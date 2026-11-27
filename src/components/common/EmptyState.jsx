/** Shown when a search / filter combination returns nothing. */
export default function EmptyState({ title = 'No results', message, action }) {
  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-dashed border-ink-600 p-10 text-center">
      <p className="font-display text-5xl text-gold-500/40" aria-hidden="true">
        ∅
      </p>
      <h2 className="mt-3 font-display text-xl text-white">{title}</h2>
      {message && <p className="mt-2 text-sm text-slate-400">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
