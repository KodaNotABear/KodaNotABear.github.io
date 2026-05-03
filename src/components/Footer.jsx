import styles from './Footer.module.css'

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/KodaNotABear', icon: '⌥' },
  { label: 'itch.io',  href: 'https://kodanotabear.itch.io',     icon: '🎮' },
  { label: 'Discord',  href: 'https://discord.com/users/kodanotabear', icon: '💬' },
  { label: 'Email',    href: 'mailto:koda@thunderbyte.studio',          icon: '✉' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
            <path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" />
          </svg>
          THUNDERBYTE STUDIO
        </p>

        <nav className={styles.socials} aria-label="Social links">
          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              className={styles.socialLink}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span>{icon}</span> {label}
            </a>
          ))}
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} Ethan Peterson · Thunderbyte Studio · Built with React + Vite
        </p>
      </div>
    </footer>
  )
}
