import CardFrame, { CardTitle } from './CardFrame'
import Badge from '../common/Badge'
import { TYPE_VARIANT } from '../common/badgeVariants'
import { pluralize } from '../../utils/format'

/** Card for one character: name, type and the boolean flags from the API. */
export default function CharacterCard({ character }) {
  return (
    <CardFrame to={`/characters/${character.id}`}>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-ink-800 font-display text-lg text-gold-400"
          >
            {character.name.charAt(0)}
          </span>
          <CardTitle>{character.name}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={TYPE_VARIANT[character.character_type]}>{character.character_type}</Badge>
          {character.is_bond && <Badge variant="gold">007</Badge>}
          {character.romantic_partner && <Badge variant="blue">Romance</Badge>}
          {character.dies && <Badge variant="red">Deceased</Badge>}
        </div>
        <p className="mt-auto font-mono text-xs text-slate-500">
          {pluralize(character.appearance_count, 'appearance')}
        </p>
      </div>
    </CardFrame>
  )
}
