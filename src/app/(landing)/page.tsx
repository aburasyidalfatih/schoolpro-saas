import Link from "next/link"
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Bell,
  CreditCard,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Globe,
    title: "Multi-Tenant",
    description: "Setiap organisasi mendapat subdomain sendiri dengan isolasi data yang aman.",
    className: "bento-lg",
  },
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description: "Autentikasi aman, RBAC, dan audit log lengkap.",
    className: "",
  },
  {
    icon: Zap,
    title: "Performa Cepat",
    description: "Teknologi modern untuk pengalaman yang responsif.",
    className: "",
  },
  {
    icon: Bell,
    title: "Notifikasi Multi-Channel",
    description: "WhatsApp, Email, atau In-App sesuai preferensi pengguna.",
    className: "bento-wide",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Otomatis",
    description: "Integrasi payment gateway untuk langganan online.",
    className: "",
  },
  {
    icon: BarChart3,
    title: "Laporan & Analitik",
    description: "Dashboard analitik interaktif dengan export Excel.",
    className: "",
  },
]

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    features: ["1 Pengguna", "100 Data", "Notifikasi In-App", "Dukungan Komunitas"],
  },
  {
    name: "Pro",
    price: "Rp 199.000",
    period: "/bulan",
    popular: true,
    features: ["10 Pengguna", "Data Tak Terbatas", "Semua Channel Notifikasi", "Export Excel", "Dukungan Prioritas"],
  },
  {
    name: "Enterprise",
    price: "Rp 499.000",
    period: "/bulan",
    features: ["Pengguna Tak Terbatas", "Data Tak Terbatas", "Custom Domain", "API Access", "Dukungan Dedicated"],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <nav className="glass sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl btn-gradient text-white font-bold text-sm shadow-lg glow-primary">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">SchoolPro</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#fitur" className="hover:text-foreground transition-colors">Fitur</Link>
            <Link href="#harga" className="hover:text-foreground transition-colors">Harga</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" className="rounded-xl">Masuk</Button></Link>
            <Link href="/daftarkan-sekolah">
              <Button className="rounded-xl btn-gradient text-white shadow-lg glow-primary border-0">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full orb-1 opacity-20 blur-3xl" />
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full orb-2 opacity-15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full orb-3 opacity-10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-28 text-center lg:py-36">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Platform SaaS Multi-Tenant Terlengkap</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl leading-[1.1]">
              Bangun Aplikasi{" "}
              <span className="text-gradient">Bisnis Tanpa Batas</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SchoolPro menyediakan fondasi lengkap untuk membangun sistem informasi sekolah,
              manajemen agen umroh, dan berbagai aplikasi SaaS lainnya.
            </p>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Link href="/daftarkan-sekolah">
                <Button size="lg" className="gap-2 rounded-xl btn-gradient text-white shadow-xl glow-primary h-12 px-8 text-base border-0">
                  Mulai Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#fitur">
                <Button variant="outline" size="lg" className="rounded-xl glass h-12 px-8 text-base">
                  Lihat Fitur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section id="fitur" className="container mx-auto px-4 py-28">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
            <Zap className="h-3.5 w-3.5" />
            Fitur Unggulan
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Semua yang Anda butuhkan</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Fondasi lengkap untuk menjalankan bisnis SaaS modern</p>
        </div>

        <div className="bento-grid max-w-5xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className={`group glass rounded-2xl p-6 hover-lift cursor-default ${feature.className}`}>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="relative overflow-hidden py-28">
        <div className="absolute top-20 left-0 h-72 w-72 rounded-full orb-1 opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full orb-2 opacity-10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
              <CreditCard className="h-3.5 w-3.5" />
              Pilihan Paket
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Harga yang transparan</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Pilih paket yang sesuai dengan skala bisnis Anda</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`glass rounded-2xl p-8 hover-lift relative ${plan.popular ? "ring-2 ring-primary glow-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-gradient px-4 py-1 text-xs font-medium text-white shadow-lg">
                    Paling Populer
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/daftarkan-sekolah" className="block">
                  <Button className={`w-full rounded-xl h-11 ${plan.popular ? "btn-gradient text-white shadow-lg border-0" : ""}`} variant={plan.popular ? "default" : "outline"}>
                    Pilih Paket
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-28">
        <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full orb-1 opacity-10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full orb-2 opacity-10 blur-3xl" />
          <div className="relative space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Siap memulai perjalanan <span className="text-gradient">SaaS Anda?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Daftar gratis dan mulai bangun aplikasi bisnis Anda dalam hitungan menit.</p>
            <Link href="/daftarkan-sekolah">
              <Button size="lg" className="rounded-xl btn-gradient text-white shadow-xl glow-primary h-12 px-8 text-base gap-2 mt-2 border-0">
                Daftar Gratis Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t glass">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SchoolPro. Hak cipta dilindungi. <span className="opacity-50 text-xs ml-2">v1.0.1</span></p>
        </div>
      </footer>
    </div>
  )
}
