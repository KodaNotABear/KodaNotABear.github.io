import { useState } from 'react'
import styles from './MobileEasterEggs.module.css'

const EGGS = [
  { id: 'ROLL',    icon: '🎲', label: 'Roll D20' },
  { id: 'GHOST',   icon: '👻', label: 'Ghost' },
  { id: 'SIGNAL',  icon: '📡', label: 'Signal' },
  { id: 'DUNGEON', icon: '⚔️', label: 'Dungeon' },
]

function fire(id) {
  window.dispatchEvent(new CustomEvent('eggTrigger', { detail: id }))
}

export default function MobileEasterEggs() {
  const [open, setOpen] = useState(false)

  function handleEgg(id) {
    fire(id)
    setOpen(false)
  }

  return (
    <div className={styles.root}>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.menu}>
            <p className={styles.menuLabel}>// secrets</p>
            {EGGS.map(({ id, icon, label }) => (
              <button key={id} className={styles.eggBtn} onClick={() => handleEgg(id)}>
                <span className={styles.eggIcon}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <button
        className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Easter eggs"
      >
        🕹️
      </button>
    </div>
  )
}
