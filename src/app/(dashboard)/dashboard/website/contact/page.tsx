"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Save, Phone, MapPin, Mail, Globe, MessageCircle, ExternalLink } from "lucide-react"

export default function WebsiteContactPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    youtube: "",
  })

  useEffect(() => {
    const id = session?.user?.tenants?.[0]?.id
    const s = session?.user?.tenants?.[0]?.slug
    if (!id) return
    setTenantId(id)
    setSlug(s || null)
    fetch(`/api/tenant/website?tenantId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSave = async () => {
    if (!tenantId) return
    setSaving(true)
    const res = await fetch("/api/tenant/website", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, ...form }),
    })
    setSaving(false)
    if (res.ok) {
      toast({ title: "Disimpan", description: "Informasi kontak berhasil diperbarui." })
    } else {
      toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" })
    }
  }

  if (loading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Informasi Kontak</h1>
          <p className="text-muted-foreground mt-1">Kelola alamat, nomor telepon, dan media sosial.</p>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/site/${slug}/contact`} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Lihat Halaman
            </a>
          )}
          <Button className="gap-2 btn-gradient text-white border-0 rounded-xl" onClick={handleSave} disabled={saving}>
            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kontak Utama */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Kontak Utama</CardTitle>
                <CardDescription>Alamat, telepon, dan email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Alamat</Label>
              <textarea value={form.address} onChange={set("address")}
                placeholder="Jl. Contoh No. 123, Kota, Provinsi" rows={3}
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Nomor Telepon</Label>
              <Input value={form.phone} onChange={set("phone")} placeholder="021-12345678" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="info@organisasi.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</Label>
              <Input value={form.website} onChange={set("website")} placeholder="https://www.organisasi.com" className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* Media Sosial */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Media Sosial</CardTitle>
                <CardDescription>WhatsApp, Instagram, Facebook, YouTube</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <span className="text-base">💬</span> WhatsApp
              </Label>
              <Input value={form.whatsapp} onChange={set("whatsapp")}
                placeholder="6281234567890 (format internasional)" className="rounded-xl" />
              <p className="text-xs text-muted-foreground">Contoh: 6281234567890 (tanpa + atau spasi)</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <span className="text-base">📷</span> Instagram
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">@</span>
                <Input value={form.instagram} onChange={set("instagram")} placeholder="username" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <span className="text-base">📘</span> Facebook
              </Label>
              <Input value={form.facebook} onChange={set("facebook")} placeholder="nama-halaman atau username" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <span className="text-base">▶️</span> YouTube
              </Label>
              <Input value={form.youtube} onChange={set("youtube")} placeholder="@channel atau ID channel" className="rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
