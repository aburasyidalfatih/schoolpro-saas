import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const tenantId = url.searchParams.get("tenantId")
  if (!tenantId) return NextResponse.json({ error: "tenantId harus diisi" }, { status: 400 })

  const achievements = await db.achievement.findMany({
    where: { tenantId },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(achievements)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const schema = z.object({
      tenantId: z.string().min(1),
      title: z.string().min(1),
      description: z.string().optional().nullable(),
      date: z.string().datetime(),
      level: z.string().default("LOKAL"),
      imageUrl: z.string().optional().nullable(),
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Data tidak valid", details: parsed.error.format() }, { status: 400 })
    }

    const { tenantId, ...data } = parsed.data

    const isSuperAdmin = session.user.isSuperAdmin
    if (!isSuperAdmin) {
      const tu = await db.tenantUser.findUnique({
        where: { tenantId_userId: { tenantId, userId: session.user.id } },
      })
      const allowedRoles = ["owner", "admin", "operator"]
      if (!tu || !allowedRoles.includes(tu.role)) {
        return NextResponse.json({ error: "Tidak punya izin untuk menambah prestasi" }, { status: 403 })
      }
    }

    const achievement = await db.achievement.create({
      data: {
        ...data,
        tenantId,
      }
    })

    return NextResponse.json({ message: "Prestasi berhasil ditambahkan", achievement })
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server", details: error.message }, { status: 500 })
  }
}
