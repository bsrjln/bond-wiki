import ListPage from '../components/common/ListPage'
import CharacterCard from '../components/cards/CharacterCard'
import { getCharacters } from '../services/api'
import { capitalize, uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const filters = [
  {
    key: 'type',
    label: 'Character type',
    allLabel: 'All types',
    getOptions: (characters) =>
      uniqueSorted(characters.map((c) => c.character_type)).map((t) => ({ value: t, label: capitalize(t) })),
    match: (character, value) => character.character_type === value,
  },
  {
    key: 'trait',
    label: 'Trait',
    allLabel: 'Any',
    options: [
      { value: 'is_bond', label: 'James Bond (007)' },
      { value: 'romantic_partner', label: 'Romantic partner' },
      { value: 'dies', label: 'Dies in film' },
    ],
    // The option value is the boolean field name in the API response.
    match: (character, value) => Boolean(character[value]),
  },
]

const name = byText((c) => c.name)
const sortOptions = [
  { value: 'name', label: 'Name A–Z', compare: name },
  { value: 'name-desc', label: 'Name Z–A', compare: reverse(name) },
  { value: 'appearances', label: 'Most appearances', compare: reverse(byNumber((c) => c.appearance_count)) },
]

export default function CharactersPage() {
  return (
    <ListPage
      eyebrow="Persons of interest"
      title="Characters"
      intro="Allies, villains, henchmen and the agent himself."
      fetcher={getCharacters}
      getKey={(c) => c.id}
      renderItem={(c) => <CharacterCard character={c} />}
      getSearchText={(c) => c.name}
      searchPlaceholder="Search characters…"
      filters={filters}
      sortOptions={sortOptions}
    />
  )
}
