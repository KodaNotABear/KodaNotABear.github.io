import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { posts } from '../data/posts'
import styles from './BlogPost.module.css'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { id } = useParams()
  const post = posts.find(p => p.id === id)

  if (!post) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.notFound}>
            <p className={styles.eyebrow}>// 404</p>
            <h1>Post not found</h1>
            <Link to="/devlog" className="btn btn-primary">← Back to Devlog</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link to="/devlog" className={styles.backLink}>← Devlog</Link>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>{formatDate(post.date)}</span>
              <div className={styles.postTags}>
                {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
              <span className={styles.readTime}>{post.readTime} read</span>
            </div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        <motion.article
          className={styles.postBody}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {post.body?.map((block, i) => {
            if (block.type === 'h2') return <h2 key={i} className={styles.bodyH2}>{block.text}</h2>
            if (block.type === 'h3') return <h3 key={i} className={styles.bodyH3}>{block.text}</h3>
            return <p key={i} className={styles.bodyP}>{block.text}</p>
          })}
        </motion.article>

        <div className={styles.footer}>
          <Link to="/devlog" className="btn btn-secondary">← Back to Devlog</Link>
        </div>
      </div>
    </main>
  )
}
