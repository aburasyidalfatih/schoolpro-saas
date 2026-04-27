import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { CheckCircle, Target, Eye, Heart } from "lucide-react"

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await db.tenant.findUnique({
    where: { slug },
    select: { name: true, about: true, description: true, address: true },
  })
  if (!tenant) notFound()

  return (
    <>
      {/* Header */}
      <section className="bg-mesh py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary mb-2">Tentang Kami</p>
          <h1 className="text-4xl font-bold tracking-tight">Mengenal {tenant.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {tenant.description || "Kami adalah perusahaan yang berkomitmen memberikan layanan terbaik untuk Anda."}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Cerita Kami</h2>
            <div className="prose prose-sm text-muted-foreground leading-relaxed space-y-4">
              <p>{tenant.about || "Didirikan dengan visi untuk memberikan solusi terbaik, kami telah melayani berbagai klien dari berbagai sektor industri. Pengalaman bertahun-tahun membuat kami memahami kebutuhan unik setiap klien."}</p>
              <p>Kami percaya bahwa keberhasilan klien adalah keberhasilan kami. Oleh karena itu, kami selalu berusaha memberikan layanan yang melebihi ekspektasi.</p>
            </div>
            {tenant.address && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50">
                <p className="text-sm font-medium">Alamat</p>
                <p className="text-sm text-muted-foreground mt-1">{tenant.address}</p>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex items-center justify-center aspect-square">
            <div className="text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-sm text-muted-foreground">Foto tim kami</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission Values */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Visi", desc: "Menjadi perusahaan terdepan yang memberikan solusi inovatif dan berkualitas tinggi untuk setiap klien." },
              { icon: Eye, title: "Misi", desc: "Memberikan layanan profesional dengan standar tertinggi, membangun hubungan jangka panjang, dan terus berinovasi." },
              { icon: Heart, title: "Nilai", desc: "Integritas, profesionalisme, inovasi, dan kepuasan pelanggan adalah fondasi dari setiap langkah kami." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border bg-background p-8">
                <item.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Mengapa Memilih Kami?</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            "Tim profesional dan bersertifikasi",
            "Pengalaman lebih dari 10 tahun",
            "Harga transparan dan kompetitif",
            "Dukungan pelanggan responsif",
            "Solusi yang disesuaikan kebutuhan",
            "Garansi kepuasan pelanggan",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <CheckCircle className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
