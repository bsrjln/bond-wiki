import { useParams } from 'react-router-dom'
import { getCharacter } from '../services/api'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'
import Badge from '../components/common/Badge'
import { TYPE_VARIANT } from '../components/common/badgeVariants'
import { capitalize } from '../utils/format'

const yesNo = (value) => (value ? 'Yes' : 'No')

export default function CharacterDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage fetcher={getCharacter} id={id} getTitle={(c) => c.name} backTo="/characters" backLabel="Characters">
      {(character) => (
        <>
          <DetailHeader
            backTo="/characters"
            backLabel="All characters"
            eyebrow="Person of interest"
            title={character.name}
            badges={
              <>
                <Badge variant={TYPE_VARIANT[character.character_type]}>{character.character_type}</Badge>
                {character.is_bond && <Badge variant="gold">007</Badge>}
                {character.romantic_partner && <Badge variant="blue">Romantic partner</Badge>}
                {character.dies && <Badge variant="red">Deceased</Badge>}
              </>
            }
            actions={
              <FavoriteButton
                item={{
                  path: `/characters/${character.id}`,
                  type: 'Character',
                  title: character.name,
                  subtitle: capitalize(character.character_type),
                }}
              />
            }
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <p className="leading-relaxed text-slate-300">{character.description || 'No description on file.'}</p>
            <FactSheet>
              <InfoRow label="Type">{capitalize(character.character_type)}</InfoRow>
              <InfoRow label="Is Bond">{yesNo(character.is_bond)}</InfoRow>
              <InfoRow label="Romance">{yesNo(character.romantic_partner)}</InfoRow>
              <InfoRow label="Dies">{yesNo(character.dies)}</InfoRow>
              <InfoRow label="Appearances">{(character.appearances ?? []).length}</InfoRow>
            </FactSheet>
          </div>
          <RelatedList title="Appears in" items={filmItems(character.appearances)} />
          <RelatedList
            title="Played by"
            items={(character.actors ?? []).map((a) => ({ key: a.id, to: `/actors/${a.id}`, title: a.name }))}
          />
        </>
      )}
    </DetailPage>
  )
}
