"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Save, Info, ExternalLink } from "lucide-react"

export default function WebsiteAboutPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [form, setForm] = useState({
    about: "",
    logo: "",
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
        setForm({ about: data.about || "", logo: data.logo || "" })
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
      toast({ title: "Disimpan", description: "Profil & tentang kami berhasil diperbarui." })
    } else {
      toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" })
    }
  }

  if (loading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil & Tentang Kami</h1>
          <p className="text-muted-foreground mt-1">Kelola informasi profil dan cerita organisasi Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <a href={`/site/${slug}/about`} target="_blank" rel="noopener"
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
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Tentang Kami</CardTitle>
                <CardDescription>Cerita dan latar belakang organisasi</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Deskripsi Lengkap</Label>
              <textarea
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                placeholder="Ceritakan tentang organisasi Anda, sejarah, visi, dan misi..."
                rows={10}
                className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">Tampil di halaman Tentang Kami website</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Logo Organisasi</CardTitle>
                <CardDescription>Logo yang tampil di navbar dan footer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL Logo</Label>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="https://..." className="rounded-xl" />
              <p className="text-xs text-muted-foreground">Rekomendasi: format PNG/SVG, ukuran 200×200px</p>
            </div>
            {form.logo ? (
              <div className="flex items-center justify-center rounded-xl border p-6 bg-muted/20">
                <img src={form.logo} alt="Logo preview" className="h-24 w-24 object-contain rounded-xl" />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed p-8 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏢</div>
                  <p className="text-sm text-muted-foreground">Belum ada logo</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
