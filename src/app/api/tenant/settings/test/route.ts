import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { parseBody } from "@/lib/api-utils"

const testSchema = z.object({
  type: z.enum(["smtp", "whatsapp"]),
  // SMTP fields
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  smtpFrom: z.string().optional(),
  smtpTo: z.string().email("Email tujuan tidak valid").optional(),
  // WhatsApp fields
  waApiUrl: z.string().url().optional(),
  waApiKey: z.string().optional(),
  waPhone: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = await parseBody(req, testSchema)
  if (parsed.error) return parsed.error
  const data = parsed.data

  if (data.type === "smtp") {
    if (!data.smtpHost || !data.smtpUser || !data.smtpPass || !data.smtpTo) {
      return NextResponse.json({ error: "Lengkapi konfigurasi SMTP terlebih dahulu" }, { status: 400 })
    }
    try {
      const nodemailer = await import("nodemailer")
      const transporter = nodemailer.default.createTransport({
        host: data.smtpHost,
        port: data.smtpPort || 587,
        secure: (data.smtpPort || 587) === 465,
        auth: { user: data.smtpUser, pass: data.smtpPass },
      })
      await transporter.verify()
      await transporter.sendMail({
        from: data.smtpFrom || data.smtpUser,
        to: data.smtpTo,
        subject: "Test Email — SchoolPro",
        html: `<p>Email test berhasil dikirim dari konfigurasi SMTP tenant Anda.</p><p>Waktu: ${new Date().toLocaleString("id-ID")}</p>`,
      })
      return NextResponse.json({ message: "Email test berhasil dikirim!" })
    } catch (err: any) {
      return NextResponse.json({ error: `Koneksi SMTP gagal: ${err.message}` }, { status: 400 })
    }
  }

  if (data.type === "whatsapp") {
    if (!data.waApiUrl || !data.waApiKey || !data.waPhone) {
      return NextResponse.json({ error: "Lengkapi konfigurasi WhatsApp terlebih dahulu" }, { status: 400 })
    }
    try {
      const res = await fetch(`${data.waApiUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.waApiKey,
        },
        body: JSON.stringify({
          messageType: "text",
          to: data.waPhone,
          body: `Test pesan dari SchoolPro. Waktu: ${new Date().toLocaleString("id-ID")}`,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        return NextResponse.json({ error: `WhatsApp API error: ${result.message || res.statusText}` }, { status: 400 })
      }
      return NextResponse.json({ message: "Pesan WhatsApp test berhasil dikirim!" })
    } catch (err: any) {
      return NextResponse.json({ error: `Koneksi WhatsApp gagal: ${err.message}` }, { status: 400 })
    }
  }

  return NextResponse.json({ error: "Tipe test tidak valid" }, { status: 400 })
}
