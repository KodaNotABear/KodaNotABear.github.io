import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { FlagIcon } from '../components/Icons'
import styles from './Portfolio.module.css'

// Only offer filters that match more than one project; one-off tags are
// noise in a filter bar even if they belong on the cards themselves.
const tagCounts = projects.flatMap(p => p.tags).reduce((acc, t) => {
  acc[t] = (acc[t] || 0) + 1
  return acc
}, {})
const ALL_TAGS = ['All', ...Object.keys(tagCounts).filter(t => tagCounts[t] > 1)]

const internship = projects.find(p => p.id === 'pixel-pirate-internship')
const otherProjects = projects.filter(p => p.id !== 'pixel-pirate-internship')

export default function Portfolio() {
  const [activeTag, setActiveTag] = useState('All')

  const filtered = activeTag === 'All'
    ? otherProjects
    : otherProjects.filter(p => p.tags.includes(activeTag))

  return (
    <main className={styles.page}>
      <section className={`${styles.header} grid-zone`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className={styles.eyebrow}>selected work</p>
            <h1 className="section-title">Portfolio</h1>
            <p className={styles.subtitle}>
              Game projects, plus engineering work from along the way.
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
              <p className={styles.spotlightEyebrow}><FlagIcon size={14} /> Professional Experience · Aug 2025 – May 2026</p>
              <h2 className={styles.spotlightTitle}>{internship.title}</h2>
              <p className={styles.spotlightOrg}>{internship.studio}</p>
              <p className={styles.spotlightDesc}>{internship.description}</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
                {internship.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to={`/portfolio/${internship.id}`} className="btn btn-primary">
                  See the full project &rarr;
                </Link>
              </div>
            </motion.div>
          )}

          {/* Filter bar: only worth showing once there are enough projects to filter */}
          {otherProjects.length > 3 && (
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
          )}

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
