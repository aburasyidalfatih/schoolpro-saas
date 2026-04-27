"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { toast } from "@/hooks/use-toast"
import { Lock, KeyRound, Smartphone, ShieldCheck, ShieldOff, Copy, Monitor, Trash2 } from "lucide-react"

interface SessionRow {
  id: string
  deviceName: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  expires: string
}

export default function SecurityPage() {
  const { data: session, update: updateSession } = useSession()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verifyCode, setVerifyCode] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [disablePassword, setDisablePassword] = useState("")
  const [disableLoading, setDisableLoading] = useState(false)

  useEffect(() => {
    setTwoFAEnabled(!!(session?.user as any)?.twoFactorEnabled)
  }, [session])

  // Fetch sessions
  useEffect(() => {
    fetch("/api/auth/sessions")
      .then((r) => r.json())
      .then((data) => { setSessions(data.data || []); setSessionsLoading(false) })
      .catch(() => setSessionsLoading(false))
  }, [])

  // 2FA Setup
  const handleSetup2FA = async () => {
    setSetupLoading(true)
    try {
      const res = await fetch("/api/auth/two-factor/setup", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setQrCode(data.qrCode)
        setSecret(data.secret)
      } else {
        toast({ title: "Gagal", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal", description: "Tidak dapat terhubung ke server", variant: "destructive" })
    }
    setSetupLoading(false)
  }

  const handleVerify2FA = async () => {
    setVerifyLoading(true)
    try {
      const res = await fetch("/api/auth/two-factor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()
      if (res.ok) {
        setTwoFAEnabled(true)
        setBackupCodes(data.backupCodes)
        setQrCode(null)
        setSecret(null)
        setVerifyCode("")
        await updateSession()
        toast({ title: "2FA Aktif", description: "Autentikasi dua faktor berhasil diaktifkan." })
      } else {
        toast({ title: "Gagal", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal", description: "Tidak dapat terhubung ke server", variant: "destructive" })
    }
    setVerifyLoading(false)
  }

  const handleDisable2FA = async () => {
    setDisableLoading(true)
    try {
      const res = await fetch("/api/auth/two-factor/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setTwoFAEnabled(false)
        setDisablePassword("")
        await updateSession()
        toast({ title: "2FA Nonaktif", description: "Autentikasi dua faktor berhasil dinonaktifkan." })
      } else {
        toast({ title: "Gagal", description: data.error, variant: "destructive" })
      }
    } catch {
      toast({ title: "Gagal", description: "Tidak dapat terhubung ke server", variant: "destructive" })
    }
    setDisableLoading(false)
  }

  const handleRevokeSession = async (sessionId: string) => {
    const res = await fetch("/api/auth/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
    if (res.ok) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast({ title: "Session dihapus", description: "Perangkat berhasil dikeluarkan." })
    }
  }

  const parseUA = (ua: string | null) => {
    if (!ua) return "Perangkat tidak dikenal"
    const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[0] || "Browser"
    const os = ua.match(/(Windows|Mac|Linux|Android|iOS)/i)?.[0] || "OS"
    return `${os} · ${browser}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Keamanan</h1>
        <p className="text-muted-foreground mt-1">Kelola password dan keamanan akun Anda.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ubah Password */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <KeyRound className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Ubah Password</CardTitle>
                <CardDescription>Pastikan password kuat dan unik</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" type="password" placeholder="Minimal 8 karakter" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input id="confirmPassword" type="password" placeholder="Ulangi password baru" className="rounded-xl" />
            </div>
            <Button className="btn-gradient text-white border-0 rounded-xl w-full">
              Ubah Password
            </Button>
          </CardContent>
        </Card>

        {/* 2FA */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                {twoFAEnabled ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <ShieldOff className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <CardTitle className="text-lg">Autentikasi Dua Faktor</CardTitle>
                <CardDescription>
                  {twoFAEnabled ? "2FA aktif — akun Anda lebih aman" : "Tambahkan lapisan keamanan ekstra"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Backup codes display */}
            {backupCodes && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Simpan backup codes ini di tempat aman!</p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code) => (
                    <code key={code} className="text-xs bg-background rounded-lg px-2 py-1.5 text-center font-mono">{code}</code>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-lg w-full gap-2" onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join("\n"))
                  toast({ title: "Disalin", description: "Backup codes disalin ke clipboard." })
                }}>
                  <Copy className="h-3 w-3" /> Salin Semua
                </Button>
                <Button variant="ghost" size="sm" className="rounded-lg w-full text-xs" onClick={() => setBackupCodes(null)}>
                  Saya sudah menyimpannya
                </Button>
              </div>
            )}

            {/* QR Code setup flow */}
            {qrCode && !twoFAEnabled && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code 2FA" className="rounded-xl border" width={200} height={200} />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Atau masukkan kode manual:</p>
                  <code className="text-xs bg-muted rounded-lg px-3 py-1.5 font-mono select-all">{secret}</code>
                </div>
                <div className="space-y-2">
                  <Label>Kode Verifikasi</Label>
                  <Input
                    placeholder="000000"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    className="rounded-xl text-center tracking-widest text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 btn-gradient text-white border-0 rounded-xl" onClick={handleVerify2FA} disabled={verifyLoading || verifyCode.length !== 6}>
                    {verifyLoading ? "Memverifikasi..." : "Aktifkan 2FA"}
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => { setQrCode(null); setSecret(null) }}>
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {/* Enable/Disable buttons */}
            {!qrCode && !backupCodes && (
              <>
                {twoFAEnabled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">2FA aktif menggunakan aplikasi authenticator</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Password untuk menonaktifkan</Label>
                      <Input type="password" placeholder="Masukkan password Anda" value={disablePassword} onChange={(e) => setDisablePassword(e.target.value)} className="rounded-xl" />
                    </div>
                    <Button variant="destructive" className="rounded-xl w-full" onClick={handleDisable2FA} disabled={disableLoading || !disablePassword}>
                      {disableLoading ? "Menonaktifkan..." : "Nonaktifkan 2FA"}
                    </Button>
                  </div>
                ) : (
                  <Button className="btn-gradient text-white border-0 rounded-xl w-full gap-2" onClick={handleSetup2FA} disabled={setupLoading}>
                    {setupLoading ? "Memuat..." : <><ShieldCheck className="h-4 w-4" /> Aktifkan 2FA</>}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Sesi Aktif — full width */}
        <Card className="glass border-0 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Sesi Aktif</CardTitle>
                <CardDescription>Perangkat yang sedang login ke akun Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6">
                <Monitor className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada sesi aktif tercatat</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{s.deviceName || parseUA(s.userAgent)}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.ipAddress || "IP tidak diketahui"} · {new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1 font-medium">Saat ini</span>
                      )}
                      {i !== 0 && (
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                          title="Hapus sesi ini?"
                          description="Perangkat ini akan dikeluarkan dari akun Anda."
                          confirmText="Ya, keluarkan"
                          onConfirm={() => handleRevokeSession(s.id)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zona Bahaya — full width */}
        <Card className="border-destructive/30 bg-destructive/5 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
                <Lock className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg text-destructive">Zona Bahaya</CardTitle>
                <CardDescription>Tindakan ini tidak dapat dibatalkan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl border border-destructive/20 p-4">
              <div>
                <p className="font-medium text-sm">Hapus Akun</p>
                <p className="text-xs text-muted-foreground">Semua data Anda akan dihapus secara permanen</p>
              </div>
              <ConfirmDialog
                trigger={<Button variant="destructive" size="sm" className="rounded-lg text-xs">Hapus Akun</Button>}
                title="Hapus akun Anda?"
                description="Semua data termasuk organisasi dan file Anda akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, hapus akun saya"
                onConfirm={() => { toast({ title: "Fitur segera hadir", description: "Penghapusan akun akan tersedia di versi berikutnya." }) }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
