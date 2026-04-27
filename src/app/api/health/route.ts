import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const start = Date.now()
  const checks: Record<string, { status: string; latency?: number }> = {}

  // Database check
  try {
    const dbStart = Date.now()
    await db.$queryRaw`SELECT 1`
    checks.database = { status: "healthy", latency: Date.now() - dbStart }
  } catch {
    checks.database = { status: "unhealthy" }
  }

  const allHealthy = Object.values(checks).every((c) => c.status === "healthy")

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      latency: Date.now() - start,
      checks,
      version: process.env.npm_package_version || "1.0.0",
    },
    { status: allHealthy ? 200 : 503 }
  )
}
