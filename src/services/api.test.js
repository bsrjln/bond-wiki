import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, clearCache, getMovie, getMovies } from './api'

afterEach(() => {
  vi.restoreAllMocks()
  clearCache()
})

describe('api service', () => {
  it('caches identical requests', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify([{ slug: 'dn' }])))
    await getMovies()
    await getMovies()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('throws an ApiError with status 404 for missing records', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }))
    await expect(getMovie('nope')).rejects.toMatchObject({ name: 'ApiError', status: 404 })
  })

  it('does not cache failures, so retry works', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce(new Response('[]'))
    await expect(getMovies()).rejects.toBeInstanceOf(ApiError)
    await expect(getMovies()).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
