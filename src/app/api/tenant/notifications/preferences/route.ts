import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET: get notification preferences
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const settings = await db.notificationSetting.findMany({
    where: { userId: session.user.id },
  })

  return NextResponse.json({ data: settings })
}

// PUT: update notification preference
export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { channel, enabled } = await req.json()
  if (!channel) return NextResponse.json({ error: "channel harus diisi" }, { status: 400 })

  await db.notificationSetting.upsert({
    where: { userId_channel: { userId: session.user.id, channel } },
    update: { enabled },
    create: { userId: session.user.id, channel, enabled },
  })

  return NextResponse.json({ message: "Preferensi disimpan" })
}
