import { describe, expect, it } from 'vitest'
import { applyListControls, byNumber, byText, normalize, reverse } from './listControls'
import { movies } from '../test/fixtures'

const filters = [
  { key: 'production', match: (m, v) => (v === 'eon' ? m.eon_production : !m.eon_production) },
  { key: 'actor', match: (m, v) => m.bond_actor?.name === v },
]
const base = { getSearchText: (m) => m.title, filters }

describe('applyListControls', () => {
  it('returns everything when no controls are set', () => {
    expect(applyListControls(movies, base)).toHaveLength(4)
  })

  it('searches case- and accent-insensitively', () => {
    expect(applyListControls(movies, { ...base, query: 'CASINO' }).map((m) => m.slug)).toEqual(['cr67', 'cr'])
    expect(normalize('Citroën')).toBe('citroen')
  })

  it('combines search and filters', () => {
    const result = applyListControls(movies, { ...base, query: 'casino', filterValues: { production: 'eon' } })
    expect(result.map((m) => m.slug)).toEqual(['cr'])
  })

  it('ignores empty filter values', () => {
    expect(applyListControls(movies, { ...base, filterValues: { actor: '' } })).toHaveLength(4)
    expect(applyListControls(movies, { ...base, filterValues: { actor: 'Sean Connery' } })).toHaveLength(2)
  })

  it('sorts without mutating the input', () => {
    const original = [...movies]
    const sorted = applyListControls(movies, { ...base, compare: reverse(byNumber((m) => m.box_office_usd)) })
    expect(sorted[0].slug).toBe('cr')
    expect(movies).toEqual(original)
    expect(applyListControls(movies, { ...base, compare: byText((m) => m.title) })[0].title).toBe('Casino Royale')
  })
})
