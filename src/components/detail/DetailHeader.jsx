import { Link } from 'react-router-dom'

/** Top of every detail page: breadcrumb back to the list, eyebrow, big title and actions. */
export default function DetailHeader({ backTo, backLabel, eyebrow, title, subtitle, badges, actions }) {
  return (
    <header className="mb-8">
      <Link to={backTo} className="link-gold inline-flex items-center gap-1 text-sm">
        <span aria-hidden="true">←</span> {backLabel}
      </Link>
      {eyebrow && <p className="mt-6 font-mono text-xs uppercase tracking-[0.35em] text-gold-500">{eyebrow}</p>}
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-3xl text-lg italic text-slate-400">{subtitle}</p>}
      {badges && <div className="mt-4 flex flex-wrap gap-2">{badges}</div>}
      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </header>
  )
}
