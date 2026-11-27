import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800 bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-display text-gold-500">007 Wiki</p>
        <p>
          Data:{' '}
          <a href="https://bond.deanebarker.net/" target="_blank" rel="noreferrer" className="link-gold">
            James Bond Movie Database API
          </a>{' '}
          · Posters:{' '}
          <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer" className="link-gold">
            OMDb
          </a>{' '}
          ·{' '}
          <Link to="/dossier" className="link-gold">
            Dossier
          </Link>
        </p>
      </div>
    </footer>
  )
}
