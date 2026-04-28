import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getPricingConfig } from "@/lib/services/billing"

export async function GET() {
  const session = await auth()
  if (!session?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [tenant, pricing] = await Promise.all([
    db.tenant.findUnique({
      where: { id: session.tenantId },
      select: {
        id: true,
        name: true,
        plan: true,
        studentQuota: true,
        isActive: true,
        expiresAt: true
      }
    }),
    getPricingConfig()
  ])

  return NextResponse.json({
    ...tenant,
    pricing
  })
}
