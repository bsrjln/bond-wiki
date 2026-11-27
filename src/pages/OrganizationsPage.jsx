import ListPage from '../components/common/ListPage'
import OrganizationCard from '../components/cards/OrganizationCard'
import { getOrganizations } from '../services/api'
import { capitalize, uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const filters = [
  {
    key: 'type',
    label: 'Type',
    allLabel: 'All types',
    getOptions: (orgs) => uniqueSorted(orgs.map((o) => o.org_type)).map((t) => ({ value: t, label: capitalize(t) })),
    match: (org, value) => org.org_type === value,
  },
]

const sortOptions = [
  { value: 'name', label: 'Name A–Z', compare: byText((o) => o.name) },
  { value: 'films', label: 'Most films', compare: reverse(byNumber((o) => o.appearance_count)) },
]

export default function OrganizationsPage() {
  return (
    <ListPage
      eyebrow="Agencies & syndicates"
      title="Organizations"
      intro="Intelligence services and the criminal networks they fight."
      fetcher={getOrganizations}
      getKey={(o) => o.id}
      renderItem={(o) => <OrganizationCard organization={o} />}
      getSearchText={(o) => o.name}
      searchPlaceholder="Search organizations…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
