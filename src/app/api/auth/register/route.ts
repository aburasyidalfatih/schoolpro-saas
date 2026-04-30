import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { generateSlug } from "@/lib/utils"
import { registerSchema } from "@/lib/validations/auth"
import { parseBody } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const parsed = await parseBody(req, registerSchema)
    if (parsed.error) return parsed.error
    const { name, email, password, tenantName, tenantSlug } = parsed.data

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Jika tenantSlug ada, berarti user mendaftar di subdomain tenant (sebagai member)
    if (tenantSlug) {
      const existingTenant = await db.tenant.findUnique({ where: { slug: tenantSlug } })
      if (!existingTenant) {
        return NextResponse.json({ error: "Sekolah tidak ditemukan" }, { status: 404 })
      }

      const result = await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { name, email, password: hashedPassword },
        })

        await tx.tenantUser.create({
          data: { tenantId: existingTenant.id, userId: user.id, role: "member" },
        })

        await tx.notificationSetting.createMany({
          data: [
            { userId: user.id, channel: "inapp", enabled: true },
            { userId: user.id, channel: "email", enabled: true },
            { userId: user.id, channel: "whatsapp", enabled: false },
          ],
        })

        return { user, tenant: existingTenant }
      })

      return NextResponse.json({
        message: "Registrasi berhasil",
        tenantSlug: result.tenant.slug,
      })
    }

    // Jika tenantSlug tidak ada (Mendaftar di domain utama / buat organisasi baru)
    if (!tenantName) {
      return NextResponse.json({ error: "Nama organisasi harus diisi" }, { status: 400 })
    }

    let slug = generateSlug(tenantName)

    // Pastikan slug unik
    const existingTenantBySlug = await db.tenant.findUnique({ where: { slug } })
    if (existingTenantBySlug) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Buat user, tenant, dan relasi dalam satu transaksi
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashedPassword },
      })

      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug },
      })

      await tx.tenantUser.create({
        data: { tenantId: tenant.id, userId: user.id, role: "owner" },
      })

      // Buat default notification settings
      await tx.notificationSetting.createMany({
        data: [
          { userId: user.id, channel: "inapp", enabled: true },
          { userId: user.id, channel: "email", enabled: true },
          { userId: user.id, channel: "whatsapp", enabled: false },
        ],
      })

      return { user, tenant }
    })

    return NextResponse.json({
      message: "Registrasi berhasil",
      tenantSlug: result.tenant.slug,
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
