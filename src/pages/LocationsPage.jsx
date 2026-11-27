import ListPage from '../components/common/ListPage'
import LocationCard from '../components/cards/LocationCard'
import { getLocations } from '../services/api'
import { capitalize, uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const filters = [
  {
    key: 'country',
    label: 'Country',
    allLabel: 'All countries',
    getOptions: (locations) => uniqueSorted(locations.map((l) => l.country)).map((c) => ({ value: c, label: c })),
    match: (location, value) => location.country === value,
  },
  {
    key: 'type',
    label: 'Type',
    allLabel: 'All types',
    getOptions: (locations) =>
      uniqueSorted(locations.map((l) => l.location_type)).map((t) => ({ value: t, label: capitalize(t) })),
    match: (location, value) => location.location_type === value,
  },
]

const sortOptions = [
  { value: 'name', label: 'Name A–Z', compare: byText((l) => l.name) },
  { value: 'country', label: 'Country A–Z', compare: byText((l) => `${l.country} ${l.name}`) },
  { value: 'films', label: 'Most films', compare: reverse(byNumber((l) => l.appearance_count)) },
]

export default function LocationsPage() {
  return (
    <ListPage
      eyebrow="Field operations"
      title="Locations"
      intro="From Jamaica to Istanbul — the places 007 has been sent."
      fetcher={getLocations}
      getKey={(l) => l.id}
      renderItem={(l) => <LocationCard location={l} />}
      getSearchText={(l) => `${l.name} ${l.country}`}
      searchPlaceholder="Search city, place or country…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
