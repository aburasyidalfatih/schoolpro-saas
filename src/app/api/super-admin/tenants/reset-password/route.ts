import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { tenantId, newPassword } = await req.json()

    if (!tenantId || !newPassword) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Cari owner tenant
    const ownerUser = await db.tenantUser.findFirst({
      where: { 
        tenantId,
        role: "owner"
      },
      include: { user: true }
    })

    if (!ownerUser) {
      return NextResponse.json({ error: "Owner tenant tidak ditemukan" }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db.user.update({
      where: { id: ownerUser.userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ 
      message: `Password untuk ${ownerUser.user.email} berhasil direset` 
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Gagal mereset password" }, { status: 500 })
  }
}
