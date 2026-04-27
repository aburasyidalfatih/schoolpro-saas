import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const tenantId = url.searchParams.get("tenantId")
  if (!tenantId) return NextResponse.json({ error: "tenantId harus diisi" }, { status: 400 })

  const [userCount, notifCount, auditCount] = await Promise.all([
    db.tenantUser.count({ where: { tenantId } }),
    db.notification.count({ where: { tenantId, isRead: false } }),
    db.auditLog.count({ where: { tenantId } }),
  ])

  return NextResponse.json({ userCount, notifCount, auditCount })
}
