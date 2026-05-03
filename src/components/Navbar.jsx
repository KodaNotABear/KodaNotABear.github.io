import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useAchievement, AchievementToast } from './AchievementToast'
import AmbientSound from './AmbientSound'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { label: 'Home',      path: '/' },
  { label: 'About',     path: '/about' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Resume',    path: '/resume' },
  { label: 'Devlog',    path: '/devlog' },
  { label: 'Contact',   path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const logoClicks = useRef(0)
  const { toast, unlock } = useAchievement()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)

  const handleLogoClick = () => {
    closeMenu()
    logoClicks.current += 1
    if (logoClicks.current === 5) {
      unlock('"Curious"', 'You clicked the logo 5 times.')
    } else if (logoClicks.current === 10) {
      unlock('"Persistent"', 'Okay, you really like this logo.')
      logoClicks.current = 0
    }
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <NavLink to="/" className={styles.logo} onClick={handleLogoClick}>
          <span className={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" />
            </svg>
          </span>
          THUNDERBYTE
        </NavLink>

        <ul className={`${styles.links} ${open ? styles.open : ''}`}>
          {NAV_ITEMS.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <AmbientSound />

        <button
          className={styles.menuBtn}
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className={styles.bar} style={open ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
          <span className={styles.bar} style={open ? { opacity: 0 } : {}} />
          <span className={styles.bar} style={open ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
        </button>
      </nav>
      <AchievementToast toast={toast} />
    </>
  )
}
