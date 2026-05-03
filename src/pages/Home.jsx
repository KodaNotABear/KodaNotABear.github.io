import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import styles from './Home.module.css'

const EYEBROW_TEXT = '// akuro.studio'

function Typewriter({ text }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 55)
    return () => clearInterval(interval)
  }, [text])
  return (
    <span>
      {displayed}
      <span className={styles.cursor}>▋</span>
    </span>
  )
}

const BOOT_LINES = [
  { text: 'AKURO OS v2.6.0', delay: 200, color: 'cyan' },
  { text: '────────────────────────', delay: 400, color: 'dim' },
  { text: '> loading operator profile...', delay: 700, color: 'normal' },
  { text: '  name:     Ethan Peterson', delay: 1100, color: 'normal' },
  { text: '  role:     Game Programmer', delay: 1350, color: 'normal' },
  { text: '  engine:   Unity · C#', delay: 1600, color: 'normal' },
  { text: '  status:   Open to Work ✓', delay: 1900, color: 'green' },
  { text: '> loading current_project...', delay: 2400, color: 'normal' },
  { text: '  project:  Black Signal', delay: 2750, color: 'normal' },
  { text: '  genre:    Space Horror', delay: 3000, color: 'normal' },
  { text: '  build:    IN DEVELOPMENT', delay: 3250, color: 'cyan' },
  { text: '────────────────────────', delay: 3600, color: 'dim' },
  { text: '> ready_', delay: 3900, color: 'green' },
]

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState([])

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={styles.terminal} aria-hidden>
      <div className={styles.terminalBar}>
        <span className={styles.termDot} style={{ background: '#ff5f57' }} />
        <span className={styles.termDot} style={{ background: '#febc2e' }} />
        <span className={styles.termDot} style={{ background: '#28c840' }} />
        <span className={styles.termTitle}>AKURO — bash</span>
      </div>
      <div className={styles.terminalBody}>
        {BOOT_LINES.map((line, i) =>
          visibleLines.includes(i) ? (
            <div key={i} className={`${styles.termLine} ${styles[`term_${line.color}`]}`}>
              {line.text}
            </div>
          ) : null
        )}
        {visibleLines.length >= BOOT_LINES.length && (
          <div className={`${styles.termLine} ${styles.term_normal}`}>
            <span className={styles.cursor}>▋</span>
          </div>
        )}
      </div>
    </div>
  )
}

const STATS = [
  { value: '1',    label: 'Game Shipped' },
  { value: '1',    label: 'Studio Internship' },
  { value: 'C#',   label: 'Primary Language' },
  { value: 'Unity', label: 'Engine of Choice' },
]

const TECH = [
  { icon: '🎮', label: 'Unity' },
  { icon: '⌨', label: 'C#' },
  { icon: '🔧', label: 'Git / GitHub' },
  { icon: '🎨', label: 'Game Design' },
  { icon: '📐', label: 'Systems Architecture' },
  { icon: '🐛', label: 'Debugging & Profiling' },
  { icon: '🌐', label: 'React / Web' },
  { icon: '🤝', label: 'Agile / Scrum' },
]

const featured = projects.filter(p => p.featured).slice(0, 2)

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden />
        <div className={styles.orb1} aria-hidden />
        <div className={styles.orb2} aria-hidden />

        <div className="container">
          <div className={styles.heroLayout}>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className={styles.eyebrow}><Typewriter text={EYEBROW_TEXT} /></p>

              <div className={styles.statusBadge}>
                <span className={styles.dot} />
                CS Graduate · May 2026
              </div>

              <h1 className={styles.heroName}>
                Ethan<br />
                <span>Peterson</span>
              </h1>

              <p className={styles.heroRole}>
                Game Programmer &amp; Designer · AKURO STUDIO
              </p>

              <p className={styles.heroBio}>
                CS grad with a Software Engineering focus, passionate about
                crafting immersive gameplay experiences. From systems design to
                pixel-perfect UI, I build games with Unity and ship them.
                Currently exploring new opportunities in the game industry.
              </p>

              <div className={styles.heroActions}>
                <Link to="/portfolio" className="btn btn-primary">View My Games</Link>
                <Link to="/contact" className="btn btn-outline">Get In Touch</Link>
                <Link to="/resume" className="btn btn-ghost">Résumé</Link>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroVisual}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <TerminalWindow />
            </motion.div>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <span>SCROLL</span>
          <span>↓</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Currently Building ── */}
      <section className={styles.buildingSection}>
        <div className="container">
          <motion.div
            className={styles.buildingCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.buildingMeta}>
              <span className={styles.buildingBadge}>
                <span className={styles.dot} />
                IN DEVELOPMENT
              </span>
              <span className={styles.buildingLabel}>// current_project.exe</span>
            </div>
            <h2 className={styles.buildingTitle}>Black Signal</h2>
            <p className={styles.buildingDesc}>
              A space-horror experience inspired by <em>Observation Duty</em>. Monitor deep-space feeds and decide what's real — and what isn't.
            </p>
            <div className={styles.buildingFooter}>
              <div className={styles.buildingTags}>
                <span>Unity</span><span>C#</span><span>Space Horror</span>
              </div>
              <Link to="/devlog" className="btn btn-ghost">Follow Progress →</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {featured.length > 0 && (
        <section className={styles.featuredSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className="section-title">Featured Work</h2>
              <Link to="/portfolio" className="btn btn-ghost">All Projects →</Link>
            </div>

            <div className={styles.featuredGrid}>
              {featured.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tech ── */}
      <section className={`${styles.techSection} section`}>
        <div className="container">
          <h2 className="section-title">Skills &amp; Tools</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-6)', maxWidth: 480 }}>
            The stack I reach for when building games and interactive experiences.
          </p>
          <div className={styles.techGrid}>
            {TECH.map(({ icon, label }) => (
              <span key={label} className={styles.techBadge}>{icon} {label}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
