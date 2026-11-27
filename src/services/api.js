/**
 * Bond API service.
 * All communication with The James Bond Movie Database API lives here,
 * so pages and components never build URLs or call fetch() themselves.
 * Docs: https://bond.deanebarker.net/
 */

// The base URL can be overridden with an env variable (handy for testing the error state).
const BASE_URL = import.meta.env.VITE_BOND_API_URL || 'https://bond.deanebarker.net'

// Simple in-memory cache: the same endpoint is fetched only once per session.
// We store the promise (not the result) so parallel requests share one network call.
const cache = new Map()

/** Error type that keeps the HTTP status so the UI can tell "not found" from other failures. */
export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Low-level helper used by every endpoint function below.
 * Throws an ApiError with a readable message when the request fails.
 */
export async function request(path, { signal } = {}) {
  if (!cache.has(path)) {
    const promise = fetchJson(path).catch((error) => {
      // Never cache failures, so "Retry" really performs a new request.
      cache.delete(path)
      throw error
    })
    cache.set(path, promise)
  }

  const data = await cache.get(path)
  // The shared promise cannot be cancelled, but the caller can stop waiting for it.
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  return data
}

async function fetchJson(path) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch {
    throw new ApiError('Network error — could not reach the Bond API. Check your connection.')
  }

  if (response.status === 404) {
    throw new ApiError('This file could not be found in the archives.', 404)
  }
  if (!response.ok) {
    throw new ApiError(`The Bond API responded with an error (${response.status}).`, response.status)
  }

  try {
    return await response.json()
  } catch {
    throw new ApiError('The Bond API returned data in an unexpected format.')
  }
}

/** Only used by tests to start from a clean cache. */
export function clearCache() {
  cache.clear()
}

// ---- Movies (accessed by slug, e.g. "gf" for Goldfinger) ----
export const getMovies = (options) => request('/movies', options)
export const getMovie = (slug, options) => request(`/movies/${encodeURIComponent(slug)}`, options)

// ---- Other entities (accessed by numeric id) ----
export const getActors = (options) => request('/actors', options)
export const getActor = (id, options) => request(`/actors/${encodeURIComponent(id)}`, options)

export const getCharacters = (options) => request('/characters', options)
export const getCharacter = (id, options) => request(`/characters/${encodeURIComponent(id)}`, options)

export const getLocations = (options) => request('/locations', options)
export const getLocation = (id, options) => request(`/locations/${encodeURIComponent(id)}`, options)

export const getOrganizations = (options) => request('/organizations', options)
export const getOrganization = (id, options) => request(`/organizations/${encodeURIComponent(id)}`, options)

export const getVehicles = (options) => request('/vehicles', options)
export const getVehicle = (id, options) => request(`/vehicles/${encodeURIComponent(id)}`, options)

export const getGadgets = (options) => request('/gadgets', options)
export const getGadget = (id, options) => request(`/gadgets/${encodeURIComponent(id)}`, options)
