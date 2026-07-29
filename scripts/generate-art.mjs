// Build-time art generation: og banner, Create: Cognition card, placeholder avatar.
// Run with: npm run art
// Output is deterministic so regenerating produces identical files.
// Policy: no invented product imagery (mock screenshots, fake readouts). Cards
// either show real assets (game banners, Ethan's splash art) or no image at all.
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const FONTS = [
  join(ROOT, 'scripts/fonts/Rajdhani-Bold.ttf'),
  join(ROOT, 'scripts/fonts/Rajdhani-SemiBold.ttf'),
  join(ROOT, 'scripts/fonts/JetBrainsMono-Regular.ttf'),
  join(ROOT, 'scripts/fonts/JetBrainsMono-Bold.ttf'),
]

// Site palette (src/styles/global.css), Graphite theme
const BG = '#0f0f10'
const ACCENT = '#7fa3e8'
const TEXT = '#ececec'
const TEXT2 = '#8b8b8d'
const LINE = 'rgba(255,255,255,0.05)'

// Three rounded bars rotated 0/60/120 degrees make the asterisk mark
const asterisk = (x, y, scale, color) => `
  <g transform="translate(${x} ${y}) scale(${scale})" fill="${color}">
    <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4"/>
    <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4" transform="rotate(60)"/>
    <rect x="-2.4" y="-12" width="4.8" height="24" rx="2.4" transform="rotate(120)"/>
  </g>`

function render(svg, outPath, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Rajdhani' },
  })
  const png = resvg.render().asPng()
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, png)
  console.log(`✓ ${outPath} (${(png.length / 1024).toFixed(0)} KB)`)
}

const gridDefs = (id, size, color) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="1"/>
  </pattern>`

// ── 1. Open Graph banner (1200×630) ─────────────────────────
function ogBanner() {
  const W = 1200, H = 630
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('grid', 48, LINE)}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  ${asterisk(104, 140, 1.1, ACCENT)}
  <text x="132" y="150" font-family="JetBrains Mono" font-size="26" letter-spacing="4" fill="${ACCENT}">AKURO.STUDIO</text>

  <rect x="90" y="186" width="452" height="46" rx="4" fill="none" stroke="rgba(255,255,255,0.14)"/>
  <circle cx="118" cy="209" r="5" fill="${ACCENT}"/>
  <text x="136" y="217" font-family="JetBrains Mono" font-size="19" letter-spacing="2" fill="${TEXT}">OPEN TO WORK · CS GRADUATE MAY 2026</text>

  <text x="86" y="368" font-family="Rajdhani" font-weight="700" font-size="132" letter-spacing="2" fill="${TEXT}">ETHAN</text>
  <text x="86" y="486" font-family="Rajdhani" font-weight="700" font-size="132" letter-spacing="2" fill="${TEXT}">PETERSON<tspan fill="${ACCENT}">.</tspan></text>

  <rect x="90" y="512" width="84" height="6" fill="${ACCENT}"/>
  <text x="92" y="556" font-family="Rajdhani" font-weight="600" font-size="33" letter-spacing="3" fill="${TEXT2}">GAME PROGRAMMER &amp; DESIGNER · UNITY / C# / JAVA</text>

  <text x="1108" y="150" text-anchor="end" font-family="JetBrains Mono" font-size="21" fill="${TEXT2}">EST. ARIZONA</text>
  <text x="1108" y="589" text-anchor="end" font-family="JetBrains Mono" font-size="21" fill="${ACCENT}">akuro.studio</text>
</svg>`
  render(svg, join(ROOT, 'public/og.png'), W)
}

// ── 2. Create: Cognition card (1280×720) ────────────────────
// Ethan's title splash (scripts/art-src) presented on the site
// background. No mock screens or invented readouts.
function createCognition() {
  const W = 1280, H = 720
  const splash = readFileSync(join(ROOT, 'scripts/art-src/create-cognition-title.png')).toString('base64')
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('ccmin', 28, 'rgba(217,164,65,0.05)')}
    ${gridDefs('ccmaj', 112, LINE)}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#ccmin)"/>
  <rect width="${W}" height="${H}" fill="url(#ccmaj)"/>

  <image href="data:image/png;base64,${splash}" x="250" y="150" width="780" height="319"/>

  <text x="640" y="560" text-anchor="middle" font-family="JetBrains Mono" font-size="21" letter-spacing="5" fill="${TEXT2}">CREATE ADD-ON · JAVA · NEOFORGE 1.21.1</text>
  <text x="640" y="602" text-anchor="middle" font-family="JetBrains Mono" font-size="16" letter-spacing="4" fill="#d9a441">AKURO STUDIO · IN BETA</text>
</svg>`
  render(svg, join(ROOT, 'public/images/create-cognition.png'), W)
}

// ── 3. Noclip card (1280×720) ───────────────────────────────
// Ethan's title splash on the site background, backrooms-yellow grid.
function noclip() {
  const W = 1280, H = 720
  const splash = readFileSync(join(ROOT, 'scripts/art-src/noclip-title.png')).toString('base64')
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('ncmin', 28, 'rgba(224,178,66,0.06)')}
    ${gridDefs('ncmaj', 112, 'rgba(224,178,66,0.09)')}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#ncmin)"/>
  <rect width="${W}" height="${H}" fill="url(#ncmaj)"/>

  <image href="data:image/png;base64,${splash}" x="220" y="180" width="840" height="259"/>

  <text x="640" y="560" text-anchor="middle" font-family="JetBrains Mono" font-size="21" letter-spacing="5" fill="${TEXT2}">MINECRAFT WORLD TYPE · JAVA · NEOFORGE 1.21.1</text>
  <text x="640" y="602" text-anchor="middle" font-family="JetBrains Mono" font-size="16" letter-spacing="4" fill="#e0b242">OPEN SOURCE · IN DEVELOPMENT</text>
</svg>`
  render(svg, join(ROOT, 'public/images/noclip.png'), W)
}

ogBanner()
createCognition()
noclip()
