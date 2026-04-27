import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  viewAllLabel?: string
  icon?: React.ReactNode
}

export function SectionHeader({ title, viewAllHref, viewAllLabel = "Lihat Semua", icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          {viewAllLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}
