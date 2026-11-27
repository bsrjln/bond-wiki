import ListPage from '../components/common/ListPage'
import VehicleCard from '../components/cards/VehicleCard'
import { getVehicles } from '../services/api'
import { uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const filters = [
  {
    key: 'make',
    label: 'Make',
    allLabel: 'All makes',
    getOptions: (vehicles) => uniqueSorted(vehicles.map((v) => v.make)).map((m) => ({ value: m, label: m })),
    match: (vehicle, value) => vehicle.make === value,
  },
  {
    key: 'gadgets',
    label: 'Gadgets',
    allLabel: 'Any',
    options: [
      { value: 'yes', label: 'Q-modified' },
      { value: 'no', label: 'Standard' },
    ],
    match: (vehicle, value) => vehicle.has_gadgets === (value === 'yes'),
  },
]

const year = byNumber((v) => v.year)
const sortOptions = [
  { value: 'year', label: 'Year (oldest)', compare: year },
  { value: 'year-desc', label: 'Year (newest)', compare: reverse(year) },
  { value: 'make', label: 'Make A–Z', compare: byText((v) => `${v.make} ${v.model}`) },
]

export default function VehiclesPage() {
  return (
    <ListPage
      eyebrow="Motor pool"
      title="Vehicles"
      intro="Aston Martins, submarine Lotuses, tanks and everything in between."
      fetcher={getVehicles}
      getKey={(v) => v.id}
      renderItem={(v) => <VehicleCard vehicle={v} />}
      getSearchText={(v) => `${v.make} ${v.model}`}
      searchPlaceholder="Search make or model…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
