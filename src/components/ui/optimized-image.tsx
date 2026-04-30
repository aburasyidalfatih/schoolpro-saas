import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt?: string
  fallbackAlt?: string
}

/**
 * OptimizedImage Component
 * 
 * - Handles 'Auto ALT' by using fallbackAlt or a default descriptive text if alt is missing.
 * - Leverages next/image for automatic WebP/AVIF conversion and resizing.
 * - Ensures accessibility and SEO consistency.
 */
export function OptimizedImage({ 
  alt, 
  fallbackAlt = "Gambar SchoolPro", 
  src, 
  className, 
  ...props 
}: OptimizedImageProps) {
  
  // Logic for Auto ALT
  // If alt is empty, null, or undefined, use fallbackAlt
  const finalAlt = alt && alt.trim() !== "" ? alt : fallbackAlt

  return (
    <Image
      src={src}
      alt={finalAlt}
      className={cn("object-cover", className)}
      // Default to WebP/AVIF via Next.js Image Optimization
      {...props}
    />
  )
}
