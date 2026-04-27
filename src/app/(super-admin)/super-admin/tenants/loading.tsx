export default function TenantsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="skeleton h-8 w-44" />
        <div className="skeleton h-4 w-72" />
      </div>
      <div className="skeleton h-10 w-72 rounded-xl" />
      <div className="skeleton h-[500px] rounded-2xl" />
    </div>
  )
}
