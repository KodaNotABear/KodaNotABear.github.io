import { motion } from 'framer-motion'
import { EmailIcon, GlobeIcon, GitHubIcon, LinkedInIcon } from '../components/Icons'
import styles from './Resume.module.css'

const EXPERIENCE = [
  {
    title: 'Game Development Intern',
    org: 'Pixel Pirate Studio',
    date: 'Aug 2025 – May 2026',
    bullets: [
      'Designed and implemented the player onboarding system for Off-Road Champion, a mobile Unity racing game, guiding new players through core mechanics in their first session',
      'Shipped a tournament update where players compete for virtual currency, connected to a web portal for live standings and rewards',
      'Ported Off-Road Champion to WebGL for browser play',
      'Collaborated with designers and producers in an Agile environment across daily standups and sprint planning',
    ],
  },
  {
    title: 'Data Acquisition Developer',
    org: 'Sun Devil Motorsports (Formula SAE)',
    date: 'Jun 2022 – 2025',
    bullets: [
      'Designed and tested on-vehicle data acquisition tools for ASU\'s Formula SAE racing team across three seasons',
      'Built embedded systems for live telemetry capture, including an infrared lap timing system used for performance analysis',
      'Collaborated with mechanical and electrical sub-teams to integrate data systems across the car',
    ],
  },
]

const EDUCATION = [
  {
    title: 'B.S. Computer Science, Software Engineering Focus',
    org: 'Arizona State University',
    date: 'May 2026',
    bullets: [
      'Focus: Software Engineering with an emphasis on game development and interactive systems',
      'Relevant coursework: Data Structures, Algorithms, Software Engineering, Computer Graphics, Game Development, Operating Systems',
      'Activities: Formula SAE (Sun Devil Motorsports, 2022–2025) · Software Developers Association (SoDA)',
    ],
  },
]

const PROJECTS = [
  {
    title: 'Wincon',
    org: 'League of Legends Ranked Review Tool · Open Source',
    date: 'Jul 2026 – Present',
    bullets: [
      'Built a TypeScript and React tool that turns Riot Match-V5 timelines into explainable coaching notes, lane-opponent comparisons, death maps, and animated ten-player replays',
      'Implemented rate-limited API caching, an anonymized public showcase, and 43 automated tests covering metrics, insight rules, replay moments, focus tracking, and report generation',
    ],
  },
  {
    title: 'Noclip',
    org: 'Backrooms World Type for Minecraft · Open Source',
    date: 'Jul 2026 – Present',
    bullets: [
      'Building a backrooms world type in Java (NeoForge 1.21.1): a seed-stable procedural maze generator with zoned variety and guaranteed connectivity, plus data-driven room templates (structure NBT + JSON) loadable from any datapack',
    ],
  },
  {
    title: 'Create: Cognition',
    org: 'AKURO STUDIO · Create Add-on for Minecraft',
    date: 'Jun 2026 – Present',
    bullets: [
      'Built a Java add-on for NeoForge 1.21.1 with multiblock compute networks, flood-fill discovery, proportional allocation, and mob-loot simulation without spawned entities',
    ],
  },
]

const SKILLS = [
  { group: 'Languages', items: ['C# (Unity, ASP.NET)', 'C++', 'Java', 'Python', 'JavaScript / React', 'HTML & CSS'] },
  { group: 'Engines & Tools', items: ['Unity (3+ years)', 'Git / GitHub', 'Blender', 'FMOD', 'Rider / Visual Studio'] },
  { group: 'Game Dev', items: ['Gameplay Systems', 'UI Implementation', 'Level Design', 'WebGL Builds'] },
  { group: 'Engineering', items: ['Embedded Systems', 'Data Acquisition', 'Game Servers (Docker / VPS)', 'Agile / Scrum', 'Code Review'] },
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
      <section className={`${styles.header} grid-zone`}>
        <div className="container">
          <motion.div
            className={styles.headerInner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <p className={styles.eyebrow}>the paper version</p>
              <h1 className="section-title">Resume</h1>
            </div>
            <a href="/resume.pdf" className="btn btn-primary" download>
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
                <span className={styles.contactItem}><EmailIcon size={14} /> <a href="mailto:koda@akuro.studio">koda@akuro.studio</a></span>
                <span className={styles.contactItem}><GlobeIcon size={14} /> <a href="https://akuro.studio" target="_blank" rel="noopener noreferrer">akuro.studio</a></span>
                <span className={styles.contactItem}><GitHubIcon size={14} /> <a href="https://github.com/KodaNotABear" target="_blank" rel="noopener noreferrer">github.com/KodaNotABear</a></span>
                <span className={styles.contactItem}><LinkedInIcon size={14} /> <a href="https://www.linkedin.com/in/ethan-peterson-sweng/" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
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
