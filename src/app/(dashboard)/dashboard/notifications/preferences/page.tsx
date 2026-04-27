"use client"

import { useEffect, useState, useOptimistic } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react"

interface Pref {
  channel: string
  enabled: boolean
}

const channelInfo: Record<string, { label: string; desc: string; icon: typeof Bell }> = {
  inapp: { label: "In-App", desc: "Notifikasi di dalam aplikasi", icon: Smartphone },
  email: { label: "Email", desc: "Kirim notifikasi ke email Anda", icon: Mail },
  whatsapp: { label: "WhatsApp", desc: "Kirim notifikasi via WhatsApp", icon: MessageSquare },
}

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<Pref[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tenant/notifications/preferences")
      .then((r) => r.json())
      .then((data) => {
        setPrefs(data.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Optimistic toggle
  const [optimisticPrefs, setOptimisticPref] = useOptimistic(
    prefs,
    (state: Pref[], action: { channel: string; enabled: boolean }) =>
      state.map((p) => p.channel === action.channel ? { ...p, enabled: action.enabled } : p)
  )

  const toggle = async (channel: string, enabled: boolean) => {
    setOptimisticPref({ channel, enabled })
    const res = await fetch("/api/tenant/notifications/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, enabled }),
    })
    if (res.ok) {
      setPrefs((prev) => prev.map((p) => p.channel === channel ? { ...p, enabled } : p))
      toast({ title: "Disimpan", description: `Notifikasi ${channel} ${enabled ? "diaktifkan" : "dinonaktifkan"}.` })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preferensi Notifikasi</h1>
        <p className="text-muted-foreground">Atur channel notifikasi yang ingin Anda terima</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)
        ) : (
          ["inapp", "email", "whatsapp"].map((channel) => {
            const info = channelInfo[channel]
            const pref = optimisticPrefs.find((p) => p.channel === channel)
            const enabled = pref?.enabled ?? (channel !== "whatsapp")
            const Icon = info.icon

            return (
              <Card key={channel} className="glass border-0">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">{info.label}</Label>
                        <p className="text-xs text-muted-foreground">{info.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(channel, !enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
