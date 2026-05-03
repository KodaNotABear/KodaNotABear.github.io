import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import styles from './Portfolio.module.css'

const ALL_TAGS = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))]

const internship = projects.find(p => p.id === 'pixel-pirate-internship')
const otherProjects = projects.filter(p => p.id !== 'pixel-pirate-internship')

export default function Portfolio() {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All'
    ? otherProjects
    : otherProjects.filter(p => p.tags.includes(activeTag))

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className={styles.eyebrow}>// my work</p>
            <h1 className="section-title">Portfolio</h1>
            <p className={styles.subtitle}>
              Games, prototypes, and experiments built with Unity. From 48-hour
              game jams to professional internship work.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-12)' }}>
        <div className="container">

          {/* Internship Spotlight */}
          {internship && (
            <motion.div
              className={styles.spotlight}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className={styles.spotlightEyebrow}>🏁 Professional Experience · Aug 2025 – May 2026</p>
              <h2 className={styles.spotlightTitle}>{internship.title}</h2>
              <p className={styles.spotlightOrg}>{internship.studio}</p>
              <p className={styles.spotlightDesc}>{internship.description}</p>
              <div className={styles.spotlightNda}>
                ⚠ Some details are restricted pending NDA expiry
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                {internship.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </motion.div>
          )}

          {/* Filter bar */}
          <div className={styles.filterBar} role="group" aria-label="Filter by tag">
            {ALL_TAGS.filter(t => t !== 'Professional').map(tag => (
              <button
                key={tag}
                className={`${styles.filterBtn} ${activeTag === tag ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className={styles.grid}>
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-16)' }}>
              No projects match that filter yet.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
