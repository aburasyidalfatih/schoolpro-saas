"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Server, Shield, Eye, EyeOff, Mail, MessageSquare, 
  CreditCard, Globe, Settings2, Save, ExternalLink 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Settings {
  platform_name: string
  platform_tagline: string
  allow_impersonate_user: string
  contact_email: string
}

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    platform_name: "SchoolPro",
    platform_tagline: "Solusi Manajemen Sekolah Digital",
    allow_impersonate_user: "true",
    contact_email: "support@schoolpro.id"
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async (data: Partial<Settings>) => {
    setSaving(true)
    const res = await fetch("/api/super-admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSettings((prev) => ({ ...prev, ...data }))
      toast({ title: "Berhasil", description: "Pengaturan platform telah diperbarui." })
    }
    setSaving(false)
  }

  const quickMenus = [
    { title: "Email SMTP", desc: "Konfigurasi pengiriman email otomatis", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10", href: "/super-admin/settings/email" },
    { title: "WhatsApp", desc: "Integrasi gateway WhatsApp StarSender", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/super-admin/settings/whatsapp" },
    { title: "Pembayaran", desc: "Pengaturan API Tripay Platform", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10", href: "/super-admin/settings/payment" },
  ]

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Platform</h1>
        <p className="text-muted-foreground mt-1">Kelola identitas dan konfigurasi utama seluruh platform.</p>
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickMenus.map((menu) => (
          <Link key={menu.title} href={menu.href}>
            <Card className="glass border-0 hover:bg-muted/50 transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-110", menu.bg)}>
                  <menu.icon className={cn("h-6 w-6", menu.color)} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm flex items-center gap-1">
                    {menu.title}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{menu.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identitas Platform */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">Identitas Platform</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Platform</Label>
              <Input 
                value={settings.platform_name} 
                onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
                placeholder="SchoolPro" 
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline Platform</Label>
              <Input 
                value={settings.platform_tagline} 
                onChange={(e) => setSettings({...settings, platform_tagline: e.target.value})}
                placeholder="Solusi Manajemen Digital" 
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Kontak</Label>
              <Input 
                value={settings.contact_email} 
                onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                placeholder="support@schoolpro.id" 
                className="rounded-xl"
              />
            </div>
            <Button 
              className="w-full gap-2 btn-gradient text-white border-0 rounded-xl"
              onClick={() => handleSave({
                platform_name: settings.platform_name,
                platform_tagline: settings.platform_tagline,
                contact_email: settings.contact_email
              })}
              disabled={saving}
            >
              {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              <Save className="h-4 w-4" />
              Simpan Identitas
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Fitur Global */}
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Keamanan & Fitur</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => handleSave({ allow_impersonate_user: settings.allow_impersonate_user === "true" ? "false" : "true" })}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 text-left",
                  settings.allow_impersonate_user === "true"
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    settings.allow_impersonate_user === "true" ? "bg-primary/10" : "bg-muted"
                  )}>
                    {settings.allow_impersonate_user === "true"
                      ? <Eye className="h-5 w-5 text-primary" />
                      : <EyeOff className="h-5 w-5 text-muted-foreground" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-sm">Login Sebagai User</p>
                    <p className="text-xs text-muted-foreground">Izinkan Super Admin login ke tenant dashboard</p>
                  </div>
                </div>
                <div className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  settings.allow_impersonate_user === "true" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/30"
                )} />
              </button>
            </CardContent>
          </Card>

          {/* Informasi Sistem */}
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">Informasi Sistem</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Status Redis", value: "Tersambung (Optimized)", color: "text-emerald-600" },
                { label: "Mode Output", value: "Next.js Standalone", color: "text-primary" },
                { label: "Versi Core", value: "15.1.7 (Stable)", color: "" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs px-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={cn("font-medium", item.color)}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
