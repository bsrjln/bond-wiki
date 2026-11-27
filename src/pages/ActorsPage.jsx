import ListPage from '../components/common/ListPage'
import ActorCard from '../components/cards/ActorCard'
import { getActors } from '../services/api'
import { getDecade, uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const UNKNOWN = 'unknown'

// Decade of the actor's first Bond film.
const debutDecade = (actor) => getDecade(Math.min(...(actor.films ?? []).map((f) => f.year)))

const filters = [
  {
    key: 'nationality',
    label: 'Nationality',
    allLabel: 'All nationalities',
    getOptions: (actors) => [
      ...uniqueSorted(actors.map((a) => a.nationality)).map((n) => ({ value: n, label: n })),
      { value: UNKNOWN, label: 'Unknown' },
    ],
    match: (actor, value) => (value === UNKNOWN ? !actor.nationality : actor.nationality === value),
  },
  {
    key: 'debut',
    label: 'Bond debut',
    allLabel: 'Any decade',
    getOptions: (actors) => uniqueSorted(actors.map(debutDecade)).map((d) => ({ value: d, label: d })),
    match: (actor, value) => debutDecade(actor) === value,
  },
]

const sortOptions = [
  { value: 'name', label: 'Name A–Z', compare: byText((a) => a.name) },
  { value: 'films', label: 'Most films', compare: reverse(byNumber((a) => a.film_count)) },
  {
    value: 'born',
    label: 'Birth date (oldest)',
    // Actors without a birth date go last.
    compare: (a, b) => (a.birth_date ?? '9999').localeCompare(b.birth_date ?? '9999'),
  },
]

export default function ActorsPage() {
  return (
    <ListPage
      eyebrow="Cast files"
      title="Actors"
      intro="The performers who brought the Bond universe to life."
      fetcher={getActors}
      getKey={(a) => a.id}
      renderItem={(a) => <ActorCard actor={a} />}
      getSearchText={(a) => a.name}
      searchPlaceholder="Search actors…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
