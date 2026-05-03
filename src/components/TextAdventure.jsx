import { useEffect, useRef, useState } from 'react'
import styles from './TextAdventure.module.css'

// ─── World data ──────────────────────────────────────────────────────────────
const ROOMS = {
  bridge: {
    name: 'BRIDGE — AXIOM-7',
    desc: 'Emergency lights paint everything red. The nav console is dead. Scratch marks lead east.',
    exits: { e: 'corridor' },
  },
  corridor: {
    name: 'CORRIDOR A',
    desc: 'A narrow passage. Panels flicker overhead. Something wet glistens on the north wall.',
    exits: { w: 'bridge', n: 'lab', s: 'engineering', e: 'server' },
  },
  lab: {
    name: 'RESEARCH LAB',
    desc: 'Overturned equipment and shattered vials. A PA speaker crackles: "...do not engage..."',
    exits: { s: 'corridor' },
  },
  engineering: {
    name: 'ENGINEERING BAY',
    desc: 'Steam hisses from ruptured pipes. Backup power hums. A plasma cutter lies on the floor.',
    exits: { n: 'corridor' },
  },
  server: {
    name: 'SERVER ROOM',
    desc: 'Dark server racks, one still blinking. A staff keycard catches the light under a terminal.',
    exits: { w: 'corridor', n: 'airlock' },
  },
  airlock: {
    name: 'AIRLOCK STAGING',
    desc: 'The escape pod is through the sealed blast door. A keycard reader blinks red.',
    exits: { s: 'server' },
    // north with keycard → win
  },
}

const ITEMS = {
  medkit:  { name: 'Medkit',        shortDesc: 'Emergency medkit.',         heal: 4 },
  cutter:  { name: 'Plasma Cutter', shortDesc: 'Still charged. Dmg: 2-5.',  weapon: true },
  keycard: { name: 'Staff Keycard', shortDesc: 'Axiom-7 clearance. Opens airlock.' },
}

const ROOM_ITEMS_INIT = { lab: ['medkit'], engineering: ['cutter'], server: ['keycard'] }

const INTRO = [
  { t: '> AXIOM-7 EMERGENCY BOOT SEQUENCE', c: 'sys' },
  { t: '> LIFE SUPPORT: CRITICAL', c: 'warn' },
  { t: '> CREW STATUS: [UNKNOWN]', c: 'warn' },
  { t: '> OBJECTIVE: REACH ESCAPE POD', c: 'sys' },
  { t: '─'.repeat(36), c: 'dim' },
  { t: 'You wake on the bridge. Something is wrong.', c: 'norm' },
  { t: 'Type HELP for commands.', c: 'dim' },
]

function dir(d) {
  return { n: 'north', s: 'south', e: 'east', w: 'west' }[d] || d
}

function exitsStr(roomId) {
  return Object.keys(ROOMS[roomId].exits).map(d => dir(d).toUpperCase()).join('  ')
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ─── Command processor ───────────────────────────────────────────────────────
function process(raw, state) {
  const cmd = raw.trim().toLowerCase()
  const words = cmd.split(/\s+/)
  const verb = words[0]
  const noun = words.slice(1).join(' ')

  let { room, hp, maxHp, inventory, roomItems, combat, won, dead } = state
  const log = []

  function out(t, c = 'norm') { log.push({ t, c }) }
  function sep() { out('─'.repeat(36), 'dim') }

  if (dead || won) {
    if (cmd === 'restart') return initState()
    out("Type RESTART to play again.", 'dim')
    return { ...state, newLog: log }
  }

  // ── In combat ──
  if (combat) {
    if (['attack', 'a', 'fight', 'hit'].includes(verb)) {
      const pDmg = inventory.includes('cutter') ? roll(2, 5) : roll(1, 3)
      const eDmg = roll(1, 3)
      const newEHp = combat.hp - pDmg
      out(`You attack for ${pDmg} damage.`, 'good')
      if (newEHp <= 0) {
        out('The Presence recoils and dissolves into shadow.', 'good')
        sep()
        out(ROOMS[room].desc, 'norm')
        out(`Exits: ${exitsStr(room)}`, 'dim')
        return { ...state, combat: null, newLog: log }
      }
      out(`The Presence lashes out for ${eDmg} damage.`, 'bad')
      const newHp = hp - eDmg
      if (newHp <= 0) {
        out('Everything goes dark.', 'bad')
        out('> YOU DIED — Type RESTART', 'warn')
        return { ...state, combat: { hp: newEHp }, hp: 0, dead: true, newLog: log }
      }
      out(`HP: ${newHp}/${maxHp}  |  Enemy: ${newEHp} HP`, 'dim')
      return { ...state, combat: { hp: newEHp }, hp: newHp, newLog: log }
    }
    if (['run', 'flee', 'escape', 'r'].includes(verb)) {
      if (Math.random() < 0.5) {
        out('You slip away into the dark.', 'good')
        combat = null
        return { ...state, combat: null, newLog: log }
      } else {
        const eDmg = roll(1, 3)
        const newHp = hp - eDmg
        out('It catches you as you flee!', 'bad')
        out(`You take ${eDmg} damage.`, 'bad')
        if (newHp <= 0) {
          out('> YOU DIED — Type RESTART', 'warn')
          return { ...state, hp: 0, dead: true, newLog: log }
        }
        out(`HP: ${newHp}/${maxHp}`, 'dim')
        return { ...state, hp: newHp, newLog: log }
      }
    }
    out('Something lurks here. ATTACK or RUN.', 'warn')
    return { ...state, newLog: log }
  }

  // ── Navigation ──
  const moveMap = { north: 'n', south: 's', east: 'e', west: 'w', n:'n', s:'s', e:'e', w:'w' }
  if (moveMap[verb]) {
    const d = moveMap[verb]
    // Special: airlock north needs keycard
    if (room === 'airlock' && d === 'n') {
      if (!inventory.includes('keycard')) {
        out('The blast door reader blinks red. You need a keycard.', 'warn')
        return { ...state, newLog: log }
      }
      out('You swipe the keycard. The blast door grinds open.', 'good')
      out('You dive into the escape pod and seal the hatch.', 'good')
      out('The station shrinks behind you. You made it.', 'good')
      sep()
      out('> TRANSMISSION RECEIVED — "black_signal.exe"', 'sys')
      out('> ESCAPE SUCCESSFUL', 'good')
      out('Type RESTART to play again.', 'dim')
      return { ...state, won: true, room: 'escape', newLog: log }
    }
    const next = ROOMS[room]?.exits[d]
    if (!next) { out("You can't go that way.", 'warn'); return { ...state, newLog: log } }
    room = next
    out(`> ${ROOMS[room].name}`, 'sys')
    out(ROOMS[room].desc, 'norm')
    const ri = roomItems[room] || []
    if (ri.length) out(`You see: ${ri.map(i => ITEMS[i].name).join(', ')}.`, 'good')
    out(`Exits: ${exitsStr(room)}`, 'dim')
    // Random encounter (not on bridge)
    if (room !== 'bridge' && Math.random() < 0.35) {
      out('', 'norm')
      out('Something moves in the dark. It turns toward you.', 'bad')
      out('ATTACK or RUN.', 'warn')
      return { ...state, room, combat: { hp: 4 }, newLog: log }
    }
    return { ...state, room, newLog: log }
  }

  // ── Look ──
  if (['look', 'l', 'examine', 'x'].includes(verb)) {
    out(`> ${ROOMS[room].name}`, 'sys')
    out(ROOMS[room].desc, 'norm')
    const ri = roomItems[room] || []
    if (ri.length) out(`You see: ${ri.map(i => ITEMS[i].name).join(', ')}.`, 'good')
    out(`Exits: ${exitsStr(room)}`, 'dim')
    return { ...state, newLog: log }
  }

  // ── Inventory ──
  if (['inv', 'i', 'inventory', 'items'].includes(verb)) {
    if (!inventory.length) { out('You have nothing.', 'dim'); return { ...state, newLog: log } }
    out('Inventory:', 'sys')
    inventory.forEach(id => out(`  ${ITEMS[id].name} — ${ITEMS[id].shortDesc}`, 'norm'))
    out(`HP: ${hp}/${maxHp}`, 'dim')
    return { ...state, newLog: log }
  }

  // ── Take ──
  if (['take', 'get', 'grab', 'pick'].includes(verb)) {
    const ri = roomItems[room] || []
    const found = ri.find(id => noun.includes(ITEMS[id].name.toLowerCase().split(' ')[0]) || noun.includes(id))
    if (!found) {
      out(ri.length ? `Take what? You see: ${ri.map(i => ITEMS[i].name).join(', ')}.` : "There's nothing to take.", 'warn')
      return { ...state, newLog: log }
    }
    const newRoomItems = { ...roomItems, [room]: ri.filter(i => i !== found) }
    out(`Picked up: ${ITEMS[found].name}.`, 'good')
    return { ...state, inventory: [...inventory, found], roomItems: newRoomItems, newLog: log }
  }

  // ── Use ──
  if (['use', 'apply'].includes(verb)) {
    if (noun.includes('medkit') || noun.includes('med')) {
      if (!inventory.includes('medkit')) { out("You don't have a medkit.", 'warn'); return { ...state, newLog: log } }
      if (hp === maxHp) { out('HP is already full.', 'dim'); return { ...state, newLog: log } }
      const newHp = Math.min(maxHp, hp + ITEMS.medkit.heal)
      out(`You patch yourself up. HP: ${hp} → ${newHp}`, 'good')
      return { ...state, hp: newHp, inventory: inventory.filter(i => i !== 'medkit'), newLog: log }
    }
    out("Use what?", 'warn')
    return { ...state, newLog: log }
  }

  // ── HP ──
  if (['hp', 'health', 'status'].includes(verb)) {
    out(`HP: ${hp}/${maxHp}  |  Room: ${ROOMS[room]?.name ?? room}`, 'dim')
    return { ...state, newLog: log }
  }

  // ── Help ──
  if (['help', '?', 'h'].includes(verb)) {
    sep()
    out('COMMANDS:', 'sys')
    out('  N / S / E / W   — move',      'dim')
    out('  LOOK            — examine room', 'dim')
    out('  INV             — inventory',  'dim')
    out('  TAKE [item]     — pick up',    'dim')
    out('  USE medkit      — heal',       'dim')
    out('  HP              — check health', 'dim')
    out('  ATTACK / RUN    — in combat',  'dim')
    out('  RESTART         — new game',   'dim')
    out('  ESC             — close',      'dim')
    sep()
    return { ...state, newLog: log }
  }

  // ── Restart ──
  if (cmd === 'restart') return initState()

  out(`Unknown command: "${raw}". Type HELP.`, 'warn')
  return { ...state, newLog: log }
}

function initState() {
  return {
    room: 'bridge',
    hp: 10, maxHp: 10,
    inventory: [],
    roomItems: JSON.parse(JSON.stringify(ROOM_ITEMS_INIT)),
    combat: null,
    won: false,
    dead: false,
    log: [...INTRO],
    newLog: null,
  }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function TextAdventure() {
  const [open, setOpen]    = useState(false)
  const [game, setGame]    = useState(initState)
  const [input, setInput]  = useState('')
  const logRef  = useRef(null)
  const seqRef  = useRef([])
  const inputRef = useRef(null)

  // Trigger: type D-U-N-G-E-O-N
  useEffect(() => {
    const SEQ = 'DUNGEON'
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      seqRef.current.push(e.key.toUpperCase())
      if (seqRef.current.length > SEQ.length) seqRef.current.shift()
      if (seqRef.current.join('') === SEQ) {
        setOpen(true); seqRef.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close on Esc (only when input is not focused)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && document.activeElement !== inputRef.current) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [game.log])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  function submit(e) {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    setInput('')
    setGame(prev => {
      const result = process(cmd, prev)
      const appended = result.newLog || []
      return {
        ...result,
        log: [...prev.log, { t: `> ${cmd}`, c: 'input' }, ...appended],
        newLog: null,
      }
    })
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.terminal} onClick={e => e.stopPropagation()}>
        {/* Title bar */}
        <div className={styles.bar}>
          <span className={styles.dot} style={{ background: '#ef4444' }} />
          <span className={styles.dot} style={{ background: '#fbbf24' }} />
          <span className={styles.dot} style={{ background: '#22d3a0' }} />
          <span className={styles.barTitle}>AXIOM-7 // EMERGENCY TERMINAL</span>
          <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Log */}
        <div className={styles.log} ref={logRef}>
          {game.log.map((line, i) => (
            <p key={i} className={`${styles.line} ${styles[line.c] || ''}`}>{line.t}</p>
          ))}
          {game.combat && (
            <p className={styles.combatBadge}>⚠ COMBAT — Enemy HP: {game.combat.hp}</p>
          )}
        </div>

        {/* Input */}
        <form className={styles.inputRow} onSubmit={submit}>
          <span className={styles.prompt}>&gt;</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="enter command..."
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
