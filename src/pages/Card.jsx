import { useState } from 'react'
import styles from './Card.module.css'

const LINKS = [
  {
    icon: '✉',
    label: 'Email',
    value: 'koda@thunderbyte.studio',
    href: 'mailto:koda@thunderbyte.studio',
  },
  {
    icon: '⌥',
    label: 'GitHub',
    value: 'KodaNotABear',
    href: 'https://github.com/KodaNotABear',
  },
  {
    icon: '🎮',
    label: 'itch.io',
    value: 'kodanotabear.itch.io',
    href: 'https://kodanotabear.itch.io',
  },
  {
    icon: '💬',
    label: 'Discord',
    value: 'kodanotabear',
    href: 'https://discord.com/users/kodanotabear',
  },
  {
    icon: '🌐',
    label: 'Portfolio',
    value: 'thunderbyte.studio',
    href: 'https://thunderbyte.studio',
  },
]

export default function Card() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText('koda@thunderbyte.studio').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z" />
            </svg>
          </div>
          <p className={styles.studio}>THUNDERBYTE STUDIO</p>
        </div>

        {/* Identity */}
        <div className={styles.identity}>
          <h1 className={styles.name}>Ethan Peterson</h1>
          <p className={styles.role}>Game Programmer &amp; Designer</p>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Open to Work · CS Graduate May 2026
          </div>
        </div>

        <div className={styles.divider} />

        {/* Links */}
        <nav className={styles.links}>
          {LINKS.map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className={styles.link}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className={styles.linkIcon}>{icon}</span>
              <span className={styles.linkContent}>
                <span className={styles.linkLabel}>{label}</span>
                <span className={styles.linkValue}>{value}</span>
              </span>
              <span className={styles.linkArrow}>→</span>
            </a>
          ))}
        </nav>

        <div className={styles.divider} />

        {/* Copy email */}
        <button className={styles.copyBtn} onClick={copyEmail}>
          {copied ? '✓ Copied!' : '⎘ Copy email address'}
        </button>

        <p className={styles.footer}>thunderbyte.studio/card</p>
      </div>
    </div>
  )
}
