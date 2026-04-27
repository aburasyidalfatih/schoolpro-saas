import { db } from "@/lib/db"
import nodemailer from "nodemailer"

// ==================== EMAIL (Mailketing SMTP) ====================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  })
}

// ==================== WHATSAPP (StarSender) ====================

export async function sendWhatsApp(phone: string, message: string) {
  const response = await fetch(`${process.env.STARSENDER_API_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STARSENDER_API_KEY}`,
    },
    body: JSON.stringify({
      messageType: "text",
      to: phone,
      body: message,
    }),
  })
  return response.json()
}

// ==================== IN-APP NOTIFICATION ====================

export async function createInAppNotification(params: {
  tenantId?: string
  userId: string
  title: string
  message: string
  type?: string
}) {
  return db.notification.create({
    data: {
      tenantId: params.tenantId,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      channel: "inapp",
    },
  })
}

// ==================== UNIFIED SEND ====================

export async function sendNotification(params: {
  tenantId?: string
  userId: string
  title: string
  message: string
  type?: string
  channels?: ("inapp" | "email" | "whatsapp")[]
}) {
  const channels = params.channels || ["inapp"]

  // Cek preferensi user
  const settings = await db.notificationSetting.findMany({
    where: { userId: params.userId },
  })

  const user = await db.user.findUnique({
    where: { id: params.userId },
  })

  for (const channel of channels) {
    const setting = settings.find((s) => s.channel === channel)
    if (setting && !setting.enabled) continue

    switch (channel) {
      case "inapp":
        await createInAppNotification(params)
        break
      case "email":
        if (user?.email) {
          await sendEmail(user.email, params.title, `<p>${params.message}</p>`)
        }
        break
      case "whatsapp":
        if (user?.phone) {
          await sendWhatsApp(user.phone, `${params.title}\n\n${params.message}`)
        }
        break
    }
  }
}
