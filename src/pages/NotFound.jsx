import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const [count, setCount] = useState(9)
  const navigate = useNavigate()

  useEffect(() => {
    if (count <= 0) { navigate('/'); return }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, navigate])

  return (
    <main className={styles.page}>
      <div className={styles.scanline} aria-hidden />
      <div className={styles.content}>
        <div className={styles.gameOver}>GAME OVER</div>
        <p className={styles.code}>404 — PAGE NOT FOUND</p>
        <p className={styles.message}>The level you're looking for doesn't exist.</p>

        <div className={styles.continue}>
          <span className={styles.continueText}>CONTINUE?</span>
          <span className={styles.countdown}>{count}</span>
        </div>

        <div className={styles.coins}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className={styles.coin}>🪙</span>
          ))}
        </div>

        <button className={`btn btn-primary ${styles.btn}`} onClick={() => navigate('/')}>
          ↩ INSERT COIN
        </button>
      </div>
    </main>
  )
}
