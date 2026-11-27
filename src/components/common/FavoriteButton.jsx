import { useFavorites } from '../../context/FavoritesContext'

/** Adds / removes the current item from the Mission Dossier. */
export default function FavoriteButton({ item }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const saved = isFavorite(item.path)

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(item)}
      aria-pressed={saved}
      className={saved ? 'btn-primary' : 'btn-secondary'}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {saved ? 'In dossier' : 'Add to dossier'}
    </button>
  )
}
