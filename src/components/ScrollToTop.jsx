import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// SPAs keep the window scroll offset across route changes because no real
// page load happens. Two behaviors users expect:
//   - clicking a link starts the new page at the top
//   - back/forward returns to where they were on that page
// The browser's native restoration can't do the second here: it fires before
// React mounts the destination page, gets clamped by the old page's height,
// and gives up. So positions are tracked per history entry and restored
// manually once the page is tall enough.
const savedPositions = new Map()

export default function ScrollToTop() {
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Remember where the user is on the current history entry. Layout effect,
  // not passive: the listener swap must happen before the browser clamps the
  // scroll offset against the incoming (possibly shorter) page and fires a
  // scroll event, or the clamped value overwrites the leaving page's position.
  useLayoutEffect(() => {
    const key = location.key
    const onScroll = () => savedPositions.set(key, window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.key])

  useEffect(() => {
    if (navType === 'POP') {
      const target = savedPositions.get(location.key) ?? 0
      let tries = 0
      const attempt = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (max >= target || tries > 60) {
          window.scrollTo({ top: Math.min(target, Math.max(max, 0)), behavior: 'instant' })
        } else {
          tries += 1
          requestAnimationFrame(attempt)
        }
      }
      attempt()
    } else {
      // 'instant' beats the global scroll-behavior: smooth; a smooth scroll
      // gets cancelled when the shorter destination page mounts and the
      // browser clamps the offset mid-animation.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.key, navType])

  return null
}
