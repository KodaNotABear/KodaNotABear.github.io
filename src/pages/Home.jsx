import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import {
  UnityIcon, CSharpIcon, GitHubIcon, ReactIcon,
  BlenderIcon, RiderIcon, FmodIcon,
} from '../components/Icons'
import styles from './Home.module.css'

const EYEBROW_TEXT = '// akuro.studio'

function Typewriter({ text }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c >= text.length) { clearInterval(interval); return c }
        return c + 1
      })
    }, 55)
    return () => clearInterval(interval)
  }, [text])
  return (
    <span>
      {text.slice(0, count)}
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

const PAGES = {
  home: '/', portfolio: '/portfolio', projects: '/portfolio', about: '/about',
  resume: '/resume', devlog: '/devlog', blog: '/devlog', contact: '/contact',
}

const EGGS = {
  snake:   { id: 'SNAKE',   flavor: 'launching snake.exe (arrow keys to steer, Esc to quit)' },
  dungeon: { id: 'DUNGEON', flavor: 'loading dungeon.exe' },
  signal:  { id: 'SIGNAL',  flavor: 'you were warned.' },
}

const HELP_LINES = [
  '  help        this menu',
  '  whoami      operator profile',
  '  snake       play snake (arrow keys)',
  '  dungeon     text adventure',
  '  signal      do not',
  '  go [page]   portfolio · about · resume · devlog · contact',
  '  clear       wipe terminal',
]

function TerminalWindow() {
  const navigate = useNavigate()
  const [visibleLines, setVisibleLines] = useState([])
  const [booted, setBooted] = useState(false)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay)
    )
    const bootTimer = setTimeout(() => setBooted(true), BOOT_LINES[BOOT_LINES.length - 1].delay + 400)
    return () => { timers.forEach(clearTimeout); clearTimeout(bootTimer) }
  }, [])

  // keep the newest line in view
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visibleLines, booted, history])

  function print(lines) {
    setHistory(h => [...h, ...lines].slice(-80))
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    const echo = { text: `> ${raw.trim()}`, color: 'normal' }

    if (cmd === 'clear') { setHistory([]); return }
    if (cmd === 'help' || cmd === '?') {
      print([echo, ...HELP_LINES.map(text => ({ text, color: 'dim' }))])
      return
    }
    if (cmd === 'whoami') {
      print([echo,
        { text: '  Ethan Peterson', color: 'normal' },
        { text: '  game programmer · Unity / C#', color: 'normal' },
        { text: '  status: open to work', color: 'green' },
      ])
      return
    }
    if (EGGS[cmd]) {
      print([echo, { text: `  ${EGGS[cmd].flavor}`, color: cmd === 'signal' ? 'cyan' : 'dim' }])
      window.dispatchEvent(new CustomEvent('eggTrigger', { detail: EGGS[cmd].id }))
      return
    }
    const dest = cmd.startsWith('go ') ? cmd.slice(3).trim() : cmd
    if (PAGES[dest]) {
      print([echo, { text: `  loading ${PAGES[dest]} ...`, color: 'dim' }])
      setTimeout(() => navigate(PAGES[dest]), 450)
      return
    }
    print([echo, { text: `  command not found: ${cmd} (try 'help')`, color: 'cyan' }])
  }

  function onSubmit(e) {
    e.preventDefault()
    run(input)
    setInput('')
  }

  return (
    <div
      className={styles.terminal}
      aria-label="Interactive terminal. Type help for commands."
      onClick={() => booted && inputRef.current?.focus()}
    >
      <div className={styles.terminalBar}>
        <span className={styles.termDot} style={{ background: '#ff5f57' }} />
        <span className={styles.termDot} style={{ background: '#febc2e' }} />
        <span className={styles.termDot} style={{ background: '#28c840' }} />
        <span className={styles.termTitle}>akuro@studio:~</span>
      </div>
      <div className={styles.terminalBody} ref={bodyRef}>
        {BOOT_LINES.map((line, i) =>
          visibleLines.includes(i) ? (
            <div key={i} className={`${styles.termLine} ${styles[`term_${line.color}`]}`}>
              {line.text}
            </div>
          ) : null
        )}
        {history.map((line, i) => (
          <div key={i} className={`${styles.termLine} ${styles[`term_${line.color}`]}`}>
            {line.text}
          </div>
        ))}
        {booted && (
          <form className={styles.termPrompt} onSubmit={onSubmit}>
            <span className={styles.term_green}>&gt;</span>
            <input
              ref={inputRef}
              className={styles.termInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="type 'help'"
              aria-label="Terminal command input"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              enterKeyHint="go"
            />
          </form>
        )}
      </div>
    </div>
  )
}

const STATS = [
  { value: '1',      label: 'Game Shipped' },
  { value: '9 mo',   label: 'Studio Internship' },
  { value: '3+ yrs', label: 'Building in Unity' },
  { value: 'C#',     label: 'Primary Language' },
]

const TECH = [
  { Icon: UnityIcon,   label: 'Unity' },
  { Icon: CSharpIcon,  label: 'C#' },
  { Icon: BlenderIcon, label: 'Blender' },
  { Icon: FmodIcon,    label: 'FMOD' },
  { Icon: RiderIcon,   label: 'JetBrains Rider' },
  { Icon: GitHubIcon,  label: 'Git / GitHub' },
  { Icon: ReactIcon,   label: 'React' },
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
                CS grad, Software Engineering focus. I build games in Unity
                and care a lot about how they feel to play. Right now I'm
                looking for my first full-time role in games. The terminal
                works, by the way.
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
              <span className={styles.buildingLabel}>// current_project</span>
            </div>
            <h2 className={styles.buildingTitle}>Black Signal</h2>
            <p className={styles.buildingDesc}>
              A first-person horror game set on a derelict space station, built in Unity. You move through it yourself, watching for anomalies while the station's sensors and tasks pull your attention away. Notice what's wrong before it notices you.
            </p>
            <div className={styles.buildingFooter}>
              <div className={styles.buildingTags}>
                <span>Unity</span><span>C#</span><span>Solo</span>
              </div>
              <Link to="/devlog" className="btn btn-ghost">Follow development →</Link>
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
            {TECH.map(({ Icon, label }) => (
              <span key={label} className={styles.techBadge}><Icon size={16} /> {label}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
