import { NextResponse } from "next/server"
import crypto from "crypto"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/services/notification"
import { inviteSchema } from "@/lib/validations/tenant"
import { parseBody } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const parsed = await parseBody(req, inviteSchema)
    if (parsed.error) return parsed.error
    const { tenantId, email, role } = parsed.data

    // Cek izin
    const tu = await db.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId: session.user.id } },
    })
    if (!tu || !["owner", "admin"].includes(tu.role)) {
      return NextResponse.json({ error: "Tidak punya izin" }, { status: 403 })
    }

    // Cek apakah sudah jadi member
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      const alreadyMember = await db.tenantUser.findUnique({
        where: { tenantId_userId: { tenantId, userId: existingUser.id } },
      })
      if (alreadyMember) return NextResponse.json({ error: "User sudah menjadi anggota" }, { status: 400 })
    }

    // Hapus undangan lama
    await db.invitation.deleteMany({ where: { tenantId, email } })

    const token = crypto.randomBytes(32).toString("hex")
    const invitation = await db.invitation.create({
      data: {
        tenantId,
        email,
        role,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const tenant = await db.tenant.findUnique({ where: { id: tenantId } })
    const acceptUrl = `${process.env.AUTH_URL}/invite/accept?token=${token}`

    await sendEmail(
      email,
      `Undangan bergabung ke ${tenant?.name} — SaasMasterPro`,
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Anda Diundang!</h2>
        <p>Anda diundang untuk bergabung ke <strong>${tenant?.name}</strong> sebagai <strong>${role}</strong>.</p>
        <a href="${acceptUrl}" style="display:inline-block;padding:12px 24px;background:#6c47ff;color:#fff;border-radius:8px;text-decoration:none;margin:16px 0">Terima Undangan</a>
        <p style="color:#888;font-size:13px">Undangan berlaku 7 hari.</p>
      </div>`
    ).catch(() => {})

    return NextResponse.json({ message: "Undangan terkirim", invitation })
  } catch (error) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
