"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouting } from "@/components/providers/routing-provider"

interface NavbarProps {
  tenant: {
    name: string
    slug: string
    logo: string | null
    tagline: string | null
    phone: string | null
  }
}

export function WebsiteNavbar({ tenant }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { resolveHref } = useRouting()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Simplified navLinks to always show all menus as requested
  const navLinks = [
    { label: "Beranda", href: "" },
    {
      label: "Profil Sekolah",
      href: "/profil",
      children: [
        { label: "Profil & Tentang", href: "/profil" },
        { label: "Guru & Staf (GTK)", href: "/gtk" },
        { label: "Fasilitas Sekolah", href: "/fasilitas" },
        { label: "Program & Jurusan", href: "/program#academic" },
        { label: "Ekstrakurikuler", href: "/program#extracurriculars" },
      ],
    },
    {
      label: "Informasi",
      href: "/berita",
      children: [
        { label: "Berita & Artikel", href: "/berita" },
        { label: "Agenda & Acara", href: "/agenda" },
        { label: "Pusat Unduhan", href: "/unduhan" },
      ],
    },
    {
      label: "Galeri & Alumni",
      href: "/gallery",
      children: [
        { label: "Galeri Foto", href: "/gallery" },
        { label: "Prestasi Siswa", href: "/prestasi" },
        { label: "Alumni Success", href: "/profil#alumni" },
      ],
    },
    { label: "Layanan", href: "/services" },
    { label: "Kontak", href: "/contact" },
  ]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 shadow-md" ref={dropdownRef}>
      {/* Single navbar bar — dark background */}
      <div style={{ background: "hsl(var(--primary))" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between gap-4">

            {/* Logo */}
            <Link href={resolveHref("/")} className="flex items-center gap-3 shrink-0">
              {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="h-11 w-11 rounded-full object-cover border-2 border-white/30" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 border-2 border-white/30 text-white font-extrabold text-lg">
                  {tenant.name.charAt(0)}
                </div>
              )}
              <div>
                {tenant.tagline && (
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70 leading-none mb-0.5">
                    {tenant.tagline}
                  </p>
                )}
                <p className="font-extrabold text-sm text-white leading-tight tracking-wide">
                  {tenant.name}
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) => {
                const href = resolveHref(link.href)
                const isActive = link.href === "" 
                  ? (pathname === resolveHref("/") || pathname === `/site/${tenant.slug}`) 
                  : pathname.startsWith(href)
                const isOpen = openDropdown === link.label

                return (
                  <div 
                    key={link.label} 
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.children ? (
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors",
                          isActive || isOpen
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                      </Link>
                    ) : (
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors",
                          isActive
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Dropdown */}
                    {link.children && isOpen && (
                      <div className="absolute top-full left-0 pt-1 w-52 z-50">
                        <div className="bg-white rounded-xl shadow-xl border overflow-hidden">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={resolveHref(child.href)}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-b last:border-0"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Right: Search + CTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <Search className="h-4 w-4" />
              </button>
              {/* PPDB Online button — yellow/accent */}
              <Link
                href={resolveHref("/contact")}
                className="px-5 py-2 text-sm font-bold rounded-lg transition-all hover:opacity-90 shadow-sm"
                style={{ background: "hsl(45 95% 55%)", color: "hsl(var(--foreground))" }}
              >
                PPDB Online
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t" style={{ background: "hsl(var(--primary))" }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const href = resolveHref(link.href)
              const isActive = link.href === "" 
                ? (pathname === resolveHref("/") || pathname === `/site/${tenant.slug}`) 
                : pathname.startsWith(href)
              
              return (
                <div key={link.label} className="space-y-1">
                  <Link
                    href={href}
                    onClick={() => { if (!link.children) setMobileOpen(false) }}
                    className={cn(
                      "block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                      isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="pl-6 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={resolveHref(child.href)}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <Link
              href={resolveHref("/contact")}
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-4 py-3 text-sm font-bold text-center rounded-lg"
              style={{ background: "hsl(45 95% 55%)", color: "hsl(var(--foreground))" }}
            >
              PPDB Online
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
