// Build-time art generation: og banner, project card art, placeholder avatar.
// Run with: npm run art
// Output is deterministic (seeded PRNG) so regenerating produces identical files.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
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

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

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

// ── 2. Black Signal teaser (1280×720) ───────────────────────
function blackSignalTeaser() {
  const W = 1280, H = 720
  const rnd = mulberry32(0xb1ac)
  let noise = ''
  for (let i = 0; i < 1400; i++) {
    const x = Math.floor(rnd() * W)
    const y = Math.floor(rnd() * H)
    const w = 1 + Math.floor(rnd() * 4)
    const h = 1 + Math.floor(rnd() * 2)
    const cyan = rnd() < 0.08
    const o = (0.02 + rnd() * 0.06).toFixed(3)
    noise += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cyan ? CYAN : '#ffffff'}" opacity="${o}"/>`
  }
  let glitch = ''
  for (const [y, h, o] of [[173, 3, 0.07], [365, 2, 0.05], [538, 4, 0.06], [612, 2, 0.04]]) {
    glitch += `<rect x="0" y="${y}" width="${W}" height="${h}" fill="${CYAN}" opacity="${o}"/>`
  }
  const br = (x, y, sx, sy) =>
    `<path d="M ${x} ${y + 42 * sy} V ${y} H ${x + 42 * sx}" fill="none" stroke="rgba(232,234,240,0.8)" stroke-width="3"/>`
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1.5" y="2.5" fill="rgba(0,0,0,0.3)"/>
    </pattern>
    <radialGradient id="vig"><stop offset="0.55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,0.72)"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#04060a"/>
  ${noise}
  ${glitch}
  <rect width="${W}" height="${H}" fill="url(#scan)"/>

  <text x="646" y="332" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="96" letter-spacing="10" fill="${CYAN}" opacity="0.45">SIGNAL LOST</text>
  <text x="634" y="336" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="96" letter-spacing="10" fill="#ef4444" opacity="0.35">SIGNAL LOST</text>
  <text x="640" y="334" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="96" letter-spacing="10" fill="${TEXT}">SIGNAL LOST</text>
  <text x="640" y="386" text-anchor="middle" font-family="JetBrains Mono" font-size="20" letter-spacing="6" fill="${TEXT2}">ANOMALY DETECTION OFFLINE :: RECONNECTING…</text>

  <text x="64" y="78" font-family="JetBrains Mono" font-size="22" fill="#d7dee8">CAM_04 // DECK C // EXTERNAL</text>
  <circle cx="1132" cy="70" r="7" fill="#ef4444"/>
  <text x="1152" y="78" font-family="JetBrains Mono" font-size="22" fill="#d7dee8">REC</text>
  <text x="64" y="668" font-family="JetBrains Mono" font-size="18" fill="${TEXT2}">T+ 03:47:12 · FEED 4/9</text>

  <text x="1216" y="638" text-anchor="end" font-family="Rajdhani" font-weight="700" font-size="34" letter-spacing="4" fill="${CYAN}">BLACK SIGNAL</text>
  <text x="1216" y="668" text-anchor="end" font-family="JetBrains Mono" font-size="16" letter-spacing="2" fill="${TEXT2}">AKURO STUDIO · IN DEVELOPMENT</text>

  ${br(36, 36, 1, 1)}${br(W - 36, 36, -1, 1)}${br(36, H - 78, 1, -0.857)}${br(W - 36, H - 78, -1, -0.857)}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`
  render(svg, join(ROOT, 'public/images/black-signal-teaser.png'), W)
}

// ── 3. Lap timing system card (1280×720) ────────────────────
function lapTiming() {
  const W = 1280, H = 720
  // square gate pulse train
  let pulse = 'M 80 600'
  let px = 80
  for (const [flat, high] of [[120, 40], [180, 40], [150, 40]]) {
    pulse += ` h ${flat} v -56 h ${high} v 56`
    px += flat + high
  }
  pulse += ` h ${1200 - px}`
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('gmin', 24, 'rgba(124,58,237,0.05)')}
    ${gridDefs('gmaj', 120, 'rgba(0,212,255,0.08)')}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#gmin)"/>
  <rect width="${W}" height="${H}" fill="url(#gmaj)"/>

  <text x="64" y="78" font-family="JetBrains Mono" font-size="20" fill="${VIOLET}">// SUN DEVIL MOTORSPORTS :: DATA ACQUISITION</text>

  <text x="640" y="200" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="76" letter-spacing="6" fill="${CYAN}">01:23.456</text>
  <text x="640" y="244" text-anchor="middle" font-family="JetBrains Mono" font-size="22" letter-spacing="8" fill="${TEXT2}">LAP 12 · BEST</text>

  <!-- IR gate schematic -->
  <g>
    <rect x="180" y="320" width="26" height="120" rx="4" fill="#181d27" stroke="${CYAN}" stroke-width="2"/>
    <circle cx="193" cy="352" r="6" fill="${CYAN}"/>
    <text x="193" y="470" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="${TEXT2}">IR EMITTER</text>

    <rect x="1074" y="320" width="26" height="120" rx="4" fill="#181d27" stroke="${VIOLET}" stroke-width="2"/>
    <circle cx="1087" cy="352" r="6" fill="${VIOLET}"/>
    <text x="1087" y="470" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="${TEXT2}">RECEIVER</text>

    <line x1="206" y1="352" x2="1074" y2="352" stroke="${CYAN}" stroke-width="2" stroke-dasharray="14 10" opacity="0.7"/>

    <!-- car crossing the beam (top-down) -->
    <g transform="translate(560 322)">
      <rect x="-10" y="-8" width="20" height="14" rx="3" fill="#10131a" stroke="${TEXT2}"/>
      <rect x="14" y="-10" width="132" height="60" rx="18" fill="#10131a" stroke="${TEXT}" stroke-width="2.5"/>
      <rect x="30" y="-18" width="30" height="10" rx="4" fill="${TEXT2}"/>
      <rect x="30" y="48" width="30" height="10" rx="4" fill="${TEXT2}"/>
      <rect x="104" y="-18" width="30" height="10" rx="4" fill="${TEXT2}"/>
      <rect x="104" y="48" width="30" height="10" rx="4" fill="${TEXT2}"/>
      <rect x="146" y="2" width="14" height="36" rx="4" fill="${VIOLET}"/>
      <text x="80" y="27" text-anchor="middle" font-family="JetBrains Mono" font-size="15" fill="${CYAN}">SDM-26</text>
    </g>
    <text x="640" y="430" text-anchor="middle" font-family="JetBrains Mono" font-size="15" letter-spacing="3" fill="${TEXT2}">BEAM BREAK → TIMESTAMP → LAP DELTA</text>
  </g>

  <!-- gate pulse -->
  <path d="${pulse}" fill="none" stroke="${GREEN}" stroke-width="2.5"/>
  <text x="80" y="640" font-family="JetBrains Mono" font-size="15" letter-spacing="2" fill="${TEXT2}">GATE PULSE :: 1/LAP</text>

  <!-- title block -->
  <g>
    <rect x="822" y="556" width="394" height="110" fill="#10131a" stroke="rgba(0,212,255,0.3)"/>
    <text x="842" y="596" font-family="Rajdhani" font-weight="700" font-size="29" letter-spacing="1" fill="${TEXT}">INFRARED LAP TIMING SYSTEM</text>
    <text x="842" y="624" font-family="JetBrains Mono" font-size="14" fill="${TEXT2}">SUN DEVIL MOTORSPORTS · FORMULA SAE</text>
    <text x="842" y="648" font-family="JetBrains Mono" font-size="14" fill="${TEXT2}">2022–2025 · ON-VEHICLE DAQ</text>
  </g>
</svg>`
  render(svg, join(ROOT, 'public/images/lap-timing.png'), W)
}

// ── 4. League stats portal card (1280×720) ──────────────────
function leaguePortal() {
  const W = 1280, H = 720
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('lpmin', 24, 'rgba(0,212,255,0.04)')}
    ${gridDefs('lpmaj', 120, 'rgba(124,58,237,0.08)')}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#lpmin)"/>
  <rect width="${W}" height="${H}" fill="url(#lpmaj)"/>

  <text x="64" y="78" font-family="JetBrains Mono" font-size="20" fill="${CYAN}">// LEAGUE STATS PORTAL :: RIOT GAMES API</text>

  <!-- lookup bar -->
  <g>
    <rect x="180" y="130" width="700" height="64" rx="8" fill="#10131a" stroke="rgba(0,212,255,0.35)" stroke-width="2"/>
    <text x="208" y="171" font-family="JetBrains Mono" font-size="24" fill="${TEXT}">SummonerName <tspan fill="${TEXT2}">#NA1</tspan></text>
    <rect x="904" y="130" width="196" height="64" rx="8" fill="rgba(0,212,255,0.12)" stroke="${CYAN}" stroke-width="2"/>
    <text x="1002" y="171" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="26" letter-spacing="2" fill="${CYAN}">LOOK UP</text>
  </g>

  <!-- stat panels -->
  <g>
    <rect x="180" y="240" width="440" height="260" rx="10" fill="#10131a" stroke="rgba(124,58,237,0.4)" stroke-width="2"/>
    <text x="208" y="288" font-family="JetBrains Mono" font-size="17" letter-spacing="2" fill="${TEXT2}">TOTAL CHAMPION MASTERY</text>
    <text x="208" y="368" font-family="JetBrains Mono" font-weight="700" font-size="54" fill="${VIOLET}">1,247,832</text>
    <text x="208" y="414" font-family="JetBrains Mono" font-size="17" fill="${TEXT2}">ACROSS ALL CHAMPIONS</text>
    <rect x="208" y="440" width="384" height="10" rx="5" fill="rgba(124,58,237,0.2)"/>
    <rect x="208" y="440" width="276" height="10" rx="5" fill="${VIOLET}"/>

    <rect x="660" y="240" width="440" height="260" rx="10" fill="#10131a" stroke="rgba(0,212,255,0.4)" stroke-width="2"/>
    <text x="688" y="288" font-family="JetBrains Mono" font-size="17" letter-spacing="2" fill="${TEXT2}">LAST MATCH</text>
    <text x="688" y="368" font-family="JetBrains Mono" font-weight="700" font-size="54" fill="${CYAN}">7 / 2 / 11</text>
    <text x="688" y="414" font-family="JetBrains Mono" font-size="17" fill="${TEXT2}">KDA · 28:41 · <tspan fill="${GREEN}">VICTORY</tspan></text>
    <rect x="688" y="440" width="384" height="10" rx="5" fill="rgba(0,212,255,0.2)"/>
    <rect x="688" y="440" width="308" height="10" rx="5" fill="${CYAN}"/>
  </g>

  <!-- title block -->
  <g>
    <rect x="64" y="556" width="470" height="110" fill="#10131a" stroke="rgba(0,212,255,0.3)"/>
    <text x="84" y="596" font-family="Rajdhani" font-weight="700" font-size="29" letter-spacing="1" fill="${TEXT}">LEAGUE STATS PORTAL</text>
    <text x="84" y="624" font-family="JetBrains Mono" font-size="14" fill="${TEXT2}">C# · ASP.NET · WCF SERVICE LAYER</text>
    <text x="84" y="648" font-family="JetBrains Mono" font-size="14" fill="${TEXT2}">SPRING 2026 · CLASS PROJECT</text>
  </g>
  <text x="1216" y="648" text-anchor="end" font-family="JetBrains Mono" font-size="16" letter-spacing="2" fill="${TEXT2}">MEMBER + STAFF AUTH · RECAPTCHA</text>
</svg>`
  render(svg, join(ROOT, 'public/images/league-stats-portal.png'), W)
}

// ── 5. Cogitation mod card (1280×720) ───────────────────────
function cogitation() {
  const W = 1280, H = 720
  const BRASS = '#d9a441'
  // cognition array schematic: nodes wired to a controller
  const node = (x, y, on = true) => `
    <rect x="${x}" y="${y}" width="72" height="72" rx="6" fill="#10131a" stroke="${on ? CYAN : TEXT2}" stroke-width="2"/>
    <circle cx="${x + 36}" cy="${y + 36}" r="12" fill="${on ? CYAN : '#1d2430'}" opacity="${on ? 0.9 : 1}"/>
    <circle cx="${x + 14}" cy="${y + 14}" r="4" fill="${on ? BRASS : TEXT2}"/>
    <circle cx="${x + 58}" cy="${y + 14}" r="4" fill="${on ? '#ef4444' : TEXT2}"/>`
  const wire = (x1, y1, x2, y2) =>
    `<path d="M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}" fill="none" stroke="${VIOLET}" stroke-width="3" opacity="0.8"/>`
  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gridDefs('cgmin', 28, 'rgba(217,164,65,0.05)')}
    ${gridDefs('cgmaj', 112, 'rgba(0,212,255,0.07)')}
  </defs>
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#cgmin)"/>
  <rect width="${W}" height="${H}" fill="url(#cgmaj)"/>

  <text x="64" y="78" font-family="JetBrains Mono" font-size="20" fill="${BRASS}">// COGITATION :: COGNITION ARRAY ONLINE</text>

  <text x="640" y="196" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="96" letter-spacing="8" fill="${TEXT}">COGITATION</text>
  <text x="640" y="246" text-anchor="middle" font-family="JetBrains Mono" font-size="20" letter-spacing="5" fill="${TEXT2}">CREATE ADD-ON · JAVA · NEOFORGE 1.21.1</text>

  <!-- array schematic: 3 neural nodes -> mainframe -> simulation chamber -->
  ${node(150, 320)}${node(150, 420, true)}${node(150, 520, false)}
  ${wire(222, 356, 420, 420)}${wire(222, 456, 420, 440)}
  <rect x="420" y="380" width="150" height="110" rx="8" fill="#10131a" stroke="${BRASS}" stroke-width="2.5"/>
  <text x="495" y="425" text-anchor="middle" font-family="JetBrains Mono" font-size="14" fill="${TEXT2}">MAINFRAME</text>
  <text x="495" y="458" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="22" fill="${BRASS}">512 CU/t</text>
  ${wire(570, 435, 740, 435)}
  <rect x="740" y="360" width="390" height="160" rx="8" fill="#10131a" stroke="${CYAN}" stroke-width="2.5"/>
  <text x="768" y="402" font-family="JetBrains Mono" font-size="15" letter-spacing="2" fill="${TEXT2}">SIMULATION CHAMBER</text>
  <text x="768" y="442" font-family="JetBrains Mono" font-weight="700" font-size="26" fill="${CYAN}">SUBJECT: WITHER</text>
  <text x="768" y="478" font-family="JetBrains Mono" font-size="16" fill="${GREEN}">PRINTING LOOT · ENTITIES SPAWNED: 0</text>
  <circle cx="1102" cy="396" r="7" fill="${GREEN}"/>

  <!-- footer -->
  <line x1="80" y1="600" x2="1200" y2="600" stroke="${TEXT2}" stroke-width="1" opacity="0.4"/>
  <text x="80" y="646" font-family="JetBrains Mono" font-size="16" letter-spacing="2" fill="${TEXT2}">ROTATION → COMPUTE → TRAINED MODELS → LOOT</text>
  <text x="1200" y="646" text-anchor="end" font-family="JetBrains Mono" font-size="16" letter-spacing="2" fill="${BRASS}">AKURO STUDIO · BETA</text>
</svg>`
  render(svg, join(ROOT, 'public/images/cogitation.png'), W)
}

// ── 6. Placeholder avatar (640×640) ─────────────────────────
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
blackSignalTeaser()
lapTiming()
leaguePortal()
cogitation()
avatar()
