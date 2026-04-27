import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await db.tenant.findUnique({
    where: { slug },
    select: {
      name: true, address: true, phone: true, email: true,
      whatsapp: true, instagram: true, facebook: true, youtube: true,
    },
  })
  if (!tenant) notFound()

  return (
    <>
      <section className="bg-mesh py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary mb-2">Kontak</p>
          <h1 className="text-4xl font-bold tracking-tight">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Kami senang mendengar dari Anda. Silakan hubungi kami melalui salah satu cara di bawah ini.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Informasi Kontak</h2>

            <div className="space-y-4">
              {tenant.address && (
                <div className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Alamat</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{tenant.address}</p>
                  </div>
                </div>
              )}

              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Telepon</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{tenant.phone}</p>
                  </div>
                </a>
              )}

              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{tenant.email}</p>
                  </div>
                </a>
              )}

              {tenant.whatsapp && (
                <a href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="flex items-start gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <MessageCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">WhatsApp</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{tenant.whatsapp}</p>
                  </div>
                </a>
              )}

              <div className="flex items-start gap-4 p-4 rounded-xl border">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Jam Operasional</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Senin - Jumat: 08:00 - 17:00</p>
                  <p className="text-sm text-muted-foreground">Sabtu: 08:00 - 12:00</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {(tenant.instagram || tenant.facebook || tenant.youtube) && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Media Sosial</h3>
                <div className="flex gap-3">
                  {tenant.instagram && (
                    <a href={`https://instagram.com/${tenant.instagram}`} target="_blank" rel="noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted/50 transition-colors text-sm">📷</a>
                  )}
                  {tenant.facebook && (
                    <a href={`https://facebook.com/${tenant.facebook}`} target="_blank" rel="noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted/50 transition-colors text-sm">📘</a>
                  )}
                  {tenant.youtube && (
                    <a href={`https://youtube.com/${tenant.youtube}`} target="_blank" rel="noopener" className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted/50 transition-colors text-sm">▶️</a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border bg-background p-8">
            <h2 className="text-xl font-bold mb-6">Kirim Pesan</h2>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama</label>
                  <input type="text" placeholder="Nama lengkap" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" placeholder="email@contoh.com" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telepon</label>
                <input type="tel" placeholder="08xxxxxxxxxx" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subjek</label>
                <input type="text" placeholder="Perihal pesan Anda" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pesan</label>
                <textarea rows={5} placeholder="Tulis pesan Anda di sini..." className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none" />
              </div>
              <button type="submit" className="w-full h-11 rounded-xl btn-gradient text-white font-medium">
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
