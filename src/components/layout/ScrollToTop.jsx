import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to the top when the page (path) changes, but not when only the ?query changes. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
