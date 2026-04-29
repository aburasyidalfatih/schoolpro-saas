"use client"

import { useEffect } from "react"

export function ThemeInjector({ theme }: { theme: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    return () => {
      // Reset ke cookie theme saat leave website
      const match = document.cookie.match(/color-theme=([^;]+)/)
      if (match) {
        document.documentElement.setAttribute("data-theme", match[1])
      }
    }
  }, [theme])

  return null
}
