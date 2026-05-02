import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth() as any
  if (!session) redirect("/login")

  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      tenant: true
    }
  })

  if (!payment) return notFound()

  // Ensure the user belongs to the tenant that owns this payment
  const isOwner = session.user?.tenants?.some((t: any) => t.id === payment.tenantId)
  if (!isOwner && !session.user?.isSuperAdmin) {
    return notFound()
  }

  const isPaid = payment.status === "paid"
  const isFailed = payment.status === "failed" || payment.status === "expired" || payment.status === "cancelled"
  const isPending = payment.status === "pending"

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-3xl p-10 shadow-2xl rounded-lg" id="invoice-container">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">INVOICE</h1>
            <p className="text-gray-500 mt-1 font-mono">{payment.reference}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">SchoolPro SaaS</h2>
            <p className="text-sm text-gray-500 mt-1">Layanan Manajemen Sekolah Modern</p>
            <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
          </div>
        </div>

        {/* Info & Status */}
        <div className="flex justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ditagihkan Kepada</p>
            <p className="text-lg font-bold text-gray-900">{payment.tenant.name}</p>
            <p className="text-sm text-gray-600 mt-1">Domain: {payment.tenant.slug}.schoolpro.id</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status Pembayaran</p>
            {isPaid && (
              <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-bold text-sm">LUNAS</span>
              </div>
            )}
            {isPending && (
              <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <Clock className="h-5 w-5" />
                <span className="font-bold text-sm">BELUM BAYAR</span>
              </div>
            )}
            {isFailed && (
              <div className="inline-flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                <XCircle className="h-5 w-5" />
                <span className="font-bold text-sm">DIBATALKAN / GAGAL</span>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">
              Tanggal: {new Date(payment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 font-bold text-gray-800 uppercase text-sm tracking-wider">Deskripsi Item</th>
                <th className="py-3 font-bold text-gray-800 uppercase text-sm tracking-wider text-center">Jumlah Siswa</th>
                <th className="py-3 font-bold text-gray-800 uppercase text-sm tracking-wider text-right">Harga Satuan</th>
                <th className="py-3 font-bold text-gray-800 uppercase text-sm tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-5">
                  <p className="font-bold text-gray-900">Upgrade / Perpanjang Paket PRO</p>
                  <p className="text-sm text-gray-500 mt-1">Biaya berlangganan per siswa (Tahunan)</p>
                </td>
                <td className="py-5 text-center text-gray-800 font-medium">{(payment.metadata as any)?.studentCount ?? 1}</td>
                <td className="py-5 text-right text-gray-800 font-medium">Rp {(payment.amount / ((payment.metadata as any)?.studentCount ?? 1)).toLocaleString("id-ID")}</td>
                <td className="py-5 text-right text-gray-900 font-bold">Rp {payment.amount.toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-gray-800 font-medium">Rp {payment.amount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Pajak (0%)</span>
              <span className="text-gray-800 font-medium">Rp 0</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-xl font-black text-gray-900">Total Tagihan</span>
              <span className="text-xl font-black text-gray-900">Rp {payment.amount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
          <p>Terima kasih atas kepercayaan Anda menggunakan layanan SchoolPro.</p>
          <p className="mt-1">Jika Anda memiliki pertanyaan terkait invoice ini, silakan hubungi tim support kami.</p>
        </div>

      </div>

      {/* Script to trigger print automatically */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      `}} />

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white; }
          #invoice-container { box-shadow: none; max-width: 100%; padding: 0; }
          @page { margin: 1cm; }
        }
      `}} />
    </div>
  )
}
