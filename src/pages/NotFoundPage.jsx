import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'

/** Catch-all route for unknown URLs. */
export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <section className="page-container flex flex-col items-center py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-gold-500/80">404</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-blood-500">Access denied · File missing</p>
      <h1 className="mt-3 font-display text-3xl text-white">This page has been redacted</h1>
      <p className="mt-3 max-w-md text-slate-400">
        The page you are looking for does not exist, or MI6 would rather you didn&apos;t see it.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Return to HQ
      </Link>
    </section>
  )
}
