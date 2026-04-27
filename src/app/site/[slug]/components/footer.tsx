import Link from "next/link"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

interface FooterProps {
  tenant: {
    name: string
    slug: string
    tagline?: string | null
    phone: string | null
    email: string | null
    whatsapp: string | null
    address?: string | null
    instagram?: string | null
    facebook?: string | null
    youtube?: string | null
  }
}

export function WebsiteFooter({ tenant }: FooterProps) {
  const base = `/site/${tenant.slug}`
  const year = new Date().getFullYear()

  return (
    <footer>
      {/* ── Main footer — dark background ── */}
      <div style={{ background: "hsl(220 25% 12%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-4">

            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white font-extrabold text-lg border-2"
                  style={{ background: "hsl(var(--primary))", borderColor: "hsl(var(--primary)/0.5)" }}
                >
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  {tenant.tagline && (
                    <p
                      className="text-[9px] font-bold uppercase tracking-[0.15em] leading-none mb-0.5"
                      style={{ color: "hsl(var(--primary))" }}
                    >
                      {tenant.tagline}
                    </p>
                  )}
                  <p className="font-extrabold text-sm text-white leading-tight">{tenant.name}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                Membentuk generasi Islami yang berilmu, beriman, dan berakhlak mulia. Bersama kami, wujudkan pendidikan Islam yang unggul dan berkembang bersama.
              </p>
              {/* Social icons */}
              <div className="flex gap-2">
                {[
                  { icon: "📷", href: tenant.instagram ? `https://instagram.com/${tenant.instagram}` : "#" },
                  { icon: "📘", href: tenant.facebook ? `https://facebook.com/${tenant.facebook}` : "#" },
                  { icon: "▶️", href: tenant.youtube ? `https://youtube.com/${tenant.youtube}` : "#" },
                  { icon: "🐦", href: "#" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors hover:opacity-80"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Link Cepat */}
            <div>
              <h3 className="font-bold text-white text-sm mb-4">Link Cepat</h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Beranda", href: "" },
                  { label: "Tentang Kami", href: "/about" },
                  { label: "Program Kami", href: "/services" },
                  { label: "Guru & Staf", href: "/about" },
                  { label: "PPDB", href: "/contact" },
                  { label: "Berita & Artikel", href: "/berita" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={`${base}${link.href}`}
                      className="text-xs transition-colors hover:text-white flex items-center gap-1.5"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <span style={{ color: "hsl(var(--primary))" }}>›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Program Kami */}
            <div>
              <h3 className="font-bold text-white text-sm mb-4">Program Kami</h3>
              <ul className="space-y-2.5">
                {[
                  "Tahfidz Al-Qur'an",
                  "Program Unggulan",
                  "Pembinaan Akhlak",
                  "Kegiatan Ekstrakurikuler",
                  "Program Bahasa Arab & Inggris",
                  "Program Pengembangan",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href={`${base}/services`}
                      className="text-xs transition-colors hover:text-white flex items-center gap-1.5"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <span style={{ color: "hsl(var(--primary))" }}>›</span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Kontak Kami */}
            <div>
              <h3 className="font-bold text-white text-sm mb-4">Kontak Kami</h3>
              <ul className="space-y-3 mb-5">
                {tenant.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {tenant.address}
                    </span>
                  </li>
                )}
                {tenant.phone && (
                  <li>
                    <a
                      href={`tel:${tenant.phone}`}
                      className="flex items-center gap-2.5 text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                      {tenant.phone}
                    </a>
                  </li>
                )}
                {tenant.email && (
                  <li>
                    <a
                      href={`mailto:${tenant.email}`}
                      className="flex items-center gap-2.5 text-xs transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(var(--primary))" }} />
                      {tenant.email}
                    </a>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <p>Senin - Jumat: 07.00 - 16.00</p>
                    <p>Sabtu: 07.00 - 12.00</p>
                  </div>
                </li>
              </ul>

              {/* WhatsApp button */}
              {tenant.whatsapp && (
                <a
                  href={`https://wa.me/${tenant.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-opacity hover:opacity-90"
                  style={{ background: "#25D366" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Hubungi Kami via WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ background: "hsl(220 25% 8%)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              &copy; {year} {tenant.name}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href={`${base}/contact`} className="text-[11px] transition-colors hover:text-white/60" style={{ color: "rgba(255,255,255,0.3)" }}>
                Kebijakan Privasi
              </Link>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              <Link href={`${base}/contact`} className="text-[11px] transition-colors hover:text-white/60" style={{ color: "rgba(255,255,255,0.3)" }}>
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
