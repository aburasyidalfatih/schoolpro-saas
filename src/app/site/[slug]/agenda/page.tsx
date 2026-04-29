import { notFound } from "next/navigation"
import { getPublicTenantBySlug } from "@/lib/services/tenant-public"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export default async function AgendaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await getPublicTenantBySlug(slug)
  if (!tenant) notFound()

  const events = tenant.events || []

  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="bg-mesh py-16 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Agenda & Acara Sekolah</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jadwal kegiatan akademik, hari besar, dan acara menarik lainnya di {tenant.name}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-[40px] border-2 border-dashed">
             <p className="text-muted-foreground">Belum ada agenda kegiatan yang dijadwalkan.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event: any) => (
              <div 
                key={event.id} 
                className="group flex flex-col md:flex-row bg-background rounded-3xl overflow-hidden border hover:border-primary/50 transition-all duration-300"
              >
                <div className="md:w-48 bg-primary text-white flex flex-col items-center justify-center p-6 text-center">
                   <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
                      {format(new Date(event.date), 'MMMM', { locale: id })}
                   </p>
                   <p className="text-5xl font-black">
                      {format(new Date(event.date), 'dd')}
                   </p>
                   <p className="text-sm font-bold mt-1 opacity-80">
                      {format(new Date(event.date), 'yyyy')}
                   </p>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" /> {event.time || "08.00 - Selesai"}
                     </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> {event.location || "Area Sekolah"}
                     </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {event.description || "Mari berpartisipasi dalam kegiatan sekolah untuk mempererat silaturahmi dan meningkatkan kompetensi diri."}
                  </p>
                </div>
                <div className="p-8 flex items-center justify-center border-t md:border-t-0 md:border-l">
                   <button className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="h-5 w-5" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
