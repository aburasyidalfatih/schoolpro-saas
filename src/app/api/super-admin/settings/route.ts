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

  const { platformSettingSchema } = await import("@/lib/validations/super-admin")
  const { parseBody } = await import("@/lib/api-utils")
  const parsed = await parseBody(req, platformSettingSchema)
  if (parsed.error) return parsed.error
  const { key, value } = parsed.data

  await db.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })

  return NextResponse.json({ message: "Setting disimpan" })
}
