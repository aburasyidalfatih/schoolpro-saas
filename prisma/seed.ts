import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // ==================== SUBSCRIPTION PLANS ====================
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "free" },
    update: {},
    create: {
      name: "Paket Dasar (Gratis)",
      slug: "free",
      description: "Fitur dasar untuk website sekolah. Cocok untuk mulai go digital.",
      price: 0,
      interval: "MONTHLY",
      maxStudents: 0, // Tak terbatas secara UI tapi fitur siswa terkunci
      maxStorage: 100, // 100MB
      isActive: true,
      features: JSON.stringify([
        "Website Company Profile Dasar",
        "Modul Berita & Pengumuman",
        "Galeri Foto & Fasilitas",
        "Pusat Unduhan (Max 100MB)",
      ]),
    },
  })

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "pro" },
    update: {},
    create: {
      name: "Paket Profesional",
      slug: "pro",
      description: "Fitur lengkap termasuk sistem manajemen akademik siswa.",
      price: 150000,
      interval: "MONTHLY",
      maxStudents: 500,
      maxStorage: 1024, // 1GB
      isPopular: true,
      isActive: true,
      features: JSON.stringify([
        "Semua fitur Paket Dasar",
        "Manajemen Data Siswa (Max 500)",
        "Sistem Absensi Online",
        "E-Rapor Akademik",
        "Custom Domain Terpisah",
      ]),
    },
  })

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
      description: "Kami adalah perusahaan teknologi yang berdedikasi memberikan solusi digital terbaik untuk bisnis Anda.",
      tagline: "Solusi Digital untuk Bisnis Modern",
      about: "Didirikan pada tahun 2020, Demo Organisasi telah melayani lebih dari 500 klien dari berbagai sektor industri. Kami percaya bahwa teknologi yang tepat dapat mengubah cara bisnis beroperasi dan berkembang. Tim kami terdiri dari profesional berpengalaman yang siap membantu Anda mencapai tujuan bisnis.",
      address: "Jl. Teknologi No. 123, Jakarta Selatan 12345",
      phone: "021-12345678",
      email: "info@demo-organisasi.com",
      whatsapp: "6281234567890",
      instagram: "demo.organisasi",
      plan: proPlan.slug,
      planId: proPlan.id,
      studentQuota: proPlan.maxStudents,
      services: JSON.stringify([
        { title: "Pengembangan Web", description: "Pembuatan website profesional dengan teknologi terkini untuk meningkatkan kehadiran digital bisnis Anda.", icon: "🌐" },
        { title: "Aplikasi Mobile", description: "Pengembangan aplikasi mobile native dan cross-platform untuk Android dan iOS.", icon: "📱" },
        { title: "Konsultasi IT", description: "Konsultasi strategis untuk transformasi digital dan optimalisasi infrastruktur IT.", icon: "💡" },
        { title: "Cloud Solutions", description: "Migrasi dan pengelolaan infrastruktur cloud untuk skalabilitas dan efisiensi.", icon: "☁️" },
        { title: "Keamanan Siber", description: "Audit keamanan, penetration testing, dan implementasi sistem keamanan.", icon: "🔒" },
        { title: "Data Analytics", description: "Analisis data dan business intelligence untuk pengambilan keputusan berbasis data.", icon: "📊" },
      ]),
    },
  })

  // ==================== INITIAL SUBSCRIPTION ====================
  await prisma.subscription.upsert({
    where: { id: "demo-subscription" },
    update: {},
    create: {
      id: "demo-subscription",
      tenantId: demoTenant.id,
      planId: proPlan.id,
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      amount: proPlan.price,
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
