import { Link } from 'react-router-dom'

/**
 * List of related records on a detail page (cast, locations, gadgets, …).
 * items: [{ key, to, title, subtitle, meta }] — every item links to its own detail page.
 */
export default function RelatedList({ title, items, emptyText = 'No records on file.' }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-3 font-display text-xl text-white">
        {title}
        <span className="font-mono text-xs text-slate-500">{items.length}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" aria-hidden="true" />
      </h2>
      {items.length === 0 ? (
        <p className="text-sm italic text-slate-500">{emptyText}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.key}>
              <RelatedItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RelatedItem({ item }) {
  const content = (
    <>
      <span className="block font-medium text-slate-100 group-hover:text-gold-300">{item.title}</span>
      {item.subtitle && <span className="mt-0.5 block text-sm text-slate-400">{item.subtitle}</span>}
      {item.meta && <span className="mt-1 block font-mono text-[11px] text-slate-500">{item.meta}</span>}
    </>
  )
  const classes = 'group block h-full rounded-lg border border-ink-700 bg-ink-900 p-3 transition'

  // Some related rows (e.g. action scenes) have no page of their own.
  if (!item.to) return <div className={classes}>{content}</div>
  return (
    <Link to={item.to} className={`${classes} hover:border-gold-500/60 hover:bg-ink-800`}>
      {content}
    </Link>
  )
}
