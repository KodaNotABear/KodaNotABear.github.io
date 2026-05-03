import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './GitHubHeatmap.module.css'

const GITHUB_USER = 'KodaNotABear'
const WEEKS = 26 // last ~6 months

function getDayColor(count) {
  if (count === 0) return 'var(--bg-surface)'
  if (count <= 2)  return 'rgba(0,212,255,0.25)'
  if (count <= 5)  return 'rgba(0,212,255,0.5)'
  if (count <= 9)  return 'rgba(0,212,255,0.75)'
  return 'var(--accent-cyan)'
}

export default function GitHubHeatmap() {
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      .then(r => r.json())
      .then(data => {
        // API returns flat array: [{date, count, level}, ...]
        const days = data.contributions || []
        if (days.length === 0) { setError(true); setLoading(false); return }
        // Group into weeks of 7
        const grouped = []
        for (let i = 0; i < days.length; i += 7) {
          grouped.push(days.slice(i, i + 7))
        }
        setWeeks(grouped.slice(-WEEKS))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className={styles.loading}>Loading activity...</div>
  if (error || weeks.length === 0) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((day, di) => (
              <motion.div
                key={di}
                className={styles.cell}
                style={{ background: getDayColor(day.count) }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: wi * 0.01, duration: 0.2 }}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span>Less</span>
        {[0, 2, 5, 9, 12].map(v => (
          <div key={v} className={styles.legendCell} style={{ background: getDayColor(v) }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
