/**
 * Home: gun-barrel hero, short intro (static text is allowed here),
 * live "intel" counts from the API and links to every section.
 */
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  getActors,
  getCharacters,
  getGadgets,
  getLocations,
  getMovies,
  getOrganizations,
  getVehicles,
} from '../services/api'
import AsyncContent from '../components/common/AsyncContent'
import SectionTitle from '../components/common/SectionTitle'
import MovieCard from '../components/cards/MovieCard'
import { SkeletonGrid } from '../components/common/Skeleton'

// Static navigation cards; the counts next to them come from the API.
const SECTIONS = [
  { to: '/movies', label: 'Movies', key: 'movies', text: 'Every mission from 1962 to today.' },
  { to: '/characters', label: 'Characters', key: 'characters', text: 'Allies, villains and henchmen.' },
  { to: '/actors', label: 'Actors', key: 'actors', text: 'The faces behind the roles.' },
  { to: '/gadgets', label: 'Gadgets', key: 'gadgets', text: 'Straight from Q Branch.' },
  { to: '/vehicles', label: 'Vehicles', key: 'vehicles', text: 'Aston Martins and beyond.' },
  { to: '/locations', label: 'Locations', key: 'locations', text: 'Where in the world is 007?' },
  { to: '/organizations', label: 'Organizations', key: 'organizations', text: 'MI6, SPECTRE and more.' },
  { to: '/timeline', label: 'Timeline', key: null, text: 'Six actors, six eras.' },
]

const fetchOverview = (signal) =>
  Promise.all([
    getMovies({ signal }),
    getCharacters({ signal }),
    getActors({ signal }),
    getGadgets({ signal }),
    getVehicles({ signal }),
    getLocations({ signal }),
    getOrganizations({ signal }),
  ]).then(([movies, characters, actors, gadgets, vehicles, locations, organizations]) => ({
    movies,
    counts: {
      movies: movies.length,
      characters: characters.length,
      actors: actors.length,
      gadgets: gadgets.length,
      vehicles: vehicles.length,
      locations: locations.length,
      organizations: organizations.length,
    },
  }))

export default function HomePage() {
  useDocumentTitle(null)
  const { data, loading, error, retry } = useFetch(fetchOverview, [])

  return (
    <>
      <Hero />

      <section className="page-container" aria-labelledby="sections-title">
        <SectionTitle eyebrow="Briefing" title="Choose your file" as="h2">
          The wiki is organised like an MI6 archive. Pick a section to begin.
        </SectionTitle>
        <span id="sections-title" className="sr-only">
          Sections
        </span>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => (
            <li key={section.to}>
              <Link
                to={section.to}
                className="group flex h-full flex-col rounded-xl border border-ink-700 bg-gradient-to-br from-ink-900 to-ink-950 p-5 transition hover:-translate-y-1 hover:border-gold-500/60"
              >
                <span className="flex items-baseline justify-between">
                  <span className="font-display text-xl text-white group-hover:text-gold-300">{section.label}</span>
                  {section.key && (
                    <span className="font-mono text-sm text-gold-500">
                      {data ? data.counts[section.key] : loading ? '··' : '—'}
                    </span>
                  )}
                </span>
                <span className="mt-2 text-sm text-slate-400">{section.text}</span>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-gold-400">
                  Open file →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-container pt-0" aria-label="Latest missions">
        <SectionTitle eyebrow="Latest intel" title="Most recent missions" as="h2" />
        <AsyncContent loading={loading} error={error} onRetry={retry} fallback={<SkeletonGrid count={4} tall />}>
          {() => (
            <>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...data.movies]
                  .sort((a, b) => b.release_year - a.release_year)
                  .slice(0, 4)
                  .map((movie) => (
                    <li key={movie.slug}>
                      <MovieCard movie={movie} />
                    </li>
                  ))}
              </ul>
              <div className="mt-8 text-center">
                <Link to="/movies" className="btn-secondary">
                  View all {data.counts.movies} films
                </Link>
              </div>
            </>
          )}
        </AsyncContent>
      </section>
    </>
  )
}

/** CSS-only gun-barrel inspired hero (no official logos or copyrighted images). */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800 bg-[radial-gradient(ellipse_at_top,_#1b2333_0%,_#05070c_70%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-blood-500">Classified · Eyes only</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-tight text-white sm:text-6xl">
            The name is <span className="text-gold-500">Wiki</span>.
            <br />
            007 Wiki.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Since 1962, Ian Fleming&apos;s secret agent James Bond has saved the world in more than two dozen films —
            with six actors, countless villains, legendary gadgets and the most famous cars in cinema. This wiki gathers
            the entire franchise into one searchable dossier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/movies" className="btn-primary">
              Browse the films
            </Link>
            <Link to="/timeline" className="btn-secondary">
              Explore the eras
            </Link>
          </div>
        </div>

        {/* Gun barrel: rifled ring + moving white dot + red drip at the bottom */}
        <div className="relative mx-auto aspect-square w-64 sm:w-80 md:w-96" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(from_0deg,_#0a0e17_0deg_12deg,_#1b2333_12deg_24deg)] shadow-[0_0_80px_rgba(201,162,39,0.15)] motion-safe:animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,_#2a3447_0%,_#05070c_70%)]" />
          <div className="absolute inset-[12%] overflow-hidden rounded-full">
            <div className="absolute inset-0 flex items-center justify-center motion-safe:animate-barrel">
              <span className="h-1/3 w-1/3 rounded-full bg-[radial-gradient(circle,_#ffffff_0%,_#e2e8f0_45%,_transparent_70%)]" />
            </div>
            <span className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-blood-500/0 via-blood-600/40 to-blood-600/80 motion-safe:animate-blood-drip" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-gold-500/30" />
        </div>
      </div>
    </section>
  )
}
