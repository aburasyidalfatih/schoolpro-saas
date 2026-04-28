import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const payments = await db.payment.findMany({
    where: status ? { status } : undefined,
    include: {
      tenant: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Calculate summary stats
  const totalRevenue = await db.payment.aggregate({
    _sum: { amount: true },
    where: { status: "paid" }
  })

  const pendingCount = await db.payment.count({
    where: { status: "pending" }
  })

  return NextResponse.json({
    payments,
    stats: {
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingCount
    }
  })
}
