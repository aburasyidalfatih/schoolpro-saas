"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      setError(result.error || "Terjadi kesalahan")
      setLoading(false)
    } else {
      router.push("/login?registered=true")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full orb-1 opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full orb-2 opacity-15 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full orb-3 opacity-10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl btn-gradient text-white font-bold text-xl shadow-lg glow-primary mb-4">
              S
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Buat akun baru</h1>
            <p className="text-sm text-muted-foreground mt-1">Daftar dan buat organisasi Anda</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" placeholder="Nama Anda" className="h-11 rounded-xl bg-background/50" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" className="h-11 rounded-xl bg-background/50" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Minimal 8 karakter" className="h-11 rounded-xl bg-background/50" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantName">Nama Organisasi</Label>
              <Input id="tenantName" placeholder="Contoh: SD Harapan Bangsa" className="h-11 rounded-xl bg-background/50" {...register("tenantName")} />
              {errors.tenantName && <p className="text-xs text-destructive">{errors.tenantName.message}</p>}
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl btn-gradient text-white shadow-lg glow-primary border-0 gap-2 mt-1" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Daftar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">&copy; 2026 SaasMasterPro</p>
      </div>
    </div>
  )
}
