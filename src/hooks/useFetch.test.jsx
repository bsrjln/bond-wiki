import { describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import useFetch from './useFetch'

describe('useFetch', () => {
  it('goes from loading to data', async () => {
    const { result } = renderHook(() => useFetch(() => Promise.resolve(['007']), []))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(['007'])
    expect(result.current.error).toBeNull()
  })

  it('exposes errors and refetches on retry', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('Failed to load data')).mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useFetch(fetcher, []))

    await waitFor(() => expect(result.current.error?.message).toBe('Failed to load data'))
    act(() => result.current.retry())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.data).toBe('ok'))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('aborts the request on unmount', () => {
    let signal
    const { unmount } = renderHook(() =>
      useFetch((s) => {
        signal = s
        return new Promise(() => {})
      }, []),
    )
    unmount()
    expect(signal.aborted).toBe(true)
  })
})
