import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"
  const { pathname } = request.nextUrl

  // Cek apakah ini subdomain
  const subdomain = hostname.replace(`.${rootDomain}`, "")

  // Jika bukan subdomain (domain utama), handle auth protection
  if (subdomain === hostname || subdomain === "www" || subdomain === "") {
    const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/super-admin")
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")
    const sessionToken = request.cookies.get("authjs.session-token")?.value || request.cookies.get("__Secure-authjs.session-token")?.value

    if (isProtected && !sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthPage && sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  }

  // ============================================================
  // SUBDOMAIN DETECTED: tenant1.domain.com
  // ============================================================

  const url = request.nextUrl.clone()

  // /dashboard pada subdomain → tetap ke /dashboard (admin panel tenant)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const response = NextResponse.rewrite(url)
    response.headers.set("x-tenant-slug", subdomain)
    return response
  }

  // Semua path lain pada subdomain → rewrite ke /site/[slug]/...
  // tenant1.domain.com/ → /site/tenant1
  // tenant1.domain.com/about → /site/tenant1/about
  url.pathname = `/site/${subdomain}${pathname}`

  const response = NextResponse.rewrite(url)
  response.headers.set("x-tenant-slug", subdomain)
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)",
  ],
}
