/** Page / section heading with the small "classified" eyebrow text above it. */
export default function SectionTitle({ eyebrow, title, children, as: Tag = 'h1' }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold-500">{eyebrow}</p>}
      <Tag className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{title}</Tag>
      {children && <div className="mt-3 max-w-3xl text-slate-400">{children}</div>}
    </header>
  )
}
