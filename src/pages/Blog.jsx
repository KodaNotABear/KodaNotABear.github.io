import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { posts } from '../data/posts'
import { PenIcon } from '../components/Icons'
import styles from './Blog.module.css'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Blog() {
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className={styles.eyebrow}>// devlog</p>
            <h1 className="section-title">Dev Blog</h1>
            <p className={styles.subtitle}>
              Behind-the-scenes looks at projects, game design deep-dives,
              post-mortems, and lessons from game jams.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <div className={styles.postList}>
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              className={styles.postCard}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={`/devlog/${post.id}`} className={styles.postCardLink}>
                <div>
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>{formatDate(post.date)}</span>
                    <div className={styles.postTags}>
                      {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                </div>
                <span className={styles.readTime}>{post.readTime} read</span>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}><PenIcon size={36} /></div>
          <h2>More posts coming soon</h2>
          <p>
            I'll be writing regularly about Unity, game design, and the
            AKURO STUDIO development process.
          </p>
        </div>
      </div>
    </main>
  )
}
