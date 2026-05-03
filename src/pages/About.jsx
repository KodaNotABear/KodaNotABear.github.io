import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import RadarChart from '../components/RadarChart'
import GitHubHeatmap from '../components/GitHubHeatmap'
import styles from './About.module.css'

const TIMELINE = [
  {
    date: 'May 2026',
    title: 'CS Degree Awarded',
    org: 'Arizona State University',
    desc: 'Graduated with a B.S. in Computer Science, Software Engineering focus.',
    color: 'var(--accent-cyan)',
  },
  {
    date: 'Aug 2025 – May 2026',
    title: 'Software Engineering Intern',
    org: 'Pixel Pirate Studio',
    desc: 'Shipped player onboarding for Off-Road Champion on mobile. Gained real production pipeline experience inside a professional Unity team.',
    color: 'var(--accent-violet)',
  },
  {
    date: '2025 – Present',
    title: 'Founder & Solo Developer',
    org: 'AKURO STUDIO',
    desc: 'Developing Black Signal, a space-horror game inspired by Observation Duty. Currently in active development.',
    color: 'var(--accent-cyan)',
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
  'Roguelikes — the perfect intersection of systems design and replayability',
  'MMOs and the social architecture behind persistent worlds',
  'MOBAs and the deep balance challenges of competitive design',
  'Boomer shooters — movement, feel, and the art of the arena',
  'Game jam culture and rapid prototyping',
]

const funFacts = [
  { icon: '🎮', fact: 'Game dev since high school with Unity' },
  { icon: '🏴‍☠️', fact: 'Interned at Pixel Pirate Studio (Off-Road Champion)' },
  { icon: '⚡', fact: 'Founded AKURO STUDIO as a solo dev label' },
  { icon: '🎓', fact: 'CS grad, Arizona State University, May 2026' },
  { icon: '🌵', fact: 'Based in Arizona' },
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
              <p className={styles.eyebrow}>// about me</p>
              <h1 className={styles.name}>Ethan Peterson</h1>
              <p className={styles.role}>Game Programmer &amp; Designer · CS Graduate</p>
              <p className={styles.bio}>
                I'm a game developer from Arizona with a passion for
                building games that are easy to pick up and hard to put down. I
                founded AKURO STUDIO as my personal dev label for indie projects
                and game jam entries. When I'm not writing C# in Unity, I'm
                usually reading game design theory, dissecting what makes a game
                feel <em>good</em>, or speedrunning something terrible.
              </p>
            </div>

            <motion.div
              className={styles.avatarWrap}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              title="Replace with a photo by swapping this emoji for an <img> element"
            >
              👾
            </motion.div>
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
                <h2>What I Care About</h2>
                <ul>
                  {INTERESTS.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Radar chart */}
              <div className={styles.sectionBlock}>
                <h2>Skills Overview</h2>
                <RadarChart />
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
                  {funFacts.map(({ icon, fact }) => (
                    <li key={fact}>{icon} {fact}</li>
                  ))}
                </ul>
              </div>

              {/* The studio */}
              <div className={styles.sectionBlock}>
                <h2>AKURO STUDIO</h2>
                <p>
                  AKURO STUDIO is my solo dev label — the name under which I
                  release personal games and experiments. The name reflects my
                  philosophy: fast, impactful, electric. Every game I ship under
                  this banner is a chance to try something new.
                </p>
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-6)' }}>
                <Link to="/portfolio" className="btn btn-primary">See My Games</Link>
                <Link to="/contact" className="btn btn-outline">Get In Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
