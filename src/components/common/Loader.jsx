/** Spinner with a visible "Loading…" label (also announced to screen readers). */
export default function Loader({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-20 text-gold-400">
      <span className="relative block h-14 w-14">
        <span className="absolute inset-0 rounded-full border-2 border-gold-500/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold-500" />
        <span className="absolute inset-[38%] rounded-full bg-gold-500/70" />
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.3em]">{label}</span>
    </div>
  )
}
