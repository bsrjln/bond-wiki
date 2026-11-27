import { describe, expect, it } from 'vitest'
import { filmItems, findNeighbors, groupByBondActor } from './movies'
import { movies } from '../test/fixtures'

describe('movie helpers', () => {
  it('groups films by Bond actor in debut order, unofficial last', () => {
    const groups = groupByBondActor(movies)
    expect(groups.map((g) => g.actor?.name ?? null)).toEqual(['Sean Connery', 'Daniel Craig', null])
    expect(groups[0].films.map((f) => f.slug)).toEqual(['dn', 'gf'])
  })

  it('finds previous and next films from _links', () => {
    expect(findNeighbors(movies, 'gf')).toMatchObject({ prev: { slug: 'dn' }, next: { slug: 'cr67' } })
    expect(findNeighbors(movies, 'dn').prev).toBeNull()
    expect(findNeighbors(movies, 'cr').next).toBeNull()
    expect(findNeighbors(null, 'gf')).toEqual({ prev: null, next: null })
  })

  it('maps films to related-list items sorted by year', () => {
    const items = filmItems([
      { id: 2, title: 'B', slug: 'b', year: 1990 },
      { id: 1, title: 'A', slug: 'a', year: 1970 },
    ])
    expect(items.map((i) => i.to)).toEqual(['/movies/a', '/movies/b'])
  })
})
