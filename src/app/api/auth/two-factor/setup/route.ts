import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateTwoFactorSecret } from "@/lib/services/two-factor"
import { logger } from "@/lib/logger"

// POST: generate 2FA secret + QR code
export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await generateTwoFactorSecret(
      session.user.id,
      session.user.email!
    )

    return NextResponse.json({
      qrCode: result.qrCode,
      secret: result.secret,
    })
  } catch (error) {
    logger.error("2FA setup failed", error, { path: "/api/auth/two-factor/setup" })
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
