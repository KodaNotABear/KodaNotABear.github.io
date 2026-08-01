import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ItchIcon, GitHubIcon, ModrinthIcon } from './Icons'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, index = 0 }) {
  const {
    id,
    title,
    studio,
    description,
    tags = [],
    image,
    imageFit = 'cover',
    links = {},
    featured = false,
  } = project

  return (
    <motion.article
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {featured && <span className={styles.featuredBadge}>Featured</span>}

      <Link to={`/portfolio/${id}`} className={styles.thumb} aria-label={`${title} details`}>
        {image ? (
          <img
            className={imageFit === 'contain' ? styles.containArt : undefined}
            src={image}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className={styles.thumbPlaceholder} aria-hidden>{title}</div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}><Link to={`/portfolio/${id}`}>{title}</Link></h3>
            {studio && <p className={styles.studio}>{studio}</p>}
          </div>
        </div>

        <p className={styles.description}>{description}</p>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Link to={`/portfolio/${id}`} className={`${styles.actionBtn} ${styles.actionPrimary}`}>
          Read more &rarr;
        </Link>
          {links.itch && (
            <a href={links.itch} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionPrimary}`}>
              <ItchIcon size={14} /> Play / Download
            </a>
          )}
          {links.modrinth && (
            <a href={links.modrinth} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionPrimary}`}>
              <ModrinthIcon size={14} /> Download
            </a>
          )}
          {links.demo && (
            links.demo.startsWith('/') ? (
              <a href={links.demo} className={`${styles.actionBtn} ${styles.actionPrimary}`}>
                {links.demoLabel || 'Open demo'}
              </a>
            ) : (
              <a href={links.demo} target="_blank" rel="noopener noreferrer"
                 className={`${styles.actionBtn} ${styles.actionPrimary}`}>
                ▶ Live Demo
              </a>
            )
          )}
          {links.github && (
            <a href={links.github} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionSecondary}`}>
              <GitHubIcon size={14} /> Source
            </a>
          )}
      </div>
    </motion.article>
  )
}
