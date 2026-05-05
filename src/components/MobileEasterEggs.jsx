import { useState } from 'react'
import { DiceIcon, GhostIcon, AntennaIcon, SwordIcon, GamepadIcon } from './Icons'
import styles from './MobileEasterEggs.module.css'

const EGGS = [
  { id: 'ROLL',    Icon: DiceIcon,    label: 'Roll D20' },
  { id: 'GHOST',   Icon: GhostIcon,   label: 'Ghost' },
  { id: 'SIGNAL',  Icon: AntennaIcon, label: 'Signal' },
  { id: 'DUNGEON', Icon: SwordIcon,   label: 'Dungeon' },
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
            {EGGS.map(({ id, Icon, label }) => (
              <button key={id} className={styles.eggBtn} onClick={() => handleEgg(id)}>
                <span className={styles.eggIcon}><Icon size={20} /></span>
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
        <GamepadIcon size={22} />
      </button>
    </div>
  )
}
