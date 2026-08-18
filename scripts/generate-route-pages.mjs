import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

// siteMeta.js pulls in posts.js, which loads markdown posts via
// import.meta.glob — a Vite feature plain Node cannot resolve. Load the
// module through a throwaway Vite dev server instead of importing it.
const vite = await createServer({ server: { middlewareMode: true }, logLevel: 'error' })
const { getPrerenderRoutes, getRouteMeta, siteUrl } = await vite.ssrLoadModule('/src/data/siteMeta.js')

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function htmlForRoute(baseHtml, route) {
  const meta = getRouteMeta(route)
  const canonicalUrl = `${siteUrl}${meta.path === '/' ? '/' : meta.path}`
  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)
  const canonical = escapeAttr(canonicalUrl)

  return baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`)
}

const indexHtml = await readFile(indexPath, 'utf8')
const routes = getPrerenderRoutes()

for (const route of routes) {
  const cleanRoute = route === '/' ? '/' : route.replace(/\/+$/, '')
  const outputPath = cleanRoute === '/'
    ? indexPath
    : join(distDir, cleanRoute.slice(1), 'index.html')

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, htmlForRoute(indexHtml, cleanRoute))
}

await vite.close()
console.log(`Generated ${routes.length} route entry pages.`)
