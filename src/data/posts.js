// ── Devlog / Blog posts ───────────────────────────────────
// Posts are markdown files in src/posts/. The filename becomes the URL slug
// (my-post.md → /devlog/my-post). Files starting with _ are skipped, and so
// is any post with `draft: true` in its frontmatter. See src/posts/_template.md
// for the format, or run `npm run dev` and open /editor to draft with a live
// preview.

import { parsePost } from '../lib/markdown.js'

const files = import.meta.glob(['../posts/*.md', '!../posts/_*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const posts = Object.entries(files)
  .map(([path, raw]) => parsePost(raw, path.split('/').pop().replace(/\.md$/, '')))
  .filter(post => !post.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1))
