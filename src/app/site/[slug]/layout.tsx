import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { WebsiteNavbar } from "./components/navbar"
import { WebsiteFooter } from "./components/footer"
import { ThemeInjector } from "./components/theme-injector"

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tenant = await db.tenant.findUnique({
    where: { slug },
    select: {
      name: true, slug: true, logo: true, tagline: true,
      phone: true, email: true, whatsapp: true, theme: true, isActive: true,
      address: true, instagram: true, facebook: true, youtube: true,
    },
  })

  if (!tenant || !tenant.isActive) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeInjector theme={tenant.theme} />
      <WebsiteNavbar tenant={tenant} />
      <main className="flex-1">{children}</main>
      <WebsiteFooter tenant={tenant} />
    </div>
  )
}
