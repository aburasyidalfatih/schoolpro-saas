import { Users, BookOpen, Award, Clock } from "lucide-react"

interface Stat { value: string; label: string; icon: string }

const iconMap: Record<string, React.ElementType> = {
  users: Users, book: BookOpen, award: Award, clock: Clock,
}

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    /* Directly below hero — same dark background as navbar, NO floating */
    <section style={{ background: "hsl(var(--primary)/0.92)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Users
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-6 py-5 ${
                  i < stats.length - 1 ? "border-r border-white/15" : ""
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">{stat.value}</p>
                  <p className="text-xs text-white/60 mt-0.5 font-medium">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
