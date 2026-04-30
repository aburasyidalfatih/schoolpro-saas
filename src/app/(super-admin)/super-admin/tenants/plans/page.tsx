"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { 
  Zap, Star, CheckCircle2, Save, 
  Users, ShieldCheck, Plus, Edit, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  interval: string
  features: any
  maxStudents: number
  maxStorage: number
  isActive: boolean
  isPopular: boolean
  sortOrder: number
}

export default function PlansPage() {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/super-admin/plans")
      const data = await res.json()
      setPlans(data)
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat paket.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleSave = async () => {
    if (!editingPlan) return
    setSaving(true)
    
    try {
      const isNew = !editingPlan.id
      const res = await fetch("/api/super-admin/plans", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingPlan,
          features: Array.isArray(editingPlan.features) 
            ? JSON.stringify(editingPlan.features) 
            : editingPlan.features
        }),
      })

      if (res.ok) {
        toast({ title: "Berhasil", description: `Paket berhasil ${isNew ? 'ditambahkan' : 'diperbarui'}.` })
        setIsDialogOpen(false)
        fetchPlans()
      } else {
        const err = await res.json()
        throw new Error(err.error || "Gagal menyimpan paket")
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return
    
    try {
      const res = await fetch(`/api/super-admin/plans?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Berhasil", description: "Paket telah dihapus." })
        fetchPlans()
      }
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus paket.", variant: "destructive" })
    }
  }

  if (loading && plans.length === 0) return <div className="space-y-4">{[1, 2].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Paket & Harga</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kelola fitur dan konfigurasi paket tetap secara dinamis.</p>
        </div>
        <Button 
          className="gap-2 btn-gradient text-white border-0 rounded-xl" 
          onClick={() => {
            setEditingPlan({
              name: "",
              slug: "",
              description: "",
              price: 0,
              interval: "MONTHLY",
              features: "[]",
              maxStudents: 0,
              maxStorage: 100,
              isActive: true,
              isPopular: false,
              sortOrder: 0
            })
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className={cn("glass border-0 overflow-hidden relative", plan.isPopular && "ring-2 ring-primary/20")}>
            <div className={cn("h-2", plan.slug === 'free' ? "bg-slate-400" : "bg-primary")} />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl", plan.slug === 'free' ? "bg-slate-100 text-slate-600" : "bg-primary/10 text-primary")}>
                    {plan.slug === 'free' ? <Zap className="h-5 w-5" /> : <Star className={cn("h-5 w-5", plan.isPopular && "fill-primary")} />}
                  </div>
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                    setEditingPlan({
                      ...plan,
                      features: Array.isArray(plan.features) ? JSON.stringify(plan.features, null, 2) : plan.features
                    })
                    setIsDialogOpen(true)
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {plan.slug !== 'free' && plan.slug !== 'pro' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-3xl font-bold">
                {plan.slug === 'pro' ? (
                  <div className="space-y-1">
                    <span className="text-lg text-primary block">Pay-per-Student</span>
                    <span className="text-sm font-normal text-muted-foreground italic">Harga diatur di Pengaturan Umum</span>
                  </div>
                ) : (
                  <>
                    Rp {plan.price.toLocaleString('id-ID')} 
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.interval === 'MONTHLY' ? ' / bulan' : plan.interval === 'YEARLY' ? ' / tahun' : ' / sekali bayar'}
                    </span>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <Label className="text-[10px] uppercase text-muted-foreground block mb-1">Kuota Siswa</Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">
                      {plan.slug === 'pro' ? 'Sesuai Pembelian' : (plan.maxStudents === 0 ? 'Tak Terbatas' : `${plan.maxStudents} Siswa`)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <Label className="text-[10px] uppercase text-muted-foreground block mb-1">Penyimpanan</Label>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">{plan.maxStorage} MB</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Fitur Utama:</Label>
                <ul className="space-y-2 text-sm">
                  {(Array.isArray(plan.features) ? plan.features : []).slice(0, 5).map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {(Array.isArray(plan.features) ? plan.features : []).length > 5 && (
                    <li className="text-xs text-muted-foreground pl-6">+ {(Array.isArray(plan.features) ? plan.features : []).length - 5} fitur lainnya</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 leading-relaxed">
            <p className="font-bold mb-1">Catatan Sistem:</p>
            <p>Halaman ini untuk mengatur paket dengan harga tetap. Untuk pengaturan harga dinamis **"Pay-per-Student"** (Paket PRO), silakan gunakan menu **Pengaturan Platform -&gt; Umum**.</p>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold">{editingPlan?.id ? 'Edit Detail Paket' : 'Tambah Paket Baru'}</DialogTitle>
            <DialogDescription>Konfigurasi fitur dan batasan kuota untuk paket ini.</DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <div className="px-6 py-4 space-y-5 overflow-y-auto max-h-[60vh] border-y border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Nama Paket</Label>
                  <Input 
                    value={editingPlan.name} 
                    onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                    placeholder="Contoh: Paket Bisnis"
                    className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Slug (ID Sistem)</Label>
                  <Input 
                    value={editingPlan.slug} 
                    onChange={e => setEditingPlan({...editingPlan, slug: e.target.value})}
                    placeholder="contoh: pro"
                    className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all"
                    disabled={editingPlan.slug === 'free' || editingPlan.slug === 'pro'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Deskripsi</Label>
                <Input 
                  value={editingPlan.description || ""} 
                  onChange={e => setEditingPlan({...editingPlan, description: e.target.value})}
                  placeholder="Penjelasan singkat paket"
                  className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Harga (Rp)</Label>
                  <Input 
                    type="number"
                    value={editingPlan.price} 
                    onChange={e => setEditingPlan({...editingPlan, price: Number(e.target.value)})}
                    className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all font-bold text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Interval</Label>
                  <select 
                    className="w-full h-10 rounded-xl border border-border/60 focus:ring-2 focus:ring-primary focus:outline-none px-3 text-sm transition-all"
                    value={editingPlan.interval}
                    onChange={e => setEditingPlan({...editingPlan, interval: e.target.value})}
                  >
                    <option value="MONTHLY">Bulanan</option>
                    <option value="YEARLY">Tahunan</option>
                    <option value="ONETIME">Sekali Bayar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Maks Siswa (0=Unlimited)</Label>
                  <Input 
                    type="number"
                    value={editingPlan.maxStudents} 
                    onChange={e => setEditingPlan({...editingPlan, maxStudents: Number(e.target.value)})}
                    className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Maks Storage (MB)</Label>
                  <Input 
                    type="number"
                    value={editingPlan.maxStorage} 
                    onChange={e => setEditingPlan({...editingPlan, maxStorage: Number(e.target.value)})}
                    className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Fitur (List JSON)</Label>
                <Textarea 
                  value={editingPlan.features} 
                  onChange={e => setEditingPlan({...editingPlan, features: e.target.value})}
                  placeholder='["Fitur A", "Fitur B"]'
                  className="rounded-xl border border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all min-h-[80px] font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Aktif</Label>
                    <p className="text-[10px] text-muted-foreground">Tampil di billing</p>
                  </div>
                  <Switch 
                    checked={editingPlan.isActive}
                    onCheckedChange={checked => setEditingPlan({...editingPlan, isActive: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Populer</Label>
                    <p className="text-[10px] text-muted-foreground">Badge unggulan</p>
                  </div>
                  <Switch 
                    checked={editingPlan.isPopular}
                    onCheckedChange={checked => setEditingPlan({...editingPlan, isPopular: checked})}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="p-6 bg-muted/10 border-t">
            <Button variant="ghost" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button className="rounded-xl btn-gradient text-white border-0 px-8" onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
