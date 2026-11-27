/**
 * "Mission Dossier" favourites.
 * Saved items live in React state and are mirrored to localStorage so they survive reloads.
 * Context is used here (instead of props) only because the Navbar badge and the
 * detail pages are far apart in the tree and both need the same list.
 */
import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'bond-wiki:dossier'
const FavoritesContext = createContext(null)

// localStorage can throw (private mode, blocked storage), so every access is guarded.
function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveFavorites(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage unavailable: favourites still work for this session.
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  // Each favourite is identified by its route path, e.g. "/movies/gf".
  const isFavorite = (path) => favorites.some((item) => item.path === path)

  // item: { path, type, title, subtitle }
  const toggleFavorite = (item) => {
    setFavorites((current) =>
      current.some((fav) => fav.path === item.path)
        ? current.filter((fav) => fav.path !== item.path)
        : [...current, { ...item, savedAt: Date.now() }],
    )
  }

  const removeFavorite = (path) => setFavorites((current) => current.filter((fav) => fav.path !== path))
  const clearFavorites = () => setFavorites([])

  const value = { favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside <FavoritesProvider>')
  return context
}
