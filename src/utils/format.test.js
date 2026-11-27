import { describe, expect, it } from 'vitest'
import {
  capitalize,
  extractImdbId,
  formatDate,
  formatMoney,
  getDecade,
  pluralize,
  uniqueSorted,
  yearRange,
} from './format'

describe('format helpers', () => {
  it('formats box office strings', () => {
    expect(formatMoney('124900000')).toBe('$124.9M')
    expect(formatMoney('1108561013')).toBe('$1.11B')
    expect(formatMoney(null)).toBe('—')
    expect(formatMoney('abc')).toBe('—')
  })

  it('formats ISO dates in UTC', () => {
    expect(formatDate('1930-08-25T05:00:00.000Z')).toBe('25 Aug 1930')
    expect(formatDate(null)).toBeNull()
  })

  it('computes decades', () => {
    expect(getDecade(1964)).toBe('1960s')
    expect(getDecade(2021)).toBe('2020s')
  })

  it('extracts IMDb ids', () => {
    expect(extractImdbId('https://www.imdb.com/title/tt0058150/')).toBe('tt0058150')
    expect(extractImdbId(null)).toBeNull()
  })

  it('handles small text helpers', () => {
    expect(capitalize('villain')).toBe('Villain')
    expect(pluralize(1, 'film')).toBe('1 film')
    expect(pluralize('3', 'film')).toBe('3 films')
    expect(yearRange([1967, 1962, 1965])).toBe('1962–1967')
    expect(yearRange([2006])).toBe('2006')
    expect(uniqueSorted(['b', null, 'a', 'b', ''])).toEqual(['a', 'b'])
  })
})
