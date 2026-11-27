import CardFrame, { CardTitle } from './CardFrame'
import Poster from '../common/Poster'
import Badge from '../common/Badge'
import { formatMoney } from '../../utils/format'

/** Card for one film: poster, title, year, Bond actor and box office. */
export default function MovieCard({ movie }) {
  return (
    <CardFrame to={`/movies/${movie.slug}`}>
      <div className="aspect-[2/3] overflow-hidden">
        <div className="h-full w-full transition duration-500 group-hover:scale-105">
          <Poster imdb={movie.imdb} title={movie.title} year={movie.release_year} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{movie.title}</CardTitle>
          <span className="shrink-0 font-mono text-sm text-gold-400">{movie.release_year}</span>
        </div>
        <p className="text-sm text-slate-400">{movie.bond_actor?.name ?? 'No official Bond actor'}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {movie.eon_production ? <Badge variant="gold">EON</Badge> : <Badge variant="red">Non-EON</Badge>}
          <span className="font-mono text-xs text-slate-500">{formatMoney(movie.box_office_usd)}</span>
        </div>
      </div>
    </CardFrame>
  )
}
