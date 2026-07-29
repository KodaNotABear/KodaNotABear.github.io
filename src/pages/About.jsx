import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Toolbox from '../components/Toolbox'
import GitHubHeatmap from '../components/GitHubHeatmap'
import { GamepadIcon, AnchorIcon, GradCapIcon, MapPinIcon, TrophyIcon } from '../components/Icons'
import styles from './About.module.css'

const TIMELINE = [
  {
    date: 'May 2026',
    title: 'CS Degree Awarded',
    org: 'Arizona State University',
    desc: 'Graduated with a B.S. in Computer Science, Software Engineering focus.',
    color: 'var(--accent)',
  },
  {
    date: 'Aug 2025 – May 2026',
    title: 'Game Development Intern',
    org: 'Pixel Pirate Studio',
    desc: 'Shipped player onboarding, a tournament update, and a WebGL port for Off-Road Champion on mobile. Real production pipeline experience inside a professional Unity team.',
    color: 'var(--accent)',
  },
  {
    date: '2026 – Present',
    title: 'Independent Projects',
    org: 'AKURO STUDIO',
    desc: 'Shipped the first beta of Create: Cognition, a Minecraft mod in Java that simulates mob loot with zero spawned entities. Black Signal, a first-person horror game in Unity, is in early prototyping.',
    color: 'var(--accent-3)',
  },
  {
    date: 'Jun 2022 – 2025',
    title: 'Data Acquisition Developer, Formula SAE',
    org: 'Sun Devil Motorsports',
    desc: 'Designed and tested on-vehicle data acquisition and embedded telemetry tools for ASU\'s FSAE racing team, including an infrared lap timing system.',
    color: 'var(--accent)',
  },
  {
    date: '2022',
    title: 'Started CS Degree',
    org: 'Arizona State University',
    desc: 'Enrolled with a focus on Software Engineering. Relevant coursework: Game Development, Computer Graphics, Algorithms, OS, Databases.',
    color: '#6b7280',
  },
]

const INTERESTS = [
  'Roguelikes and how good run-to-run variety keeps them fresh',
  'MMOs and the systems that hold persistent worlds together',
  'MOBAs and the constant balancing act behind competitive design',
  'Boomer shooters and movement that feels good on its own',
  'Game jams and fast, messy prototyping',
]

const funFacts = [
  { Icon: GamepadIcon, fact: 'Game dev since high school with Unity' },
  { Icon: AnchorIcon,  fact: 'Interned at Pixel Pirate Studio (Off-Road Champion)' },
  { Icon: TrophyIcon,  fact: '3 seasons of FSAE racing telemetry at Sun Devil Motorsports' },
  { Icon: GradCapIcon, fact: 'CS grad, Arizona State University, May 2026' },
  { Icon: MapPinIcon,  fact: 'Based in Arizona' },
]

export default function About() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroAccent} aria-hidden />
        <div className="container">
          <motion.div
            className={styles.heroInner}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className={styles.eyebrow}>about me</p>
              <h1 className={styles.name}>Ethan Peterson</h1>
              <p className={styles.role}>Game Programmer &amp; Designer · CS Graduate</p>
              <p className={styles.bio}>
                Game developer from Arizona, working mostly in Unity. Making
                games since high school, now shipping personal projects under
                AKURO STUDIO. Time away from building games usually goes to
                playing or reading about them.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left column */}
            <div>
              {/* Experience timeline */}
              <div className={styles.sectionBlock}>
                <h2>Timeline</h2>
                <div className={styles.timeline}>
                  {TIMELINE.map(({ date, title, org, desc, color }, i) => (
                    <motion.div
                      key={title}
                      className={styles.timelineItem}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.4 }}
                    >
                      <span className={styles.timelineDot} style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                      <p className={styles.timelineDate}>{date}</p>
                      <p className={styles.timelineTitle}>{title}</p>
                      <p className={styles.timelineOrg}>{org}</p>
                      <p className={styles.timelineDesc}>{desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className={styles.sectionBlock}>
                <h2>Interests</h2>
                <ul>
                  {INTERESTS.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Toolbox */}
              <div className={styles.sectionBlock}>
                <h2>Toolbox</h2>
                <Toolbox />
              </div>

              {/* GitHub heatmap */}
              <div className={styles.sectionBlock}>
                <h2>GitHub Activity</h2>
                <GitHubHeatmap />
              </div>

              {/* Fun facts */}
              <div className={styles.sectionBlock}>
                <h2>Quick Facts</h2>
                <ul>
                  {funFacts.map(({ Icon, fact }) => (
                    <li key={fact} className={styles.factItem}>
                      <Icon size={15} />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The studio */}
              <div className={styles.sectionBlock}>
                <h2>AKURO STUDIO</h2>
                <p>
                  AKURO STUDIO is the label for personal projects. Nothing big
                  ships under the name yet, but the Minecraft mods live there.
                </p>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
                <Link to="/portfolio" className="btn btn-primary">View Projects</Link>
                <Link to="/contact" className="btn btn-outline">Get In Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
