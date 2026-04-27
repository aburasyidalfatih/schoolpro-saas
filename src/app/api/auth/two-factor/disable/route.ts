import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { disableTwoFactor } from "@/lib/services/two-factor"
import { z } from "zod"
import { parseBody } from "@/lib/api-utils"

const schema = z.object({
  password: z.string().min(1, "Password harus diisi"),
})

// POST: disable 2FA (requires password confirmation)
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = await parseBody(req, schema)
    if (parsed.error) return parsed.error

    const bcrypt = await import("bcryptjs")
    const { db } = await import("@/lib/db")
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 400 })
    }

    await disableTwoFactor(session.user.id)

    return NextResponse.json({ message: "2FA berhasil dinonaktifkan" })
  } catch (error) {
    console.error("2FA disable error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
