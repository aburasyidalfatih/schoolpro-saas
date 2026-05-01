import { NextResponse } from "next/server"
import os from "os"
import { exec } from "child_process"
import { promisify } from "util"
import { auth } from "@/lib/auth"
import { getRedisClient } from "@/lib/redis"
import { logger } from "@/lib/logger"

const execAsync = promisify(exec)

export async function GET() {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = (usedMem / totalMem) * 100

    const cpus = os.cpus()
    const coreCount = cpus.length
    const loadAvg = os.loadavg()
    const cpuUsage = (loadAvg[0] / coreCount) * 100

    // Get PM2 Status
    let pm2Stats = []
    try {
      const { stdout } = await execAsync("pm2 jlist")
      const rawPm2 = JSON.parse(stdout)
      pm2Stats = rawPm2.map((p: any) => ({
        name: p.name,
        status: p.pm2_env.status,
        cpu: p.monit.cpu,
        memory: p.monit.memory,
        uptime: Date.now() - p.pm2_env.pm_uptime,
      }))
    } catch (e) {
      logger.error("PM2 fetch failed", e)
    }

    return NextResponse.json({
      ram: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercentage: memUsage,
      },
      cpu: {
        cores: coreCount,
        model: cpus[0]?.model || "Unknown",
        loadAverage: loadAvg,
        usagePercentage: Math.min(cpuUsage, 100),
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(),
      },
      pm2: pm2Stats,
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve system metrics" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.isSuperAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const body = await req.json()
    const { action } = body

    if (action === "clear-cache") {
      const redis = await getRedisClient()
      await redis.flush()
      return NextResponse.json({ message: "Redis cache cleared successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    logger.error("System action failed", error, { path: "/api/super-admin/system" })
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
