import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const keys = ["app_logo", "platform_name", "platform_tagline"]
    const settings = await db.platformSetting.findMany({
      where: { key: { in: keys } },
    })

    const data: Record<string, string> = {
      app_logo: "/logo-schoolpro.png", // fallback
      platform_name: "SchoolPro",
      platform_tagline: "Solusi Manajemen Sekolah Digital"
    }

    settings.forEach(s => {
      if (s.value) {
        data[s.key] = s.value
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ 
      app_logo: "/logo-schoolpro.png",
      platform_name: "SchoolPro",
    })
  }
}
