import { useRef, useEffect, useState } from 'react'
import styles from './RadarChart.module.css'

const SKILLS = [
  { label: 'Unity',       score: 9 },
  { label: 'C#',          score: 8 },
  { label: 'Gameplay',    score: 8 },
  { label: 'Level Design',score: 7 },
  { label: 'Web / React', score: 6 },
  { label: 'Profiling',   score: 9 },
]

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 80
const LEVELS = 4

function polarToXY(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180)
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

const N = SKILLS.length
const angles = SKILLS.map((_, i) => (360 / N) * i)

function polygonPoints(scores, maxR) {
  return scores
    .map((s, i) => {
      const r = (s / 10) * maxR
      const { x, y } = polarToXY(angles[i], r)
      return `${x},${y}`
    })
    .join(' ')
}

export default function RadarChart() {
  const dataPoints = polygonPoints(SKILLS.map(s => s.score), RADIUS)
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg} aria-label="Skills radar chart">
        {/* Grid rings */}
        {Array.from({ length: LEVELS }).map((_, lvl) => {
          const r = (RADIUS / LEVELS) * (lvl + 1)
          const pts = angles.map(a => {
            const { x, y } = polarToXY(a, r)
            return `${x},${y}`
          }).join(' ')
          return <polygon key={lvl} points={pts} className={styles.ring} />
        })}

        {/* Axis lines */}
        {angles.map((angle, i) => {
          const { x, y } = polarToXY(angle, RADIUS)
          return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} className={styles.axis} />
        })}

        {/* Data polygon */}
        <polygon
          points={dataPoints}
          className={`${styles.data}${inView ? ` ${styles.dataVisible}` : ''}`}
        />

        {/* Skill labels */}
        {SKILLS.map((skill, i) => {
          const { x, y } = polarToXY(angles[i], RADIUS + 20)
          return (
            <text key={skill.label} x={x} y={y} className={styles.label}
              textAnchor={x < CENTER - 4 ? 'end' : x > CENTER + 4 ? 'start' : 'middle'}
              dominantBaseline="middle"
            >
              {skill.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
