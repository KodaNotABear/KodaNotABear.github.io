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
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [nfcState, setNfcState] = useState('idle') // 'idle' | 'writing' | 'done' | 'error' | 'unsupported'

  function copyEmail() {
    navigator.clipboard.writeText('koda@akuro.studio').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function shareViaNFC() {
    if (!('NDEFReader' in window)) {
      setNfcState('unsupported')
      setShowQR(true)
      setTimeout(() => setNfcState('idle'), 3000)
      return
    }
    try {
      setNfcState('writing')
      const ndef = new NDEFReader()
      await ndef.write({ records: [{ recordType: 'url', data: CARD_URL }] })
      setNfcState('done')
      setTimeout(() => setNfcState('idle'), 3000)
    } catch {
      setNfcState('error')
      setTimeout(() => setNfcState('idle'), 3000)
    }
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ethan Peterson · AKURO STUDIO', url: CARD_URL })
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(CARD_URL)
    }
  }

  const nfcLabel = {
    idle:        '⬡ Write to NFC tag',
    writing:     'Hold NFC tag to your phone…',
    done:        '✓ NFC tag programmed!',
    error:       '✕ No tag detected — try again',
    unsupported: 'NFC not supported — use QR',
  }[nfcState]

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

        {/* Copy email */}
        <button className={styles.copyBtn} onClick={copyEmail}>
          {copied ? '✓ Copied!' : '⎘ Copy email address'}
        </button>

        <div className={styles.divider} />

        {/* Share row */}
        <div className={styles.shareRow}>
          <button
            className={`${styles.shareBtn} ${styles.nfcBtn} ${nfcState !== 'idle' ? styles[nfcState] : ''}`}
            onClick={shareViaNFC}
            disabled={nfcState === 'writing'}
          >
            {nfcState === 'writing' && <span className={styles.nfcRing} aria-hidden />}
            {nfcLabel}
          </button>
          <button
            className={`${styles.shareBtn} ${styles.qrToggle} ${showQR ? styles.qrActive : ''}`}
            onClick={() => setShowQR(q => !q)}
            aria-label={showQR ? 'Hide QR code' : 'Show QR code'}
          >
            QR
          </button>
          <button
            className={`${styles.shareBtn} ${styles.sysShare}`}
            onClick={shareCard}
            aria-label="Share card"
          >
            ↑
          </button>
        </div>

        {/* QR code panel */}
        {showQR && (
          <div className={styles.qrPanel}>
            <QRCodeSVG
              value={CARD_URL}
              size={160}
              bgColor="transparent"
              fgColor="currentColor"
              className={styles.qrCode}
            />
            <p className={styles.qrHint}>Scan with any phone camera</p>
          </div>
        )}

        <p className={styles.footer}>akuro.studio/card</p>
      </div>
    </div>
  )
}
