/**
 * Small pure helpers for formatting API values for display.
 * Kept free of React so they are easy to unit test.
 */

/** "124900000" -> "$124.9M", "1108561013" -> "$1.11B". Returns "—" for missing values. */
export function formatMoney(value) {
  const amount = Number(value)
  if (!value || Number.isNaN(amount)) return '—'
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
  return `$${amount.toLocaleString('en-US')}`
}

/** ISO date -> "25 Aug 1930". UTC is used so the day does not shift with the viewer's timezone. */
export function formatDate(iso) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** 1964 -> "1960s" */
export function getDecade(year) {
  const y = Number(year)
  if (!y) return null
  return `${Math.floor(y / 10) * 10}s`
}

/** "https://www.imdb.com/title/tt0058150/" -> "tt0058150" */
export function extractImdbId(url) {
  if (!url) return null
  const match = String(url).match(/tt\d+/)
  return match ? match[0] : null
}

/** "villain" -> "Villain" */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** pluralize(1, 'film') -> "1 film", pluralize(3, 'film') -> "3 films" */
export function pluralize(count, word) {
  const n = Number(count) || 0
  return `${n} ${n === 1 ? word : `${word}s`}`
}

/** Returns "1962–1967" style range from a list of years. */
export function yearRange(years) {
  const valid = years.filter(Boolean).map(Number)
  if (valid.length === 0) return null
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  return min === max ? String(min) : `${min}–${max}`
}

/** Unique, sorted list of values (ignores null/empty). Used to build filter options from data. */
export function uniqueSorted(values) {
  return [...new Set(values.filter((v) => v !== null && v !== undefined && v !== ''))].sort((a, b) =>
    String(a).localeCompare(String(b)),
  )
}
