import CardFrame, { CardTitle } from './CardFrame'
import { formatDate, pluralize, yearRange } from '../../utils/format'

/** Card for one actor: name, nationality, birth date and film count. */
export default function ActorCard({ actor }) {
  const films = actor.films ?? []
  return (
    <CardFrame to={`/actors/${actor.id}`}>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <CardTitle>{actor.name}</CardTitle>
        <p className="text-sm text-slate-400">
          {actor.nationality ?? 'Nationality unknown'}
          {actor.birth_date && <span className="text-slate-500"> · b. {formatDate(actor.birth_date)}</span>}
        </p>
        <p className="line-clamp-2 text-xs text-slate-500">{films.map((f) => f.title).join(', ')}</p>
        <div className="mt-auto flex items-center justify-between pt-2 font-mono text-xs">
          <span className="text-gold-400">{pluralize(actor.film_count, 'film')}</span>
          <span className="text-slate-500">{yearRange(films.map((f) => f.year))}</span>
        </div>
      </div>
    </CardFrame>
  )
}
