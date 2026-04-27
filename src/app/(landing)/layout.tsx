/**
 * Landing page layout — tema selalu aurora (default platform).
 * Tidak ikut tema tenant karena ini halaman milik super admin/platform.
 * Override data-theme di <html> via script sebelum render.
 */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Force aurora theme — landing page is platform-owned, not tenant-owned */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute("data-theme","aurora");`,
        }}
      />
      {children}
    </>
  )
}
