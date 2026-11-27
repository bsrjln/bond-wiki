import { useParams } from 'react-router-dom'
import { getOrganization } from '../services/api'
import { capitalize } from '../utils/format'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'
import Badge from '../components/common/Badge'

export default function OrganizationDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage
      fetcher={getOrganization}
      id={id}
      getTitle={(o) => o.name}
      backTo="/organizations"
      backLabel="Organizations"
    >
      {(org) => (
        <>
          <DetailHeader
            backTo="/organizations"
            backLabel="All organizations"
            eyebrow="Agency file"
            title={org.name}
            badges={<Badge variant={org.org_type === 'criminal' ? 'red' : 'green'}>{org.org_type}</Badge>}
            actions={
              <FavoriteButton
                item={{
                  path: `/organizations/${org.id}`,
                  type: 'Organization',
                  title: org.name,
                  subtitle: capitalize(org.org_type),
                }}
              />
            }
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <p className="leading-relaxed text-slate-300">{org.description || 'No description on file.'}</p>
            <FactSheet>
              <InfoRow label="Type">{capitalize(org.org_type)}</InfoRow>
              <InfoRow label="Films">{(org.movies ?? []).length}</InfoRow>
            </FactSheet>
          </div>
          <RelatedList title="Active in" items={filmItems(org.movies)} />
        </>
      )}
    </DetailPage>
  )
}
