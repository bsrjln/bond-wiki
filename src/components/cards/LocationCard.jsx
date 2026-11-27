import CardFrame, { CardTitle } from './CardFrame'
import Badge from '../common/Badge'
import { pluralize } from '../../utils/format'

/** Card for one filming / story location. */
export default function LocationCard({ location }) {
  return (
    <CardFrame to={`/locations/${location.id}`}>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500">{location.country}</p>
        <CardTitle>{location.name}</CardTitle>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge>{location.location_type}</Badge>
          <span className="font-mono text-xs text-slate-500">{pluralize(location.appearance_count, 'film')}</span>
        </div>
      </div>
    </CardFrame>
  )
}
