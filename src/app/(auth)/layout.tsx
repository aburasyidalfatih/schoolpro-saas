/**
 * Auth pages layout — tema selalu aurora.
 * Halaman login/register/forgot-password adalah milik platform,
 * bukan tenant, jadi tidak ikut tema tenant.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute("data-theme","aurora");`,
        }}
      />
      {children}
    </>
  )
}
