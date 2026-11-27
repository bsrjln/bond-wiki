import { useParams } from 'react-router-dom'
import { getActor } from '../services/api'
import { capitalize, formatDate } from '../utils/format'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'
import Badge from '../components/common/Badge'

export default function ActorDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage fetcher={getActor} id={id} getTitle={(a) => a.name} backTo="/actors" backLabel="Actors">
      {(actor) => {
        const playedBond = (actor.characters ?? []).some((c) => c.is_bond)
        return (
          <>
            <DetailHeader
              backTo="/actors"
              backLabel="All actors"
              eyebrow="Cast file"
              title={actor.name}
              badges={playedBond && <Badge variant="gold">Played James Bond</Badge>}
              actions={
                <FavoriteButton
                  item={{ path: `/actors/${actor.id}`, type: 'Actor', title: actor.name, subtitle: actor.nationality }}
                />
              }
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <p className="leading-relaxed text-slate-300">{actor.biography || 'No biography on file.'}</p>
              <FactSheet>
                <InfoRow label="Born">{formatDate(actor.birth_date) ?? 'Unknown'}</InfoRow>
                <InfoRow label="Nationality">{actor.nationality ?? 'Unknown'}</InfoRow>
                <InfoRow label="Bond films">{(actor.appearances ?? []).length}</InfoRow>
              </FactSheet>
            </div>
            <RelatedList title="Filmography" items={filmItems(actor.appearances)} />
            <RelatedList
              title="Characters played"
              items={(actor.characters ?? []).map((c) => ({
                key: c.id,
                to: `/characters/${c.id}`,
                title: c.name,
                meta: capitalize(c.character_type),
              }))}
            />
          </>
        )
      }}
    </DetailPage>
  )
}
