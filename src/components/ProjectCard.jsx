import { motion } from 'framer-motion'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, index = 0 }) {
  const {
    title,
    studio,
    description,
    tags = [],
    image,
    emoji = '🎮',
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

      <div className={styles.thumb}>
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className={styles.thumbPlaceholder}>{emoji}</div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
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

      {(links.itch || links.github || links.demo) && (
        <div className={styles.actions}>
          {links.itch && (
            <a href={links.itch} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionPrimary}`}>
              🎮 Play / Download
            </a>
          )}
          {links.demo && (
            <a href={links.demo} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionPrimary}`}>
              ▶ Live Demo
            </a>
          )}
          {links.github && (
            <a href={links.github} target="_blank" rel="noopener noreferrer"
               className={`${styles.actionBtn} ${styles.actionSecondary}`}>
              ⌥ Source
            </a>
          )}
        </div>
      )}
    </motion.article>
  )
}
