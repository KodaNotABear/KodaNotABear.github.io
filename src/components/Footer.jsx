import { useState } from 'react'
import { GitHubIcon, ItchIcon, DiscordIcon, EmailIcon } from './Icons'
import { copyText } from '../utils/copyText'
import styles from './Footer.module.css'

// Discord entry copies the handle since username URLs don't resolve on discord.com
const SOCIALS = [
  { label: 'GitHub',  href: 'https://github.com/KodaNotABear', icon: <GitHubIcon /> },
  { label: 'itch.io', href: 'https://kodanotabear.itch.io',    icon: <ItchIcon /> },
  { label: 'Discord', copyValue: 'kodanotabear',               icon: <DiscordIcon /> },
  { label: 'Email',   href: 'mailto:koda@akuro.studio',        icon: <EmailIcon /> },
]

const STACK = [
  'React 19', 'Vite 8', 'React Router v7',
  'Framer Motion', 'CSS Modules', 'GitHub Pages', 'Cloudflare',
]

export default function Footer() {
  const [tipVisible, setTipVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyDiscord = async (value) => {
    if (await copyText(value)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
            <path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" />
          </svg>
          AKURO STUDIO
        </p>

        <nav className={styles.socials} aria-label="Social links">
          {SOCIALS.map(({ label, href, copyValue, icon }) =>
            copyValue ? (
              <button
                key={label}
                type="button"
                className={styles.socialLink}
                onClick={() => copyDiscord(copyValue)}
                title={`Copy ${copyValue}`}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
                {copied ? 'Copied ✓' : label}
              </button>
            ) : (
              <a
                key={label}
                href={href}
                className={styles.socialLink}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span> {label}
              </a>
            )
          )}
        </nav>

        <p
          className={styles.copy}
          style={{ position: 'relative', display: 'inline-block', cursor: 'default' }}
          onMouseEnter={() => setTipVisible(true)}
          onMouseLeave={() => setTipVisible(false)}
        >
          © {new Date().getFullYear()} Ethan Peterson · AKURO STUDIO ·{' '}
          <span className={styles.builtWith}>Built with React + Vite ↑</span>
          {tipVisible && (
            <span className={styles.tooltip}>
              {STACK.map(t => <span key={t} className={styles.tooltipTag}>{t}</span>)}
            </span>
          )}
        </p>
      </div>
    </footer>
  )
}
