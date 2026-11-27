import { useEffect, useState } from 'react'
import { getPoster } from '../services/omdb'

/** Returns a poster URL for a film, or null (no key / not found / error). */
export default function usePoster(imdb, title, year) {
  const key = `${imdb ?? ''}|${title ?? ''}|${year ?? ''}`
  const [result, setResult] = useState({ key, poster: null })

  useEffect(() => {
    let active = true
    getPoster({ imdb, title, year }).then((poster) => {
      if (active) setResult({ key, poster })
    })
    return () => {
      active = false
    }
  }, [key, imdb, title, year])

  // Ignore a stale result that belongs to a previous film.
  return result.key === key ? result.poster : null
}
