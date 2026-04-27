"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2, Search, Pencil, Trash2, LogIn,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ServerPagination } from "@/components/shared/server-pagination"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface TenantRow {
  id: string
  name: string
  slug: string
  domain: string | null
  plan: string
  theme: string
  isActive: boolean
  createdAt: string
  userCount: number
  owner: { name: string; email: string; phone: string | null } | null
}

const planBadge: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-primary/10 text-primary",
  enterprise: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const limit = 10

  const fetchTenants = useCallback(() => {
    setLoading(true)
    fetch(`/api/super-admin/tenants?page=${page}&limit=${limit}&search=${search}`)
      .then((r) => r.json())
      .then((data) => {
        setTenants(data.data || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [page, search])

  useEffect(() => { fetchTenants() }, [fetchTenants])

  const totalPages = Math.ceil(total / limit)

  const handleDelete = async (id: string, name: string) => {
    const res = await fetch("/api/super-admin/tenants", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      toast({ title: "Tenant dihapus", description: `${name} berhasil dihapus.` })
      fetchTenants()
    } else {
      toast({ title: "Gagal", description: "Tidak dapat menghapus tenant.", variant: "destructive" })
    }
  }

  const handleLoginAs = async (tenantId: string, slug: string) => {
    const res = await fetch("/api/super-admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    })
    if (res.ok) {
      window.location.href = "/dashboard"
    } else {
      const data = await res.json()
      toast({ title: "Gagal", description: data.error || "Tidak dapat login sebagai tenant.", variant: "destructive" })
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Semua Tenant</h1>
          <p className="text-muted-foreground mt-1">Kelola semua organisasi di platform ({total} tenant)</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama tenant..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Table */}
      <Card className="glass border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">WhatsApp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Domain</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Tgl Daftar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-4" colSpan={7}><div className="skeleton h-6 w-full rounded-lg" /></td>
                  </tr>
                ))
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">Belum ada tenant</p>
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    {/* Tenant */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{t.slug}</span>
                            <span className={cn("text-[10px] font-semibold uppercase rounded-full px-1.5 py-0.5", planBadge[t.plan] || planBadge.free)}>
                              {t.plan}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-sm">{t.owner?.email || "-"}</span>
                    </td>

                    {/* WhatsApp */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm">{t.owner?.phone || "-"}</span>
                    </td>

                    {/* Domain */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {t.domain ? (
                        <span className="text-sm">{t.domain}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{t.slug}.saasmasterpro.com</span>
                      )}
                    </td>

                    {/* Tanggal */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{formatDate(t.createdAt)}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
                        t.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", t.isActive ? "bg-emerald-500" : "bg-destructive")} />
                        {t.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 glass rounded-xl">
                          <DropdownMenuItem className="gap-2 rounded-lg" onClick={() => toast({ title: "Edit", description: `Edit ${t.name} — fitur segera hadir.` })}>
                            <Pencil className="h-4 w-4" />
                            Edit Tenant
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg" onClick={() => handleLoginAs(t.id, t.slug)}>
                            <LogIn className="h-4 w-4" />
                            Login Sebagai
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <ConfirmDialog
                            trigger={
                              <DropdownMenuItem className="gap-2 rounded-lg text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4" />
                                Hapus Tenant
                              </DropdownMenuItem>
                            }
                            title={`Hapus tenant "${t.name}"?`}
                            description="Semua data tenant termasuk pengguna, pembayaran, dan file akan dihapus secara permanen."
                            confirmText="Ya, hapus tenant"
                            onConfirm={() => handleDelete(t.id, t.name)}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t">
            <ServerPagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
