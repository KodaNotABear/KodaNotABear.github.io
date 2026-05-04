import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { GitHubIcon, ItchIcon, DiscordIcon, EmailIcon, GlobeIcon } from '../components/Icons'
import styles from './Card.module.css'

const CARD_URL = 'https://akuro.studio/card'

const LINKS = [
  {
    icon: <EmailIcon size={20} />,
    label: 'Email',
    value: 'koda@akuro.studio',
    href: 'mailto:koda@akuro.studio',
  },
  {
    icon: <GitHubIcon size={20} />,
    label: 'GitHub',
    value: 'KodaNotABear',
    href: 'https://github.com/KodaNotABear',
  },
  {
    icon: <ItchIcon size={20} />,
    label: 'itch.io',
    value: 'kodanotabear.itch.io',
    href: 'https://kodanotabear.itch.io',
  },
  {
    icon: <DiscordIcon size={20} />,
    label: 'Discord',
    value: 'kodanotabear',
    href: 'https://discord.com/users/kodanotabear',
  },
  {
    icon: <GlobeIcon size={20} />,
    label: 'Portfolio',
    value: 'akuro.studio',
    href: 'https://akuro.studio',
  },
]

export default function Card() {
  const [qrOpen, setQrOpen] = useState(false)

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ethan Peterson · AKURO STUDIO', url: CARD_URL })
      } catch { /* user cancelled */ }
    }
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
          <p className={styles.studio}>AKURO STUDIO</p>
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

        {/* Action row */}
        <div className={styles.actionRow}>
          <button className={`${styles.actionBtn} ${styles.qrBtn}`} onClick={() => setQrOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/>
              <rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
            </svg>
            QR Code
          </button>
          {navigator?.share && (
            <button className={`${styles.actionBtn} ${styles.sysShareBtn}`} onClick={shareCard} aria-label="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          )}
        </div>

        <p className={styles.footer}>akuro.studio/card</p>
      </div>

      {/* Fullscreen QR overlay */}
      {qrOpen && (
        <div className={styles.qrOverlay} onClick={() => setQrOpen(false)} role="dialog" aria-modal aria-label="QR code">
          <div className={styles.qrModal} onClick={e => e.stopPropagation()}>
            <div className={styles.qrGlow} aria-hidden />
            <p className={styles.qrTitle}>Scan to open my card</p>
            <div className={styles.qrFrame}>
              <QRCodeSVG
                value={CARD_URL}
                size={220}
                bgColor="transparent"
                fgColor="currentColor"
                className={styles.qrCode}
              />
            </div>
            <p className={styles.qrUrl}>{CARD_URL}</p>
            <button className={styles.qrClose} onClick={() => setQrOpen(false)}>✕ Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
