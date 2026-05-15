import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import styles from './AnimeHome.module.css'

const STATS = [
  { label: 'UNITY',    value: 90, color: '#b91c1c' },
  { label: 'C#',       value: 88, color: '#c8a84b' },
  { label: 'REACT',    value: 75, color: '#7c3aed' },
  { label: 'GAME FEEL',value: 85, color: '#a78bfa' },
  { label: 'BLENDER',  value: 62, color: '#7c3aed' },
  { label: 'FMOD',     value: 68, color: '#b91c1c' },
]

const SKILLS = ['Unity', 'C#', 'React', 'Vite', 'Blender', 'FMOD', 'Git', 'C++', 'Node.js', 'Python']

const PANELS = [
  {
    tag:   'CURSED WORK',
    title: 'BLACK\nSIGNAL',
    desc:  'A space-horror game built in Unity. Atmospheric tension, unsettling audio design, and layered narrative mechanics aboard a dying station.',
    meta:  ['GENRE: SPACE HORROR', 'STATUS: IN DEVELOPMENT'],
    link:  '/portfolio',
    linkLabel: 'ENTER DOMAIN →',
    mod:   'panelFeat',
    spanRows: true,
  },
  {
    tag:   'TECHNIQUES',
    title: 'CURSED\nINDEX',
    desc:  null,
    meta:  [],
    link:  null,
    mod:   'panelSkills',
  },
  {
    tag:   'CHRONICLE',
    title: 'ABOUT',
    desc:  'Game programmer with a passion for atmospheric, story-driven experiences. Graduated from ASU. Founded AKURO STUDIO. Always learning.',
    meta:  [],
    link:  '/about',
    linkLabel: 'READ SCROLL →',
    mod:   'panelAbout',
  },
  {
    tag:   'COMMUNE',
    title: 'CONTACT',
    desc:  'Ready to collaborate or just want to talk games? Drop a line.',
    meta:  [],
    link:  '/contact',
    linkLabel: 'OPEN CHANNEL →',
    mod:   'panelContact',
  },
]

function StatBar({ label, value, color, delay }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statBarBg}>
        <motion.div
          className={styles.statBarFill}
          style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, delay, ease: 'easeOut' }}
        />
      </div>
      <span className={styles.statVal}>{value}</span>
    </div>
  )
}

function PanelBlock({ panel, index }) {
  const rowSpan = panel.spanRows ? { gridRow: 'span 2' } : {}
  return (
    <motion.div
      className={`${styles.panel} ${styles[panel.mod]}`}
      style={rowSpan}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <div className={styles.panelAccentBar} />
      <div className={styles.panelTag}>{panel.tag}</div>
      <h2 className={styles.panelTitle}>
        {panel.title.split('\n').map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </h2>
      {panel.desc && <p className={styles.panelDesc}>{panel.desc}</p>}
      {panel.meta.map((m) => (
        <div key={m} className={styles.panelMeta}>{m}</div>
      ))}
      {panel.mod === 'panelSkills' && (
        <div className={styles.skillTags}>
          {SKILLS.map((s) => (
            <span key={s} className={styles.skillTag}>{s}</span>
          ))}
        </div>
      )}
      {panel.link && (
        <Link to={panel.link} className={styles.panelLink}>{panel.linkLabel}</Link>
      )}

      {/* Corner bracket decorations */}
      <span className={styles.cornerTL} aria-hidden />
      <span className={styles.cornerBR} aria-hidden />
    </motion.div>
  )
}

export default function AnimeHome() {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Atmospheric background */}
        <div className={styles.heroBg} aria-hidden>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
          <div className={styles.heroGrid} />
        </div>

        {/* Floating anime level badge */}
        <div className={styles.levelBadge} aria-hidden>
          <span className={styles.levelGem}>呪</span>
          <span className={styles.levelNum}>SPECIAL</span>
          <span className={styles.levelLabel}>GRADE</span>
        </div>

        <div className={styles.heroInner}>
          {/* Name card */}
          <motion.div
            className={styles.nameCard}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className={styles.cardDiag} aria-hidden />
            <div className={styles.eyebrow}>// CURSED TECHNIQUE USER</div>
            <h1 className={styles.name}>
              <span>ETHAN</span>
              <span>PETERSON</span>
            </h1>
            <div className={styles.role}>GAME PROGRAMMER</div>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              OPEN TO WORK
            </div>
            <div className={styles.orgLine}>AKURO STUDIO</div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
          >
            <div className={styles.statCardTitle}>CURSED INDEX</div>
            {STATS.map((s, i) => (
              <StatBar key={s.label} {...s} delay={0.4 + i * 0.08} />
            ))}
          </motion.div>
        </div>

        {/* CTA buttons */}
        <motion.div
          className={styles.ctaRow}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.55 }}
        >
          <Link to="/portfolio" className={styles.btnPrimary}>VIEW PORTFOLIO</Link>
          <Link to="/devlog"    className={styles.btnSecondary}>READ DEVLOG</Link>
          <Link to="/"          className={styles.btnGhost}>← MAIN SITE</Link>
        </motion.div>
      </section>

      {/* ── Chronicle Panels ───────────────────────────────── */}
      <section className={styles.panelsSection}>
        <div className={styles.sectionDivider}>
          <span className={styles.dividerInner}>✦  CURSED CHRONICLE  ✦</span>
        </div>

        <div className={styles.panelGrid}>
          {PANELS.map((panel, i) => (
            <PanelBlock key={panel.mod} panel={panel} index={i} />
          ))}
        </div>
      </section>

      {/* ── Bonus footer CTA ─────────────────────────────── */}
      <section className={styles.bonusSection}>
        <motion.div
          className={styles.bonusCard}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.bonusTag}>HIDDEN ARCHIVE</div>
          <h2 className={styles.bonusTitle}>DELVE DEEPER</h2>
          <p className={styles.bonusDesc}>
            Build logs, breakdowns, and cursed experiments — all documented in the devlog.
          </p>
          <Link to="/devlog" className={styles.btnPrimary}>ENTER ARCHIVE →</Link>
        </motion.div>
      </section>
    </motion.div>
  )
}
