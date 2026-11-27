/** One "label: value" row in a detail page fact sheet. Renders nothing when value is empty. */
export default function InfoRow({ label, children }) {
  if (children === null || children === undefined || children === '') return null
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 border-b border-ink-700/70 py-2.5 last:border-0 sm:grid-cols-[10rem_1fr]">
      <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-200">{children}</dd>
    </div>
  )
}
