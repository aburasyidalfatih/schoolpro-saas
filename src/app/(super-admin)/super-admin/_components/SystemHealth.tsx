"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, Server, Activity, RefreshCw } from "lucide-react"

interface SystemMetrics {
  ram: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
  cpu: {
    cores: number
    model: string
    loadAverage: number[]
    usagePercentage: number
  }
  os: {
    platform: string
    release: string
    uptime: number
  }
  timestamp: number
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/super-admin/system")
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error("Failed to fetch system metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 15000) // Refresh every 15s
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    
    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    return parts.join(" ") || "< 1m"
  }

  if (loading && !metrics) {
    return (
      <Card className="glass border-0">
        <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) return null

  return (
    <Card className="glass border-0 overflow-hidden relative group mt-6">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => { setLoading(true); fetchMetrics(); }} 
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-500" />
          Kesehatan Sistem (VPS Host)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {/* RAM Usage */}
          <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HardDrive className="h-4 w-4 text-emerald-500" />
                Memori (RAM)
              </div>
              <span className="text-sm font-semibold">
                {metrics.ram.usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${metrics.ram.usagePercentage > 85 ? 'bg-red-500' : metrics.ram.usagePercentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${metrics.ram.usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Terpakai: {formatBytes(metrics.ram.used)}</span>
              <span>Total: {formatBytes(metrics.ram.total)}</span>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Cpu className="h-4 w-4 text-blue-500" />
                CPU ({metrics.cpu.cores} Cores)
              </div>
              <span className="text-sm font-semibold">
                ~{metrics.cpu.usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${metrics.cpu.usagePercentage > 85 ? 'bg-red-500' : metrics.cpu.usagePercentage > 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
                style={{ width: `${metrics.cpu.usagePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="truncate max-w-[150px]" title={metrics.cpu.model}>{metrics.cpu.model}</span>
              <span>Load Avg: {metrics.cpu.loadAverage[0].toFixed(2)}</span>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-3 bg-background/50 p-4 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Activity className="h-4 w-4 text-violet-500" />
                Status Host
              </div>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">{formatUptime(metrics.os.uptime)}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-1">
                  <span className="text-muted-foreground">OS Platform</span>
                  <span className="font-medium">{metrics.os.platform} ({metrics.os.release})</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Pembaruan Terakhir</span>
                  <span className="font-medium text-xs pt-0.5">{new Date(metrics.timestamp).toLocaleTimeString('id-ID')}</span>
                </div>
             </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
