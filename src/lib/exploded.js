import { animate, createTimeline, onScroll } from 'animejs'
import { generate, hashSeed } from './dungeon.js'

// Exploded axonometric of a generated dungeon, drawn as a technical assembly.
//
// anime.js animates plain scene parameters and the canvas renders from them.
// The library never touches the DOM here, which is the same shape the anime.js
// site itself uses to drive a WebGL hero from the same API as a CSS transform.
//
// Everything lives inside createScene so a remount cannot leave a stale
// animation or resize listener running against a detached canvas.

const COS_P = 0.56
const SIN_P = 0.83
const LABEL_COL = 268
const PAD = 26
const LIGHT = -0.7

const LAYERS = [
  { num: '01', label: 'Substrate', note: 'rooms held in reserve' },
  { num: '02', label: 'Chambers', note: 'main rooms, size selected' },
  { num: '03', label: 'Circulation', note: 'carved corridors and halls' },
  { num: '04', label: 'Topology', note: 'spanning tree plus loops' },
  { num: '05', label: 'Validation', note: 'reachability proof' },
]

const C = {
  hair: '#2a2a2d',
  substrateTop: '#212124',
  substrateSide: '#171719',
  chamberTop: '#e8e6e1',
  chamberSide: '#a8a6a1',
  hallTop: '#8f8d87',
  hallSide: '#65635f',
  corridor: '#8f8d87',
  tree: '#4c7dff',
  loop: '#e8b44a',
  valid: '#46d39a',
  text: '#ececec',
  muted: '#5a5a5c',
  accent: '#4c7dff',
}

export function createScene(canvas) {
  const ctx = canvas.getContext('2d')
  const view = { yaw: 0.6, scale: 4, cx: 0, cy: 0 }
  // starts assembled: scroll drives it apart, so the first painted frame before
  // any tick must be the collapsed model, not the exploded one
  const state = { explode: 0, seed: 'tavern', focus: -1, insetLeft: 0 }
  let data = null
  let dpr = 1
  let spinner = null
  let running = null
  let disposed = false

  function project(x, y, z) {
    const c = Math.cos(view.yaw)
    const s = Math.sin(view.yaw)
    const rx = x * c - y * s
    const ry = x * s + y * c
    return {
      sx: view.cx + rx * view.scale,
      sy: view.cy + (ry * COS_P - z * SIN_P) * view.scale,
      d: ry * SIN_P + z * COS_P,
    }
  }

  // Dimming is done by mixing the colour toward the background, NOT with
  // globalAlpha. Rooms are five overlapping faces and rooms overlap each other
  // in projection, so repeated semi-transparent fills accumulate back to
  // opaque and the "dimmed" layer stays bright.
  const BG = [15, 15, 16]

  function parseColor(col) {
    if (col[0] === '#') {
      const n = parseInt(col.slice(1), 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    }
    const p = col.slice(col.indexOf('(') + 1).split(',').map(Number)
    return [p[0], p[1], p[2]]
  }

  function mix(col, k) {
    if (k >= 1) return col
    const [r, g, b] = parseColor(col)
    return `rgb(${Math.round(BG[0] + (r - BG[0]) * k)},${Math.round(BG[1] + (g - BG[1]) * k)},${Math.round(BG[2] + (b - BG[2]) * k)})`
  }

  function shade(angle, base) {
    const k = 0.52 + 0.48 * Math.max(0, Math.cos(angle - LIGHT))
    const n = parseInt(base.slice(1), 16)
    return `rgb(${Math.round(((n >> 16) & 255) * k)},${Math.round(((n >> 8) & 255) * k)},${Math.round((n & 255) * k)})`
  }

  // Painter's algorithm, done per BOX rather than per face.
  //
  // Sorting individual faces by average depth is unstable: faces within a box,
  // and between neighbouring boxes, sit at nearly equal average depth, so the
  // comparison flips as the model rotates and faces pop in front of each other.
  // That was the shadow flicker. Boxes never overlap after separation, so a
  // per-box depth is unambiguous, and layer index breaks the coplanar case at
  // full collapse.
  function boxDepth(r, zTop) {
    const ry = r.x * Math.sin(view.yaw) + r.y * Math.cos(view.yaw)
    return ry * SIN_P + zTop * COS_P
  }

  function poly(pts, fill) {
    ctx.beginPath()
    ctx.moveTo(pts[0].sx, pts[0].sy)
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    ctx.stroke()
  }

  const SIDE_NORMALS = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]

  function drawBox(b) {
    const { r, layer, z, thick } = b
    const k = layerAlpha(layer)
    const x0 = r.x - r.w / 2
    const x1 = r.x + r.w / 2
    const y0 = r.y - r.h / 2
    const y1 = r.y + r.h / 2
    const zt = z + thick
    const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]

    ctx.lineWidth = 0.6
    ctx.strokeStyle = mix(b.stroke, k)

    // Only the sides facing the camera. A face is visible when its outward
    // normal has a positive screen-y component, i.e. sin(normal + yaw) > 0.
    // The hidden two contributed nothing but overdraw and sort ambiguity.
    for (let i = 0; i < 4; i++) {
      const n = SIDE_NORMALS[i] + view.yaw
      if (Math.sin(n) <= 0) continue
      const a = corners[i]
      const c = corners[(i + 1) % 4]
      poly(
        [
          project(a[0], a[1], z),
          project(c[0], c[1], z),
          project(c[0], c[1], zt),
          project(a[0], a[1], zt),
        ],
        mix(shade(n, b.side), k)
      )
    }

    poly(corners.map(c => project(c[0], c[1], zt)), mix(b.top, k))
  }

  // Layers do not separate together. Each one lags the layer above it, so the
  // assembly peels apart from the top instead of sliding as a single block,
  // and reassembles bottom-up. This is most of the difference between "the
  // layers moved" and something that reads as a machine coming apart.
  const LAYER_SPAN = 30
  const LEAD = 0.09

  function zOf(i) {
    const lead = (LAYERS.length - 1 - i) * LEAD
    const span = 1 - lead || 1
    const t = Math.min(1, Math.max(0, (state.explode - lead) / span))
    return i * LAYER_SPAN * (t * t * (3 - 2 * t))
  }

  const topZ = () => zOf(LAYERS.length - 1)

  // With a stage's copy on screen, everything except its layer drops back so
  // the reader's eye lands on the part being described.
  function layerAlpha(i) {
    if (state.focus < 0) return 1
    return i === state.focus ? 1 : 0.22
  }

  // Fit from the model's bounding RADIUS, not its projected bounds. Projected
  // bounds change with yaw, which makes the model breathe as it spins.
  function fit(w, h) {
    let r2 = 0
    for (const room of data.rooms) {
      const dx = Math.abs(room.x) + room.w / 2
      const dy = Math.abs(room.y) + room.h / 2
      r2 = Math.max(r2, dx * dx + dy * dy)
    }
    const R = Math.sqrt(r2)
    const zMax = topZ() + 3
    const wide = w > 720
    const inset = wide ? state.insetLeft : 0
    const availW = Math.max(80, w - inset - (wide ? LABEL_COL : 0) - PAD * 2)
    const availH = Math.max(80, h - PAD * 2)

    view.scale = Math.min(availW / (2 * R), availH / (2 * R * COS_P + zMax * SIN_P))
    view.cx = inset + PAD + availW / 2
    view.cy = PAD + availH / 2 + (zMax * SIN_P * view.scale) / 2
    return R
  }

  function drawRibbons() {
    const z = zOf(2) + 1.5
    ctx.lineWidth = Math.max(1.2, view.scale)
    ctx.strokeStyle = mix(C.corridor, layerAlpha(2))
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.globalAlpha = 0.85
    for (const c of data.corridors) {
      ctx.beginPath()
      c.points.forEach((p, i) => {
        const q = project(p.x, p.y, z)
        i ? ctx.lineTo(q.sx, q.sy) : ctx.moveTo(q.sx, q.sy)
      })
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  function drawTopology() {
    const z = zOf(3)
    const k = layerAlpha(3)
    const at = i => project(data.centers[i].x, data.centers[i].y, z)
    const run = (edges, width, color) => {
      ctx.lineWidth = width
      ctx.strokeStyle = color
      for (const e of edges) {
        const a = at(e.a)
        const b = at(e.b)
        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.stroke()
      }
    }
    // candidates that lost still show as hairlines: the drawing records what
    // was considered, not only what shipped
    run(data.stages.discarded, 0.7, mix('rgb(37,44,66)', k))
    run(data.stages.tree, 1.5, mix(C.tree, k))
    run(data.stages.extra, 2, mix(C.loop, k))

    ctx.fillStyle = mix(C.tree, k)
    data.centers.forEach((_, i) => {
      const p = at(i)
      ctx.beginPath()
      ctx.arc(p.sx, p.sy, 2.1, 0, 6.284)
      ctx.fill()
    })
  }

  function drawValidation() {
    const z = zOf(4)
    ctx.strokeStyle = mix(C.valid, layerAlpha(4))
    ctx.lineWidth = 1.2
    data.verify.waves.forEach((wave, w) => {
      ctx.globalAlpha = 0.35 + 0.65 * (1 - w / data.verify.waves.length)
      for (const n of wave) {
        const p = project(data.centers[n].x, data.centers[n].y, z)
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, 3 + w * 0.55, 0, 6.284)
        ctx.stroke()
      }
    })
    ctx.globalAlpha = 1
  }

  function drawLabels(R, w) {
    if (state.explode < 0.06 || w <= 720) return
    ctx.globalAlpha = Math.min(1, (state.explode - 0.06) / 0.35)
    ctx.textBaseline = 'middle'
    const lx = w - LABEL_COL + 8

    LAYERS.forEach((L, i) => {
      if (state.focus >= 0 && i !== state.focus) return
      const z = zOf(i) + 1
      const ax = view.cx + R * 0.62 * view.scale
      const ay = view.cy - z * SIN_P * view.scale

      ctx.strokeStyle = C.hair
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(lx - 12, ay)
      ctx.stroke()

      ctx.fillStyle = C.accent
      ctx.beginPath()
      ctx.arc(ax, ay, 2, 0, 6.284)
      ctx.fill()

      ctx.font = '500 11px "JetBrains Mono", monospace'
      ctx.fillStyle = C.accent
      ctx.fillText(L.num, lx, ay)
      ctx.fillStyle = C.text
      ctx.fillText(L.label.toUpperCase(), lx + 26, ay)
      ctx.font = '400 10px "JetBrains Mono", monospace'
      ctx.fillStyle = C.muted
      ctx.fillText(L.note, lx + 26, ay + 14)
    })
    ctx.globalAlpha = 1
  }

  function drawTitleBlock(w, h) {
    if (w <= 720) return
    const bw = 268
    const bh = 74
    const x = w - bw - 24
    const y = h - bh - 24

    ctx.strokeStyle = C.hair
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, bw, bh)
    ctx.beginPath()
    ctx.moveTo(x, y + 26.5)
    ctx.lineTo(x + bw, y + 26.5)
    ctx.moveTo(x + 150.5, y + 26)
    ctx.lineTo(x + 150.5, y + bh)
    ctx.stroke()

    ctx.textBaseline = 'middle'
    ctx.fillStyle = C.text
    ctx.font = '500 12px "JetBrains Mono", monospace'
    ctx.fillText('PROCEDURAL DUNGEON', x + 12, y + 13)

    const cell = (label, value, cx, cy) => {
      ctx.fillStyle = C.muted
      ctx.font = '400 9px "JetBrains Mono", monospace'
      ctx.fillText(label, cx, cy)
      ctx.fillStyle = C.text
      ctx.font = '500 12px "JetBrains Mono", monospace'
      ctx.fillText(value, cx, cy + 15)
    }
    cell('SEED', state.seed.slice(0, 12), x + 12, y + 42)
    cell('ROOMS', String(data.stats.main), x + 162, y + 42)
    ctx.fillStyle = C.muted
    ctx.font = '400 9px "JetBrains Mono", monospace'
    ctx.fillText('SHEET 1/1', x + 218, y + 42)
  }

  function draw() {
    if (!data || disposed) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    const R = fit(w, h)

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const boxes = []
    for (const r of data.rooms) {
      if (r.kind === 'filler') {
        boxes.push({ r, layer: 0, z: zOf(0), thick: 0.8, top: C.substrateTop, side: C.substrateSide, stroke: C.hair })
      } else if (r.kind === 'main') {
        boxes.push({ r, layer: 1, z: zOf(1), thick: 2.4, top: C.chamberTop, side: C.chamberSide, stroke: 'rgba(15,15,16,.55)' })
      } else {
        boxes.push({ r, layer: 2, z: zOf(2), thick: 1.4, top: C.hallTop, side: C.hallSide, stroke: 'rgba(15,15,16,.5)' })
      }
    }
    for (const b of boxes) b.d = boxDepth(b.r, b.z + b.thick)
    boxes.sort((a, b) => a.layer - b.layer || a.d - b.d)
    for (const b of boxes) drawBox(b)

    drawRibbons()
    drawTopology()
    drawValidation()
    drawLabels(R, w)
    drawTitleBlock(w, h)
  }

  // The scene can be constructed before layout has settled, in which case
  // clientWidth is 0. Writing a zero-width canvas there is unrecoverable
  // without another resize, so skip it and let the ResizeObserver call back
  // once the element actually has a box.
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

  function setSeed(seed) {
    state.seed = seed || 'tavern'
    data = generate({ seed: hashSeed(state.seed), roomCount: 90, loopFactor: 0.18 })
    draw()
  }

  function setExplode(v) {
    if (running) { running.pause(); running = null }
    state.explode = v
    draw()
  }

  function setYaw(v) {
    stopSpin()
    view.yaw = v
    draw()
  }

  function intro() {
    if (running) running.pause()
    running = createTimeline({ defaults: { onUpdate: draw } })
      .add(state, { explode: [0, 1], duration: 1800, ease: 'out(4)' }, 150)
    return running
  }

  function spin() {
    if (spinner) return stopSpin()
    spinner = animate(view, {
      yaw: view.yaw + Math.PI * 2,
      duration: 26000,
      ease: 'linear',
      loop: true,
      onUpdate: draw,
    })
    return spinner
  }

  function stopSpin() {
    if (spinner) { spinner.pause(); spinner = null }
  }

  function setInset(px) {
    if (state.insetLeft === px) return
    state.insetLeft = px
    draw()
  }

  function setFocus(i) {
    if (state.focus === i) return
    state.focus = i
    draw()
  }

  // Drag to rotate at any point. Scroll still owns the narrative; this just
  // lets a reader stop and look at whatever the copy is describing.
  let dragging = false
  let lastX = 0
  const onDown = e => { dragging = true; lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId) }
  const onMove = e => {
    if (!dragging) return
    view.yaw += (e.clientX - lastX) * 0.006
    lastX = e.clientX
    draw()
  }
  const onUp = () => { dragging = false }

  // Scroll drives the timeline directly rather than triggering it: sync ties
  // playback position to scroll position, so the assembly comes apart and back
  // together under the reader's control, forwards or backwards.
  //
  // 0-38   separate (layers peel from the top, see zOf)
  // 38-88  hold apart while the stage copy is read
  // 88-100 reassemble as a closing beat
  // yaw orbits across the whole range, independent of the explode phases.
  function attachScroll(trigger) {
    if (running) running.pause()
    stopSpin()
    running = createTimeline({
      autoplay: onScroll({ target: trigger, enter: 'top top', leave: 'bottom bottom', sync: true }),
      defaults: { ease: 'linear' },
      onUpdate: draw,
    })
      .add(state, { explode: [0, 1], duration: 38 }, 0)
      .add(state, { explode: [1, 0], duration: 12 }, 88)
      .add(view, { yaw: [0.35, 0.35 + Math.PI * 1.6], duration: 100 }, 0)
    return running
  }

  function destroy() {
    disposed = true
    ro.disconnect()
    canvas.removeEventListener('pointerdown', onDown)
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerup', onUp)
    canvas.removeEventListener('pointercancel', onUp)
    stopSpin()
    if (running) running.pause()
    window.removeEventListener('resize', resize)
  }

  const ro = new ResizeObserver(resize)

  setSeed(state.seed)
  resize()
  ro.observe(canvas)
  window.addEventListener('resize', resize)
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)

  return {
    state, view, draw, setSeed, setExplode, setYaw,
    spin, stopSpin, intro, attachScroll, setFocus, setInset, resize, destroy,
  }
}
