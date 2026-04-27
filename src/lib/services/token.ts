import crypto from "crypto"
import { db } from "@/lib/db"

export async function createToken(userId: string, type: "email_verify" | "password_reset", expiresInHours = 24) {
  // Hapus token lama dengan tipe yang sama
  await db.verificationToken.deleteMany({ where: { userId, type } })

  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)

  return db.verificationToken.create({
    data: { userId, token, type, expiresAt },
  })
}

export async function verifyToken(token: string, type: "email_verify" | "password_reset") {
  const record = await db.verificationToken.findUnique({ where: { token } })

  if (!record || record.type !== type) return null
  if (record.expiresAt < new Date()) {
    await db.verificationToken.delete({ where: { id: record.id } })
    return null
  }

  return record
}

export async function consumeToken(token: string) {
  return db.verificationToken.delete({ where: { token } })
}
