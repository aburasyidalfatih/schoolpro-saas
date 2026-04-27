"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Save, Globe, ExternalLink } from "lucide-react"

export default function WebsiteHomePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    heroImage: "",
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
          name: data.name || "",
          tagline: data.tagline || "",
          description: data.description || "",
          heroImage: data.heroImage || "",
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

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
      toast({ title: "Disimpan", description: "Konten beranda website berhasil diperbarui." })
    } else {
      const data = await res.json().catch(() => ({}))
      toast({ title: "Gagal", description: data.error || "Terjadi kesalahan.", variant: "destructive" })
    }
  }

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Beranda Website</h1>
          <p className="text-muted-foreground mt-1">Kelola konten utama halaman beranda website Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/site/${slug}`} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Lihat Website
            </a>
          )}
          <Button className="gap-2 btn-gradient text-white border-0 rounded-xl" onClick={handleSave} disabled={saving}>
            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Identitas Website</CardTitle>
                <CardDescription>Nama, tagline, dan deskripsi singkat</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Organisasi</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama organisasi Anda" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Tagline / Slogan</Label>
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Slogan singkat yang menggambarkan organisasi" className="rounded-xl" />
              <p className="text-xs text-muted-foreground">Tampil di hero section dan navbar website</p>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi singkat organisasi Anda (maks. 300 karakter)"
                maxLength={300}
                rows={4}
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">{form.description.length}/300 karakter</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Gambar Hero</CardTitle>
                <CardDescription>Foto utama di bagian atas website</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL Gambar Hero</Label>
              <Input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                placeholder="https://..." className="rounded-xl" />
              <p className="text-xs text-muted-foreground">Masukkan URL gambar (rekomendasi: 1920×1080px)</p>
            </div>
            {form.heroImage && (
              <div className="rounded-xl overflow-hidden border aspect-video">
                <img src={form.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            )}
            {!form.heroImage && (
              <div className="rounded-xl border-2 border-dashed aspect-video flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm text-muted-foreground">Belum ada gambar hero</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
