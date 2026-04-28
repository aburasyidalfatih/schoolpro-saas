import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      schoolName, schoolSlug, npsn, schoolStatus, 
      province, regency, adminName, adminEmail, adminPhone, address 
    } = body

    if (!schoolName || !schoolSlug || !adminEmail || !adminPhone || !npsn) {
      return NextResponse.json({ error: "Data wajib diisi" }, { status: 400 })
    }

    // Cek ketersediaan slug/subdomain
    const existingTenant = await db.tenant.findUnique({ where: { slug: schoolSlug } })
    const existingApp = await db.tenantApplication.findUnique({ where: { schoolSlug } })
    
    if (existingTenant || existingApp) {
      return NextResponse.json({ error: "Subdomain sudah digunakan" }, { status: 400 })
    }

    const application = await db.tenantApplication.create({
      data: {
        schoolName,
        schoolSlug,
        npsn,
        schoolStatus,
        province,
        regency,
        adminName,
        adminEmail,
        adminPhone,
        address,
        status: "PENDING"
      }
    })

    return NextResponse.json({ message: "Pengajuan berhasil dikirim", id: application.id })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Gagal mengirim pengajuan" }, { status: 500 })
  }
}
