import { notFound } from "next/navigation"
import { GalleryGrid } from "./gallery-grid"
import { getPublicTenantBySlug } from "@/lib/services/tenant-public"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await getPublicTenantBySlug(slug)
  if (!tenant) return {}
  return {
    title: `Galeri | ${tenant.seoTitle || tenant.name}`,
    description: `Galeri foto ${tenant.name}`,
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await getPublicTenantBySlug(slug)
  if (!tenant) notFound()

  // Support both old format (string[]) and new format ({url, caption}[])
  const raw = (tenant.gallery as any[]) || []
  const gallery = raw.map((item: any) =>
    typeof item === "string" ? { url: item, caption: "" } : item
  )

  return (
    <>
      <section className="relative h-[30vh] min-h-[250px] flex items-center justify-center overflow-hidden bg-primary/90 text-white">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-3 opacity-80">Dokumentasi</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Galeri Kami</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan portofolio pekerjaan kami.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <GalleryGrid items={gallery} />
      </section>
    </>
  )
}
