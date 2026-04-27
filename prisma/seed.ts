import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  const hashedPassword = await bcrypt.hash("admin123", 12)

  // ==================== SUPER ADMIN ====================
  // Super admin TIDAK terhubung ke tenant manapun
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@saasmasterpro.com" },
    update: { isSuperAdmin: true },
    create: {
      name: "Super Admin",
      email: "admin@saasmasterpro.com",
      password: hashedPassword,
      isSuperAdmin: true,
      emailVerified: new Date(),
    },
  })

  // ==================== TENANT ADMIN ====================
  const tenantAdmin = await prisma.user.upsert({
    where: { email: "tenant@saasmasterpro.com" },
    update: {},
    create: {
      name: "Admin Tenant",
      email: "tenant@saasmasterpro.com",
      password: hashedPassword,
      isSuperAdmin: false,
      emailVerified: new Date(),
    },
  })

  // ==================== DEMO TENANT ====================
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "Demo Organisasi",
      slug: "demo",
      description: "Tenant demo untuk testing",
    },
  })

  // Hubungkan tenant admin sebagai owner
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: { tenantId: demoTenant.id, userId: tenantAdmin.id },
    },
    update: { role: "owner" },
    create: {
      tenantId: demoTenant.id,
      userId: tenantAdmin.id,
      role: "owner",
    },
  })

  // Hapus super admin dari tenant (isolasi)
  await prisma.tenantUser.deleteMany({
    where: { tenantId: demoTenant.id, userId: superAdmin.id },
  })

  // ==================== MEMBER USER ====================
  const memberUser = await prisma.user.upsert({
    where: { email: "user@saasmasterpro.com" },
    update: {},
    create: {
      name: "User Demo",
      email: "user@saasmasterpro.com",
      password: hashedPassword,
      isSuperAdmin: false,
      emailVerified: new Date(),
    },
  })

  // Hubungkan member ke demo tenant
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: { tenantId: demoTenant.id, userId: memberUser.id },
    },
    update: { role: "member" },
    create: {
      tenantId: demoTenant.id,
      userId: memberUser.id,
      role: "member",
    },
  })

  // Notification settings untuk semua user
  const allUsers = [tenantAdmin, memberUser]
  const channels = ["inapp", "email", "whatsapp"]
  for (const user of allUsers) {
    for (const channel of channels) {
      await prisma.notificationSetting.upsert({
        where: { userId_channel: { userId: user.id, channel } },
        update: {},
        create: { userId: user.id, channel, enabled: channel !== "whatsapp" },
      })
    }
  }

  // Platform settings
  await prisma.platformSetting.upsert({
    where: { key: "allow_impersonate_user" },
    update: {},
    create: { key: "allow_impersonate_user", value: "true" },
  })

  console.log("✅ Seed selesai!")
  console.log("")
  console.log("👑 Super Admin (hanya akses /super-admin):")
  console.log("   📧 admin@saasmasterpro.com")
  console.log("   🔑 admin123")
  console.log("")
  console.log("🏢 Tenant Admin (akses /dashboard — menu lengkap):")
  console.log("   📧 tenant@saasmasterpro.com")
  console.log("   🔑 admin123")
  console.log("")
  console.log("👤 User Biasa (akses /dashboard — menu terbatas):")
  console.log("   📧 user@saasmasterpro.com")
  console.log("   🔑 admin123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
