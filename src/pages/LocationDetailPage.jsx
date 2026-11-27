import { useParams } from 'react-router-dom'
import { getLocation } from '../services/api'
import { capitalize } from '../utils/format'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'
import Badge from '../components/common/Badge'

export default function LocationDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage fetcher={getLocation} id={id} getTitle={(l) => l.name} backTo="/locations" backLabel="Locations">
      {(location) => (
        <>
          <DetailHeader
            backTo="/locations"
            backLabel="All locations"
            eyebrow={`Field report · ${location.country}`}
            title={location.name}
            badges={<Badge>{location.location_type}</Badge>}
            actions={
              <FavoriteButton
                item={{
                  path: `/locations/${location.id}`,
                  type: 'Location',
                  title: location.name,
                  subtitle: location.country,
                }}
              />
            }
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <p className="leading-relaxed text-slate-300">{location.description || 'No description on file.'}</p>
            <FactSheet>
              <InfoRow label="Country">{location.country}</InfoRow>
              <InfoRow label="Type">{capitalize(location.location_type)}</InfoRow>
              <InfoRow label="Films">{(location.movies ?? []).length}</InfoRow>
            </FactSheet>
          </div>
          <RelatedList title="Featured in" items={filmItems(location.movies)} />
        </>
      )}
    </DetailPage>
  )
}
