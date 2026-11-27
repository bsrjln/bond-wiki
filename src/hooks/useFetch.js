import { useEffect, useState } from 'react'

/**
 * Generic data-fetching hook used by every page.
 *
 *   const { data, loading, error, retry } = useFetch((signal) => getMovie(slug, { signal }), [slug])
 *
 * - `fetcher` receives an AbortSignal; the request is aborted when the component
 *   unmounts or the dependencies change, so we never set state on an unmounted component.
 * - `retry()` simply runs the effect again (used by the "Retry" button).
 * - `loading` is derived: we are loading whenever the stored result belongs to
 *   different dependencies than the current ones (e.g. the slug in the URL changed).
 */
export default function useFetch(fetcher, deps = []) {
  const [attempt, setAttempt] = useState(0)
  const requestDeps = [...deps, attempt]
  const [result, setResult] = useState({ deps: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ deps: requestDeps, data, error: null })
      })
      .catch((error) => {
        // An aborted request is expected (navigation/unmount), not a real error.
        if (controller.signal.aborted || error.name === 'AbortError') return
        setResult({ deps: requestDeps, data: null, error })
      })

    return () => controller.abort()
    // The caller controls when to refetch through `deps` (like useEffect itself).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, requestDeps)

  const isCurrent = sameDeps(result.deps, requestDeps)
  const retry = () => setAttempt((n) => n + 1)

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
    retry,
  }
}

function sameDeps(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((value, i) => Object.is(value, b[i]))
}
