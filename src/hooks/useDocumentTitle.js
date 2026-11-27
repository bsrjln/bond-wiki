import { useEffect } from 'react'

/** Updates the browser tab title, e.g. "Goldfinger · 007 Wiki". */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · 007 Wiki` : '007 Wiki'
  }, [title])
}
