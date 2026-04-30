import { notFound } from "next/navigation"
import { BookOpen, Target, ArrowRight, Star, CheckCircle2, Award } from "lucide-react"
import { getPublicTenantBySlug } from "@/lib/services/tenant-public"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await getPublicTenantBySlug(slug)
  
  if (!tenant) notFound()

  const programs = tenant.programs || []
  const extracurriculars = tenant.extracurriculars || []

  return (
    <div className="bg-background min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-primary/90 text-white">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-8">
            <Target className="h-4 w-4 text-amber-400" /> Kurikulum & Bakat Siswa
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Program & Ekstrakurikuler</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
            Membangun keunggulan akademik dan mengembangkan bakat non-akademik melalui program yang terintegrasi dan inovatif.
          </p>
        </div>
      </section>

      {/* ── ACADEMIC PROGRAMS ── */}
      <section id="academic" className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Program Unggulan</h2>
            <p className="text-muted-foreground text-lg">
              Fokus utama kami adalah memberikan pendidikan yang relevan dengan kebutuhan zaman tanpa meninggalkan nilai-nilai karakter.
            </p>
          </div>
          <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {programs.length}
             </div>
             <div className="text-xs font-bold text-primary uppercase tracking-widest leading-tight">
                Program<br/>Akademik
             </div>
          </div>
        </div>

        {programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {programs.map((prog: any, index: number) => (
              <div 
                key={prog.id} 
                className={cn(
                  "group relative bg-white rounded-[2.5rem] overflow-hidden border border-border/60 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl flex flex-col md:flex-row",
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                )}
              >
                <div className="relative h-64 md:h-auto md:w-2/5 shrink-0 overflow-hidden">
                  <Image 
                    src={prog.imageUrl || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022"} 
                    alt={prog.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                </div>
                <div className="p-8 md:p-10 flex-1 flex flex-col">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{prog.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                    {prog.description || "Program pendidikan yang dirancang khusus untuk mengoptimalkan potensi intelektual dan keterampilan siswa secara komprehensif."}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    Pelajari Selengkapnya <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
             <h3 className="text-xl font-bold">Data Program Belum Tersedia</h3>
             <p className="text-muted-foreground mt-2">Daftar program akademik sedang dalam proses sinkronisasi.</p>
          </div>
        )}
      </section>

      {/* ── EXTRACURRICULAR ACTIVITIES ── */}
      <section id="extracurriculars" className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Pengembangan Bakat (Ekstrakurikuler)</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Wadah bagi siswa untuk mengeksplorasi minat, mengasah kepemimpinan, dan membangun kerjasama tim di luar jam kelas.
            </p>
          </div>

          {extracurriculars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {extracurriculars.map((ekskul: any) => (
                <div key={ekskul.id} className="group bg-white rounded-3xl p-6 border border-border hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-md">
                    <Image 
                      src={ekskul.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070"} 
                      alt={ekskul.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-amber-500 shadow-sm">
                      <Star className="h-4 w-4 fill-amber-500" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xl mb-2">{ekskul.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                    {ekskul.description || "Kegiatan positif yang rutin dilakukan setiap minggu untuk mendukung minat dan bakat siswa di bidang non-akademik."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                       <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                    </div>
                    {ekskul.schedule && (
                      <div className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {ekskul.schedule}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-border">
              <h3 className="text-xl font-bold">Data Ekstrakurikuler Belum Tersedia</h3>
            </div>
          )}
        </div>
      </section>

      {/* ── HIGHLIGHT SECTION ── */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="absolute -top-10 -left-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-amber-400/10 rounded-full blur-3xl" />
               <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070" 
                    alt="Education Highlight" 
                    width={800} 
                    height={600} 
                    className="object-cover"
                  />
               </div>
            </div>
            <div className="space-y-8">
               <div className="bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest w-fit">
                  Keunggulan Kami
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Membangun Kompetensi Abad 21</h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                  Kami membekali siswa dengan 4C (Critical Thinking, Communication, Collaboration, & Creativity) melalui setiap kegiatan yang dilakukan di sekolah.
               </p>
               <ul className="space-y-4">
                  {[
                    "Kurikulum Adaptif & Berbasis Proyek",
                    "Pembimbingan Karakter & Etika Islami",
                    "Fasilitas Praktikum Lengkap",
                    "Ekosistem Belajar yang Aman & Nyaman"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                       </div>
                       <span className="font-bold text-slate-700">{item}</span>
                    </li>
                  ))}
               </ul>
               <div className="pt-6">
                  <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-2xl border border-border/50">
                     <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white">
                        <Award className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Terakreditasi</p>
                        <p className="text-lg font-black text-slate-900 leading-tight">Grade A (Sangat Baik)</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}
