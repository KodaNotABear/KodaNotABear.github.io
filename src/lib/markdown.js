// ── Devlog markdown parser ────────────────────────────────
// Posts are .md files in src/posts/ with a small frontmatter header.
// This module is pure JS with no browser or Vite dependencies so the
// prerender script can use it under plain Node as well.
//
// Supported block syntax:
//   ## Heading            → h2
//   ### Heading           → h3
//   ![alt](src "caption") → img, or clip when src ends in .mp4/.webm
//   @interactive name     → interactive piece from components/interactive.js
//   blank-line-separated  → paragraphs (inline **bold**, *italic*, `code`,
//                           [links](url) are handled at render time)

const MEDIA_RE = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/
const CLIP_RE = /\.(mp4|webm)$/i

function parseFrontmatter(raw) {
  const meta = {}
  let content = raw
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (match) {
    content = raw.slice(match[0].length)
    for (const line of match[1].split(/\r?\n/)) {
      const sep = line.indexOf(':')
      if (sep === -1) continue
      const key = line.slice(0, sep).trim()
      let value = line.slice(sep + 1).trim()
      if (key === 'tags') {
        value = value.replace(/^\[|\]$/g, '').split(',').map(t => t.trim()).filter(Boolean)
      } else if (value === 'true' || value === 'false') {
        value = value === 'true'
      }
      if (key) meta[key] = value
    }
  }
  return { meta, content }
}

function parseBlocks(content) {
  const blocks = []
  let paragraph = []

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') })
      paragraph = []
    }
  }

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) { flush(); continue }

    if (line.startsWith('### ')) {
      flush()
      blocks.push({ type: 'h3', text: line.slice(4).trim() })
      continue
    }
    if (line.startsWith('## ')) {
      flush()
      blocks.push({ type: 'h2', text: line.slice(3).trim() })
      continue
    }
    if (line.startsWith('@interactive ')) {
      flush()
      blocks.push({ type: 'interactive', name: line.slice('@interactive '.length).trim() })
      continue
    }
    const media = line.match(MEDIA_RE)
    if (media) {
      flush()
      const [, alt, src, caption] = media
      blocks.push({ type: CLIP_RE.test(src) ? 'clip' : 'img', src, alt, caption: caption || '' })
      continue
    }
    paragraph.push(line)
  }
  flush()
  return blocks
}

function computeReadTime(blocks) {
  const words = blocks
    .filter(b => b.text)
    .reduce((n, b) => n + b.text.split(/\s+/).length, 0)
  return `${Math.max(1, Math.round(words / 200))} min`
}

// Raw markdown → post object matching the shape the site has always used.
// The id (URL slug) comes from the filename.
export function parsePost(raw, id) {
  const { meta, content } = parseFrontmatter(raw)
  const body = parseBlocks(content)
  return {
    id,
    title: meta.title || id,
    date: meta.date || '',
    tags: meta.tags || [],
    excerpt: meta.excerpt || '',
    readTime: meta.readTime || computeReadTime(body),
    draft: meta.draft === true,
    body,
  }
}
