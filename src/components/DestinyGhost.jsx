import { useEffect, useRef, useState } from 'react'
import styles from './DestinyGhost.module.css'

const QUIPS = [
  'Scanning... anomalous talent detected.',
  "That's classified, Guardian.",
  "I've seen worse codebases. Actually — no, I haven't.",
  'You should probably hire this Guardian.',
  'My Light grows dim... but my admiration does not.',
  'Error 503: compliment overflow. Rebooting.',
  'Threat assessment: dangerously hireable.',
  "I've checked every timeline. This one ends with a job offer.",
  'Paracausal ability detected: shipping clean code.',
  'The Traveler is silent on the matter. I am not.',
]

function GhostSVG({ lit }) {
  const c = lit ? '#00d4ff' : 'rgba(0,212,255,0.3)'
  return (
    <svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">
      {/* Shell petals */}
      <polygon points="40,6 52,22 40,18 28,22"    fill="#0d1320" stroke={c} strokeWidth="1.2" />
      <polygon points="74,37 58,28 62,40 58,52"    fill="#0d1320" stroke={c} strokeWidth="1.2" />
      <polygon points="40,74 52,58 40,62 28,58"    fill="#0d1320" stroke={c} strokeWidth="1.2" />
      <polygon points="6,37 22,28 18,40 22,52"     fill="#0d1320" stroke={c} strokeWidth="1.2" />
      <polygon points="66,16 54,24 62,32 70,26"    fill="#0d1320" stroke={c} strokeWidth="1" />
      <polygon points="66,64 70,54 62,48 54,56"    fill="#0d1320" stroke={c} strokeWidth="1" />
      <polygon points="14,16 10,26 18,32 26,24"    fill="#0d1320" stroke={c} strokeWidth="1" />
      <polygon points="14,64 26,56 18,48 10,54"    fill="#0d1320" stroke={c} strokeWidth="1" />
      {/* Core ring */}
      <circle cx="40" cy="40" r="17" fill="#080c14" stroke={c} strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="40" cy="40" r="8" fill={lit ? 'rgba(0,212,255,0.15)' : 'transparent'} />
      <ellipse cx="40" cy="40" rx="4" ry="6" fill={c} opacity={lit ? 1 : 0.4} />
      {lit && <ellipse cx="40" cy="40" rx="4" ry="6" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="3" />}
      {lit && <circle cx="40" cy="40" r="17" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="4" />}
    </svg>
  )
}

export default function DestinyGhost() {
  const [visible, setVisible] = useState(false)
  const [quipIdx, setQuipIdx] = useState(0)
  const [lit, setLit] = useState(true)
  const seqRef = useRef([])

  // Trigger: type G-H-O-S-T
  useEffect(() => {
    const SEQ = 'GHOST'
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      seqRef.current.push(e.key.toUpperCase())
      if (seqRef.current.length > SEQ.length) seqRef.current.shift()
      if (seqRef.current.join('') === SEQ) {
        setVisible(true)
        setQuipIdx(0)
        setLit(true)
        seqRef.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Esc to dismiss
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => { if (e.key === 'Escape') setVisible(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  // Eye blink
  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => {
      setLit(l => !l)
      setTimeout(() => setLit(true), 120)
    }, 4000)
    return () => clearInterval(id)
  }, [visible])

  function handleClick() {
    setQuipIdx(i => (i + 1) % QUIPS.length)
    setLit(false)
    setTimeout(() => setLit(true), 80)
  }

  if (!visible) return null

  return (
    <div className={styles.container}>
      <div className={styles.ghost} onClick={handleClick} title="Click me, Guardian">
        <GhostSVG lit={lit} />
        <div className={styles.bubble}>
          <p>{QUIPS[quipIdx]}</p>
          <span className={styles.counter}>{quipIdx + 1}/{QUIPS.length}</span>
        </div>
      </div>
      <button className={styles.dismiss} onClick={() => setVisible(false)} aria-label="Dismiss Ghost">✕</button>
    </div>
  )
}
