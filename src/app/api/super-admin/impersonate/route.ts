import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// POST: mulai impersonate tenant
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { impersonateTenantSchema } = await import("@/lib/validations/tenant")
  const { parseBody } = await import("@/lib/api-utils")
  const parsed = await parseBody(req, impersonateTenantSchema)
  if (parsed.error) return parsed.error
  const { tenantId } = parsed.data

  // Cari tenant dan owner-nya
  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
    include: {
      users: {
        where: { role: "owner" },
        include: { user: true },
        take: 1,
      },
    },
  })

  if (!tenant) return NextResponse.json({ error: "Tenant tidak ditemukan" }, { status: 404 })

  const owner = tenant.users[0]?.user
  if (!owner) return NextResponse.json({ error: "Tenant tidak punya owner" }, { status: 400 })

  const response = NextResponse.json({
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    tenantName: tenant.name,
    ownerId: owner.id,
    ownerName: owner.name,
    ownerEmail: owner.email,
  })

  response.cookies.set("impersonate-tenant", tenant.slug, {
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  })
  response.cookies.set("impersonate-by", session.user.id, {
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  })

  return response
}

// DELETE: stop impersonate
export async function DELETE() {
  const response = NextResponse.json({ message: "Impersonate dihentikan" })
  response.cookies.delete("impersonate-tenant")
  response.cookies.delete("impersonate-by")
  return response
}
