/**
 * Shared list page used by Movies, Characters, Actors, Gadgets, Vehicles, Locations and Organizations.
 *
 * Each page only *describes* itself through props (what to fetch, how to search,
 * which filters/sorts exist and how to render a card). This component handles:
 *   - fetching with loading / error / retry states
 *   - live text search (debounced)
 *   - filters + sorting
 *   - client-side "Load more" (the API returns everything at once)
 *   - keeping search/filter/sort in the URL so a filtered view can be shared and
 *     the browser back button works.
 */
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import useDebounce from '../../hooks/useDebounce'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import { applyListControls } from '../../utils/listControls'
import AsyncContent from './AsyncContent'
import { SkeletonGrid } from './Skeleton'
import SectionTitle from './SectionTitle'
import SearchBar from './SearchBar'
import FilterSelect from './FilterSelect'
import LoadMoreButton from './LoadMoreButton'
import EmptyState from './EmptyState'

const PAGE_SIZE = 12

export default function ListPage({
  eyebrow,
  title,
  intro,
  fetcher,
  getKey,
  renderItem,
  getSearchText,
  searchPlaceholder,
  filters = [],
  sortOptions = [],
  tallSkeleton = false,
}) {
  useDocumentTitle(title)
  const { data, loading, error, retry } = useFetch((signal) => fetcher({ signal }), [fetcher])
  const [searchParams, setSearchParams] = useSearchParams()

  // ---- Search text: local input state, written to the URL after a short pause ----
  const urlQuery = searchParams.get('q') ?? ''
  const [input, setInput] = useState(urlQuery)
  const debouncedInput = useDebounce(input, 250)

  useEffect(() => {
    if (debouncedInput === urlQuery) return
    setSearchParams(
      (params) => {
        if (debouncedInput) params.set('q', debouncedInput)
        else params.delete('q')
        return params
      },
      { replace: true }, // typing should not create a history entry per keystroke
    )
    // Only react to the debounced text; urlQuery is read for comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput])

  // Keep the input in sync when the URL changes from outside (back button, "Clear filters").
  // Adjusting state during render is React's recommended alternative to an extra effect.
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery)
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery)
    setInput(urlQuery)
  }

  // ---- Filters and sorting come straight from the URL ----
  const filterValues = Object.fromEntries(filters.map((f) => [f.key, searchParams.get(f.key) ?? '']))
  const sortValue = searchParams.get('sort') ?? sortOptions[0]?.value ?? ''
  const activeSort = sortOptions.find((s) => s.value === sortValue) ?? sortOptions[0]

  const setParam = (key, value) => {
    setSearchParams((params) => {
      if (value) params.set(key, value)
      else params.delete(key)
      return params
    })
  }

  const clearAll = () => {
    setInput('')
    setSearchParams({})
  }

  const items = useMemo(() => data ?? [], [data])
  const filterKey = searchParams.toString()

  const visibleItems = useMemo(
    () =>
      applyListControls(items, {
        query: urlQuery,
        getSearchText,
        filters,
        filterValues,
        compare: activeSort?.compare,
      }),
    // filterKey captures every URL-driven value (query, filters, sort).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, filterKey],
  )

  // ---- "Load more": resets to the first page whenever search/filter/sort changes ----
  const [limit, setLimit] = useState({ key: filterKey, count: PAGE_SIZE })
  const visibleCount = limit.key === filterKey ? limit.count : PAGE_SIZE
  const loadMore = () => setLimit({ key: filterKey, count: visibleCount + PAGE_SIZE })

  const hasActiveControls = Boolean(urlQuery) || filters.some((f) => filterValues[f.key])

  return (
    <section className="page-container">
      <SectionTitle eyebrow={eyebrow} title={title}>
        {intro}
      </SectionTitle>

      {/* Controls: search on top, the selects share the row below and wrap as needed */}
      <div className="mb-8 space-y-4 rounded-xl border border-ink-700 bg-ink-900/70 p-4">
        <SearchBar value={input} onChange={setInput} placeholder={searchPlaceholder} label={`Search ${title}`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
          {filters.map((filter) => (
            <FilterSelect
              key={filter.key}
              id={`filter-${filter.key}`}
              label={filter.label}
              value={filterValues[filter.key]}
              onChange={(value) => setParam(filter.key, value)}
              allLabel={filter.allLabel ?? 'All'}
              options={filter.getOptions ? filter.getOptions(items) : filter.options}
            />
          ))}
          {sortOptions.length > 0 && (
            <FilterSelect
              id="sort"
              label="Sort by"
              value={activeSort?.value ?? ''}
              onChange={(value) => setParam('sort', value === sortOptions[0].value ? '' : value)}
              options={sortOptions}
            />
          )}
        </div>
      </div>

      <AsyncContent loading={loading} error={error} onRetry={retry} fallback={<SkeletonGrid tall={tallSkeleton} />}>
        {() => (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
              <p aria-live="polite">
                {visibleItems.length} {visibleItems.length === 1 ? 'result' : 'results'}
                {hasActiveControls && ` (of ${items.length})`}
              </p>
              {hasActiveControls && (
                <button type="button" onClick={clearAll} className="link-gold text-sm">
                  Clear filters
                </button>
              )}
            </div>

            {visibleItems.length === 0 ? (
              <EmptyState
                title="No matching files"
                message="Try a different search term or remove some filters."
                action={
                  <button type="button" onClick={clearAll} className="btn-secondary">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <>
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleItems.slice(0, visibleCount).map((item) => (
                    <li key={getKey(item)} className="animate-fade-up">
                      {renderItem(item)}
                    </li>
                  ))}
                </ul>
                <LoadMoreButton
                  shown={Math.min(visibleCount, visibleItems.length)}
                  total={visibleItems.length}
                  onClick={loadMore}
                />
              </>
            )}
          </>
        )}
      </AsyncContent>
    </section>
  )
}
