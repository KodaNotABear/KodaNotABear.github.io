import { useEffect, useRef, useState } from 'react'
import styles from './BlackSignalGlitch.module.css'

const CORRUPT_LINES = [
  '> SYS://AXIOM-7/COMMS/RELAY_04',
  '> SIGNAL ORIGIN: [REDACTED]',
  '> TIMESTAMP: ████████████',
  '> CONTENT: [CORRUPTED — 94.7%]',
  '> ...do not... look for us...',
  '> MESSAGE ENDS',
]

export default function BlackSignalGlitch() {
  const [visible, setVisible] = useState(false)
  const seqRef = useRef([])

  // Trigger: type S-I-G-N-A-L  (or custom eggTrigger event for mobile)
  useEffect(() => {
    const SEQ = 'SIGNAL'
    const trigger = () => {
      setVisible(true)
      seqRef.current = []
      setTimeout(() => setVisible(false), 5000)
    }
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      seqRef.current.push(e.key.toUpperCase())
      if (seqRef.current.length > SEQ.length) seqRef.current.shift()
      if (seqRef.current.join('') === SEQ) trigger()
    }
    const onEgg = (e) => { if (e.detail === SEQ) trigger() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('eggTrigger', onEgg)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('eggTrigger', onEgg)
    }
  }, [])

  // Esc early dismiss
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => { if (e.key === 'Escape') setVisible(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  if (!visible) return null

  return (
    <div className={styles.overlay} onClick={() => setVisible(false)}>
      <div className={styles.content}>
        <p className={styles.pre}>INCOMING TRANSMISSION</p>
        <p className={styles.source}>SRC: UNKNOWN — DIST: 4.3 AU</p>
        <div className={styles.divider} />
        {CORRUPT_LINES.map((line, i) => (
          <p key={i} className={styles.line} style={{ animationDelay: `${i * 0.12 + 0.3}s` }}>
            {line}
          </p>
        ))}
        <div className={styles.divider} />
        <p className={styles.footer}>BLACK SIGNAL — coming soon</p>
      </div>
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
    </div>
  )
}
