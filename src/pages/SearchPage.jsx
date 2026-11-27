/**
 * Global search across every entity type (movies, characters, actors, gadgets,
 * vehicles, locations, organisations). The query lives in the URL (?q=…).
 */
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { normalize } from '../utils/listControls'
import AsyncContent from '../components/common/AsyncContent'
import SectionTitle from '../components/common/SectionTitle'
import SearchBar from '../components/common/SearchBar'
import EmptyState from '../components/common/EmptyState'

// How to turn each entity list into searchable { title, subtitle, to } rows.
const SOURCES = [
  {
    type: 'Movies',
    fetch: getMovies,
    map: (m) => ({ id: m.slug, title: m.title, subtitle: String(m.release_year), to: `/movies/${m.slug}` }),
  },
  {
    type: 'Characters',
    fetch: getCharacters,
    map: (c) => ({ id: c.id, title: c.name, subtitle: c.character_type, to: `/characters/${c.id}` }),
  },
  {
    type: 'Actors',
    fetch: getActors,
    map: (a) => ({ id: a.id, title: a.name, subtitle: a.nationality, to: `/actors/${a.id}` }),
  },
  {
    type: 'Gadgets',
    fetch: getGadgets,
    map: (g) => ({ id: g.id, title: g.name, subtitle: g.provided_by, to: `/gadgets/${g.id}` }),
  },
  {
    type: 'Vehicles',
    fetch: getVehicles,
    map: (v) => ({ id: v.id, title: `${v.make} ${v.model}`, subtitle: String(v.year), to: `/vehicles/${v.id}` }),
  },
  {
    type: 'Locations',
    fetch: getLocations,
    map: (l) => ({ id: l.id, title: l.name, subtitle: l.country, to: `/locations/${l.id}` }),
  },
  {
    type: 'Organizations',
    fetch: getOrganizations,
    map: (o) => ({ id: o.id, title: o.name, subtitle: o.org_type, to: `/organizations/${o.id}` }),
  },
]

const fetchAll = (signal) =>
  Promise.all(SOURCES.map((source) => source.fetch({ signal }))).then((lists) =>
    SOURCES.map((source, i) => ({ type: source.type, rows: lists[i].map(source.map) })),
  )

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  useDocumentTitle(query ? `Search: ${query}` : 'Search')
  const { data, loading, error, retry } = useFetch(fetchAll, [])

  // Results update on every keystroke; the data is already in memory, so no debounce is needed.
  const groups = useMemo(() => {
    const needle = normalize(query)
    if (!data || needle.length < 2) return []
    return data
      .map((group) => ({ ...group, rows: group.rows.filter((row) => normalize(row.title).includes(needle)) }))
      .filter((group) => group.rows.length > 0)
  }, [data, query])

  const total = groups.reduce((sum, g) => sum + g.rows.length, 0)

  return (
    <section className="page-container">
      <SectionTitle eyebrow="Global search" title="Search the archives" />
      <div className="mb-8 max-w-xl">
        <SearchBar
          value={query}
          onChange={(value) => setSearchParams(value ? { q: value } : {}, { replace: true })}
          placeholder="Type at least 2 characters…"
          label="Search all entities"
        />
      </div>
      <AsyncContent loading={loading} error={error} onRetry={retry}>
        {() =>
          normalize(query).length < 2 ? (
            <p className="text-slate-400">
              Search films, characters, actors, gadgets, vehicles, locations and organizations at once.
            </p>
          ) : total === 0 ? (
            <EmptyState title="No files match" message={`Nothing found for “${query}”.`} />
          ) : (
            <div className="space-y-8">
              <p className="text-sm text-slate-400" aria-live="polite">
                {total} results for “{query}”
              </p>
              {groups.map((group) => (
                <section key={group.type}>
                  <h2 className="mb-3 font-display text-xl text-white">
                    {group.type} <span className="font-mono text-xs text-slate-500">{group.rows.length}</span>
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.rows.map((row) => (
                      <li key={row.id}>
                        <Link
                          to={row.to}
                          className="group block rounded-lg border border-ink-700 bg-ink-900 p-3 transition hover:border-gold-500/60"
                        >
                          <span className="block text-slate-100 group-hover:text-gold-300">{row.title}</span>
                          {row.subtitle && <span className="text-sm capitalize text-slate-500">{row.subtitle}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )
        }
      </AsyncContent>
    </section>
  )
}
