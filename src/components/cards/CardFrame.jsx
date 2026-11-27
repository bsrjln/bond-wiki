import { Link } from 'react-router-dom'

/** Common clickable card shell so every card shares the same border, hover and focus styles. */
export default function CardFrame({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink-700 bg-ink-900 transition duration-300 hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-[0_10px_40px_-10px_rgba(201,162,39,0.35)] focus-visible:border-gold-500 ${className}`}
    >
      {children}
    </Link>
  )
}

/** Title line used inside cards (turns gold on hover). */
export function CardTitle({ children }) {
  return (
    <h2 className="font-display text-lg font-semibold leading-snug text-white transition group-hover:text-gold-300">
      {children}
    </h2>
  )
}
