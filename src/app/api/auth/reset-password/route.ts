import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { verifyToken, consumeToken } from "@/lib/services/token"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/api-utils"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous"
    const { success } = await rateLimit(`auth:reset:${ip}`, 5, 60_000)
    if (!success) {
      return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 })
    }

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
    logger.error("Reset password failed", error, { path: "/api/auth/reset-password" })
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
