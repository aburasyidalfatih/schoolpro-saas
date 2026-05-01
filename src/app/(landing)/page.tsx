import Link from "next/link"
import {
  ArrowRight,
  Globe,
  Database,
  CreditCard,
  PiggyBank,
  Users,
  FileText,
  Shield,
  Zap,
  Check,
  ChevronRight,
  MonitorSmartphone,
  School,
  Wallet,
  Settings,
  BellRing,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Data fitur berdasarkan kategori
const featureModules = [
  {
    id: "website",
    title: "Website Gratis",
    icon: Globe,
    description: "Sekolah go-online dalam hitungan menit dengan portal website gratis terintegrasi.",
    features: [
      { name: "Portal Profil Lembaga Pendidikan", status: "ready" },
      { name: "Tema Halaman Portal (Statik/CMS)", status: "ready" },
      { name: "Portal Berita & Artikel Terbaru", status: "ready" },
      { name: "Pusat Informasi & Pengumuman", status: "ready" },
      { name: "Galeri & Prestasi Sekolah", status: "ready" }
    ]
  },
  {
    id: "ppdb",
    title: "PPDB Online",
    icon: Users,
    description: "Penerimaan peserta didik baru terpusat, mulai dari pendaftaran hingga seleksi.",
    features: [
      { name: "Portal PPDB Online Mandiri", status: "coming_soon" },
      { name: "Manajemen Data Pendaftar & Berkas", status: "coming_soon" },
      { name: "Verifikasi Pendaftar & Persyaratan", status: "coming_soon" },
      { name: "Tagihan Pendaftaran & Daftar Ulang", status: "coming_soon" },
      { name: "Sinkronisasi ke Data Master Siswa", status: "coming_soon" },
      { name: "Kustomisasi Formulir Pendaftaran", status: "coming_soon" }
    ]
  },
  {
    id: "data",
    title: "Data Master",
    icon: Database,
    description: "Kelola seluruh data sekolah dengan mudah, terstruktur, dan terpusat.",
    features: [
      { name: "Kelola Data Petugas (Admin/Keuangan/Guru)", status: "coming_soon" },
      { name: "Kelola Data Siswa, Kelas & Tahun Ajaran", status: "coming_soon" },
      { name: "Proses Kenaikan & Pindah Kelas", status: "coming_soon" },
      { name: "Ekspor/Impor Data via Excel", status: "coming_soon" },
      { name: "Manajemen Akun Sistem", status: "coming_soon" }
    ]
  },
  {
    id: "keuangan",
    title: "Tagihan & Kas",
    icon: Wallet,
    description: "Otomatisasi tagihan siswa dan pembukuan arus kas masuk/keluar.",
    features: [
      { name: "Pembuatan Tagihan Otomatis (SPP, Buku, dll)", status: "coming_soon" },
      { name: "Pembayaran Tunai & Non-Tunai", status: "coming_soon" },
      { name: "Rekap Transaksi & Arus Kas", status: "coming_soon" },
      { name: "Pengingat Tagihan via WhatsApp", status: "coming_soon" },
      { name: "Cetak Nota & Kwitansi PDF", status: "coming_soon" }
    ]
  },
  {
    id: "tabungan",
    title: "Tabungan E-Kantin",
    icon: PiggyBank,
    description: "Digitalisasi tabungan siswa dengan teknologi QR Code untuk E-Kantin.",
    features: [
      { name: "Transaksi Setoran & Penarikan Saldo", status: "coming_soon" },
      { name: "Rekap & Cetak Laporan Saldo", status: "coming_soon" },
      { name: "Cetak Kode QR Tabungan (E-Kantin)", status: "coming_soon" },
      { name: "Log Aktivitas Transaksi Tabungan", status: "coming_soon" }
    ]
  },
  {
    id: "portal",
    title: "Portal Wali & Laporan",
    icon: MonitorSmartphone,
    description: "Transparansi untuk orang tua siswa dan kemudahan cetak laporan untuk petugas.",
    features: [
      { name: "Dasbor Wali/Siswa (Cek Tagihan & Saldo)", status: "coming_soon" },
      { name: "Notifikasi Otomatis (WhatsApp/Email)", status: "coming_soon" },
      { name: "Cetak Laporan Tagihan & Transaksi (PDF/Excel)", status: "coming_soon" },
      { name: "Dasbor Petugas Terpadu", status: "coming_soon" }
    ]
  }
]

const plans = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "selamanya",
    description: "Untuk sekolah yang baru ingin go-online",
    features: ["Website Sekolah Gratis", "Akses CMS Terbatas", "Notifikasi In-App", "Dukungan Komunitas"],
  },
  {
    name: "Pro",
    price: "Rp 149.000",
    period: "/bulan",
    popular: true,
    description: "Solusi lengkap untuk administrasi & tagihan",
    features: ["Website Sekolah & CMS Lengkap", "Modul PPDB & Data Master", "Tagihan Otomatis & Kas", "Notifikasi WhatsApp & Email", "Export Laporan Excel & PDF"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "/bulan",
    description: "Skala besar dengan kebutuhan khusus",
    features: ["Domain Sekolah Kustom (.sch.id)", "Modul Tabungan E-Kantin", "Prioritas Bantuan (Dedicated Support)", "Setup Data Awal Gratis"],
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
            <Link href="#fitur" className="hover:text-foreground transition-colors">Fitur Terpadu</Link>
            <Link href="#solusi" className="hover:text-foreground transition-colors">Solusi</Link>

          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" className="rounded-xl">Masuk</Button></Link>
            <Link href="/daftarkan-sekolah">
              <Button className="rounded-xl btn-gradient text-white shadow-lg glow-primary border-0">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full orb-1 opacity-20 blur-3xl" />
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full orb-2 opacity-15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full orb-3 opacity-10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-16 text-center lg:py-20">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Platform SaaS Pendidikan Modern</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
              Langkah Mudah <span className="text-gradient">Digitalisasi</span> Sekolah Anda
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dapatkan <strong className="text-foreground">Website Sekolah Gratis</strong> sekarang juga. 
              Kelola administrasi, tagihan otomatis, PPDB online, hingga tabungan E-Kantin dalam satu platform terpusat yang revolusioner.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/daftarkan-sekolah" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 rounded-xl btn-gradient text-white shadow-xl glow-primary h-14 px-8 text-base border-0">
                  Daftarkan Sekolah Gratis <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#fitur" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-xl glass h-14 px-8 text-base">
                  Jelajahi Fitur Terpadu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solusi Section */}
      <section id="solusi" className="container mx-auto px-4 py-12 md:py-16">
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full orb-1 opacity-10 blur-3xl" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Tinggalkan Cara Lama yang Merepotkan</h2>
              <p className="text-muted-foreground leading-relaxed">
                Kami memahami sulitnya mengelola tumpukan kertas administrasi, mengingatkan wali murid tentang tunggakan SPP, dan mengelola pendaftaran siswa baru secara manual.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  "Website sekolah yang profesional & gratis.",
                  "Tagihan & kuitansi terkirim otomatis via WhatsApp.",
                  "Data master siswa & guru yang selalu tersinkronisasi.",
                  "PPDB Online yang dapat dipantau secara real-time."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-2xl border bg-background/50 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4 border-b pb-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BellRing className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Sistem Notifikasi Pintar</h4>
                  <p className="text-sm text-muted-foreground">Otomatisasi pengingat via WhatsApp</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-muted/50 p-4 text-sm border">
                  &quot;Bapak/Ibu, tagihan SPP bulan ini sebesar Rp 150.000 telah terbit. Silakan lakukan pembayaran via transfer ke Virtual Account...&quot;
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-sm border">
                  &quot;Terima kasih! Pembayaran tagihan Buku Paket atas nama Budi telah kami terima.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Terpadu - Tabs Section */}
      <section id="fitur" className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
            <School className="h-3.5 w-3.5" />
            Modul Lengkap
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Satu Platform, Beragam Solusi</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Mulai dari website profil hingga manajemen tabungan kantin, semua terintegrasi di SchoolPro.
          </p>
        </div>

        <Tabs defaultValue="website" className="max-w-5xl mx-auto">
          <TabsList className="flex flex-wrap justify-center h-auto gap-2 bg-transparent mb-12">
            {featureModules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="rounded-full px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg glass border transition-all"
              >
                <module.icon className="h-4 w-4 mr-2" />
                {module.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {featureModules.map((module) => (
            <TabsContent key={module.id} value={module.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass rounded-3xl p-8 md:p-12 border">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Left Side: Module Description */}
                  <div className="md:w-1/3 space-y-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-2">
                      <module.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{module.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Right Side: Feature List */}
                  <div className="md:w-2/3 w-full bg-background/40 rounded-2xl p-6 border shadow-inner">
                    <h4 className="font-semibold mb-6 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" /> Detail Modul
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <Check className="h-3 w-3" />
                          </div>
                          <div>
                            <span className="text-sm font-medium leading-snug">{feature.name}</span>
                            {feature.status === "coming_soon" && (
                              <span className="ml-2 inline-block rounded text-[10px] bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 font-semibold">
                                Segera Hadir
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>



      {/* CTA */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="glass rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full orb-1 opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full orb-2 opacity-20 blur-3xl" />
          <div className="relative space-y-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Siap memajukan <br /> <span className="text-gradient">Sekolah Anda?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Gabung bersama ratusan lembaga pendidikan lainnya yang telah mengadopsi teknologi digital demi efisiensi dan transparansi.
            </p>
            <div className="pt-4">
              <Link href="/daftarkan-sekolah">
                <Button size="lg" className="rounded-2xl btn-gradient text-white shadow-2xl glow-primary h-14 px-10 text-lg font-semibold gap-3 border-0">
                  Buat Website Sekolah Gratis <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground/60 pt-4">Tanpa kartu kredit. Setup instan 5 menit.</p>
          </div>
        </div>
      </section>

      <footer className="border-t glass">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md btn-gradient text-white font-bold text-[10px]">S</div>
            <span className="font-semibold text-foreground">SchoolPro</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Hak cipta dilindungi. <span className="opacity-50 text-xs ml-2">v1.0.3 ({process.env.NEXT_PUBLIC_ROOT_DOMAIN || "local"})</span></p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
