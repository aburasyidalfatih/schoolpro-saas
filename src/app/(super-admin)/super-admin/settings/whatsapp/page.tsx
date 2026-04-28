"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { MessageSquare, Save, Send, Eye, EyeOff, ChevronLeft, Smartphone } from "lucide-react"
import Link from "next/link"

export default function SuperAdminWhatsAppPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [testNumber, setTestNumber] = useState("")
  const [form, setForm] = useState({
    STARSENDER_API_KEY: "",
    STARSENDER_DEVICE_ID: "",
  })

  useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          STARSENDER_API_KEY: data.STARSENDER_API_KEY || "",
          STARSENDER_DEVICE_ID: data.STARSENDER_DEVICE_ID || "",
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch("/api/super-admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      toast({ title: "Disimpan", description: "Konfigurasi WhatsApp platform berhasil disimpan." })
    }
  }

  const handleTest = async () => {
    if (!testNumber) { toast({ title: "Isi nomor tujuan", variant: "destructive" }); return }
    setTesting(true)
    const res = await fetch("/api/tenant/settings/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "whatsapp",
        waApiKey: form.STARSENDER_API_KEY,
        waTo: testNumber,
        message: "Tes koneksi WhatsApp dari Platform SchoolPro.",
      }),
    })
    const data = await res.json()
    setTesting(false)
    if (res.ok) {
      toast({ title: "✅ Berhasil!", description: data.message })
    } else {
      toast({ title: "❌ Gagal", description: data.error, variant: "destructive" })
    }
  }

  if (loading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/super-admin/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">WhatsApp Gateway</h1>
            <p className="text-muted-foreground mt-1">Integrasi WhatsApp menggunakan StarSender (Global).</p>
          </div>
        </div>
        <Button className="gap-2 btn-gradient text-white border-0 rounded-xl" onClick={handleSave} disabled={saving}>
          {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
          Simpan Semua
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">StarSender API</CardTitle>
                <CardDescription>Konfigurasi token gateway platform</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Token / Key</Label>
              <div className="relative">
                <Input 
                  type={showToken ? "text" : "password"} 
                  value={form.STARSENDER_API_KEY} 
                  onChange={(e) => setForm({...form, STARSENDER_API_KEY: e.target.value})} 
                  placeholder="Masukkan token StarSender" 
                  className="rounded-xl pr-10" 
                />
                <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Device ID (Opsional)</Label>
              <Input 
                value={form.STARSENDER_DEVICE_ID} 
                onChange={(e) => setForm({...form, STARSENDER_DEVICE_ID: e.target.value})} 
                placeholder="ID perangkat yang terdaftar" 
                className="rounded-xl" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Test WhatsApp</CardTitle>
                <CardDescription>Kirim pesan tes ke nomor Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Nomor Tujuan</Label>
              <Input value={testNumber} onChange={(e) => setTestNumber(e.target.value)} placeholder="Contoh: 08123456789" className="rounded-xl" />
            </div>
            <Button variant="outline" className="w-full rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5" onClick={handleTest} disabled={testing || !form.STARSENDER_API_KEY}>
              {testing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <Send className="h-4 w-4" />}
              {testing ? "Sedang Mengirim..." : "Kirim Pesan Tes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
