import fs from "fs"
import path from "path"
import { db } from "@/lib/db"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024

export function ensureUploadDir(subDir?: string) {
  const dir = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export async function saveFile(
  file: File,
  tenantId?: string,
  subDir?: string
): Promise<{ path: string; name: string; size: number; mimeType: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file melebihi batas maksimum (${MAX_FILE_SIZE / 1024 / 1024}MB)`)
  }

  const dir = ensureUploadDir(subDir || tenantId || "general")
  const ext = path.extname(file.name)
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
  const filePath = path.join(dir, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(filePath, buffer)

  const record = await db.fileUpload.create({
    data: {
      tenantId,
      name: file.name,
      path: filePath,
      mimeType: file.type,
      size: file.size,
    },
  })

  return {
    path: filePath,
    name: file.name,
    size: file.size,
    mimeType: file.type,
  }
}

export function deleteFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
