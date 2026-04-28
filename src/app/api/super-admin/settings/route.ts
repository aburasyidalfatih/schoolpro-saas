import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const settings = await db.platformSetting.findMany()
  const map: Record<string, string> = {}
  settings.forEach((s) => { map[s.key] = s.value })
  return NextResponse.json(map)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  
  // Jika body adalah object key-value (Batch Update)
  if (typeof body === 'object' && !body.key) {
    const updates = Object.entries(body).map(([key, value]) => 
      db.platformSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
    await Promise.all(updates)
    return NextResponse.json({ message: "Pengaturan batch berhasil disimpan" })
  }

  // Support single update (legacy)
  const { platformSettingSchema } = await import("@/lib/validations/super-admin")
  const { key, value } = body
  
  await db.platformSetting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  })

  return NextResponse.json({ message: "Setting disimpan" })
}
