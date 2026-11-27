/**
 * Timeline of the Bond eras: films grouped by the actor who played 007,
 * in the order each actor debuted (Connery → Craig). Data comes from /movies.
 */
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getMovies } from '../services/api'
import { formatMoney, pluralize, yearRange } from '../utils/format'
import { groupByBondActor } from '../utils/movies'
import AsyncContent from '../components/common/AsyncContent'
import SectionTitle from '../components/common/SectionTitle'
import Badge from '../components/common/Badge'

export default function TimelinePage() {
  useDocumentTitle('Timeline')
  const { data, loading, error, retry } = useFetch((signal) => getMovies({ signal }), [])

  return (
    <section className="page-container">
      <SectionTitle eyebrow="Eras" title="Bond timeline">
        Six decades of 007, era by era. Each era is the run of a single Bond actor.
      </SectionTitle>
      <AsyncContent loading={loading} error={error} onRetry={retry}>
        {() => (
          <ol className="relative space-y-10 border-l-2 border-gold-500/30 pl-6 sm:pl-10">
            {groupByBondActor(data).map((group, index) => (
              <li key={group.actor?.id ?? 'none'} className="relative">
                {/* Timeline dot */}
                <span className="absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gold-500 bg-ink-950 sm:-left-[49px]" />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-sm text-gold-500">
                    {yearRange(group.films.map((f) => f.release_year))}
                  </span>
                  <h2 className="font-display text-2xl text-white">
                    {group.actor ? (
                      <Link to={`/actors/${group.actor.id}`} className="hover:text-gold-300">
                        {group.actor.name}
                      </Link>
                    ) : (
                      'Unofficial / no Bond actor'
                    )}
                  </h2>
                  <span className="text-sm text-slate-500">
                    {group.actor ? `Bond #${index + 1} · ` : ''}
                    {pluralize(group.films.length, 'film')}
                  </span>
                </div>
                <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {group.films.map((film) => (
                    <li key={film.slug} className="w-44 shrink-0">
                      <Link
                        to={`/movies/${film.slug}`}
                        className="group block h-full rounded-lg border border-ink-700 bg-ink-900 p-3 transition hover:border-gold-500/60"
                      >
                        <span className="font-mono text-xs text-slate-500">{film.release_year}</span>
                        <span className="mt-1 block font-medium text-slate-100 group-hover:text-gold-300">
                          {film.title}
                        </span>
                        <span className="mt-2 flex items-center justify-between">
                          <span className="font-mono text-[11px] text-slate-500">
                            {formatMoney(film.box_office_usd)}
                          </span>
                          {!film.eon_production && <Badge variant="red">Non-EON</Badge>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </AsyncContent>
    </section>
  )
}
