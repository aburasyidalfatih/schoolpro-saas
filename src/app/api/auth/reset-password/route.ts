import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { verifyToken, consumeToken } from "@/lib/services/token"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const parsed = await parseBody(req, resetPasswordSchema)
    if (parsed.error) return parsed.error
    const { token, password } = parsed.data

    const record = await verifyToken(token, "password_reset")
    if (!record) {
      return NextResponse.json({ error: "Token tidak valid atau sudah kedaluwarsa" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await db.user.update({ where: { id: record.userId }, data: { password: hashed } })
    await consumeToken(token)

    return NextResponse.json({ message: "Password berhasil direset" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
