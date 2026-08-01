import { animate, createTimeline } from 'animejs'
import { buildRegion, seedFromText, findLongestPath, ZONE_CELLS, SOLID, OPEN } from './noclip.js'

// Axonometric view of Noclip's Level 0, built one CHUNK at a time in shuffled
// order, walls rising out of the floor as each chunk resolves.
//
// Two things this has to carry, and a top-down plan carried neither:
//
// 1. The generator's real property: every block is a pure function of
//    (seed, position), so a chunk needs nothing from its neighbours. Filling in
//    a shuffled order and still lining up is that shown rather than asserted.
// 2. The vertical variation, which is most of what makes the space read as the
//    Backrooms. Walls are 4 blocks, ceilings 5, and warehouse zones are
//    23-block voids with 2x2 mega-pillars. Flat plans throw all of that away.
//
// A chunk is 16 blocks = 2x2 cells, matching Minecraft, so chunk borders land
// exactly on cell walls.

const CHUNK_CELLS = 2
const COS_P = 0.58
const SIN_P = 0.81

// Heights in CELL units. A cell is 8 blocks wide, so a 4-block wall is 0.5.
const WALL_H = 0.5
const WAREHOUSE_H = 2.6
const PILLAR = 0.26
const PROP_H = 0.2
const PATH_Y = 0.07
const DOOR_Y = 0.03
// cells within a chunk resolve in sequence rather than together, so a single
// chunk's walls and doorways are legible as they appear
const CELL_LAG = 0.55

// ms per unit of build time; the build reads as construction rather than a
// flicker, so it is deliberately unhurried
const BUILD_MS = 92
const PATH_MS = 105

const C = {
  bg: '#0f0f10',
  floor: '#2b2820',
  floorHalls: '#332f24',
  floorWarehouse: '#1e1d18',
  wallLit: '#c2b57d',
  wallDim: '#8a8054',
  wallCap: '#ded2a1',
  pillarLit: '#9d9260',
  pillarDim: '#6b6342',
  propLit: '#7d7048',
  propDim: '#584f34',
  propTop: '#9c8d5c',
  floorRoom: '#3d3524',
  path: '#46d39a',
  door: '#4c7dff',
  active: '#4c7dff',
  text: '#ececec',
  muted: '#5a5a5c',
  accent: '#4c7dff',
}

const easeOut = t => 1 - Math.pow(1 - t, 3)
const clamp01 = t => (t < 0 ? 0 : t > 1 ? 1 : t)

export function createNoclipView(canvas) {
  const ctx = canvas.getContext('2d')
  const view = { yaw: Math.PI / 4, scale: 20, cx: 0, cy: 0 }
  const state = {
    seedText: 'noclip',
    seed: seedFromText('noclip'),
    originX: -7,
    originZ: -7,
    cols: 15,
    rows: 15,
    t: 0,
    pathT: 0,
    stagger: 1,
    rise: 3.6,
    showZones: true,
    hover: null,
  }
  let region = null
  let path = []
  let orderIndex = new Map() // chunk key -> reveal position
  let dpr = 1
  let disposed = false
  let running = null
  let orbiting = null

  const chunkKey = (x, z) => `${x},${z}`
  function project(x, z, y) {
    const c = Math.cos(view.yaw)
    const s = Math.sin(view.yaw)
    const rx = x * c - z * s
    const rz = x * s + z * c
    return {
      sx: view.cx + rx * view.scale,
      sy: view.cy + (rz * COS_P - y * SIN_P) * view.scale,
      d: rz,
    }
  }

  function rebuild() {
    region = buildRegion(state.seed, state.originX, state.originZ, state.cols, state.rows)
    const anchors = []
    const sx = Math.floor(state.originX / CHUNK_CELLS) * CHUNK_CELLS
    const sz = Math.floor(state.originZ / CHUNK_CELLS) * CHUNK_CELLS
    for (let z = sz; z < state.originZ + state.rows; z += CHUNK_CELLS) {
      for (let x = sx; x < state.originX + state.cols; x += CHUNK_CELLS) anchors.push([x, z])
    }
    // Deterministic shuffle from the seed, so the build order is reproducible
    // and visibly not a raster scan.
    let h = Number(BigInt.asUintN(32, state.seed)) >>> 0
    for (let i = anchors.length - 1; i > 0; i--) {
      h = (Math.imul(h, 1664525) + 1013904223) >>> 0
      const j = h % (i + 1)
      ;[anchors[i], anchors[j]] = [anchors[j], anchors[i]]
    }
    orderIndex = new Map(anchors.map(([x, z], i) => [chunkKey(x, z), i]))
    state.total = anchors.length
    path = findLongestPath(region)
  }

  const cellAt = (cx, cz) =>
    region.cells[(cz - region.originZ) * region.cols + (cx - region.originX)]

  const CHUNK_SPAN = () => state.rise + (CHUNK_CELLS * CHUNK_CELLS - 1) * CELL_LAG

  /** 0 to 1 build progress for one cell, lagged within its chunk. */
  function progressOf(cx, cz) {
    const ax = Math.floor(cx / CHUNK_CELLS) * CHUNK_CELLS
    const az = Math.floor(cz / CHUNK_CELLS) * CHUNK_CELLS
    const k = orderIndex.get(chunkKey(ax, az))
    if (k === undefined) return 0
    const sub = (cx - ax + (cz - az) * CHUNK_CELLS) * CELL_LAG
    return clamp01((state.t - k * state.stagger - sub) / state.rise)
  }

  /** 0 to 1 for the chunk as a whole, used to flag the one resolving now. */
  function chunkProgress(ax, az) {
    const k = orderIndex.get(chunkKey(ax, az))
    if (k === undefined) return 0
    return clamp01((state.t - k * state.stagger) / CHUNK_SPAN())
  }

  function fit(w, h) {
    const gw = state.cols
    const gh = state.rows
    const diag = Math.hypot(gw, gh)
    const extentX = diag
    const extentY = diag * COS_P + WAREHOUSE_H * SIN_P
    const pad = 24
    view.scale = Math.min((w - pad * 2) / extentX, (h - pad * 2) / extentY)
    view.cx = w / 2
    view.cy = h / 2 + (WAREHOUSE_H * SIN_P * view.scale) / 2
  }

  function quad(p, fill) {
    ctx.beginPath()
    ctx.moveTo(p[0].sx, p[0].sy)
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].sx, p[i].sy)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }

  const depthAt = (x, z) => x * Math.sin(view.yaw) + z * Math.cos(view.yaw)

  // Walls sit on a cell's MINIMUM edges (west at x, north at z), but a cell's
  // sort key is its centre, so every wall used to be ordered half a cell nearer
  // than it actually is. That error is 0.5*sin(yaw) for west walls and
  // 0.5*cos(yaw) for north walls: equal at 45 degrees, wildly unequal away from
  // it, so one whole direction of walls sorted too near and painted over
  // everything regardless of occlusion. Pieces now carry their own true centre.
  function pushPanel(out, x1, z1, x2, z2, y, lit) {
    if (y <= 0.001) return
    out.push({
      box: false,
      x1, z1, x2, z2, y, lit,
      d: depthAt((x1 + x2) / 2, (z1 + z2) / 2),
    })
  }

  function pushWall(out, opening, x1, z1, x2, z2, y, lit) {
    if (opening === OPEN) return
    if (opening === SOLID) return pushPanel(out, x1, z1, x2, z2, y, lit)
    // DOOR: leave a gap in the middle so the opening is legible in silhouette,
    // plus a threshold on the floor. Without it a doorway and a fully OPEN
    // segment look identical from above, and they are different states.
    const dx = x2 - x1
    const dz = z2 - z1
    pushPanel(out, x1, z1, x1 + dx * 0.32, z1 + dz * 0.32, y, lit)
    pushPanel(out, x2 - dx * 0.32, z2 - dz * 0.32, x2, z2, y, lit)
    pushLine(
      out,
      x1 + dx * 0.32, z1 + dz * 0.32,
      x1 + dx * 0.68, z1 + dz * 0.68,
      DOOR_Y, C.door, Math.max(1.2, view.scale * 0.06)
    )
  }

  function pushLine(out, x1, z1, x2, z2, y, color, width) {
    out.push({ line: true, x1, z1, x2, z2, y, color, width, d: depthAt((x1 + x2) / 2, (z1 + z2) / 2) })
  }

  function drawLine(pc) {
    const a = project(pc.x1, pc.z1, pc.y)
    const b = project(pc.x2, pc.z2, pc.y)
    ctx.strokeStyle = pc.color
    ctx.lineWidth = pc.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
    ctx.stroke()
  }

  function pushBox(out, x, z, size, y, litCol, dimCol, topCol) {
    if (y <= 0.001) return
    out.push({
      box: true,
      x, z, size, y, litCol, dimCol, topCol,
      d: depthAt(x + size / 2, z + size / 2),
    })
  }

  function drawPanel(pc) {
    quad(
      [
        project(pc.x1, pc.z1, 0),
        project(pc.x2, pc.z2, 0),
        project(pc.x2, pc.z2, pc.y),
        project(pc.x1, pc.z1, pc.y),
      ],
      pc.lit ? C.wallLit : C.wallDim
    )
    // cap line: reads as the top edge of the wall
    ctx.strokeStyle = C.wallCap
    ctx.lineWidth = 1
    const a = project(pc.x1, pc.z1, pc.y)
    const b = project(pc.x2, pc.z2, pc.y)
    ctx.beginPath()
    ctx.moveTo(a.sx, a.sy)
    ctx.lineTo(b.sx, b.sy)
    ctx.stroke()
  }

  const SIDE_NORMALS = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]

  function drawBox(pc) {
    const { x, z, size, y } = pc
    const x1 = x + size
    const z1 = z + size
    const corners = [[x, z], [x1, z], [x1, z1], [x, z1]]
    // Backface culling makes the four sides order-independent, so a box never
    // depends on the order its faces happen to sit in the array.
    for (let i = 0; i < 4; i++) {
      const n = SIDE_NORMALS[i] + view.yaw
      if (Math.sin(n) <= 0) continue
      const [ax, az] = corners[i]
      const [bx, bz] = corners[(i + 1) % 4]
      quad(
        [project(ax, az, 0), project(bx, bz, 0), project(bx, bz, y), project(ax, az, y)],
        Math.sin(n) > 0.5 ? pc.litCol : pc.dimCol
      )
    }
    quad(
      [project(x, z, y), project(x1, z, y), project(x1, z1, y), project(x, z1, y)],
      pc.topCol || C.wallCap
    )
  }

  function draw() {
    if (!region || disposed) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    fit(w, h)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, w, h)

    // Painter's algorithm over CELLS. Cells never overlap, so a cell-centre
    // depth is unambiguous; sorting individual quads would flicker as the
    // model turns.
    const cells = region.cells
      .map(cell => {
        const p = progressOf(cell.cx, cell.cz)
        if (p <= 0) return null
        const mid = project(cell.cx + 0.5, cell.cz + 0.5, 0)
        return { cell, p, d: mid.d }
      })
      .filter(Boolean)
      .sort((a, b) => a.d - b.d)

    // west-facing walls catch the light when the yaw puts them toward the eye
    const litWest = Math.sin(Math.PI + view.yaw) > 0
    const litNorth = Math.sin(-Math.PI / 2 + view.yaw) > 0

    // TWO PASSES, and the split matters. Drawing each cell's floor and walls
    // together means a nearer cell's floor is painted after a farther cell's
    // wall and covers it. Barely visible on 4-block walls, but it slices
    // straight through a 23-block warehouse pillar. Floors are coplanar at
    // y = 0 and never overlap, so they can all go down first.
    for (const { cell } of cells) {
      const x = cell.cx
      const z = cell.cz
      quad(
        [project(x, z, 0), project(x + 1, z, 0), project(x + 1, z + 1, 0), project(x, z + 1, 0)],
        cell.zone.warehouse
          ? C.floorWarehouse
          : cell.bigRoom
            ? C.floorRoom
            : state.showZones && cell.zone.key === 'halls'
              ? C.floorHalls
              : C.floor
      )
    }

    // Zone boundaries belong to the floor, so they are drawn with it. Drawn
    // after the walls they streak across the geometry that should hide them.
    if (state.showZones) {
      ctx.strokeStyle = 'rgba(76,125,255,.28)'
      ctx.lineWidth = 1
      const line = (x1, z1, x2, z2) => {
        const a = project(x1, z1, 0)
        const b = project(x2, z2, 0)
        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.stroke()
      }
      for (let cx = region.originX; cx <= region.originX + region.cols; cx++) {
        if (((cx % ZONE_CELLS) + ZONE_CELLS) % ZONE_CELLS === 0) {
          line(cx, region.originZ, cx, region.originZ + region.rows)
        }
      }
      for (let cz = region.originZ; cz <= region.originZ + region.rows; cz++) {
        if (((cz % ZONE_CELLS) + ZONE_CELLS) % ZONE_CELLS === 0) {
          line(region.originX, cz, region.originX + region.cols, cz)
        }
      }
    }

    // the chunk resolving right now, so the eye has somewhere to land
    for (const key of orderIndex.keys()) {
      const [ax, az] = key.split(',').map(Number)
      const p = chunkProgress(ax, az)
      if (p <= 0.02 || p >= 0.98) continue
      ctx.strokeStyle = C.active
      ctx.lineWidth = 1.4
      ctx.globalAlpha = Math.sin(p * Math.PI)
      const c = [
        project(ax, az, 0.02),
        project(ax + CHUNK_CELLS, az, 0.02),
        project(ax + CHUNK_CELLS, az + CHUNK_CELLS, 0.02),
        project(ax, az + CHUNK_CELLS, 0.02),
      ]
      ctx.beginPath()
      ctx.moveTo(c[0].sx, c[0].sy)
      for (let i = 1; i < 4; i++) ctx.lineTo(c[i].sx, c[i].sy)
      ctx.closePath()
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // Standing geometry, sorted as PIECES by their own centre rather than by
    // the cell that owns them. Panels lie on grid lines and never intersect, so
    // a per-piece depth is unambiguous and varies smoothly with yaw.
    const pieces = []
    for (const { cell, p } of cells) {
      const x = cell.cx
      const z = cell.cz
      const e = easeOut(p)

      if (cell.zone.warehouse) {
        // 2x2 mega-pillars every 16 blocks, in a 23-block void
        if (((x % 2) + 2) % 2 === 0 && ((z % 2) + 2) % 2 === 0) {
          pushBox(pieces, x + 0.5 - PILLAR / 2, z + 0.5 - PILLAR / 2, PILLAR, WAREHOUSE_H * e, C.pillarLit, C.pillarDim)
        }
        continue
      }

      const y = WALL_H * e
      pushWall(pieces, cell.north, x, z, x + 1, z, y, litNorth)
      pushWall(pieces, cell.west, x, z, x, z + 1, y, litWest)
    }

    // room templates the generator would stamp into these cells, and the traced
    // route, share the piece list so walls occlude them correctly
    for (const { cell, p } of cells) {
      const x = cell.cx
      const z = cell.cz
      const e = easeOut(p)
      // Only the PRESENCE of a room template is known; the geometry lives in an
      // NBT registry this port does not load. So a small room gets a marker
      // object and a big room gets a floor marking, rather than invented walls.
      if (cell.zone.warehouse || cell.bigRoom) continue
      if (cell.smallRoom) {
        pushBox(pieces, x + 0.33, z + 0.33, 0.34, PROP_H * e, C.propLit, C.propDim, C.propTop)
      }
    }

    for (let i = 0; i < path.length - 1; i++) {
      const head = state.pathT - i
      if (head <= 0) break
      const [ax, az] = path[i]
      const [bx, bz] = path[i + 1]
      const f = Math.min(1, head)
      const x1 = ax + 0.5
      const z1 = az + 0.5
      const x2 = x1 + (bx - ax) * f
      const z2 = z1 + (bz - az) * f
      pushLine(pieces, x1, z1, x2, z2, PATH_Y, C.path, Math.max(2, view.scale * 0.13))
    }

    pieces.sort((a, b) => a.d - b.d)
    for (const pc of pieces) (pc.line ? drawLine : pc.box ? drawBox : drawPanel)(pc)

    if (state.hover) {
      const [ax, az] = state.hover
      ctx.strokeStyle = C.accent
      ctx.lineWidth = 1.5
      const c = [
        project(ax, az, 0),
        project(ax + CHUNK_CELLS, az, 0),
        project(ax + CHUNK_CELLS, az + CHUNK_CELLS, 0),
        project(ax, az + CHUNK_CELLS, 0),
      ]
      ctx.beginPath()
      ctx.moveTo(c[0].sx, c[0].sy)
      for (let i = 1; i < 4; i++) ctx.lineTo(c[i].sx, c[i].sy)
      ctx.closePath()
      ctx.stroke()
    }

    // build counter
    const built = Math.min(state.total, Math.max(0, Math.floor(state.t / state.stagger)))
    ctx.fillStyle = C.muted
    ctx.font = '500 11px "JetBrains Mono", monospace'
    ctx.textBaseline = 'top'
    ctx.fillText(`CHUNKS ${String(built).padStart(2, '0')} / ${state.total}`, 16, 14)
    if (state.pathT > 0 && path.length) {
      ctx.fillStyle = C.path
      const done = Math.min(path.length, Math.ceil(state.pathT))
      ctx.fillText(`ROUTE ${done} / ${path.length} CELLS`, 16, 32)
    }
  }

  function run() {
    if (running) running.pause()
    state.t = 0
    state.pathT = 0
    const end = state.total * state.stagger + state.rise
    running = createTimeline({ defaults: { ease: 'linear' }, onUpdate: draw })
      .add(state, { t: [0, end], duration: end * BUILD_MS }, 0)
      .add(state, { pathT: [0, path.length], duration: path.length * PATH_MS },
        end * BUILD_MS + 400)
    return running
  }

  function finish() {
    if (running) running.pause()
    state.t = state.total * state.stagger + state.rise
    state.pathT = path.length
    draw()
  }

  // A full 360 turntable passes through yaw 0, PI/2, PI and 3PI/2, where the
  // axonometric degenerates to axis-aligned: walls line up with the screen
  // axes, depth reads as nothing, and the whole thing flattens into a grid.
  // So it oscillates around a 45-degree three-quarter view instead of orbiting.
  const BASE_YAW = Math.PI / 4
  const YAW_SWING = 0.35

  function orbit(on) {
    if (orbiting) { orbiting.pause(); orbiting = null }
    if (!on) return
    view.yaw = BASE_YAW - YAW_SWING
    orbiting = animate(view, {
      yaw: BASE_YAW + YAW_SWING,
      duration: 19000,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
      onUpdate: draw,
    })
  }

  /** Re-derive one chunk alone and confirm it lands identically. */
  function rederive(ax, az) {
    if (!orderIndex.has(chunkKey(ax, az))) return
    const fresh = buildRegion(state.seed, ax, az, CHUNK_CELLS, CHUNK_CELLS)
    let identical = true
    for (const c of fresh.cells) {
      const cur = cellAt(c.cx, c.cz)
      if (!cur || cur.west !== c.west || cur.north !== c.north || cur.zone.key !== c.zone.key) {
        identical = false
      }
    }
    return identical
  }

  function setSeed(text) {
    state.seedText = text || 'noclip'
    state.seed = seedFromText(state.seedText)
    rebuild()
    run()
  }

  function resize() {
    if (disposed) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = w * dpr
    canvas.height = h * dpr
    draw()
  }

  // ── pointer: drag to turn, hover to target a chunk ──────────
  let dragging = false
  let lastX = 0
  let moved = 0

  const pickChunk = e => {
    // invert the projection on the ground plane
    const r = canvas.getBoundingClientRect()
    const sx = (e.clientX - r.left - view.cx) / view.scale
    const sy = (e.clientY - r.top - view.cy) / (view.scale * COS_P)
    const c = Math.cos(view.yaw)
    const s = Math.sin(view.yaw)
    const x = sx * c + sy * s
    const z = -sx * s + sy * c
    return [
      Math.floor(Math.floor(x) / CHUNK_CELLS) * CHUNK_CELLS,
      Math.floor(Math.floor(z) / CHUNK_CELLS) * CHUNK_CELLS,
    ]
  }

  const onDown = e => { dragging = true; moved = 0; lastX = e.clientX; orbit(false) }
  const onMove = e => {
    if (dragging) {
      const d = e.clientX - lastX
      moved += Math.abs(d)
      view.yaw += d * 0.006
      lastX = e.clientX
      draw()
      return
    }
    state.hover = pickChunk(e)
    draw()
  }
  const onUp = () => { dragging = false }
  const onLeave = () => { dragging = false; state.hover = null; draw() }

  const ro = new ResizeObserver(resize)

  rebuild()
  resize()
  ro.observe(canvas)
  window.addEventListener('resize', resize)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointerleave', onLeave)

  function destroy() {
    disposed = true
    if (running) running.pause()
    if (orbiting) orbiting.pause()
    ro.disconnect()
    window.removeEventListener('resize', resize)
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointerleave', onLeave)
  }

  return {
    state, view, draw, run, finish, orbit, rederive, setSeed, resize, destroy,
    dragMoved: () => moved,
    toggleZones: v => { state.showZones = v; draw() },
    get total() { return state.total },
  }
}
