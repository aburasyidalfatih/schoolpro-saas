"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { 
  Zap, Star, CheckCircle2, Save, Info, 
  Users, CreditCard, ShieldCheck, Lock 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanConfig {
  PRICE_PER_STUDENT: string
  MIN_STUDENTS: string
}

export default function PlansPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<PlanConfig>({
    PRICE_PER_STUDENT: "30000",
    MIN_STUDENTS: "50"
  })

  useEffect(() => {
    fetch("/api/super-admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setConfig({
          PRICE_PER_STUDENT: data.PRICE_PER_STUDENT || "30000",
          MIN_STUDENTS: data.MIN_STUDENTS || "50"
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
      body: JSON.stringify(config),
    })

    if (res.ok) {
      toast({ title: "Berhasil", description: "Harga paket telah diperbarui." })
    }
    setSaving(false)
  }

  if (loading) return <div className="space-y-4">{[1, 2].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Paket & Harga</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kelola fitur dan konfigurasi harga untuk tenant.</p>
        </div>
        <Button 
          className="gap-2 btn-gradient text-white border-0 rounded-xl" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FREE PLAN */}
        <Card className="glass border-0 overflow-hidden">
          <div className="h-2 bg-slate-400" />
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Paket FREE</CardTitle>
                  <CardDescription>Paket awal untuk semua sekolah</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-lg">Default</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-3xl font-bold">Rp 0 <span className="text-sm font-normal text-muted-foreground">/ selamanya</span></div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Fitur Termasuk:</Label>
              <ul className="space-y-2">
                {[
                  "CMS Website Sekolah",
                  "Manajemen Data Guru",
                  "Subdomain schoolpro.id",
                  "Pengaturan Dasar Instansi",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Fitur Terkunci:</Label>
              <ul className="space-y-2">
                {[
                  "Manajemen Siswa & Akademik",
                  "Laporan & Analitik",
                  "Custom Domain (.sch.id)",
                  "WhatsApp Notification",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground opacity-70">
                    <Lock className="h-3.5 w-3.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* PRO PLAN */}
        <Card className="glass border-0 overflow-hidden ring-2 ring-primary/20">
          <div className="h-2 bg-primary" />
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                </div>
                <div>
                  <CardTitle>Paket PRO</CardTitle>
                  <CardDescription>Fitur lengkap manajemen digital</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary text-white border-0 rounded-lg">Premium</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Harga / Siswa (Rp)</Label>
                  <Input 
                    type="number" 
                    value={config.PRICE_PER_STUDENT}
                    onChange={(e) => setConfig({...config, PRICE_PER_STUDENT: e.target.value})}
                    className="rounded-xl font-bold text-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Minimal Siswa</Label>
                  <Input 
                    type="number" 
                    value={config.MIN_STUDENTS}
                    onChange={(e) => setConfig({...config, MIN_STUDENTS: e.target.value})}
                    className="rounded-xl font-bold h-11"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" /> Harga ini akan digunakan saat tenant melakukan upgrade.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Semua Fitur FREE + :</Label>
              <ul className="space-y-2">
                {[
                  "Manajemen Siswa (Unlimited sesuai kuota)",
                  "Laporan Analitik & Tren",
                  "Fitur Keuangan & SPP Digital",
                  "Absensi & Notifikasi WhatsApp",
                  "Custom Domain Support",
                  "Support Prioritas",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 leading-relaxed">
            <p className="font-bold mb-1">Informasi Kebijakan Paket:</p>
            <p>1. Tenant paket PRO yang habis masa berlakunya akan otomatis kembali ke paket FREE (Fitur Pro terkunci namun data tidak dihapus).</p>
            <p>2. Perubahan harga tidak mempengaruhi tenant yang sudah membayar (hanya berlaku untuk transaksi baru).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
