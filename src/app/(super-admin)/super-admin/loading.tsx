export default function SuperAdminLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-[120px] rounded-2xl" style={{ animationDelay: `${i * 75}ms` }} />
        ))}
      </div>
    </div>
  )
}
