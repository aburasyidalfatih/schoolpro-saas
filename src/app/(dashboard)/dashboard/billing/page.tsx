"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { 
  CreditCard, CheckCircle2, Zap, Users, 
  Info, ArrowRight, ShieldCheck, Star 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function BillingPage() {
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [data, setData] = useState<any>(null)
  const [studentCount, setStudentCount] = useState(50)

  useEffect(() => {
    fetch("/api/tenant/billing")
      .then((r) => r.json())
      .then((res) => {
        setData(res)
        setStudentCount(res.pricing?.MIN_STUDENTS || 50)
        setLoading(false)
      })
  }, [])

  const pricing = data?.pricing || { PRICE_PER_STUDENT: 30000, MIN_STUDENTS: 50 }
  const totalCost = studentCount * pricing.PRICE_PER_STUDENT

  const handleCheckout = async () => {
    if (studentCount < pricing.MIN_STUDENTS) {
      toast({ title: "Gagal", description: `Minimal upgrade adalah ${pricing.MIN_STUDENTS} siswa`, variant: "destructive" })
      return
    }

    setCheckingOut(true)
    const res = await fetch("/api/tenant/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentCount }),
    })

    const result = await res.json()
    setCheckingOut(false)

    if (res.ok) {
      if (result.checkoutUrl && result.checkoutUrl !== "#") {
        window.location.href = result.checkoutUrl
      } else {
        toast({ title: "Invoice Dibuat", description: "Silakan cek email Anda untuk detail pembayaran." })
      }
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    }
  }

  if (loading) return <div className="skeleton h-96 rounded-2xl" />

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Langganan & Penagihan</h1>
        <p className="text-muted-foreground mt-1">Kelola paket sekolah dan kuota siswa Anda.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Status Paket Saat Ini */}
        <Card className={cn(
          "lg:col-span-1 border-0 shadow-lg",
          data?.plan === "pro" ? "bg-primary text-primary-foreground" : "glass"
        )}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {data?.plan === "pro" ? <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <Zap className="h-5 w-5 text-primary" />}
              Paket Saat Ini
            </CardTitle>
            <CardDescription className={data?.plan === "pro" ? "text-primary-foreground/80" : ""}>
              Status akun sekolah Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold uppercase tracking-widest">
              {data?.plan || "FREE"}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Kuota Siswa</span>
                <span className="font-bold">{data?.studentQuota || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Status Akun</span>
                <Badge variant={data?.isActive ? "secondary" : "destructive"}>
                  {data?.isActive ? "Aktif" : "Non-aktif"}
                </Badge>
              </div>
            </div>
            {data?.plan === "free" && (
              <div className="pt-4 border-t border-white/20">
                <p className="text-xs opacity-80 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0" />
                  Anda menggunakan paket gratis. Upgrade ke PRO untuk fitur manajemen siswa lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Upgrade */}
        <Card className="lg:col-span-2 glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Upgrade ke Paket PRO</CardTitle>
                <CardDescription>Bayar sesuai jumlah siswa aktif (Pay-per-Student)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Jumlah Siswa Aktif
                  </Label>
                  <Input 
                    type="number" 
                    min={pricing.MIN_STUDENTS} 
                    value={studentCount} 
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="rounded-xl h-12 text-lg font-semibold"
                  />
                  <p className="text-[10px] text-muted-foreground">Minimal upgrade: {pricing.MIN_STUDENTS} siswa</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                  <p className="text-xs text-muted-foreground">Estimasi Biaya</p>
                  <div className="flex items-end gap-1 text-primary">
                    <span className="text-sm font-semibold">Rp</span>
                    <span className="text-3xl font-bold">{totalCost.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-[10px] opacity-70 italic text-primary">Biaya Rp {pricing.PRICE_PER_STUDENT.toLocaleString("id-ID")} / siswa / tahun</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Fitur yang Anda dapatkan:</Label>
                <ul className="space-y-2 text-sm">
                  {[
                    "Manajemen Data Siswa Lengkap",
                    "E-Rapor & Cetak Dokumen Otomatis",
                    "Keuangan & SPP Digital",
                    "Fitur Absensi & Notifikasi Ortu",
                    "Support Prioritas 24/7",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl btn-gradient text-white border-0 gap-2 text-lg shadow-lg shadow-primary/20"
              disabled={checkingOut || studentCount < pricing.MIN_STUDENTS}
              onClick={handleCheckout}
            >
              {checkingOut ? "Menyiapkan Invoice..." : "Upgrade Sekarang"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
