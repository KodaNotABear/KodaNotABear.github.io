import { useEffect, useState, useCallback } from 'react'
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
  { keys: ['?'],            label: 'Toggle this menu' },
  { keys: ['Esc'],          label: 'Close menu' },
]

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const pendingG = useCallback(() => {}, [])
  const gTimerRef = { current: null }

  useEffect(() => {
    let waitingForSecond = false
    let timer = null

    function onKey(e) {
      // Ignore inside inputs/textareas
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      const key = e.key.toUpperCase()

      if (key === 'ESCAPE') {
        setOpen(false)
        return
      }

      if (open && key === '?') {
        setOpen(false)
        return
      }

      if (!open && (key === '?' || e.key === '?')) {
        e.preventDefault()
        setOpen(true)
        return
      }

      if (key === 'G') {
        waitingForSecond = true
        clearTimeout(timer)
        timer = setTimeout(() => { waitingForSecond = false }, 1000)
        return
      }

      if (waitingForSecond) {
        waitingForSecond = false
        clearTimeout(timer)
        const match = SHORTCUTS.find(s => s.keys[1] === key)
        if (match) {
          navigate(match.path)
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [open, navigate])

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
