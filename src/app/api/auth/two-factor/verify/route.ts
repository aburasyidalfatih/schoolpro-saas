import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { enableTwoFactor } from "@/lib/services/two-factor"
import { z } from "zod"
import { parseBody } from "@/lib/api-utils"

const schema = z.object({
  code: z.string().length(6, "Kode OTP harus 6 digit"),
})

// POST: verify code and enable 2FA
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = await parseBody(req, schema)
    if (parsed.error) return parsed.error

    const result = await enableTwoFactor(session.user.id, parsed.data.code)

    return NextResponse.json({
      message: "2FA berhasil diaktifkan",
      backupCodes: result.backupCodes,
    })
  } catch (error: any) {
    if (error.message === "Kode OTP tidak valid") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error("2FA verify error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
