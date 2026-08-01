// Pure, deterministic dungeon generation.
// No rendering, no animation. Every stage returns a snapshot the UI can draw.
// This is the TinyKeep-lineage algorithm most 2D roguelikes actually use.

// ── seeded rng ────────────────────────────────────────────
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const round = n => Math.round(n)

// ── 1. scatter ────────────────────────────────────────────
// Rooms spawn at random points inside a disc, with sizes drawn from a
// distribution skewed small. A few large rooms is what makes a dungeon read
// as having landmarks instead of uniform mush.
function scatter(rand, count, radius) {
  const rooms = []
  for (let i = 0; i < count; i++) {
    const t = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * radius
    // skew toward small: two rolls multiplied
    const w = round(4 + rand() * rand() * 22)
    const h = round(4 + rand() * rand() * 18)
    rooms.push({
      id: i,
      x: round(Math.cos(t) * r),
      y: round(Math.sin(t) * r),
      w,
      h,
      kind: 'filler',
    })
  }
  return rooms
}

const overlaps = (a, b, pad = 1) =>
  Math.abs(a.x - b.x) * 2 < a.w + b.w + pad * 2 &&
  Math.abs(a.y - b.y) * 2 < a.h + b.h + pad * 2

// ── 2. separate ───────────────────────────────────────────
// Steering separation. Overlapping rooms push each other apart along the
// axis of least penetration until nothing overlaps. Recorded per iteration
// so the UI can animate the settling instead of cutting to the result.
function separate(rooms, maxIter = 220) {
  const frames = [rooms.map(r => ({ x: r.x, y: r.y }))]
  const work = rooms.map(r => ({ ...r }))

  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false
    for (let i = 0; i < work.length; i++) {
      for (let j = i + 1; j < work.length; j++) {
        const a = work[i]
        const b = work[j]
        if (!overlaps(a, b)) continue
        moved = true
        const dx = b.x - a.x
        const dy = b.y - a.y
        const px = (a.w + b.w) / 2 + 1 - Math.abs(dx)
        const py = (a.h + b.h) / 2 + 1 - Math.abs(dy)
        // resolve along the shallower axis: rooms slide rather than jump
        if (px < py) {
          const s = (dx < 0 ? -1 : 1) * Math.max(px / 2, 0.5)
          a.x -= s
          b.x += s
        } else {
          const s = (dy < 0 ? -1 : 1) * Math.max(py / 2, 0.5)
          a.y -= s
          b.y += s
        }
      }
    }
    if (iter % 6 === 0 || !moved) {
      frames.push(work.map(r => ({ x: round(r.x), y: round(r.y) })))
    }
    if (!moved) break
  }

  work.forEach(r => {
    r.x = round(r.x)
    r.y = round(r.y)
  })
  return { rooms: work, frames }
}

// ── 3. select ─────────────────────────────────────────────
// Rooms above a size threshold become the dungeon's real spaces. Everything
// else is held back as potential hallway filler.
function selectMain(rooms, cutoff = 1.15) {
  const meanArea = rooms.reduce((s, r) => s + r.w * r.h, 0) / rooms.length
  const out = rooms.map(r => ({
    ...r,
    kind: r.w * r.h >= meanArea * cutoff ? 'main' : 'filler',
  }))
  // guarantee enough anchors for a graph worth building
  const mains = out.filter(r => r.kind === 'main')
  if (mains.length < 4) {
    out
      .filter(r => r.kind === 'filler')
      .sort((a, b) => b.w * b.h - a.w * a.h)
      .slice(0, 4 - mains.length)
      .forEach(r => (r.kind = 'main'))
  }
  return out
}

// ── 4. triangulate (Bowyer-Watson) ────────────────────────
// Delaunay over main-room centers gives a set of candidate connections that
// favour near neighbours, so corridors don't cross the whole map.
function delaunay(points) {
  if (points.length < 3) return []
  const minX = Math.min(...points.map(p => p.x))
  const minY = Math.min(...points.map(p => p.y))
  const maxX = Math.max(...points.map(p => p.x))
  const maxY = Math.max(...points.map(p => p.y))
  const dx = maxX - minX || 1
  const dy = maxY - minY || 1
  const dm = Math.max(dx, dy) * 12

  const st = [
    { x: minX - dm, y: minY - dm, s: true },
    { x: minX + dm * 2, y: minY - dm, s: true },
    { x: minX - dm, y: minY + dm * 2, s: true },
  ]
  const pts = [...points, ...st]
  const si = points.length

  const circum = tri => {
    const [a, b, c] = tri.map(i => pts[i])
    const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))
    if (Math.abs(d) < 1e-9) return null
    const a2 = a.x * a.x + a.y * a.y
    const b2 = b.x * b.x + b.y * b.y
    const c2 = c.x * c.x + c.y * c.y
    const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d
    const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d
    return { x: ux, y: uy, r2: (a.x - ux) ** 2 + (a.y - uy) ** 2 }
  }

  let tris = [{ v: [si, si + 1, si + 2], c: null }]
  tris[0].c = circum(tris[0].v)

  for (let i = 0; i < points.length; i++) {
    const p = pts[i]
    const bad = []
    const keep = []
    for (const t of tris) {
      if (t.c && (p.x - t.c.x) ** 2 + (p.y - t.c.y) ** 2 < t.c.r2) bad.push(t)
      else keep.push(t)
    }
    // boundary of the cavity = edges belonging to exactly one bad triangle
    const counts = new Map()
    for (const t of bad) {
      const [a, b, c] = t.v
      for (const [u, v] of [
        [a, b],
        [b, c],
        [c, a],
      ]) {
        const k = u < v ? `${u},${v}` : `${v},${u}`
        counts.set(k, (counts.get(k) || 0) + 1)
      }
    }
    tris = keep
    for (const [k, n] of counts) {
      if (n !== 1) continue
      const [u, v] = k.split(',').map(Number)
      const t = { v: [u, v, i], c: null }
      t.c = circum(t.v)
      if (t.c) tris.push(t)
    }
  }

  const edges = new Set()
  for (const t of tris) {
    if (t.v.some(v => v >= si)) continue
    const [a, b, c] = t.v
    for (const [u, v] of [
      [a, b],
      [b, c],
      [c, a],
    ]) {
      edges.add(u < v ? `${u},${v}` : `${v},${u}`)
    }
  }
  return [...edges].map(k => {
    const [a, b] = k.split(',').map(Number)
    return { a, b }
  })
}

// ── 5. spanning tree + loops ──────────────────────────────
// An MST alone gives a dungeon with exactly one path between any two rooms,
// which plays like a corridor. Adding back a fraction of the discarded edges
// creates loops, and loops are what make a layout feel like a place.
function connect(edges, points, loopFactor, rand) {
  const len = e => Math.hypot(points[e.a].x - points[e.b].x, points[e.a].y - points[e.b].y)
  const sorted = [...edges].sort((p, q) => len(p) - len(q))

  const parent = points.map((_, i) => i)
  const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i])))

  const tree = []
  const rest = []
  for (const e of sorted) {
    const ra = find(e.a)
    const rb = find(e.b)
    if (ra === rb) rest.push(e)
    else {
      parent[ra] = rb
      tree.push(e)
    }
  }

  const extra = rest.filter(() => rand() < loopFactor)
  return { tree, extra, discarded: rest.filter(e => !extra.includes(e)) }
}

// ── 6. carve ──────────────────────────────────────────────
// L-shaped corridors between room centers. Filler rooms a corridor passes
// through get promoted to hallway rooms, which is what gives the finished
// map its irregular, hand-placed look for free.
function carve(chosen, rooms, mainIdx) {
  const corridors = chosen.map(({ a, b }, i) => {
    const ra = rooms[mainIdx[a]]
    const rb = rooms[mainIdx[b]]
    // alternate elbow direction so the map doesn't develop a visual grain
    const horizFirst = i % 2 === 0
    const elbow = horizFirst ? { x: rb.x, y: ra.y } : { x: ra.x, y: rb.y }
    return { points: [{ x: ra.x, y: ra.y }, elbow, { x: rb.x, y: rb.y }], a, b }
  })

  const hitsSegment = (r, p, q) => {
    const pad = 1
    const minX = Math.min(p.x, q.x) - pad
    const maxX = Math.max(p.x, q.x) + pad
    const minY = Math.min(p.y, q.y) - pad
    const maxY = Math.max(p.y, q.y) + pad
    return (
      r.x + r.w / 2 > minX &&
      r.x - r.w / 2 < maxX &&
      r.y + r.h / 2 > minY &&
      r.y - r.h / 2 < maxY
    )
  }

  const out = rooms.map(r => ({ ...r }))
  for (const c of corridors) {
    for (let s = 0; s < c.points.length - 1; s++) {
      for (const r of out) {
        if (r.kind !== 'filler') continue
        if (hitsSegment(r, c.points[s], c.points[s + 1])) r.kind = 'hall'
      }
    }
  }
  return { corridors, rooms: out }
}

// ── 7. verify ─────────────────────────────────────────────
// Breadth-first from the entrance. If a room isn't reached, the layout is
// rejected rather than shipped, which is the check that keeps a seed from
// walling a player out of the exit.
function verify(mainIdx, chosen) {
  const adj = new Map(mainIdx.map((_, i) => [i, []]))
  for (const { a, b } of chosen) {
    adj.get(a).push(b)
    adj.get(b).push(a)
  }
  const order = []
  const seen = new Set([0])
  let frontier = [0]
  while (frontier.length) {
    order.push([...frontier])
    const next = []
    for (const n of frontier) {
      for (const m of adj.get(n)) {
        if (seen.has(m)) continue
        seen.add(m)
        next.push(m)
      }
    }
    frontier = next
  }
  return { waves: order, reached: seen, complete: seen.size === mainIdx.length }
}

// ── pipeline ──────────────────────────────────────────────
export function generate({ seed, roomCount = 90, loopFactor = 0.18, radius = 48 }) {
  const rand = rng(seed)

  const scattered = scatter(rand, roomCount, radius)
  const sep = separate(scattered)
  const selected = selectMain(sep.rooms)

  const mainIdx = selected.map((r, i) => (r.kind === 'main' ? i : -1)).filter(i => i >= 0)
  const centers = mainIdx.map(i => ({ x: selected[i].x, y: selected[i].y }))

  const tri = delaunay(centers)
  const { tree, extra, discarded } = connect(tri, centers, loopFactor, rand)
  const chosen = [...tree, ...extra]

  const carved = carve(chosen, selected, mainIdx)
  const check = verify(mainIdx, chosen)

  return {
    seed,
    stages: {
      scatter: scattered,
      separateFrames: sep.frames,
      settled: sep.rooms,
      selected,
      triangulation: tri,
      tree,
      extra,
      discarded,
      carved,
    },
    rooms: carved.rooms,
    corridors: carved.corridors,
    mainIdx,
    centers,
    chosen,
    verify: check,
    stats: {
      spawned: roomCount,
      main: mainIdx.length,
      halls: carved.rooms.filter(r => r.kind === 'hall').length,
      discarded: carved.rooms.filter(r => r.kind === 'filler').length,
      corridors: chosen.length,
      loops: extra.length,
      settleIterations: sep.frames.length,
    },
  }
}
