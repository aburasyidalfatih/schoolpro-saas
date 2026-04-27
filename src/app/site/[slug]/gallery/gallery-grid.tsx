"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

interface GalleryItem {
  url: string
  caption: string
}

interface Props {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () => setLightbox(i => (i !== null ? (i - 1 + items.length) % items.length : null))
  const next = () => setLightbox(i => (i !== null ? (i + 1) % items.length : null))

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Galeri Belum Tersedia</h3>
        <p className="text-muted-foreground">Foto dan dokumentasi akan segera ditambahkan.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <button key={i} onClick={() => setLightbox(i)}
            className="group relative aspect-square rounded-2xl overflow-hidden border focus:outline-none focus:ring-2 focus:ring-primary">
            <img src={item.url} alt={item.caption || `Foto ${i + 1}`}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          {/* Close */}
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-3"
            onClick={e => e.stopPropagation()}>
            <img src={items[lightbox].url} alt={items[lightbox].caption || `Foto ${lightbox + 1}`}
              className="max-h-[70vh] max-w-full rounded-xl object-contain" />
            {items[lightbox].caption && (
              <p className="text-white text-sm text-center max-w-lg">{items[lightbox].caption}</p>
            )}
            <p className="text-white/50 text-xs">{lightbox + 1} / {items.length}</p>
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
