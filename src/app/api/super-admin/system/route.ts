import { NextResponse } from "next/server"
import os from "os"

export async function GET() {
  try {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = (usedMem / totalMem) * 100

    const cpus = os.cpus()
    const coreCount = cpus.length
    const loadAvg = os.loadavg()
    // 1-minute load avg normalized by core count. This is a rough estimation of CPU usage percentage.
    const cpuUsage = (loadAvg[0] / coreCount) * 100

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
        usagePercentage: Math.min(cpuUsage, 100), // Cap at 100% 
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(), // in seconds
      },
      timestamp: Date.now(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve system metrics" }, { status: 500 })
  }
}
