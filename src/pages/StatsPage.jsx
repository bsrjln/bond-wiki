/**
 * Statistics computed from the API data and drawn with plain CSS bars
 * (no chart library): films per Bond actor, box office per film, and more.
 */
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getCharacters, getMovies } from '../services/api'
import { capitalize, formatMoney } from '../utils/format'
import AsyncContent from '../components/common/AsyncContent'
import SectionTitle from '../components/common/SectionTitle'
import { groupByBondActor } from '../utils/movies'

const fetchStats = (signal) =>
  Promise.all([getMovies({ signal }), getCharacters({ signal })]).then(([movies, characters]) => ({
    movies,
    characters,
  }))

export default function StatsPage() {
  useDocumentTitle('Stats')
  const { data, loading, error, retry } = useFetch(fetchStats, [])

  return (
    <section className="page-container">
      <SectionTitle eyebrow="Analysis" title="By the numbers">
        Figures calculated live from the Bond API.
      </SectionTitle>
      <AsyncContent loading={loading} error={error} onRetry={retry}>
        {() => <Stats movies={data.movies} characters={data.characters} />}
      </AsyncContent>
    </section>
  )
}

function Stats({ movies, characters }) {
  const eras = groupByBondActor(movies).filter((g) => g.actor)
  const totalBoxOffice = movies.reduce((sum, m) => sum + (Number(m.box_office_usd) || 0), 0)
  const topGrossing = [...movies].sort((a, b) => Number(b.box_office_usd) - Number(a.box_office_usd))[0]

  const filmsPerActor = eras.map((g) => ({
    key: g.actor.id,
    label: g.actor.name,
    value: g.films.length,
    to: `/actors/${g.actor.id}`,
  }))
  const avgPerActor = eras.map((g) => ({
    key: g.actor.id,
    label: g.actor.name,
    value: g.films.reduce((s, f) => s + Number(f.box_office_usd || 0), 0) / g.films.length,
    to: `/actors/${g.actor.id}`,
  }))
  const boxOffice = [...movies]
    .sort((a, b) => a.release_year - b.release_year)
    .map((m) => ({
      key: m.slug,
      label: `${m.title} (${m.release_year})`,
      value: Number(m.box_office_usd) || 0,
      to: `/movies/${m.slug}`,
    }))

  const typeCounts = characters.reduce(
    (acc, c) => ({ ...acc, [c.character_type]: (acc[c.character_type] ?? 0) + 1 }),
    {},
  )
  const characterTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ key: type, label: capitalize(type), value: count }))

  return (
    <div className="space-y-12">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Films" value={movies.length} />
        <StatTile label="Official EON films" value={movies.filter((m) => m.eon_production).length} />
        <StatTile label="Total box office" value={formatMoney(totalBoxOffice)} />
        <StatTile label="Top grossing" value={topGrossing?.title} note={formatMoney(topGrossing?.box_office_usd)} />
      </dl>

      <div className="grid gap-10 lg:grid-cols-2">
        <BarChart title="Films per Bond actor" rows={filmsPerActor} format={(v) => v} />
        <BarChart title="Average box office per Bond actor" rows={avgPerActor} format={formatMoney} />
        <BarChart title="Characters by type" rows={characterTypes} format={(v) => v} />
      </div>
      <BarChart title="Box office per film (unadjusted USD)" rows={boxOffice} format={formatMoney} />
    </div>
  )
}

function StatTile({ label, value, note }) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-5">
      <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</dt>
      <dd className="mt-2 font-display text-2xl text-gold-400">{value}</dd>
      {note && <dd className="font-mono text-xs text-slate-500">{note}</dd>}
    </div>
  )
}

/** Horizontal bar chart made of divs; bar width is relative to the largest value. */
function BarChart({ title, rows, format }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <figure>
      <figcaption className="mb-4 font-display text-xl text-white">{title}</figcaption>
      <ul className="space-y-2">
        {rows.map((row) => {
          const label = row.to ? (
            <Link to={row.to} className="hover:text-gold-300">
              {row.label}
            </Link>
          ) : (
            row.label
          )
          return (
            <li
              key={row.key}
              className="grid grid-cols-[minmax(0,10rem)_1fr] items-center gap-3 text-sm sm:grid-cols-[minmax(0,14rem)_1fr]"
            >
              <span className="truncate text-slate-300">{label}</span>
              <span className="flex items-center gap-2">
                <span
                  className="h-3 rounded-sm bg-gradient-to-r from-gold-600 to-gold-400"
                  style={{ width: `${(row.value / max) * 100}%` }}
                />
                <span className="shrink-0 font-mono text-xs text-slate-400">{format(row.value)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
