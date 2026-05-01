import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  const session = await auth() as any
  const headersList = await headers()
  let slug = headersList.get("x-tenant-slug")
  
  if (!slug) {
    const host = headersList.get("host") || ""
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "schoolpro.test"
    if (host.endsWith(`.${rootDomain}`)) {
      slug = host.replace(`.${rootDomain}`, "")
    } else if (host !== rootDomain && !host.startsWith("www.")) {
      slug = host.split(".")[0]
    }
  }
  
  const tenant = session?.user?.tenants?.find((t: any) => t.slug === slug)
  if (!tenant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const tenantId = tenant.id

  try {
    const { paymentId } = await req.json()
    if (!paymentId) return NextResponse.json({ error: "Missing paymentId" }, { status: 400 })

    const payment = await db.payment.findUnique({
      where: { id: paymentId }
    })

    if (!payment || payment.tenantId !== tenantId) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status !== "pending") {
      return NextResponse.json({ error: "Only pending payments can be cancelled" }, { status: 400 })
    }

    await db.payment.update({
      where: { id: paymentId },
      data: { status: "cancelled" }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Billing cancel failed", error, { path: "/api/tenant/billing/cancel" })
    return NextResponse.json({ error: "Gagal membatalkan pembayaran" }, { status: 500 })
  }
}
