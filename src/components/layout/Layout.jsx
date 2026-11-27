import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

/** Page shell shared by every route: navbar, animated page content, footer. */
export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold-500 focus:px-3 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      {/* key={pathname} re-mounts the wrapper so each page fades in */}
      <main id="main" key={pathname} className="flex-1 animate-fade-up">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
