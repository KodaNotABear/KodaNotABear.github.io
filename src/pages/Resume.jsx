import { motion } from 'framer-motion'
import styles from './Resume.module.css'

// ── Data ── replace all placeholders with real content ────
const EXPERIENCE = [
  {
    title: 'Software Engineering Intern',
    org: 'Pixel Pirate Studio',
    date: 'Aug 2025 – May 2026',
    bullets: [
      'Designed and implemented a player onboarding system for Off-Road Champion, a mobile Unity game, guiding new players through core mechanics to improve early-game retention',
      'Collaborated with designers and producers in an Agile environment across daily standups and sprint planning',
    ],
  },
  {
    title: 'Founder & Lead Developer',
    org: 'AKURO STUDIO (Solo)',
    date: '2022 – Present',
    bullets: [
      'Developing Black Signal, a space horror game in Unity (C#), as a solo developer — handling all design, programming, and production',
      'Managed full game development lifecycle: concept, design, implementation, QA, and release',
      'Maintaining an itch.io presence and community engagement for published and upcoming projects',
    ],
  },
]

const EDUCATION = [
  {
    title: 'B.S. Computer Science — Software Engineering Focus',
    org: 'Arizona State University',
    date: 'May 2026',
    bullets: [
      'Focus: Software Engineering with an emphasis on game development and interactive systems',
      'Relevant coursework: Data Structures, Algorithms, Software Engineering, Computer Graphics, Game Development, Operating Systems',
    ],
  },
]

const PROJECTS = [
  {
    title: 'Off-Road Champion — Player Onboarding System',
    org: 'Pixel Pirate Studio',
    date: 'Aug 2025 – May 2026',
    bullets: [
      'Designed and built a full onboarding flow in Unity (C#) for a mobile racing game targeting new players',
      'System guided players through vehicle controls, race mechanics, and progression goals in their first session',
    ],
  },
  {
    title: 'Black Signal',
    org: 'AKURO STUDIO',
    date: '2025 – Present',
    bullets: [
      'Solo-developed space horror game in Unity (C#) inspired by Observation Duty — player monitors a derelict station through its security camera network, tracking anomalies and keeping the crew alive',
      'Designing all gameplay systems, UI, audio direction, and level layout independently',
    ],
  },
]

const SKILLS = [
  { group: 'Languages', items: ['C# (Unity)', 'Python', 'JavaScript / TypeScript', 'HTML & CSS'] },
  { group: 'Engines & Tools', items: ['Unity (3+ years)', 'Git / GitHub', 'VS Code', 'Rider / Visual Studio'] },
  { group: 'Game Dev', items: ['Gameplay Systems', 'UI Implementation', 'Level Design', 'Game Jam Development'] },
  { group: 'Soft Skills', items: ['Agile / Scrum', 'Technical Writing', 'Code Review', 'Problem Solving'] },
]

function Section({ title, children }) {
  return (
    <div className={styles.resumeSection}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function Entry({ title, org, date, bullets }) {
  return (
    <div className={styles.entry}>
      <div className={styles.entryHeader}>
        <div>
          <div className={styles.entryTitle}>{title}</div>
          <div className={styles.entryOrg}>{org}</div>
        </div>
        <span className={styles.entryDate}>{date}</span>
      </div>
      {bullets?.length > 0 && (
        <ul className={styles.entryBullets}>
          {bullets.map(b => <li key={b}>{b}</li>)}
        </ul>
      )}
    </div>
  )
}

export default function Resume() {
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <motion.div
            className={styles.headerInner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <p className={styles.eyebrow}>// résumé</p>
              <h1 className="section-title">Resume</h1>
            </div>
            <a
              href="/resume.pdf"
              className="btn btn-primary"
              download
              title="Add resume.pdf to the /public folder to enable this download"
            >
              ⬇ Download PDF
            </a>
          </motion.div>
        </div>
      </section>

      <div className={styles.resumeWrap}>
        <div className="container">
          <motion.div
            className={styles.resumeDoc}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {/* ── Doc header ── */}
            <header className={styles.docHeader}>
              <div className={styles.docName}>Ethan Peterson</div>
              <div className={styles.docTitle}>Game Programmer &amp; Designer · CS Graduate</div>
              <div className={styles.contactInfo}>
                <span className={styles.contactItem}>✉ <a href="mailto:koda@akuro.studio">koda@akuro.studio</a></span>
                <span className={styles.contactItem}>🌐 <a href="https://akuro.studio" target="_blank" rel="noopener noreferrer">akuro.studio</a></span>
                <span className={styles.contactItem}>⌥ <a href="https://github.com/KodaNotABear" target="_blank" rel="noopener noreferrer">github.com/KodaNotABear</a></span>
                <span className={styles.contactItem}>🎮 <a href="https://kodanotabear.itch.io" target="_blank" rel="noopener noreferrer">kodanotabear.itch.io</a></span>
              </div>
            </header>

            {/* ── Doc body ── */}
            <div className={styles.docBody}>
              <Section title="Experience">
                {EXPERIENCE.map(e => <Entry key={e.title + e.org} {...e} />)}
              </Section>

              <Section title="Education">
                {EDUCATION.map(e => <Entry key={e.title} {...e} />)}
              </Section>

              <Section title="Projects">
                {PROJECTS.map(e => <Entry key={e.title} {...e} />)}
              </Section>

              <Section title="Skills">
                <div className={styles.skillsGrid}>
                  {SKILLS.map(({ group, items }) => (
                    <div key={group} className={styles.skillGroup}>
                      <h3>{group}</h3>
                      <div className={styles.skillList}>
                        {items.map(s => <span key={s}>{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>


          </motion.div>
        </div>
      </div>
    </main>
  )
}
