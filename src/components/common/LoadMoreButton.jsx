/** "Load more" button with a "showing X of Y" counter. Hidden when everything is visible. */
export default function LoadMoreButton({ shown, total, onClick }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="font-mono text-xs text-slate-500">
        Showing {shown} of {total}
      </p>
      {shown < total && (
        <button type="button" onClick={onClick} className="btn-secondary">
          Load more
        </button>
      )}
    </div>
  )
}
