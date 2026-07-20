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

// Site palette (src/styles/global.css)
const BG = '#0a0b0f'
const CYAN = '#00d4ff'
const VIOLET = '#7c3aed'
const TEXT = '#e8eaf0'
const TEXT2 = '#8892a4'
const GREEN = '#22d3a0'

const BOLT = 'M13 2L4.5 13.5H11L10 22L20.5 9.5H14L13 2Z'

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
    ${gridDefs('grid', 48, 'rgba(0,212,255,0.05)')}
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${VIOLET}"/>
    </linearGradient>
    <radialGradient id="orbC"><stop offset="0" stop-color="rgba(0,212,255,0.16)"/><stop offset="1" stop-color="rgba(0,212,255,0)"/></radialGradient>
    <radialGradient id="orbV"><stop offset="0" stop-color="rgba(124,58,237,0.18)"/><stop offset="1" stop-color="rgba(124,58,237,0)"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="1040" cy="90" r="320" fill="url(#orbC)"/>
  <circle cx="140" cy="600" r="360" fill="url(#orbV)"/>

  <text x="92" y="148" font-family="JetBrains Mono" font-size="26" fill="${CYAN}">// akuro.studio</text>

  <rect x="90" y="178" width="436" height="46" rx="23" fill="rgba(34,211,160,0.07)" stroke="rgba(34,211,160,0.45)"/>
  <circle cx="118" cy="201" r="5" fill="${GREEN}"/>
  <text x="136" y="209" font-family="JetBrains Mono" font-size="19" fill="${GREEN}">OPEN TO WORK · CS GRADUATE MAY 2026</text>

  <text x="86" y="356" font-family="Rajdhani" font-weight="700" font-size="128" letter-spacing="2" fill="${TEXT}">ETHAN</text>
  <text x="86" y="474" font-family="Rajdhani" font-weight="700" font-size="128" letter-spacing="2" fill="url(#name)">PETERSON</text>

  <text x="92" y="532" font-family="Rajdhani" font-weight="600" font-size="33" letter-spacing="3" fill="${TEXT2}">GAME PROGRAMMER &amp; DESIGNER · UNITY / C#</text>

  <g transform="translate(92 564) scale(1.4)" fill="${CYAN}"><path d="${BOLT}"/></g>
  <text x="136" y="589" font-family="JetBrains Mono" font-size="21" letter-spacing="4" fill="${TEXT2}">AKURO STUDIO</text>
  <text x="1108" y="589" text-anchor="end" font-family="JetBrains Mono" font-size="21" fill="${CYAN}">akuro.studio</text>
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
    ${gridDefs('ccmaj', 112, 'rgba(0,212,255,0.06)')}
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

// ── 3. Placeholder avatar (640×640) ─────────────────────────
function avatar() {
  const S = 640
  const svg = `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('agrid', 40, 'rgba(0,212,255,0.05)')}
    <radialGradient id="abg"><stop offset="0" stop-color="#181d27"/><stop offset="1" stop-color="${BG}"/></radialGradient>
    <linearGradient id="abolt" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${VIOLET}"/>
    </linearGradient>
    <filter id="aglow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  <rect width="${S}" height="${S}" fill="url(#abg)"/>
  <rect width="${S}" height="${S}" fill="url(#agrid)"/>
  <circle cx="320" cy="320" r="278" fill="none" stroke="rgba(0,212,255,0.55)" stroke-width="5"/>
  <circle cx="320" cy="320" r="246" fill="none" stroke="rgba(124,58,237,0.4)" stroke-width="2" stroke-dasharray="6 14"/>
  <g transform="translate(176 158) scale(12)">
    <path d="${BOLT}" fill="url(#abolt)" filter="url(#aglow)" opacity="0.55"/>
    <path d="${BOLT}" fill="url(#abolt)"/>
  </g>
  <text x="320" y="560" text-anchor="middle" font-family="JetBrains Mono" font-size="26" letter-spacing="10" fill="${TEXT2}">AKURO STUDIO</text>
</svg>`
  render(svg, join(ROOT, 'public/images/avatar.png'), S)
}

ogBanner()
createCognition()
avatar()
