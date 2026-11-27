import { useState } from 'react'
import usePoster from '../../hooks/usePoster'

/**
 * Movie poster from OMDb, with a themed "007" placeholder when there is
 * no API key, no IMDb id, no poster or the image fails to load.
 */
export default function Poster({ imdb, title, year, className = '' }) {
  const poster = usePoster(imdb, title, year)
  const [failedSrc, setFailedSrc] = useState(null)

  if (poster && failedSrc !== poster) {
    return (
      <img
        src={poster}
        alt={`Poster for ${title}`}
        loading="lazy"
        onError={() => setFailedSrc(poster)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${title} placeholder poster`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ink-700 via-ink-900 to-ink-950 p-4 text-center ${className}`}
    >
      {/* Concentric rings echo the gun-barrel motif */}
      <span className="absolute aspect-square w-[140%] rounded-full border border-gold-500/10" />
      <span className="absolute aspect-square w-full rounded-full border border-gold-500/10" />
      <span className="absolute aspect-square w-[60%] rounded-full border border-gold-500/15" />
      <span className="relative font-display text-4xl font-extrabold text-gold-500">007</span>
      <span className="relative mt-2 line-clamp-2 font-display text-sm text-slate-200">{title}</span>
      {year && <span className="relative mt-1 font-mono text-[10px] text-slate-500">{year}</span>}
      <span className="absolute bottom-0 h-1 w-full bg-blood-500/70" />
    </div>
  )
}
