import { useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './ProjectCard.module.css'

function useTilt() {
  const ref = useRef(null)
  const onMouseMove = (e) => {
    const card = ref.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5
    const y = (e.clientY - top)  / height - 0.5
    card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`
  }
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return { ref, onMouseMove, onMouseLeave }
}

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

  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt()

  return (
    <motion.article
      ref={tiltRef}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: 'transform', transition: 'transform 0.15s ease, box-shadow 0.3s ease' }}
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
