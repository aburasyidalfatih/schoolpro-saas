import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="relative bg-primary/5 dark:bg-primary/10 border-b border-border/50 pt-8 pb-10 overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 opacity-50" />
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-bold">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Title & Description */}
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
