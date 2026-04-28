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
      <section className="bg-mesh py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary mb-2">Galeri</p>
          <h1 className="text-4xl font-bold tracking-tight">Galeri Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
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
