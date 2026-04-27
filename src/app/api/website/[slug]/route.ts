import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Public API — no auth required. Used by tenant website pages.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const tenant = await db.tenant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      description: true,
      tagline: true,
      about: true,
      address: true,
      phone: true,
      email: true,
      website: true,
      whatsapp: true,
      instagram: true,
      facebook: true,
      youtube: true,
      services: true,
      heroImage: true,
      gallery: true,
      theme: true,
      isActive: true,
    },
  })

  if (!tenant || !tenant.isActive) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  }

  // Parse JSON fields
  return NextResponse.json({
    ...tenant,
    services: tenant.services ? JSON.parse(tenant.services) : [],
    gallery: tenant.gallery ? JSON.parse(tenant.gallery) : [],
  })
}
