import { Link } from 'react-router-dom'

/**
 * Error box with a Retry button.
 * A 404 from the API gets a friendlier "file not found" message and a way back
 * instead of a retry, because retrying a missing record will not help.
 */
export default function ErrorMessage({ error, onRetry, backTo = '/', backLabel = 'Back to HQ' }) {
  const notFound = error?.status === 404

  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-lg rounded-xl border border-blood-500/40 bg-blood-600/10 p-8 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-blood-500">
        {notFound ? 'File not found' : 'Transmission failed'}
      </p>
      <h2 className="mt-3 font-display text-2xl text-white">
        {notFound ? 'This dossier does not exist' : 'Failed to load data'}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{error?.message || 'Something went wrong.'}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {!notFound && onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            Retry
          </button>
        )}
        <Link to={backTo} className="btn-secondary">
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
