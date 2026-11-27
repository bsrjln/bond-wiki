import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

/**
 * Shared wrapper for the three states of every data-driven page:
 * loading -> error (with Retry) -> content.
 * Pages pass the values from useFetch and render their content as children.
 */
export default function AsyncContent({ loading, error, onRetry, fallback, backTo, backLabel, children }) {
  if (loading) return fallback ?? <Loader />
  if (error) return <ErrorMessage error={error} onRetry={onRetry} backTo={backTo} backLabel={backLabel} />
  return children()
}
