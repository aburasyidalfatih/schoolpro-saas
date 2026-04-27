import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { exportToExcel } from "@/lib/services/export"
import { exportSchema } from "@/lib/validations/super-admin"
import { parseBody } from "@/lib/api-utils"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = await parseBody(req, exportSchema)
    if (parsed.error) return parsed.error
    const { data, columns, filename } = parsed.data

    const buffer = await exportToExcel(data, columns, filename)

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename || "export"}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export gagal" }, { status: 500 })
  }
}
