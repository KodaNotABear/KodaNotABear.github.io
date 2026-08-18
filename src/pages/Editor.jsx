import { useEffect, useMemo, useState } from 'react'
import { parsePost } from '../lib/markdown'
import PostBody from '../components/PostBody'
import template from '../posts/_template.md?raw'
import postStyles from './BlogPost.module.css'
import styles from './Editor.module.css'

// Dev-only markdown editor with a live preview of the real post rendering.
// Not linked anywhere and excluded from production builds (see App.jsx).

const DRAFT_KEY = 'devlog-editor-draft'

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled'
}

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  return Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Editor() {
  const [text, setText] = useState(() => localStorage.getItem(DRAFT_KEY) ?? template)
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = 'Devlog Editor · AKURO STUDIO' }, [])

  useEffect(() => {
    const id = setTimeout(() => localStorage.setItem(DRAFT_KEY, text), 300)
    return () => clearTimeout(id)
  }, [text])

  const post = useMemo(() => parsePost(text, 'preview'), [text])
  const filename = `src/posts/${slugify(post.title)}.md`

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const reset = () => {
    if (confirm('Replace the current draft with the template?')) setText(template)
  }

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>devlog editor · dev only</span>
        <span className={styles.filename}>save as: {filename}</span>
        <div className={styles.toolbarActions}>
          <button className={styles.toolbarBtn} onClick={copy}>{copied ? 'copied ✓' : 'copy markdown'}</button>
          <button className={styles.toolbarBtn} onClick={reset}>reset to template</button>
        </div>
      </div>

      <div className={styles.split}>
        <textarea
          className={styles.input}
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck="false"
          aria-label="Markdown source"
        />

        <div className={styles.preview}>
          <section className={`${postStyles.header} grid-zone`}>
            <div className="container">
              <div className={postStyles.postMeta}>
                <span className={postStyles.postDate}>{formatDate(post.date)}</span>
                <div className={postStyles.postTags}>
                  {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <span className={postStyles.readTime}>{post.readTime} read</span>
              </div>
              <h1 className={postStyles.postTitle}>{post.title}</h1>
              {post.excerpt && <p className={postStyles.postExcerpt}>{post.excerpt}</p>}
            </div>
          </section>
          <PostBody body={post.body} animate={false} />
        </div>
      </div>
    </main>
  )
}
