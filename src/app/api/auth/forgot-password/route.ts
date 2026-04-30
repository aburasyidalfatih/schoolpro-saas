import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createToken } from "@/lib/services/token"
import { sendEmail } from "@/lib/services/notification"
import { rateLimit } from "@/lib/rate-limit"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const parsed = await parseBody(req, forgotPasswordSchema)
    if (parsed.error) return parsed.error
    const { email } = parsed.data

    const user = await db.user.findUnique({ where: { email } })

    // Selalu return sukses untuk mencegah email enumeration
    if (!user) return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." })

    const { token } = await createToken(user.id, "password_reset", 1)
    const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}`

    await sendEmail(
      user.email,
      "Reset Password — SchoolPro",
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Reset Password</h2>
        <p>Halo ${user.name},</p>
        <p>Klik tombol di bawah untuk mereset password Anda. Link berlaku 1 jam.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6c47ff;color:#fff;border-radius:8px;text-decoration:none;margin:16px 0">Reset Password</a>
        <p style="color:#888;font-size:13px">Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>`
    ).catch(() => {}) // Jangan gagalkan response jika email gagal kirim

    return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
