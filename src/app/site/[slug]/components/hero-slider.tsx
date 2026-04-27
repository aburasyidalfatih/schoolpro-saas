"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

interface Slide {
  title: string
  subtitle: string
  description: string
  image?: string
  cta: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

interface HeroSliderProps {
  slides: Slide[]
  base: string
}

export function HeroSlider({ slides, base }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  const slide = slides[current]
  const lines = slide.title.split("\\n")

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "72vh" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        {slide.image ? (
          <img src={slide.image} alt="" className="w-full h-full object-cover object-center" />
        ) : (
          /* Gradient placeholder that looks like a photo background */
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)/0.9) 0%, hsl(var(--primary)/0.6) 40%, hsl(var(--primary)/0.3) 100%)",
            }}
          />
        )}
        {/* Left-to-right dark overlay — darker on left where text is */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex items-center" style={{ minHeight: "72vh" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="max-w-xl">
            {/* Subtitle label */}
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "hsl(45 95% 65%)" }}
            >
              {slide.subtitle}
            </p>

            {/* Title — last line in accent color */}
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.15] text-white mb-5">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {i === lines.length - 1 ? (
                    <span style={{ color: "hsl(45 95% 60%)" }}>{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-md">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`${base}${slide.cta.href}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-all hover:opacity-90"
                style={{ background: "hsl(var(--primary))", color: "white" }}
              >
                {slide.cta.label}
                <ChevronRight className="h-4 w-4" />
              </Link>
              {slide.ctaSecondary && (
                <Link
                  href={`${base}${slide.ctaSecondary.href}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold border-2 border-white/50 text-white hover:bg-white/10 transition-all"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Play className="h-3 w-3 fill-white text-white" />
                  </div>
                  {slide.ctaSecondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slider controls — only if multiple slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <button
            onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrent((p) => (p + 1) % slides.length)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </section>
  )
}
