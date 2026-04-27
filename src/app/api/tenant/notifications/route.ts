import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET: list notifications for current user
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = Number(url.searchParams.get("page") || "1")
  const limit = Number(url.searchParams.get("limit") || "20")

  const where = { userId: session.user.id, channel: "inapp" }
  const [data, total] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.notification.count({ where }),
  ])

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / limit) })
}

// PUT: mark as read
export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, all } = await req.json()

  if (all) {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    })
  } else if (id) {
    await db.notification.update({ where: { id }, data: { isRead: true } })
  }

  return NextResponse.json({ message: "OK" })
}
