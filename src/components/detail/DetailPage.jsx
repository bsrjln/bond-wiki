import useFetch from '../../hooks/useFetch'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import AsyncContent from '../common/AsyncContent'

/**
 * Shared shell for the simple detail pages (actor, character, gadget, …):
 * fetches one record by id, sets the tab title and handles loading / error / 404.
 * `children` is a function that receives the loaded record.
 */
export default function DetailPage({ fetcher, id, getTitle, backTo, backLabel, children }) {
  const { data, loading, error, retry } = useFetch((signal) => fetcher(id, { signal }), [fetcher, id])
  useDocumentTitle(data ? getTitle(data) : backLabel)

  return (
    <article className="page-container">
      <AsyncContent
        loading={loading}
        error={error}
        onRetry={retry}
        backTo={backTo}
        backLabel={`Back to ${backLabel.toLowerCase()}`}
      >
        {() => children(data)}
      </AsyncContent>
    </article>
  )
}
