import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './KonamiCode.module.css'

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
]

export default function KonamiCode() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === SEQUENCE[progress]) {
        const next = progress + 1
        if (next === SEQUENCE.length) {
          setActive(true)
          setProgress(0)
        } else {
          setProgress(next)
        }
      } else {
        setProgress(e.key === SEQUENCE[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [progress])

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setActive(false), 4000)
      return () => clearTimeout(t)
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setActive(false)}
        >
          <motion.div
            className={styles.content}
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className={styles.badge}>CHEAT CODE ACTIVATED</div>
            <h2 className={styles.heading}>+30 Lives</h2>
            <p className={styles.sub}>You found the secret.</p>
            <p className={styles.cta}>Now hire me.</p>
            <p className={styles.dismiss}>[ click anywhere to dismiss ]</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
