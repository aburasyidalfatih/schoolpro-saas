import { db } from "@/lib/db"
import nodemailer from "nodemailer"

/**
 * Mengambil pengaturan platform secara dinamis dari database
 */
async function getPlatformSettings() {
  const settings = await db.platformSetting.findMany()
  const map: Record<string, string> = {}
  settings.forEach(s => map[s.key] = s.value)
  return map
}

/**
 * Mengirim notifikasi status pendaftaran (Email & WA)
 */
export async function sendApplicationNotification(applicationId: string) {
  const app = await db.tenantApplication.findUnique({ where: { id: applicationId } })
  if (!app) return

  const settings = await getPlatformSettings()
  const platformName = settings.platform_name || "SchoolPro"

  let subject = ""
  let message = ""

  switch (app.status) {
    case "APPROVED":
      subject = `Selamat! Pendaftaran ${app.schoolName} Disetujui`
      message = `Halo ${app.adminName},\n\nPendaftaran sekolah ${app.schoolName} telah disetujui. Anda sekarang dapat mengakses dashboard sekolah menggunakan email ini.\n\nSilakan login di: https://${app.schoolSlug}.${settings.NEXT_PUBLIC_ROOT_DOMAIN || 'schoolpro.id'}/login\n\nTerima kasih.`
      break
    case "REVISION":
      subject = `Permintaan Revisi Pendaftaran: ${app.schoolName}`
      message = `Halo ${app.adminName},\n\nTerima kasih telah mendaftar. Namun, ada beberapa data yang perlu diperbaiki:\n\n"${app.adminMessage}"\n\nSilakan hubungi kami untuk melakukan perbaikan data.`
      break
    case "REJECTED":
      subject = `Update Pendaftaran: ${app.schoolName}`
      message = `Halo ${app.adminName},\n\nMohon maaf, pendaftaran sekolah ${app.schoolName} belum dapat kami setujui saat ini.\n\nAlasan: ${app.adminMessage}\n\nTerima kasih atas minat Anda.`
      break
  }

  if (!subject) return

  // 1. Kirim Email (Dinamis dari Platform Settings)
  if (settings.SMTP_HOST && settings.SMTP_USER) {
    try {
      const transporter = nodemailer.createTransport({
        host: settings.SMTP_HOST,
        port: Number(settings.SMTP_PORT) || 587,
        auth: { user: settings.SMTP_USER, pass: settings.SMTP_PASS },
      })
      await transporter.sendMail({
        from: `"${platformName}" <${settings.SMTP_FROM || settings.SMTP_USER}>`,
        to: app.adminEmail,
        subject,
        html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">${platformName}</h2>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>`
      })
    } catch (err) {
      console.error("Email notification failed:", err)
    }
  }

  // 2. Kirim WhatsApp (Dinamis dari Platform Settings)
  if (settings.STARSENDER_API_KEY) {
    try {
      await fetch("https://api.starsender.online/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.STARSENDER_API_KEY}`,
        },
        body: JSON.stringify({
          messageType: "text",
          to: app.adminPhone,
          body: `*${subject}*\n\n${message}`
        }),
      })
    } catch (err) {
      console.error("WA notification failed:", err)
    }
  }
}

/**
 * Logika menyetujui pengajuan dan membuat tenant baru
 */
export async function approveApplication(id: string) {
  const app = await db.tenantApplication.findUnique({ where: { id } })
  if (!app) throw new Error("Pengajuan tidak ditemukan")

  // 1. Buat Tenant Baru
  const tenant = await db.tenant.create({
    data: {
      name: app.schoolName,
      slug: app.schoolSlug,
      email: app.adminEmail,
      phone: app.adminPhone,
      address: app.address,
      isActive: true,
      plan: "free"
    }
  })

  // 2. Cek apakah user admin sudah ada
  let user = await db.user.findUnique({ where: { email: app.adminEmail } })
  
  if (!user) {
    // Buat user baru (Password default atau invite link)
    // Untuk demo ini kita buat user non-aktif yang harus reset password
    user = await db.user.create({
      data: {
        name: app.adminName,
        email: app.adminEmail,
        password: "PASSWORD_NEED_RESET", // Idealnya kirim link set password
        phone: app.adminPhone,
      }
    })
  }

  // 3. Hubungkan User ke Tenant sebagai Owner
  await db.tenantUser.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role: "owner"
    }
  })

  // 4. Update status pengajuan
  await db.tenantApplication.update({
    where: { id },
    data: { status: "APPROVED" }
  })

  // 5. Kirim Notifikasi
  await sendApplicationNotification(id)

  return tenant
}
