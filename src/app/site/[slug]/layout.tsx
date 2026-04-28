import { db } from "@/lib/db"
import { getPublicTenantBySlug } from "@/lib/services/tenant-public"
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

  const tenant = await getPublicTenantBySlug(slug)

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
