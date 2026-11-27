/**
 * Optional OMDb service — only used to fetch movie posters.
 * The Bond API has no images, so we look the poster up on OMDb:
 *   1. by the IMDb id from the Bond API, and check that OMDb returns the same film
 *      (the Bond API has at least one wrong IMDb id, e.g. You Only Live Twice);
 *   2. otherwise by title + year (some films, e.g. Casino Royale 1967, have no IMDb id).
 * If there is no API key, or anything goes wrong, we return null and
 * the UI shows a themed placeholder instead. This must never crash the app.
 */
import { extractImdbId } from '../utils/format'
import { normalize } from '../utils/listControls'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'
const posterCache = new Map() // "title|year" -> Promise<string | null>

export const hasOmdbKey = Boolean(API_KEY)

async function requestOmdb(params) {
  const query = new URLSearchParams({ ...params, apikey: API_KEY })
  const response = await fetch(`${BASE_URL}?${query}`)
  if (!response.ok) return null
  const data = await response.json()
  return data.Response === 'True' ? data : null
}

const posterOf = (data) => (data?.Poster && data.Poster !== 'N/A' ? data.Poster : null)

async function findPoster(imdbUrl, title, year) {
  const imdbId = extractImdbId(imdbUrl)

  // 1) Look up by IMDb id, but only trust it if the title matches.
  if (imdbId) {
    const byId = await requestOmdb({ i: imdbId })
    if (byId && (!title || normalize(byId.Title) === normalize(title))) return posterOf(byId)
  }

  // 2) Fallback: search by title (and year, to tell the 1967 and 2006 Casino Royale apart).
  if (!title) return null
  const byTitle = await requestOmdb({ t: title, ...(year ? { y: String(year) } : {}), type: 'movie' })
  return posterOf(byTitle)
}

export function getPoster({ imdb, title, year }) {
  if (!API_KEY || (!imdb && !title)) return Promise.resolve(null)

  const key = `${imdb ?? ''}|${title ?? ''}|${year ?? ''}`
  if (!posterCache.has(key)) {
    posterCache.set(
      key,
      findPoster(imdb, title, year).catch(() => null), // network/JSON errors -> placeholder
    )
  }
  return posterCache.get(key)
}
