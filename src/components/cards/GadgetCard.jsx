import CardFrame, { CardTitle } from './CardFrame'
import { pluralize } from '../../utils/format'

/** Card for one gadget: name, who provided it and the films it appears in. */
export default function GadgetCard({ gadget }) {
  const films = gadget.films ?? []
  return (
    <CardFrame to={`/gadgets/${gadget.id}`}>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-500">{gadget.provided_by}</p>
        <CardTitle>{gadget.name}</CardTitle>
        <p className="text-sm text-slate-400">{films.map((f) => `${f.title} (${f.year})`).join(', ')}</p>
        <p className="mt-auto pt-2 font-mono text-xs text-slate-500">
          {pluralize(gadget.appearance_count, 'appearance')}
        </p>
      </div>
    </CardFrame>
  )
}
