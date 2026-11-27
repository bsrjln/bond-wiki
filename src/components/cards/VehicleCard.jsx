import CardFrame, { CardTitle } from './CardFrame'
import Badge from '../common/Badge'

/** Card for one vehicle: make, model, year and whether it is gadget-equipped. */
export default function VehicleCard({ vehicle }) {
  const films = vehicle.films ?? []
  return (
    <CardFrame to={`/vehicles/${vehicle.id}`}>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500">{vehicle.make}</p>
          <span className="font-mono text-sm text-slate-400">{vehicle.year}</span>
        </div>
        <CardTitle>{vehicle.model}</CardTitle>
        <p className="text-sm text-slate-400">{films.map((f) => f.title).join(', ')}</p>
        <div className="mt-auto pt-2">
          {vehicle.has_gadgets ? <Badge variant="gold">Q-modified</Badge> : <Badge>Standard</Badge>}
        </div>
      </div>
    </CardFrame>
  )
}
