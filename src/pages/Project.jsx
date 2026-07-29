import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProject, nextProject } from '../data/projects'
import { statusVariant } from '../utils/status'
import { GitHubIcon, ItchIcon } from '../components/Icons'
import NotFound from './NotFound'
import styles from './Project.module.css'

export default function Project() {
  const { id } = useParams()
  const project = getProject(id)
  const next = nextProject(id)

  useEffect(() => {
    if (project) document.title = `${project.title} · AKURO STUDIO`
    return () => { document.title = 'Ethan Peterson · AKURO STUDIO' }
  }, [project])

  if (!project) return <NotFound />

  const { title, studio, role, period, status, tagline, tags, image, links, gallery = [], caseStudy = [] } = project

  return (
    <main className={styles.page}>
      {/* ── Head ── */}
      <section className={`${styles.head} grid-zone`}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link to="/portfolio" className={styles.back}>&larr; All work</Link>
            <p className={styles.eyebrow}>{studio}</p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.tagline}>{tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Art ── */}
      <motion.section
        className={styles.artWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="container">
          {image ? (
            <img className={styles.art} src={image} alt={title} />
          ) : (
            <div className={styles.artGhost} aria-hidden>{title}</div>
          )}
        </div>
      </motion.section>

      {/* ── Body ── */}
      <section className={styles.body}>
        <div className={`container ${styles.bodyGrid}`}>
          {/* Meta rail */}
          <aside className={styles.meta}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Role</div>
              <div className={styles.metaValue}>{role}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Timeframe</div>
              <div className={styles.metaValue}>{period}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Status</div>
              <div className={styles.metaValue}><span className={styles.statusChip} data-variant={statusVariant(status)}>{status}</span></div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Stack</div>
              <div className={styles.metaTags}>
                {tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {(links.github || links.itch || links.demo) && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>Links</div>
                <div className={styles.metaLinks}>
                  {links.github && (
                    <a href={links.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      <GitHubIcon size={14} /> Source
                    </a>
                  )}
                  {links.itch && (
                    <a href={links.itch} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <ItchIcon size={14} /> Play
                    </a>
                  )}
                  {links.demo && (
                    <a href={links.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live demo
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Case study */}
          <div className={styles.content}>
            {caseStudy.map(({ heading, paragraphs = [], bullets = [] }, i) => (
              <motion.div
                key={heading}
                className={styles.section}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <h2 className={styles.sectionTitle}><span>*</span> {heading}</h2>
                {paragraphs.map(p => <p key={p} className={styles.paragraph}>{p}</p>)}
                {bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                )}
              </motion.div>
            ))}

            {gallery.length > 0 && (
              <motion.div
                className={styles.section}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4 }}
              >
                <h2 className={styles.sectionTitle}><span>*</span> Screenshots</h2>
                <div className={styles.gallery}>
                  {gallery.map(src => (
                    <img key={src} src={src} alt={`${title} screenshot`} loading="lazy" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Next project ── */}
      {next && next.id !== id && (
        <section className={styles.nextWrap}>
          <div className="container">
            <Link to={`/portfolio/${next.id}`} className={styles.next}>
              <span className={styles.nextLabel}>Next project</span>
              <span className={styles.nextTitle}>{next.title} &rarr;</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
