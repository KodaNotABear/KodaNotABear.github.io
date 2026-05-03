import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './About.module.css'

const EXPERIENCE = [
  {
    date: 'Aug 2025 – May 2026',
    title: 'Software Engineering Intern',
    org: 'Pixel Pirate Studio',
    desc: 'Worked on Off-Road Champion, a mobile Unity game. Designed and implemented a player onboarding system to guide new players through core mechanics, improving early-game retention. Gained hands-on professional game development pipeline experience.',
  },
  {
    date: '2022 – 2026',
    title: 'B.S. Computer Science — Software Engineering Focus',
    org: 'Arizona State University',
    desc: 'Relevant coursework: Data Structures, Algorithms, Software Engineering, Computer Graphics, Game Development, Operating Systems, Database Systems.',
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
  { icon: '⚡', fact: 'Founded Thunderbyte Studio as a solo dev label' },
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
                founded Thunderbyte Studio as my personal dev label for indie projects
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
                <h2>Experience &amp; Education</h2>
                <div className={styles.timeline}>
                  {EXPERIENCE.map(({ date, title, org, desc }) => (
                    <div key={title} className={styles.timelineItem}>
                      <span className={styles.timelineDot} />
                      <p className={styles.timelineDate}>{date}</p>
                      <p className={styles.timelineTitle}>{title}</p>
                      <p className={styles.timelineOrg}>{org}</p>
                      <p className={styles.timelineDesc}>{desc}</p>
                    </div>
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
                <h2>Thunderbyte Studio</h2>
                <p>
                  Thunderbyte Studio is my solo dev label — the name under which I
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
