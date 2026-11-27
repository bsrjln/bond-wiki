/** "Mission Dossier": the user's saved favourites (stored in localStorage). */
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import useDocumentTitle from '../hooks/useDocumentTitle'
import SectionTitle from '../components/common/SectionTitle'
import EmptyState from '../components/common/EmptyState'

export default function DossierPage() {
  useDocumentTitle('Mission Dossier')
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  // Group saved items by type (Movie, Character, …).
  const groups = favorites.reduce((acc, item) => {
    ;(acc[item.type] ??= []).push(item)
    return acc
  }, {})

  return (
    <section className="page-container">
      <SectionTitle eyebrow="Eyes only" title="Mission Dossier">
        Your personal file of saved films, characters, gadgets and more. Saved in this browser.
      </SectionTitle>

      {favorites.length === 0 ? (
        <EmptyState
          title="Your dossier is empty"
          message="Open any film, character or gadget and press “Add to dossier”."
          action={
            <Link to="/movies" className="btn-primary">
              Browse films
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-6 flex justify-end">
            <button type="button" onClick={clearFavorites} className="btn-secondary">
              Shred entire dossier
            </button>
          </div>
          <div className="space-y-10">
            {Object.entries(groups).map(([type, items]) => (
              <section key={type}>
                <h2 className="mb-4 font-display text-xl text-white">
                  {type}s <span className="font-mono text-xs text-slate-500">{items.length}</span>
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <li
                      key={item.path}
                      className="flex items-center justify-between gap-3 rounded-lg border border-ink-700 bg-ink-900 p-3"
                    >
                      <Link to={item.path} className="min-w-0 flex-1 hover:text-gold-300">
                        <span className="block truncate text-slate-100">{item.title}</span>
                        {item.subtitle && <span className="text-sm text-slate-500">{item.subtitle}</span>}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFavorite(item.path)}
                        className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-blood-500/20 hover:text-red-300"
                        aria-label={`Remove ${item.title} from dossier`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
