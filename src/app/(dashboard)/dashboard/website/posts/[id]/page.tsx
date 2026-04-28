"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useTenantBranding } from "@/components/providers/tenant-branding-provider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations/post"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

type FormData = z.infer<typeof postSchema>

export default function PostFormPage() {
  const router = useRouter()
  const params = useParams()
  const { branding, isLoadingTenant } = useTenantBranding()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const tenantId = branding.id

  const isNew = params.id === "new"

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: "BLOG_GURU",
      status: "PUBLISHED",
      featuredImage: ""
    }
  })

  // Auto generate slug from title
  const titleValue = watch("title")
  useEffect(() => {
    if (isNew && titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setValue("slug", generatedSlug)
    }
  }, [titleValue, isNew, setValue])



  useEffect(() => {
    if (isLoadingTenant) return
    if (!tenantId) return
    if (isNew) {
      setInitialLoading(false)
      return
    }

    fetch(`/api/tenant/posts/${params.id}?tenantId=${tenantId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          toast({ title: "Gagal memuat artikel", description: d.error, variant: "destructive" })
          router.push("/dashboard/website/posts")
          return
        }
        setValue("title", d.title)
        setValue("slug", d.slug)
        setValue("content", d.content)
        setValue("type", d.type)
        setValue("status", d.status)
        setValue("featuredImage", d.featuredImage || "")
        setInitialLoading(false)
      })
      .catch(() => {
        toast({ title: "Gagal memuat artikel", variant: "destructive" })
        setInitialLoading(false)
      })
  }, [tenantId, isNew, params.id, setValue, router])

  const onSubmit = async (data: FormData) => {
    if (!tenantId) return
    setLoading(true)

    const url = isNew ? `/api/tenant/posts` : `/api/tenant/posts/${params.id}`
    const method = isNew ? "POST" : "PUT"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tenantId })
      })

      const d = await res.json()
      if (res.ok) {
        toast({ title: "Berhasil", description: d.message })
        router.push("/dashboard/website/posts")
        router.refresh()
      } else {
        toast({ title: "Gagal menyimpan", description: d.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal menyimpan artikel", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="skeleton h-96 rounded-2xl" />

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Link href="/dashboard/website/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{isNew ? "Tulis Artikel Baru" : "Edit Artikel"}</h1>
            <p className="text-muted-foreground mt-1">Buat konten menarik untuk website sekolah Anda.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="glass border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel <span className="text-red-500">*</span></Label>
                <Input id="title" {...register("title")} className="rounded-xl" placeholder="Contoh: Kegiatan Porseni 2026" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) <span className="text-red-500">*</span></Label>
                <Input id="slug" {...register("slug")} className="rounded-xl" placeholder="kegiatan-porseni-2026" />
                {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Kategori Pos</Label>
                <select 
                  id="type" 
                  {...register("type")} 
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="BLOG_GURU">Blog Guru (Artikel Umum)</option>
                  <option value="EDITORIAL">Editorial (Khusus Kepsek)</option>
                  <option value="PENGUMUMAN">Pengumuman Penting</option>
                </select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Publikasi</Label>
                <select 
                  id="status" 
                  {...register("status")} 
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PUBLISHED">Publikasikan Langsung</option>
                  <option value="DRAFT">Simpan sebagai Draft</option>
                </select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage">URL Gambar Utama (Opsional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="featuredImage" {...register("featuredImage")} className="rounded-xl pl-9" placeholder="https://contoh.com/gambar.jpg" />
              </div>
              <p className="text-[11px] text-muted-foreground">URL gambar cover untuk artikel ini. Gunakan fitur Kelola Galeri untuk upload lalu copy URL-nya ke sini.</p>
              {errors.featuredImage && <p className="text-xs text-red-500">{errors.featuredImage.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Konten Artikel <span className="text-red-500">*</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea 
                id="content" 
                {...register("content")} 
                className="rounded-xl min-h-[400px] resize-y font-mono text-sm leading-relaxed" 
                placeholder="Tulis isi artikel Anda di sini... Mendukung format HTML sederhana." 
              />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
              <p className="text-[11px] text-muted-foreground mt-2">
                Saat ini hanya menggunakan teks area standar. Format Rich Text (bold, italic) bisa ditulis menggunakan tag HTML seperti &lt;b&gt;teks&lt;/b&gt; untuk sementara.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/website/posts">Batal</Link>
          </Button>
          <Button type="submit" disabled={loading} className="gap-2 btn-gradient text-white border-0 rounded-xl px-8">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? "Simpan Artikel" : "Update Artikel"}
          </Button>
        </div>
      </form>
    </div>
  )
}
