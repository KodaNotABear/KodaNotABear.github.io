import { Link } from 'react-router-dom'
import styles from './Credits.module.css'

const CREDITS = [
  { role: 'DESIGN & DEVELOPMENT', name: 'Ethan Peterson' },
  { role: 'STUDIO', name: 'AKURO STUDIO' },
  { role: '', name: '' },
  { role: 'BUILT WITH', name: '' },
  { role: 'Framework', name: 'React 19 + Vite' },
  { role: 'Routing', name: 'React Router v7' },
  { role: 'Animation', name: 'Framer Motion' },
  { role: 'Hosting', name: 'GitHub Pages' },
  { role: 'CDN', name: 'Cloudflare' },
  { role: 'Fonts', name: 'Rajdhani · Inter · JetBrains Mono' },
  { role: '', name: '' },
  { role: 'SPECIAL THANKS', name: '' },
  { role: 'Inspiration', name: 'Every game that made me want to make games' },
  { role: 'Coffee', name: 'Too many cups to count' },
  { role: '', name: '' },
  { role: 'YOU FOUND THIS PAGE', name: '— nice detective work' },
  { role: '', name: '' },
  { role: '© 2026', name: 'AKURO STUDIO. All rights reserved.' },
]

export default function Credits() {
  return (
    <main className={styles.page}>
      <div className={styles.scanline} aria-hidden />

      <div className={styles.viewport}>
        <div className={styles.scroll}>
          <div className={styles.title}>AKURO STUDIO</div>
          <div className={styles.subtitle}>— Credits —</div>

          {CREDITS.map((c, i) =>
            c.role === '' && c.name === '' ? (
              <div key={i} className={styles.spacer} />
            ) : c.name === '' ? (
              <div key={i} className={styles.section}>{c.role}</div>
            ) : (
              <div key={i} className={styles.row}>
                <span className={styles.role}>{c.role}</span>
                <span className={styles.name}>{c.name}</span>
              </div>
            )
          )}

          <div className={styles.fin}>— FIN —</div>
        </div>
      </div>

      <Link to="/" className={styles.exit}>← Back to site</Link>
    </main>
  )
}
