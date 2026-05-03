import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import styles from './Home.module.css'

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
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className={styles.eyebrow}>// thunderbyte.studio</p>

            <div className={styles.statusBadge}>
              <span className={styles.dot} />
              CS Graduate · May 2026
            </div>

            <h1 className={styles.heroName}>
              Ethan<br />
              <span>Peterson</span>
            </h1>

            <p className={styles.heroRole}>
              Game Programmer &amp; Designer · Thunderbyte Studio
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
