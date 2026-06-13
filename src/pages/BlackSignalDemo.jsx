import { useEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './BlackSignalDemo.module.css'

// ── A small playable slice of Black Signal's core loop ──────────
// Watch six camera feeds. When an anomaly appears in one, click that
// feed to log it before it reaches the crew. Miss it and the station
// loses integrity. Survive the shift.

const SHIFT_MS = 75_000          // one shift
const START_INTEGRITY = 100
const BREACH_DAMAGE = 16         // missing an anomaly
const WRONG_PENALTY = 7          // flagging a clear feed

const ROOMS = [
  { id: 0, label: 'CARGO BAY',  cam: 'CAM 01' },
  { id: 1, label: 'CORRIDOR C', cam: 'CAM 02' },
  { id: 2, label: 'AIRLOCK',    cam: 'CAM 03' },
  { id: 3, label: 'MED BAY',    cam: 'CAM 04' },
  { id: 4, label: 'REACTOR',    cam: 'CAM 05' },
  { id: 5, label: 'QUARTERS',   cam: 'CAM 06' },
]

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Deterministic-ish PRNG so a given feed always draws the same room
function rng(seed) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// ── Procedural camera scene (no image assets) ───────────────────
function FeedScene({ room, anomaly }) {
  const r = rng(room.id + 1)
  const lightOn = r() > 0.4
  // a couple of room-specific props
  const props = []
  const propCount = 2 + Math.floor(r() * 2)
  for (let i = 0; i < propCount; i++) {
    const w = 14 + r() * 26
    const h = 10 + r() * 22
    props.push({ x: 12 + r() * 120, y: 60 - h + r() * 14, w, h, shade: 0.05 + r() * 0.1 })
  }
  return (
    <svg viewBox="0 0 160 90" className={styles.scene} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id={`amb${room.id}`} cx="50%" cy="32%" r="70%">
          <stop offset="0" stopColor={lightOn ? 'rgba(0,212,255,0.14)' : 'rgba(60,70,90,0.06)'} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill="#05070b" />
      <rect width="160" height="90" fill={`url(#amb${room.id})`} />
      {/* back wall / floor split */}
      <rect x="0" y="58" width="160" height="32" fill="rgba(255,255,255,0.018)" />
      {/* perspective floor lines */}
      <line x1="40" y1="90" x2="70" y2="58" stroke="rgba(0,212,255,0.08)" strokeWidth="0.5" />
      <line x1="120" y1="90" x2="90" y2="58" stroke="rgba(0,212,255,0.08)" strokeWidth="0.5" />
      <line x1="0" y1="72" x2="160" y2="72" stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
      {/* ceiling light */}
      {lightOn && <circle cx="80" cy="14" r="3" fill="rgba(0,212,255,0.5)" />}
      {/* props */}
      {props.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="1"
          fill={`rgba(150,170,200,${p.shade})`} stroke="rgba(0,212,255,0.07)" strokeWidth="0.4" />
      ))}
      {/* anomaly: a figure that should not be there */}
      {anomaly && (
        <g className={styles.figure} transform={`translate(${anomaly.x} ${anomaly.y})`}>
          <ellipse cx="0" cy="20" rx="6" ry="2" fill="rgba(255,40,40,0.25)" />
          <path d="M0 2 C 3 2 4 5 4 8 L 3 19 L -3 19 L -4 8 C -4 5 -3 2 0 2 Z"
            fill="rgba(255,30,30,0.9)" />
          <circle cx="0" cy="-1" r="3" fill="rgba(255,30,30,0.95)" />
        </g>
      )}
    </svg>
  )
}

const initialUi = {
  integrity: START_INTEGRITY,
  score: 0,
  timeLeftMs: SHIFT_MS,
  anomalyIdx: null,
  anomalyPos: null,
  feedback: null, // { idx, type }
  caught: 0,
  missed: 0,
}
function uiReducer(state, action) {
  if (action.type === 'sync') return { ...state, ...action.payload }
  if (action.type === 'reset') return { ...initialUi }
  return state
}

export default function BlackSignalDemo() {
  const [phase, setPhase] = useState('intro') // intro | playing | won | lost
  const [ui, dispatch] = useReducer(uiReducer, initialUi)
  const game = useRef(null)

  function startShift() {
    const now = Date.now()
    game.current = {
      startTime: now,
      integrity: START_INTEGRITY,
      score: 0,
      anomaly: null,        // { idx, x, y, start, window }
      lastResolve: now,
      feedback: null,       // { idx, type, until }
      caught: 0,
      missed: 0,
    }
    dispatch({ type: 'reset' })
    setPhase('playing')
  }

  // ── Game loop ──
  useEffect(() => {
    if (phase !== 'playing') return
    const tick = () => {
      const g = game.current
      if (!g) return
      const now = Date.now()
      const elapsed = now - g.startTime
      const timeLeftMs = SHIFT_MS - elapsed
      const progress = clamp(elapsed / SHIFT_MS, 0, 1)
      const spawnGap = lerp(2600, 1150, progress)
      const window = lerp(3900, 2300, progress)

      if (g.feedback && now > g.feedback.until) g.feedback = null

      if (!g.anomaly && now - g.lastResolve > spawnGap) {
        const idx = Math.floor(Math.random() * ROOMS.length)
        g.anomaly = {
          idx,
          x: 24 + Math.random() * 112,
          y: 30 + Math.random() * 26,
          start: now,
          window,
        }
      }
      if (g.anomaly && now - g.anomaly.start > g.anomaly.window) {
        g.integrity = clamp(g.integrity - BREACH_DAMAGE, 0, 100)
        g.missed += 1
        g.feedback = { idx: g.anomaly.idx, type: 'breach', until: now + 750 }
        g.anomaly = null
        g.lastResolve = now
      }

      if (g.integrity <= 0) {
        dispatch({ type: 'sync', payload: snapshot(g, 0) })
        setPhase('lost')
        return
      }
      if (timeLeftMs <= 0) {
        dispatch({ type: 'sync', payload: snapshot(g, 0) })
        setPhase('won')
        return
      }
      dispatch({ type: 'sync', payload: snapshot(g, timeLeftMs) })
    }
    const id = setInterval(tick, 50)
    return () => clearInterval(id)
  }, [phase])

  function snapshot(g, timeLeftMs) {
    return {
      integrity: g.integrity,
      score: g.score,
      timeLeftMs,
      anomalyIdx: g.anomaly ? g.anomaly.idx : null,
      anomalyPos: g.anomaly ? { x: g.anomaly.x, y: g.anomaly.y } : null,
      feedback: g.feedback ? { idx: g.feedback.idx, type: g.feedback.type } : null,
      caught: g.caught,
      missed: g.missed,
    }
  }

  function flag(idx) {
    if (phase !== 'playing') return
    const g = game.current
    const now = Date.now()
    if (g.anomaly && g.anomaly.idx === idx) {
      const speed = clamp(1 - (now - g.anomaly.start) / g.anomaly.window, 0, 1)
      g.score += 100 + Math.round(speed * 120)
      g.caught += 1
      g.feedback = { idx, type: 'caught', until: now + 650 }
      g.anomaly = null
      g.lastResolve = now
    } else {
      g.integrity = clamp(g.integrity - WRONG_PENALTY, 0, 100)
      g.feedback = { idx, type: 'wrong', until: now + 500 }
    }
    dispatch({ type: 'sync', payload: snapshot(g, ui.timeLeftMs) })
  }

  // Esc returns to intro from a finished run
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && phase !== 'playing') setPhase('intro') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  const secs = Math.ceil(ui.timeLeftMs / 1000)
  const mm = String(Math.floor(secs / 60)).padStart(1, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <main className={styles.page}>
      <div className={styles.scanlines} aria-hidden />
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>// black_signal — playable slice</p>
            <h1 className={styles.title}>Anomaly Watch</h1>
          </div>
          <Link to="/portfolio" className="btn btn-ghost">← Back to projects</Link>
        </div>

        {/* HUD */}
        <div className={styles.hud}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>SHIFT</span>
            <span className={styles.statValue}>{mm}:{ss}</span>
          </div>
          <div className={styles.integrityWrap}>
            <span className={styles.statLabel}>HULL INTEGRITY</span>
            <div className={styles.integrityBar}>
              <div
                className={styles.integrityFill}
                style={{
                  width: `${ui.integrity}%`,
                  background: ui.integrity > 50
                    ? 'var(--accent-cyan)'
                    : ui.integrity > 25 ? 'var(--warning)' : '#ef4444',
                }}
              />
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>SCORE</span>
            <span className={styles.statValue}>{ui.score}</span>
          </div>
        </div>

        {/* Camera grid */}
        <div className={styles.grid}>
          {ROOMS.map((room) => {
            const isAnom = ui.anomalyIdx === room.id
            const fb = ui.feedback && ui.feedback.idx === room.id ? ui.feedback.type : null
            return (
              <button
                key={room.id}
                className={`${styles.feed} ${fb ? styles[`fb_${fb}`] : ''} ${isAnom ? styles.alert : ''}`}
                onClick={() => flag(room.id)}
                disabled={phase !== 'playing'}
                aria-label={`${room.cam} ${room.label}`}
              >
                <FeedScene room={room} anomaly={isAnom ? ui.anomalyPos : null} />
                <span className={styles.feedBar}>
                  <span className={styles.rec}><i />REC</span>
                  <span>{room.cam}</span>
                  <span className={styles.feedRoom}>{room.label}</span>
                </span>
                {fb === 'caught' && <span className={styles.flash}>LOGGED +</span>}
                {fb === 'wrong' && <span className={`${styles.flash} ${styles.flashBad}`}>CLEAR</span>}
                {fb === 'breach' && <span className={`${styles.flash} ${styles.flashBad}`}>BREACH</span>}
              </button>
            )
          })}
        </div>

        <p className={styles.hint}>
          An intruder shows up red. Click the feed it's in before the timer runs out on it.
        </p>
      </div>

      {/* Overlays */}
      {phase !== 'playing' && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            {phase === 'intro' && (
              <>
                <p className={styles.panelTag}>INCOMING SHIFT</p>
                <h2 className={styles.panelTitle}>Anomaly Watch</h2>
                <p className={styles.panelText}>
                  You're monitoring a derelict station through six cameras. When something
                  that shouldn't be there appears in a feed, flag that feed fast. Miss it and
                  the hull takes damage. Last the full shift.
                </p>
                <button className="btn btn-primary" onClick={startShift}>Begin shift →</button>
              </>
            )}
            {phase === 'won' && (
              <>
                <p className={styles.panelTag} style={{ color: 'var(--success)' }}>SHIFT COMPLETE</p>
                <h2 className={styles.panelTitle}>You made it.</h2>
                <p className={styles.panelText}>
                  Score {ui.score} · {ui.caught} logged · {ui.missed} missed · hull at {Math.round(ui.integrity)}%.
                </p>
                <div className={styles.panelActions}>
                  <button className="btn btn-primary" onClick={startShift}>Run it back</button>
                  <Link to="/portfolio" className="btn btn-outline">Back to projects</Link>
                </div>
              </>
            )}
            {phase === 'lost' && (
              <>
                <p className={styles.panelTag} style={{ color: '#ef4444' }}>SIGNAL LOST</p>
                <h2 className={styles.panelTitle}>The station went dark.</h2>
                <p className={styles.panelText}>
                  Score {ui.score} · {ui.caught} logged · {ui.missed} got through.
                </p>
                <div className={styles.panelActions}>
                  <button className="btn btn-primary" onClick={startShift}>Try again</button>
                  <Link to="/portfolio" className="btn btn-outline">Back to projects</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
