"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analitik Platform</h1>
        <p className="text-muted-foreground mt-1">Statistik dan analitik seluruh platform</p>
      </div>
      <Card className="glass border-0">
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Belum ada data</p>
        </CardContent>
      </Card>
    </div>
  )
}
