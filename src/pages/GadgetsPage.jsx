import ListPage from '../components/common/ListPage'
import GadgetCard from '../components/cards/GadgetCard'
import { getGadgets } from '../services/api'
import { uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const filters = [
  {
    key: 'provider',
    label: 'Provided by',
    allLabel: 'Anyone',
    getOptions: (gadgets) => uniqueSorted(gadgets.map((g) => g.provided_by)).map((p) => ({ value: p, label: p })),
    match: (gadget, value) => gadget.provided_by === value,
  },
]

const firstYear = (g) => Math.min(...(g.films ?? []).map((f) => f.year))
const sortOptions = [
  { value: 'name', label: 'Name A–Z', compare: byText((g) => g.name) },
  { value: 'year', label: 'First seen (oldest)', compare: byNumber(firstYear) },
  { value: 'year-desc', label: 'First seen (newest)', compare: reverse(byNumber(firstYear)) },
]

export default function GadgetsPage() {
  return (
    <ListPage
      eyebrow="Q Branch inventory"
      title="Gadgets"
      intro="Pay attention, 007. Everything Q Branch ever handed over."
      fetcher={getGadgets}
      getKey={(g) => g.id}
      renderItem={(g) => <GadgetCard gadget={g} />}
      getSearchText={(g) => `${g.name} ${(g.films ?? []).map((f) => f.title).join(' ')}`}
      searchPlaceholder="Search gadgets or films…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
