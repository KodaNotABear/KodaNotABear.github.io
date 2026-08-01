import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { posts } from '../data/posts'
import { getInteractive } from '../components/interactive'
import styles from './BlogPost.module.css'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Split the body so an interactive piece can sit outside the prose column and
// the page container. A CSS breakout with calc(50% - 50vw) does not work here:
// .postBody is left-aligned rather than centred, so its 50% is half the column
// rather than half the page, and the piece lands off-screen to the left.
function toSegments(body = []) {
  const segments = []
  for (const block of body) {
    if (block.type === 'interactive') {
      segments.push({ interactive: block.name })
      continue
    }
    const last = segments[segments.length - 1]
    if (last && last.blocks) last.blocks.push(block)
    else segments.push({ blocks: [block] })
  }
  return segments
}

function renderBlock(block, i) {
  if (block.type === 'h2') return <h2 key={i} className={styles.bodyH2}>{block.text}</h2>
  if (block.type === 'h3') return <h3 key={i} className={styles.bodyH3}>{block.text}</h3>
  return <p key={i} className={styles.bodyP}>{block.text}</p>
}

export default function BlogPost() {
  const { id } = useParams()
  const post = posts.find(p => p.id === id)

  if (!post) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.notFound}>
            <p className={styles.eyebrow}>404</p>
            <h1>Post not found</h1>
            <Link to="/devlog" className="btn btn-primary">← Back to Devlog</Link>
          </div>
        </div>
      </main>
    )
  }

  const segments = toSegments(post.body)
  let proseIndex = 0

  return (
    <main className={styles.page}>
      <section className={`${styles.header} grid-zone`}>
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

      {segments.map((seg, si) => {
        if (seg.interactive) {
          const Piece = getInteractive(seg.interactive)
          return Piece ? <Piece key={`i${si}`} /> : null
        }
        const first = proseIndex++ === 0
        return (
          <div className="container" key={`s${si}`}>
            <motion.article
              className={`${styles.postBody} ${first ? '' : styles.postBodyCont}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: first ? 0.15 : 0, duration: 0.5 }}
            >
              {seg.blocks.map(renderBlock)}
            </motion.article>
          </div>
        )
      })}

      <div className="container">
        <div className={styles.footer}>
          <Link to="/devlog" className="btn btn-secondary">← Back to Devlog</Link>
        </div>
      </div>
    </main>
  )
}
