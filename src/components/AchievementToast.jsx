import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrophyIcon } from './Icons'
import styles from './AchievementToast.module.css'

export function useAchievement() {
  const [toast, setToast] = useState(null)

  const unlock = useCallback((title, desc) => {
    setToast({ title, desc, key: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }, [])

  return { toast, unlock }
}

export function AchievementToast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          className={styles.toast}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
          <div className={styles.icon}><TrophyIcon size={24} /></div>
          <div className={styles.text}>
            <div className={styles.label}>ACHIEVEMENT UNLOCKED</div>
            <div className={styles.title}>{toast.title}</div>
            <div className={styles.desc}>{toast.desc}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
