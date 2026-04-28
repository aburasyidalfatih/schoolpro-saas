"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Receipt, Search, Filter, ArrowUpRight, 
  CheckCircle2, Clock, XCircle, AlertCircle,
  TrendingUp, Wallet, CreditCard, School
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Payment {
  id: string
  reference: string
  amount: number
  method: string | null
  status: string
  plan: string
  createdAt: string
  paidAt: string | null
  tenant: {
    name: string
    slug: string
  }
}

interface Stats {
  totalRevenue: number
  pendingCount: number
}

export default function PaymentsPage() {
  const [data, setData] = useState<{ payments: Payment[], stats: Stats }>({ payments: [], stats: { totalRevenue: 0, pendingCount: 0 } })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")

  const fetchPayments = async () => {
    try {
      const url = filter === "all" ? "/api/super-admin/payments" : `/api/super-admin/payments?status=${filter}`
      const res = await fetch(url)
      const result = await res.json()
      setData(result)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch payments", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const filteredPayments = data.payments.filter(p => 
    p.reference.toLowerCase().includes(search.toLowerCase()) ||
    p.tenant.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": 
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Berhasil</Badge>
      case "pending": 
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1"><Clock className="h-3 w-3" /> Menunggu</Badge>
      case "expired": 
        return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 gap-1"><AlertCircle className="h-3 w-3" /> Kedaluwarsa</Badge>
      case "failed": 
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1"><XCircle className="h-3 w-3" /> Gagal</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  if (loading) return <div className="space-y-6">{[1, 2, 3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transaksi Platform</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor seluruh aktivitas pembayaran langganan tenant.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={fetchPayments}>
            <TrendingUp className="h-4 w-4" /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-0 shadow-lg shadow-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Wallet className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">Paid</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Pendapatan</p>
              <h3 className="text-2xl font-bold mt-1">Rp {data.stats.totalRevenue.toLocaleString("id-ID")}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg shadow-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100">Pending</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Transaksi Menunggu</p>
              <h3 className="text-2xl font-bold mt-1">{data.stats.pendingCount} Transaksi</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg shadow-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="h-6 w-6" />
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">All Time</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Total Transaksi</p>
              <h3 className="text-2xl font-bold mt-1">{data.payments.length} Transaksi</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & List */}
      <Card className="glass border-0 shadow-xl shadow-primary/5">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Daftar Transaksi</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari Ref / Tenant..." 
                  className="rounded-xl pl-9 w-[200px] md:w-[250px] h-9" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select 
                className="h-9 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="paid">Berhasil</option>
                <option value="pending">Menunggu</option>
                <option value="expired">Kedaluwarsa</option>
                <option value="failed">Gagal</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground font-medium">
                  <th className="text-left py-3 px-2">ID Referensi</th>
                  <th className="text-left py-3 px-2">Tenant</th>
                  <th className="text-left py-3 px-2">Paket</th>
                  <th className="text-left py-3 px-2">Nominal</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-muted-foreground italic">
                      Tidak ada transaksi ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2 font-mono text-xs font-semibold">{p.reference}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                            <School className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{p.tenant.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 uppercase text-[10px] font-bold tracking-wider">{p.plan}</td>
                      <td className="py-4 px-2 font-bold text-primary">Rp {p.amount.toLocaleString("id-ID")}</td>
                      <td className="py-4 px-2">{getStatusBadge(p.status)}</td>
                      <td className="py-4 px-2 text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
