import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getInteractive } from './interactive'
import styles from './PostBody.module.css'

// Inline markdown: `code`, **bold**, *italic*, [links](url). No nesting.
const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/

function renderInline(text) {
  const nodes = []
  let last = 0
  for (const match of text.matchAll(INLINE_RE)) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('`')) {
      nodes.push(<code key={match.index}>{token.slice(1, -1)}</code>)
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={match.index}>{token.slice(1, -1)}</em>)
    } else {
      const [, label, href] = token.match(LINK_RE)
      nodes.push(href.startsWith('/')
        ? <Link key={match.index} to={href}>{label}</Link>
        : <a key={match.index} href={href} target="_blank" rel="noreferrer">{label}</a>)
    }
    last = match.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function renderBlock(block, i) {
  if (block.type === 'h2') return <h2 key={i} className={styles.bodyH2}>{block.text}</h2>
  if (block.type === 'h3') return <h3 key={i} className={styles.bodyH3}>{block.text}</h3>
  if (block.type === 'img' || block.type === 'clip') {
    return (
      <figure key={i} className={styles.media}>
        {block.type === 'img'
          ? <img src={block.src} alt={block.alt} loading="lazy" />
          : <video src={block.src} autoPlay loop muted playsInline preload="metadata" aria-label={block.alt} />}
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    )
  }
  return <p key={i} className={styles.bodyP}>{renderInline(block.text)}</p>
}

// Split the body so an interactive piece can sit outside the prose column and
// the page container. A CSS breakout with calc(50% - 50vw) does not work here:
// the prose column is left-aligned rather than centred, so its 50% is half the
// column rather than half the page, and the piece lands off-screen to the left.
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

// Renders a post body (the parsed block array). animate=false gives a static
// render for the editor preview so typing does not replay entry animations.
export default function PostBody({ body, animate = true }) {
  const segments = toSegments(body)
  let proseIndex = 0

  return segments.map((seg, si) => {
    if (seg.interactive) {
      const Piece = getInteractive(seg.interactive)
      return Piece ? <Piece key={`i${si}`} /> : null
    }
    const first = proseIndex++ === 0
    const className = `${styles.postBody} ${first ? '' : styles.postBodyCont}`
    return (
      <div className="container" key={`s${si}`}>
        {animate ? (
          <motion.article
            className={className}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: first ? 0.15 : 0, duration: 0.5 }}
          >
            {seg.blocks.map(renderBlock)}
          </motion.article>
        ) : (
          <article className={className}>{seg.blocks.map(renderBlock)}</article>
        )}
      </div>
    )
  })
}
