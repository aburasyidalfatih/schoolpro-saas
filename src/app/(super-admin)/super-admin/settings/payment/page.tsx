"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { CreditCard, Save, Send, Eye, EyeOff, ChevronLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function SuperAdminPaymentPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [form, setForm] = useState({
    TRIPAY_API_KEY: "",
    TRIPAY_PRIVATE_KEY: "",
    TRIPAY_MERCHANT_CODE: "",
    TRIPAY_MODE: "sandbox", // sandbox atau live
  })

  useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          TRIPAY_API_KEY: data.TRIPAY_API_KEY || "",
          TRIPAY_PRIVATE_KEY: data.TRIPAY_PRIVATE_KEY || "",
          TRIPAY_MERCHANT_CODE: data.TRIPAY_MERCHANT_CODE || "",
          TRIPAY_MODE: data.TRIPAY_MODE || "sandbox",
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
      toast({ title: "Disimpan", description: "Konfigurasi Tripay platform berhasil disimpan." })
    }
  }

  if (loading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/super-admin/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerbang Pembayaran</h1>
            <p className="text-muted-foreground mt-1">Integrasi Tripay untuk pembayaran paket langganan tenant.</p>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                <CreditCard className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Konfigurasi Tripay</CardTitle>
                <CardDescription>Detail API Merchant dari Tripay</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tripay Mode</Label>
              <select 
                value={form.TRIPAY_MODE}
                onChange={(e) => setForm({...form, TRIPAY_MODE: e.target.value})}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="sandbox">Sandbox (Testing)</option>
                <option value="live">Live (Produksi)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Merchant Code</Label>
              <Input 
                value={form.TRIPAY_MERCHANT_CODE} 
                onChange={(e) => setForm({...form, TRIPAY_MERCHANT_CODE: e.target.value})} 
                placeholder="TXXXX" 
                className="rounded-xl" 
              />
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input 
                  type={showKey ? "text" : "password"} 
                  value={form.TRIPAY_API_KEY} 
                  onChange={(e) => setForm({...form, TRIPAY_API_KEY: e.target.value})} 
                  placeholder="Masukkan API Key" 
                  className="rounded-xl pr-10" 
                />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Private Key</Label>
              <Input 
                type="password"
                value={form.TRIPAY_PRIVATE_KEY} 
                onChange={(e) => setForm({...form, TRIPAY_PRIVATE_KEY: e.target.value})} 
                placeholder="Masukkan Private Key" 
                className="rounded-xl" 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-lg">Informasi Integrasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground">
              <p>API ini digunakan oleh platform untuk membuat tagihan otomatis ketika tenant melakukan upgrade paket langganan.</p>
              <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                <p className="font-semibold text-foreground">URL Callback / IPN:</p>
                <code className="block bg-muted p-2 rounded-lg text-xs break-all">
                  https://schoolpro.id/api/payment/callback
                </code>
                <p className="text-[10px]">Daftarkan URL di atas pada dashboard Tripay Anda.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
