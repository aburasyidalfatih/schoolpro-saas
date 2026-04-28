import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { approveApplication, sendApplicationNotification } from "@/lib/services/application"

// Ambil semua daftar pengajuan
export async function GET() {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const applications = await db.tenantApplication.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(applications)
}

// Update status pengajuan (Approve, Reject, Revision)
export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { id, status, adminMessage } = body

  try {
    if (status === "APPROVED") {
      // Jalankan logika persetujuan (Buat Tenant + User + Notif)
      const tenant = await approveApplication(id)
      return NextResponse.json({ message: "Pengajuan disetujui dan Tenant berhasil dibuat", tenant })
    } else {
      // Update status biasa (Rejected/Revision)
      const application = await db.tenantApplication.update({
        where: { id },
        data: { status, adminMessage }
      })

      // Kirim notifikasi status terbaru
      await sendApplicationNotification(id)
      
      return NextResponse.json({ message: `Status diperbarui ke ${status}`, application })
    }
  } catch (error: any) {
    console.error("Update application error:", error)
    return NextResponse.json({ error: error.message || "Gagal memperbarui status" }, { status: 500 })
  }
}
