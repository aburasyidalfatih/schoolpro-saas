"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Mail, Save, Send, Eye, EyeOff, CheckCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function SuperAdminEmailPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [form, setForm] = useState({
    SMTP_HOST: "",
    SMTP_PORT: "587",
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_FROM: "",
  })

  useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          SMTP_HOST: data.SMTP_HOST || "",
          SMTP_PORT: data.SMTP_PORT || "587",
          SMTP_USER: data.SMTP_USER || "",
          SMTP_PASS: data.SMTP_PASS || "",
          SMTP_FROM: data.SMTP_FROM || "",
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
      toast({ title: "Disimpan", description: "Konfigurasi SMTP platform berhasil disimpan secara batch." })
    }
  }

  const handleTest = async () => {
    if (!testEmail) { toast({ title: "Isi email tujuan", variant: "destructive" }); return }
    setTesting(true)
    const res = await fetch("/api/tenant/settings/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "smtp",
        smtpHost: form.SMTP_HOST, 
        smtpPort: Number(form.SMTP_PORT),
        smtpUser: form.SMTP_USER, 
        smtpPass: form.SMTP_PASS,
        smtpFrom: form.SMTP_FROM || form.SMTP_USER, 
        smtpTo: testEmail,
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
            <h1 className="text-2xl font-bold tracking-tight">Email & SMTP Platform</h1>
            <p className="text-muted-foreground mt-1">Konfigurasi pengiriman email sistem secara global.</p>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Konfigurasi SMTP</CardTitle>
                <CardDescription>Server pengiriman email (Mailketing/Gmail/dll)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>SMTP Host</Label>
                <Input value={form.SMTP_HOST} onChange={(e) => setForm({...form, SMTP_HOST: e.target.value})} placeholder="smtp.mailketing.co.id" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input value={form.SMTP_PORT} onChange={(e) => setForm({...form, SMTP_PORT: e.target.value})} placeholder="587" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={form.SMTP_USER} onChange={(e) => setForm({...form, SMTP_USER: e.target.value})} placeholder="user@domain.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Password / API Key</Label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} value={form.SMTP_PASS} onChange={(e) => setForm({...form, SMTP_PASS: e.target.value})} placeholder="••••••••" className="rounded-xl pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Pengirim (From)</Label>
              <Input value={form.SMTP_FROM} onChange={(e) => setForm({...form, SMTP_FROM: e.target.value})} placeholder="noreply@schoolpro.id" className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Send className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Uji Coba Pengiriman</CardTitle>
                <CardDescription>Pastikan server bisa mengirim email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Email Tujuan</Label>
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} type="email" placeholder="tujuan@gmail.com" className="rounded-xl" />
            </div>
            <Button variant="outline" className="w-full rounded-xl gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5" onClick={handleTest} disabled={testing || !form.SMTP_HOST}>
              {testing ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /> : <Send className="h-4 w-4" />}
              {testing ? "Sedang Mengirim..." : "Kirim Email Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
