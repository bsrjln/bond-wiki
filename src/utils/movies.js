/** Groups films by the actor who played Bond, sorted by each actor's debut. Films without a Bond go last. */
export function groupByBondActor(movies) {
  const groups = new Map()
  for (const movie of movies) {
    const key = movie.bond_actor?.id ?? 'none'
    if (!groups.has(key)) groups.set(key, { actor: movie.bond_actor ?? null, films: [] })
    groups.get(key).films.push(movie)
  }
  return [...groups.values()]
    .map((group) => {
      const films = [...group.films].sort((a, b) => a.release_year - b.release_year)
      return { ...group, films, firstYear: films[0].release_year }
    })
    .sort((a, b) => {
      if (!a.actor) return 1
      if (!b.actor) return -1
      return a.firstYear - b.firstYear
    })
}

/** Finds prev/next films using the `_links` provided in the /movies list response. */
export function findNeighbors(movies, slug) {
  const current = movies?.find((m) => m.slug === slug)
  if (!current?._links) return { prev: null, next: null }
  const toMovie = (link) => {
    const neighborSlug = link?.href?.split('/').pop()
    return neighborSlug ? (movies.find((m) => m.slug === neighborSlug) ?? null) : null
  }
  return { prev: toMovie(current._links.prev), next: toMovie(current._links.next) }
}

/** Maps the `{ id, title, slug, year }` film objects used across the API to RelatedList items. */
export function filmItems(films = [], getMeta) {
  return [...films]
    .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    .map((film) => ({
      key: film.id,
      to: `/movies/${film.slug}`,
      title: film.title,
      subtitle: film.year ? String(film.year) : null,
      meta: getMeta ? getMeta(film) : null,
    }))
}
