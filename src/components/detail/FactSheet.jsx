/** Bordered "classified file" box holding InfoRow items. */
export default function FactSheet({ title = 'Fact sheet', children }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/80 p-5">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-blood-500">{title}</p>
      <dl>{children}</dl>
    </div>
  )
}
