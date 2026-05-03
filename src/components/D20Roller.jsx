import { useEffect, useRef, useState } from 'react'
import styles from './D20Roller.module.css'

const RESULTS = [
  null, // index 0 unused
  { label: 'CRITICAL FAIL',     msg: 'Touch grass. Then apply anyway.',              color: '#ef4444' }, // 1
  { label: '2',  msg: 'The dice mock you. Your resolve does not.',      color: '#9ca3af' },
  { label: '3',  msg: 'A grim roll. Not fatal. Embarrassing, though.',  color: '#9ca3af' },
  { label: '4',  msg: 'Rough. The dungeon master is unimpressed.',      color: '#9ca3af' },
  { label: '5',  msg: 'Below average. The RNG gods frown.',             color: '#9ca3af' },
  { label: '6',  msg: 'A feeble six. You survive, narrowly.',           color: '#9ca3af' },
  { label: '7',  msg: 'Adequate. Mediocrity is a choice.',              color: '#6b7280' },
  { label: '8',  msg: 'Getting there. Keep rolling.',                   color: '#6b7280' },
  { label: '9',  msg: 'Nearly decent. Fortune teeters.',                color: '#6b7280' },
  { label: '10', msg: 'A middle path. Neither doomed nor favored.',     color: '#9ca3af' },
  { label: '11', msg: 'Modest. But modest gets things done.',           color: '#9ca3af' },
  { label: '12', msg: 'Competent. The dice acknowledge your effort.',   color: '#00d4ff' },
  { label: '13', msg: 'Lucky 13? Fate says: sure, why not.',            color: '#00d4ff' },
  { label: '14', msg: 'Decent. Fortune shows cautious interest.',       color: '#00d4ff' },
  { label: '15', msg: 'A strong roll. The party approves.',             color: '#00d4ff' },
  { label: '16', msg: 'Well played. Destiny is taking notes.',          color: '#22d3a0' },
  { label: '17', msg: 'Impressive. The dungeon master nods.',           color: '#22d3a0' },
  { label: '18', msg: 'Exceptional. Few roll this high.',               color: '#22d3a0' },
  { label: '19', msg: 'Near perfect. One pip shy of legend.',           color: '#22d3a0' },
  { label: 'NATURAL 20',        msg: 'CRITICAL HIT — hire me. Immediately. The dice have spoken.', color: '#fbbf24' }, // 20
]

export default function D20Roller() {
  const [open, setOpen]     = useState(false)
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null)
  const seqRef = useRef([])

  // Trigger: type R-O-L-L anywhere  (or custom eggTrigger event for mobile)
  useEffect(() => {
    const SEQ = 'ROLL'
    const trigger = () => { setOpen(true); setResult(null); seqRef.current = [] }
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

  // Escape to close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function roll() {
    if (rolling) return
    setRolling(true); setResult(null)
    setTimeout(() => {
      const n = Math.floor(Math.random() * 20) + 1
      setResult({ ...RESULTS[n], n })
      setRolling(false)
    }, 800)
  }

  if (!open) return null

  const accentColor = result?.color ?? 'rgba(0,212,255,0.6)'

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
        <p className={styles.eyebrow}>Roll for employment?</p>

        <div className={`${styles.dieWrap} ${rolling ? styles.rolling : ''} ${result?.n === 20 ? styles.crit : ''}`} onClick={roll}>
          <svg viewBox="0 0 100 100" width="150" height="150" overflow="visible">
            {/* Outer hex */}
            <polygon
              points="50,4 93,27 93,73 50,96 7,73 7,27"
              fill="rgba(10,11,15,0.9)"
              stroke={accentColor}
              strokeWidth="1.5"
            />
            {/* Inner face lines */}
            <line x1="50" y1="4"  x2="50" y2="96" stroke={accentColor} strokeWidth="0.6" opacity="0.35" />
            <line x1="7"  y1="27" x2="93" y2="73" stroke={accentColor} strokeWidth="0.6" opacity="0.35" />
            <line x1="93" y1="27" x2="7"  y2="73" stroke={accentColor} strokeWidth="0.6" opacity="0.35" />
            {/* Midpoints */}
            <line x1="50" y1="4"  x2="7"  y2="27" stroke={accentColor} strokeWidth="0.4" opacity="0.2" />
            <line x1="50" y1="4"  x2="93" y2="27" stroke={accentColor} strokeWidth="0.4" opacity="0.2" />
            <line x1="50" y1="96" x2="7"  y2="73" stroke={accentColor} strokeWidth="0.4" opacity="0.2" />
            <line x1="50" y1="96" x2="93" y2="73" stroke={accentColor} strokeWidth="0.4" opacity="0.2" />
            {/* Center circle */}
            <circle cx="50" cy="50" r="22" fill={result ? `${accentColor}22` : 'rgba(0,212,255,0.04)'} stroke={accentColor} strokeWidth="1" />
            {/* Number */}
            <text x="50" y="57" textAnchor="middle" fill={accentColor}
              fontSize={result?.n === 20 || result?.n === 1 ? "11" : "22"}
              fontFamily="monospace" fontWeight="bold">
              {rolling ? '?' : result ? result.label : 'd20'}
            </text>
          </svg>
          {result?.n === 20 && <div className={styles.glow20} />}
        </div>

        {result && (
          <div className={styles.resultBox} style={{ borderColor: result.color }}>
            <p className={styles.resultMsg} style={{ color: result.color }}>{result.msg}</p>
          </div>
        )}

        <button className={styles.rollBtn} onClick={roll} disabled={rolling}>
          {rolling ? 'Rolling...' : result ? 'Roll Again' : 'Roll the Die'}
        </button>
        <p className={styles.hint}>Click the die or the button · Esc to close</p>
      </div>
    </div>
  )
}
