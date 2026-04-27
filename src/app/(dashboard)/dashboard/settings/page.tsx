"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Building2, User, Bell, Globe, Phone, Mail, MapPin } from "lucide-react"

export default function SettingsGeneralPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Umum</h1>
        <p className="text-muted-foreground mt-1">Kelola profil, organisasi, dan preferensi notifikasi.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profil */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Profil</CardTitle>
                <CardDescription>Informasi akun Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue={session?.user?.name || ""} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={session?.user?.email || ""} disabled className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input id="phone" placeholder="08xxxxxxxxxx" className="rounded-xl" />
            </div>
            <Button
              className="btn-gradient text-white border-0 rounded-xl w-full"
              onClick={() => toast({ title: "Berhasil disimpan", description: "Profil Anda telah diperbarui." })}
            >
              Simpan Profil
            </Button>
          </CardContent>
        </Card>

        {/* Organisasi */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Organisasi</CardTitle>
                <CardDescription>Pengaturan tenant Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nama Organisasi</Label>
              <Input id="orgName" defaultValue={session?.user?.tenants?.[0]?.name || ""} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Subdomain</Label>
              <Input id="slug" defaultValue={session?.user?.tenants?.[0]?.slug || ""} disabled className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgDesc">Deskripsi</Label>
              <Input id="orgDesc" placeholder="Deskripsi singkat organisasi" className="rounded-xl" />
            </div>
            <Button
              className="btn-gradient text-white border-0 rounded-xl w-full"
              onClick={() => toast({ title: "Berhasil disimpan", description: "Pengaturan organisasi telah diperbarui." })}
            >
              Simpan Organisasi
            </Button>
          </CardContent>
        </Card>

        {/* Notifikasi — full width */}
        <Card className="glass border-0 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Preferensi Notifikasi</CardTitle>
                <CardDescription>Pilih channel notifikasi yang Anda inginkan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { name: "In-App", desc: "Notifikasi di dalam aplikasi", icon: Bell, active: true },
                { name: "Email", desc: "Via Mailketing SMTP", icon: Mail, active: true },
                { name: "WhatsApp", desc: "Via StarSender", icon: Phone, active: false },
              ].map((ch) => (
                <button
                  key={ch.name}
                  onClick={() =>
                    toast({
                      title: ch.active ? "Dinonaktifkan" : "Diaktifkan",
                      description: `Notifikasi ${ch.name} telah diubah.`,
                    })
                  }
                  className={cn(
                    "flex flex-col items-center gap-2.5 rounded-xl border-2 p-5 transition-all duration-200 text-center",
                    ch.active
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    ch.active ? "bg-primary/10" : "bg-muted"
                  )}>
                    <ch.icon className={cn("h-5 w-5", ch.active ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className={cn("text-sm font-semibold", ch.active ? "text-primary" : "text-foreground")}>{ch.name}</span>
                  <span className="text-[11px] text-muted-foreground">{ch.desc}</span>
                  <span className={cn(
                    "text-[10px] font-medium rounded-full px-2.5 py-0.5",
                    ch.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {ch.active ? "Aktif" : "Nonaktif"}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
