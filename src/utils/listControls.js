/**
 * Pure search / filter / sort logic shared by every list page.
 * The list pages only describe *what* can be searched, filtered and sorted;
 * this function does the actual work. No React here, so it is unit tested directly.
 */

/** Lower-cases and strips accents so "citroen" matches "Citroën". */
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * @param {Array} items           raw items from the API
 * @param {Object} config
 * @param {string} config.query          text typed by the user
 * @param {Function} config.getSearchText item -> string that the query is matched against
 * @param {Array} config.filters         [{ key, match(item, value) }]
 * @param {Object} config.filterValues   { [key]: selectedValue } ('' means "all")
 * @param {Function} [config.compare]    sort comparator, optional
 */
export function applyListControls(items, { query = '', getSearchText, filters = [], filterValues = {}, compare }) {
  const needle = normalize(query)

  const result = items.filter((item) => {
    if (needle && !normalize(getSearchText(item)).includes(needle)) return false
    return filters.every((filter) => {
      const value = filterValues[filter.key]
      return !value || filter.match(item, value)
    })
  })

  // Copy before sorting so we never mutate the cached API array.
  return compare ? [...result].sort(compare) : result
}

// Reusable comparators
export const byText = (getText) => (a, b) => String(getText(a) ?? '').localeCompare(String(getText(b) ?? ''))
export const byNumber = (getNumber) => (a, b) => (Number(getNumber(a)) || 0) - (Number(getNumber(b)) || 0)
export const reverse = (compare) => (a, b) => compare(b, a)
