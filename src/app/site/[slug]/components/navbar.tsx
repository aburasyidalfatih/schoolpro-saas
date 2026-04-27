"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  tenant: {
    name: string
    slug: string
    logo: string | null
    tagline: string | null
    phone: string | null
  }
}

const navLinks = [
  { label: "Beranda", href: "" },
  {
    label: "Profil", href: "/about",
    children: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Visi & Misi", href: "/about" },
      { label: "Struktur Organisasi", href: "/about" },
    ],
  },
  {
    label: "Akademik", href: "/services",
    children: [
      { label: "Program Unggulan", href: "/services" },
      { label: "Kurikulum", href: "/services" },
      { label: "Kegiatan", href: "/services" },
    ],
  },
  {
    label: "Informasi", href: "/informasi",
    children: [
      { label: "Berita & Artikel", href: "/informasi" },
      { label: "Pengumuman", href: "/informasi" },
      { label: "Agenda Kegiatan", href: "/informasi" },
    ],
  },
  { label: "Galeri", href: "/gallery" },
  { label: "Kontak", href: "/contact" },
]

export function WebsiteNavbar({ tenant }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const base = `/site/${tenant.slug}`
  const dropdownRef = useRef<HTMLDivElement>(null)

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
            <Link href={base} className="flex items-center gap-3 shrink-0">
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
                const href = `${base}${link.href}`
                const isActive = link.href === "" ? pathname === base : pathname.startsWith(href)
                const isOpen = openDropdown === link.label

                return (
                  <div key={link.label} className="relative">
                    {link.children ? (
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : link.label)}
                        className={cn(
                          "flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors",
                          isActive || isOpen
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
                      </button>
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
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={`${base}${child.href}`}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border-b last:border-0"
                          >
                            {child.label}
                          </Link>
                        ))}
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
                href={`${base}/contact`}
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
              const href = `${base}${link.href}`
              const isActive = link.href === "" ? pathname === base : pathname.startsWith(href)
              return (
                <Link
                  key={link.label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors",
                    isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href={`${base}/contact`}
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
