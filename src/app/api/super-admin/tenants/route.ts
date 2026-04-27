import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const url = new URL(req.url)
  const page = Number(url.searchParams.get("page") || "1")
  const limit = Number(url.searchParams.get("limit") || "20")
  const search = url.searchParams.get("search") || ""

  const where = search ? { name: { contains: search } } : {}
  const [data, total] = await Promise.all([
    db.tenant.findMany({
      where,
      include: {
        _count: { select: { users: true } },
        users: {
          where: { role: "owner" },
          include: { user: { select: { name: true, email: true, phone: true } } },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.tenant.count({ where }),
  ])

  const result = data.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    domain: t.domain,
    plan: t.plan,
    theme: t.theme,
    isActive: t.isActive,
    createdAt: t.createdAt,
    userCount: t._count.users,
    owner: t.users[0]?.user || null,
  }))

  return NextResponse.json({ data: result, total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { deleteTenantSchema } = await import("@/lib/validations/super-admin")
  const { parseBody } = await import("@/lib/api-utils")
  const parsed = await parseBody(req, deleteTenantSchema)
  if (parsed.error) return parsed.error
  await db.tenant.delete({ where: { id: parsed.data.id } })
  return NextResponse.json({ message: "Tenant dihapus" })
}
