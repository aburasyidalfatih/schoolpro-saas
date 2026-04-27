import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { ColorThemeProvider } from "@/components/providers/color-theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ImpersonateBanner } from "@/components/shared/impersonate-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SaasMasterPro",
  description: "Platform SaaS Multi-Tenant untuk semua kebutuhan bisnis Anda",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#6c47ff",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Baca tema dari cookie (di-set saat admin tenant ganti tema)
  const cookieStore = await cookies()
  const colorTheme = cookieStore.get("color-theme")?.value || "aurora"

  return (
    <html lang="id" data-theme={colorTheme} suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ColorThemeProvider>
              <ImpersonateBanner />
              {children}
              <Toaster />
            </ColorThemeProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
