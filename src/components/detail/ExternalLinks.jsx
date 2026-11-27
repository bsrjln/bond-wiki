/** Wikipedia / IMDb links when the API provides them. */
export default function ExternalLinks({ wikipedia, imdb }) {
  if (!wikipedia && !imdb) return null
  return (
    <div className="flex flex-wrap gap-3">
      {wikipedia && (
        <a href={wikipedia} target="_blank" rel="noreferrer" className="btn-secondary">
          Wikipedia ↗
        </a>
      )}
      {imdb && (
        <a href={imdb} target="_blank" rel="noreferrer" className="btn-secondary">
          IMDb ↗
        </a>
      )}
    </div>
  )
}
