import ListPage from '../components/common/ListPage'
import MovieCard from '../components/cards/MovieCard'
import { getMovies } from '../services/api'
import { getDecade, uniqueSorted } from '../utils/format'
import { byNumber, byText, reverse } from '../utils/listControls'

const NO_ACTOR = 'none'

// Filter definitions: options are built from the fetched data, never hard-coded.
const filters = [
  {
    key: 'actor',
    label: 'Bond actor',
    allLabel: 'All actors',
    getOptions: (movies) => [
      // Keep actors in chronological order of their first film.
      ...uniqueSorted(movies.map((m) => m.bond_actor?.name))
        .map((name) => ({
          name,
          first: Math.min(...movies.filter((m) => m.bond_actor?.name === name).map((m) => m.release_year)),
        }))
        .sort((a, b) => a.first - b.first)
        .map(({ name }) => ({ value: name, label: name })),
      { value: NO_ACTOR, label: 'No official Bond' },
    ],
    match: (movie, value) => (value === NO_ACTOR ? !movie.bond_actor : movie.bond_actor?.name === value),
  },
  {
    key: 'decade',
    label: 'Decade',
    allLabel: 'All decades',
    getOptions: (movies) =>
      uniqueSorted(movies.map((m) => getDecade(m.release_year))).map((d) => ({ value: d, label: d })),
    match: (movie, value) => getDecade(movie.release_year) === value,
  },
  {
    key: 'production',
    label: 'Production',
    allLabel: 'EON + non-EON',
    options: [
      { value: 'eon', label: 'EON (official)' },
      { value: 'non-eon', label: 'Non-EON' },
    ],
    match: (movie, value) => (value === 'eon' ? movie.eon_production : !movie.eon_production),
  },
]

const releaseYear = byNumber((m) => m.release_year)
const sortOptions = [
  { value: 'year-asc', label: 'Release (oldest)', compare: releaseYear },
  { value: 'year-desc', label: 'Release (newest)', compare: reverse(releaseYear) },
  { value: 'title', label: 'Title A–Z', compare: byText((m) => m.title) },
  { value: 'box-office', label: 'Box office (highest)', compare: reverse(byNumber((m) => m.box_office_usd)) },
]

export default function MoviesPage() {
  return (
    <ListPage
      eyebrow="Mission archive"
      title="Movies"
      intro="Every Bond film from Dr. No to No Time to Die — including the unofficial entries."
      fetcher={getMovies}
      getKey={(movie) => movie.slug}
      renderItem={(movie) => <MovieCard movie={movie} />}
      getSearchText={(movie) => `${movie.title} ${movie.tagline ?? ''} ${movie.director ?? ''}`}
      searchPlaceholder="Search by title, tagline or director…"
      filters={filters}
      sortOptions={sortOptions}
      tallSkeleton
    />
  )
}
