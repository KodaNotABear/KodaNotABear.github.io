import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  const closeMenu = () => setOpen(false)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <NavLink to="/" className={styles.logo} onClick={closeMenu}>
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
  )
}
