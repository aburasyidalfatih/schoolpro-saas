import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { saveFile } from "@/lib/services/upload"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const tenantId = formData.get("tenantId") as string | null

    if (!file) {
      return NextResponse.json({ error: "File harus diupload" }, { status: 400 })
    }

    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipe file tidak diizinkan: ${file.type}` },
        { status: 400 }
      )
    }

    const result = await saveFile(file, tenantId || undefined)

    return NextResponse.json({
      message: "File berhasil diupload",
      file: {
        name: result.name,
        size: result.size,
        mimeType: result.mimeType,
        path: result.path,
      },
    })
  } catch (error: any) {
    if (error.message?.includes("batas maksimum")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 })
  }
}
