import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './KeyboardShortcuts.module.css'

const SHORTCUTS = [
  { keys: ['G', 'H'], label: 'Go to Home',      path: '/' },
  { keys: ['G', 'P'], label: 'Go to Portfolio',  path: '/portfolio' },
  { keys: ['G', 'A'], label: 'Go to About',      path: '/about' },
  { keys: ['G', 'R'], label: 'Go to Resume',     path: '/resume' },
  { keys: ['G', 'D'], label: 'Go to Devlog',     path: '/devlog' },
  { keys: ['G', 'C'], label: 'Go to Contact',    path: '/contact' },
]

const INFO_SHORTCUTS = [
  { keys: ['↑↑↓↓←→←→BA'], label: '???' },
  { keys: ['S N A K E'],   label: '🐍' },
  { keys: ['R O L L'],     label: '🎲' },
  { keys: ['G H O S T'],   label: '👻' },
  { keys: ['S I G N A L'], label: '📡' },
  { keys: ['D U N G E O N'], label: '⚔️' },
  { keys: ['?'],            label: 'Toggle this menu' },
  { keys: ['Esc'],          label: 'Close menu' },
]

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  // Use a ref for open so the stable event listener always sees current value
  const openRef = React.useRef(open)
  useEffect(() => { openRef.current = open }, [open])

  useEffect(() => {
    let waitingForSecond = false
    let timer = null

    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        setOpen(prev => !prev)
        return
      }

      // G+letter navigation — only when modal is closed
      if (!openRef.current) {
        const upper = e.key.toUpperCase()
        if (upper === 'G') {
          waitingForSecond = true
          clearTimeout(timer)
          timer = setTimeout(() => { waitingForSecond = false }, 1000)
          return
        }
        if (waitingForSecond) {
          waitingForSecond = false
          clearTimeout(timer)
          const match = SHORTCUTS.find(s => s.keys[1] === upper)
          if (match) { navigate(match.path) }
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [navigate])  // stable — no re-register on open changes

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Keyboard Shortcuts</span>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Navigation</p>
          {SHORTCUTS.map(({ keys, label }) => (
            <div key={label} className={styles.row}>
              <span className={styles.label}>{label}</span>
              <div className={styles.keys}>
                {keys.map((k, i) => (
                  <>
                    <kbd key={k} className={styles.kbd}>{k}</kbd>
                    {i < keys.length - 1 && <span key={`sep-${i}`} className={styles.then}>then</span>}
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>General</p>
          {INFO_SHORTCUTS.map(({ keys, label }) => (
            <div key={label} className={styles.row}>
              <span className={styles.label}>{label}</span>
              <div className={styles.keys}>
                {keys.map(k => <kbd key={k} className={styles.kbd}>{k}</kbd>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
