/** Grey shimmering placeholder blocks shown while list pages load. */
export function SkeletonCard({ tall = false }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
      {tall && <div className="aspect-[2/3] bg-ink-800" />}
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-ink-700" />
        <div className="h-3 w-1/2 rounded bg-ink-800" />
        <div className="h-3 w-2/3 rounded bg-ink-800" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8, tall = false }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} tall={tall} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}
