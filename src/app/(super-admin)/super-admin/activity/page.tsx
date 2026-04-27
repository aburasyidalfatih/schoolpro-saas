"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Aktivitas Sistem</h1>
        <p className="text-muted-foreground mt-1">Monitor aktivitas real-time platform</p>
      </div>
      <Card className="glass border-0">
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Belum ada data</p>
        </CardContent>
      </Card>
    </div>
  )
}
