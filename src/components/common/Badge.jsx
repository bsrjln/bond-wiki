// Colour variants for small labels (character type, EON, gadgets, …).
const VARIANTS = {
  gold: 'border-gold-500/40 bg-gold-500/10 text-gold-300',
  red: 'border-blood-500/50 bg-blood-500/10 text-red-300',
  slate: 'border-ink-600 bg-ink-800 text-slate-300',
  green: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  blue: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
}

export default function Badge({ children, variant = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${VARIANTS[variant] ?? VARIANTS.slate}`}
    >
      {children}
    </span>
  )
}
