import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// GET: list active sessions for current user
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await db.session.findMany({
      where: {
        userId: session.user.id,
        expires: { gt: new Date() },
      },
      select: {
        id: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expires: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: sessions })
  } catch (error) {
    console.error("Sessions list error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}

// DELETE: revoke a specific session
export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = await req.json()
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId harus diisi" }, { status: 400 })
    }

    // Verify the session belongs to the current user
    const targetSession = await db.session.findUnique({
      where: { id: sessionId },
    })

    if (!targetSession || targetSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Session tidak ditemukan" }, { status: 404 })
    }

    await db.session.delete({ where: { id: sessionId } })

    return NextResponse.json({ message: "Session berhasil dihapus" })
  } catch (error) {
    console.error("Session revoke error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 })
  }
}
