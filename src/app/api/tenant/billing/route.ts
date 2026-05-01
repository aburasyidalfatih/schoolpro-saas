import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getPricingConfig } from "@/lib/services/billing"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

// Prisma JSON fields may come back as array, string, or other shapes
function normalizeFeatures(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter((f: any) => typeof f === "string")
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((f: any) => typeof f === "string") : []
    } catch {
      return []
    }
  }
  return []
}

export async function GET() {
  const session = await auth() as any
  const headersList = await headers()
  let slug = headersList.get("x-tenant-slug")
  
  if (!slug) {
    const host = headersList.get("host") || ""
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "schoolpro.test"
    if (host.endsWith(`.${rootDomain}`)) {
      slug = host.replace(`.${rootDomain}`, "")
    } else if (host !== rootDomain && !host.startsWith("www.")) {
      slug = host.split(".")[0] // Fallback local test
    }
  }

  const tenantUser = session?.user?.tenants?.find((t: any) => t.slug === slug)
  if (!tenantUser) return NextResponse.json({ error: "Unauthorized", slug_detected: slug }, { status: 401 })
  const tenantId = tenantUser.id

  const [tenant, pricing, proPlan, pendingPayment] = await Promise.all([
    db.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        plan: true,
        studentQuota: true,
        isActive: true,
        expiresAt: true
      }
    }),
    getPricingConfig(),
    db.subscriptionPlan.findUnique({
      where: { slug: "pro" },
      select: { features: true }
    }),
    db.payment.findFirst({
      where: { tenantId, status: "pending" },
      select: { id: true }
    })
  ])

  const proFeatures = normalizeFeatures(proPlan?.features)

  return NextResponse.json({
    ...tenant,
    pricing,
    proFeatures,
    hasPendingInvoice: !!pendingPayment
  })
}
