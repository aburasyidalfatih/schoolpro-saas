import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 })

    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: "Token harus diisi" }, { status: 400 })

    const invitation = await db.invitation.findUnique({ where: { token } })
    if (!invitation) return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 })
    if (invitation.expiresAt < new Date()) {
      await db.invitation.delete({ where: { id: invitation.id } })
      return NextResponse.json({ error: "Undangan sudah kedaluwarsa" }, { status: 400 })
    }

    // Pastikan email cocok
    if (invitation.email !== session.user.email) {
      return NextResponse.json({ error: "Undangan ini bukan untuk akun Anda" }, { status: 403 })
    }

    // Tambahkan ke tenant
    await db.tenantUser.create({
      data: {
        tenantId: invitation.tenantId,
        userId: session.user.id,
        role: invitation.role,
      },
    })

    // Hapus undangan
    await db.invitation.delete({ where: { id: invitation.id } })

    return NextResponse.json({ message: "Berhasil bergabung", tenantId: invitation.tenantId })
  } catch (error) {
    console.error("Accept invite error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
