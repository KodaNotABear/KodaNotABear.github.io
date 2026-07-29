import { useState } from 'react'
import { GitHubIcon, LinkedInIcon, DiscordIcon, EmailIcon } from './Icons'
import { copyText } from '../utils/copyText'
import styles from './Footer.module.css'

// Discord entry copies the handle since username URLs don't resolve on discord.com
const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/KodaNotABear',                       icon: <GitHubIcon /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ethan-peterson-sweng/',     icon: <LinkedInIcon /> },
  { label: 'Discord',  copyValue: 'kodanotabear',                                     icon: <DiscordIcon /> },
  { label: 'Email',    href: 'mailto:koda@akuro.studio',                              icon: <EmailIcon /> },
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
      <div className={`container ${styles.sayBlock}`}>
        <p className={styles.sayLabel}>Have a role, a mod idea, or feedback?</p>
        <a className={styles.sayBig} href="mailto:koda@akuro.studio">
          Say hi<span className={styles.sayDot}>.</span>
        </a>
        <p className={styles.saySub}>
          Open to a first full-time role in games. Replies usually land within 24 hours.
        </p>
      </div>

      <div className={`container ${styles.inner}`}>
        <p className={styles.brand}>
          <svg width="13" height="13" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
            <g transform="translate(16 16)">
              <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4" />
              <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4" transform="rotate(60)" />
              <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4" transform="rotate(120)" />
            </g>
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

        <p className={styles.hint}>
          Press <kbd className={styles.kbd}>?</kbd> for shortcuts. The terminal on the home page knows more.
        </p>

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
