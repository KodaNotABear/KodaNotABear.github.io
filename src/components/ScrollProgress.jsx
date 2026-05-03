import { useEffect, useState } from 'react'
import styles from './ScrollProgress.module.css'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setPct(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.track} aria-hidden>
      <div className={styles.bar} style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}
