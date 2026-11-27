/**
 * Top navigation: logo, global search, dossier shortcut and section links.
 * On small screens the section links collapse into a hamburger menu.
 */
import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/characters', label: 'Characters' },
  { to: '/actors', label: 'Actors' },
  { to: '/gadgets', label: 'Gadgets' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/locations', label: 'Locations' },
  { to: '/organizations', label: 'Organizations' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/stats', label: 'Stats' },
]

// Active link gets the gold colour + underline bar.
const linkClass = ({ isActive }) =>
  `relative px-1 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
    isActive
      ? 'text-gold-400 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-gold-500'
      : 'text-slate-400 hover:text-white'
  }`

const mobileLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wider ${
    isActive ? 'bg-gold-500/10 text-gold-400' : 'text-slate-300 hover:bg-ink-800'
  }`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { favorites } = useFavorites()
  const location = useLocation()

  // Close the mobile menu whenever the route changes (adjusting state during render,
  // as recommended by React instead of an effect).
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="007 Wiki home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-500 font-display text-xs font-extrabold text-gold-500">
            007
          </span>
          <span className="hidden font-display text-xl font-bold tracking-wide text-white sm:inline">
            007 <span className="text-gold-500">Wiki</span>
          </span>
        </Link>

        <GlobalSearch className="ml-auto w-full max-w-xs" />

        <NavLink
          to="/dossier"
          className={({ isActive }) =>
            `relative flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              isActive ? 'border-gold-500 text-gold-400' : 'border-ink-600 text-slate-300 hover:border-gold-500/60'
            }`
          }
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
          <span className="hidden md:inline">Dossier</span>
          {favorites.length > 0 && (
            <span
              className="rounded-full bg-blood-500 px-1.5 text-[10px] text-white"
              aria-label={`${favorites.length} saved`}
            >
              {favorites.length}
            </span>
          )}
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-ink-600 text-slate-200 lg:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Desktop section links */}
      <nav aria-label="Main" className="hidden border-t border-ink-800 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-6 px-8">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-ink-800 bg-ink-950 lg:hidden">
          <ul className="grid gap-1 px-4 py-3 sm:grid-cols-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={mobileLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

/** Small search form that sends the user to /search?q=… (searches every entity type). */
function GlobalSearch({ className }) {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = text.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setText('')
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label htmlFor="global-search" className="sr-only">
        Search the whole wiki
      </label>
      <input
        id="global-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search all files…"
        className="input py-1.5"
      />
    </form>
  )
}
