// Noclip's actual Level 0 layout algorithm, ported from
// ~/noclip/src/main/java/studio/akuro/noclip/worldgen/BackroomsChunkGenerator.java
//
// This is a faithful port, not an approximation: the hash is bit-exact with the
// Java original, so the same world seed produces the same maze here as in the
// mod. That is the whole point of putting it on the Noclip page.
//
// PORTED:   the 64-bit position hash, zone assignment, the binary-tree carve
//           with border redirection, braid loops, and zone-border doorways.
// OMITTED:  room templates and sealed big rooms. Those depend on the NBT
//           template registry loaded at runtime, so `managedCrossing` here
//           considers only warehouse crossings. Everything omitted is additive
//           decoration stamped into cells; the maze topology below is complete.

const U64 = x => BigInt.asUintN(64, x)

const K_A = 0x9e3779b97f4a7c15n
const K_B = 0xc2b2ae3d27d4eb4fn
const K_SALT = 0x165667b19e3779f9n
const K_MIX = 0xff51afd7ed558ccdn

export const CELL = 8
export const ZONE_CELLS = 8

const SALT_CARVE = 0x55
const SALT_BRAID = 0x56
const SALT_KIND = 0x58
const SALT_ZONE = 0x5a
const SALT_BORDER = 0x5e
const SALT_ROOM_PRESENCE = 0x53
const SALT_BIG_PRESENCE = 0x5c
const ROOM_CHANCE = 12
const BIG_ROOM_CHANCE = 28

export function hash(seed, a, b, salt) {
  let h = U64(
    U64(seed) ^
      U64(BigInt(a) * K_A) ^
      U64(BigInt(b) * K_B) ^
      U64(BigInt(salt) * K_SALT)
  )
  h = U64(h ^ (h >> 33n))
  h = U64(h * K_MIX)
  h = U64(h ^ (h >> 33n))
  return h
}

const floorDiv = (a, b) => Math.floor(a / b)
const floorMod = (a, b) => ((a % b) + b) % b

// 50% tight maze / 30% mixed / 15% open halls / 5% warehouse void,
// decided once per 8x8-cell zone.
export const ZONE_KINDS = {
  maze: { key: 'maze', label: 'Corridor maze', warehouse: false, braid: 8, openKind: 8 },
  mixed: { key: 'mixed', label: 'Mixed', warehouse: false, braid: 24, openKind: 32 },
  halls: { key: 'halls', label: 'Open halls', warehouse: false, braid: 112, openKind: 192 },
  warehouse: { key: 'warehouse', label: 'Warehouse void', warehouse: true, braid: 0, openKind: 0 },
}

export function zoneAt(seed, cellX, cellZ) {
  const roll = Number(
    hash(seed, floorDiv(cellX, ZONE_CELLS), floorDiv(cellZ, ZONE_CELLS), SALT_ZONE) & 0xffn
  )
  if (roll < 128) return ZONE_KINDS.maze
  if (roll < 205) return ZONE_KINDS.mixed
  if (roll < 243) return ZONE_KINDS.halls
  return ZONE_KINDS.warehouse
}

function managedCrossing(seed, ax, az, bx, bz) {
  return zoneAt(seed, ax, az).warehouse !== zoneAt(seed, bx, bz).warehouse
}

// Binary tree maze: every cell carves exactly one passage, west or north. That
// alone guarantees an infinite grid is fully connected with no global pass and
// no shared state, which is what lets any chunk generate on any thread.
// Border redirection spends the carve inside the cell's own zone when the other
// direction would cross a zone boundary, so warehouse edges are not riddled
// with forced doorways. Connectivity is unaffected: still exactly one passage.
export function carvesWest(seed, cellX, cellZ) {
  const carveWest = Number(hash(seed, cellX, cellZ, SALT_CARVE) & 1n) === 0
  const westCrosses = managedCrossing(seed, cellX, cellZ, cellX - 1, cellZ)
  const northCrosses = managedCrossing(seed, cellX, cellZ, cellX, cellZ - 1)
  if (carveWest && westCrosses && !northCrosses) return false
  if (!carveWest && northCrosses && !westCrosses) return true
  return carveWest
}

export const SOLID = 'SOLID'
export const DOOR = 'DOOR'
export const OPEN = 'OPEN'

export function segmentOpening(seed, cellX, cellZ, west) {
  const zone = zoneAt(seed, cellX, cellZ)
  const neighbor = west ? zoneAt(seed, cellX - 1, cellZ) : zoneAt(seed, cellX, cellZ - 1)
  const carvedHere = carvesWest(seed, cellX, cellZ) === west

  if (zone.warehouse && neighbor.warehouse) return OPEN

  if (zone.warehouse !== neighbor.warehouse) {
    if (carvedHere && !zone.warehouse) return DOOR
    const along = west ? cellZ : cellX
    if (floorMod(along, ZONE_CELLS) === ZONE_CELLS / 2) return DOOR
    const h = Number(hash(seed, cellX, cellZ, west ? SALT_BORDER : SALT_BORDER + 1) & 0xffn)
    return h < 10 ? DOOR : SOLID
  }

  // braid: reopen extra walls so the maze has loops, at the zone's density
  const braided =
    Number(hash(seed, cellX, cellZ, west ? SALT_BRAID : SALT_BRAID + 1) & 0xffn) < zone.braid
  if (!carvedHere && !braided) return SOLID

  const kind = Number(hash(seed, cellX, cellZ, west ? SALT_KIND : SALT_KIND + 1) & 0xffn)
  return kind < zone.openKind ? OPEN : DOOR
}

/** Build a cellX/cellZ window of the infinite grid for drawing. */
export function buildRegion(seed, originX, originZ, cols, rows) {
  const s = typeof seed === 'bigint' ? seed : BigInt(seed)
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = originX + c
      const cz = originZ + r
      cells.push({
        cx,
        cz,
        col: c,
        row: r,
        zone: zoneAt(s, cx, cz),
        carvesWest: carvesWest(s, cx, cz),
        west: segmentOpening(s, cx, cz, true),
        north: segmentOpening(s, cx, cz, false),
        bigRoom: hasBigRoom(s, cx & ~1, cz & ~1),
        smallRoom: hasSmallRoom(s, cx, cz),
      })
    }
  }
  return { seed: s, originX, originZ, cols, rows, cells }
}

/** World seed from a text field, matching Minecraft's string-seed behaviour. */
export function seedFromText(text) {
  const t = String(text).trim()
  if (/^-?\d+$/.test(t)) return BigInt.asIntN(64, BigInt(t))
  let h = 0
  for (let i = 0; i < t.length; i++) h = Math.imul(31, h) + t.charCodeAt(i) | 0
  return BigInt.asIntN(64, BigInt(h))
}

// ── room templates ────────────────────────────────────────
// Only the PRESENCE rolls are ported. Which template gets stamped needs the
// runtime NBT registry, so these answer "does a room go here", not "which one".

/** Big rooms anchor on even cell coords and span 2x2, so they cannot overlap. */
export function hasBigRoom(seed, anchorX, anchorZ) {
  const s = typeof seed === 'bigint' ? seed : BigInt(seed)
  const cells = [[0, 0], [1, 0], [0, 1], [1, 1]]
  if (cells.some(([dx, dz]) => zoneAt(s, anchorX + dx, anchorZ + dz).warehouse)) return false
  return Number(hash(s, anchorX, anchorZ, SALT_BIG_PRESENCE) & 0xffn) < BIG_ROOM_CHANCE
}

export function hasSmallRoom(seed, cellX, cellZ) {
  const s = typeof seed === 'bigint' ? seed : BigInt(seed)
  if (zoneAt(s, cellX, cellZ).warehouse) return false
  return Number(hash(s, cellX, cellZ, SALT_ROOM_PRESENCE) & 0xffn) < ROOM_CHANCE
}

// ── connectivity ──────────────────────────────────────────
// The binary-tree carve guarantees the infinite grid is fully connected without
// any global pass. Tracing an actual route is that guarantee made checkable
// rather than asserted.

const passable = o => o !== SOLID

export function findPath(region, from, to) {
  const key = (x, z) => `${x},${z}`
  const inside = (x, z) =>
    x >= region.originX && z >= region.originZ &&
    x < region.originX + region.cols && z < region.originZ + region.rows
  const cellAt = (x, z) => region.cells[(z - region.originZ) * region.cols + (x - region.originX)]

  const prev = new Map()
  const seen = new Set([key(...from)])
  let frontier = [from]

  while (frontier.length) {
    const next = []
    for (const [x, z] of frontier) {
      if (x === to[0] && z === to[1]) {
        const path = []
        let cur = key(x, z)
        while (cur) {
          path.push(cur.split(',').map(Number))
          cur = prev.get(cur)
        }
        return path.reverse()
      }
      const cell = cellAt(x, z)
      // a cell's own west/north segments gate the steps to those neighbours;
      // the east/south steps are gated by the neighbour's segments
      const moves = [
        [x - 1, z, passable(cell.west)],
        [x, z - 1, passable(cell.north)],
        [x + 1, z, inside(x + 1, z) && passable(cellAt(x + 1, z).west)],
        [x, z + 1, inside(x, z + 1) && passable(cellAt(x, z + 1).north)],
      ]
      for (const [nx, nz, ok] of moves) {
        if (!ok || !inside(nx, nz) || seen.has(key(nx, nz))) continue
        seen.add(key(nx, nz))
        prev.set(key(nx, nz), key(x, z))
        next.push([nx, nz])
      }
    }
    frontier = next
  }
  return []
}

/**
 * The longest route that stays inside the drawn window.
 *
 * The maze IS fully connected, but that connectivity leans on carve chains that
 * run far outside any finite view: from a 15x15 window, a search clipped to the
 * window reaches only a handful of cells, while an unclipped one reaches all of
 * them. Drawing a path that wanders off-frame and back would read as a bug, so
 * this traces the longest real corridor inside the visible area instead.
 * Approximate graph diameter by double breadth-first search.
 */
export function findLongestPath(region) {
  const key = (x, z) => `${x},${z}`
  const inside = (x, z) =>
    x >= region.originX && z >= region.originZ &&
    x < region.originX + region.cols && z < region.originZ + region.rows
  const cellAt = (x, z) => region.cells[(z - region.originZ) * region.cols + (x - region.originX)]

  const neighbours = ([x, z]) => {
    const c = cellAt(x, z)
    return [
      [x - 1, z, passable(c.west)],
      [x, z - 1, passable(c.north)],
      [x + 1, z, inside(x + 1, z) && passable(cellAt(x + 1, z).west)],
      [x, z + 1, inside(x, z + 1) && passable(cellAt(x, z + 1).north)],
    ].filter(([nx, nz, ok]) => ok && inside(nx, nz))
  }

  // sweep, tracking both the component and the farthest cell within it
  const sweep = start => {
    const prev = new Map()
    const seen = new Set([key(...start)])
    let frontier = [start]
    let last = start
    while (frontier.length) {
      const next = []
      for (const cell of frontier) {
        last = cell
        for (const [nx, nz] of neighbours(cell)) {
          if (seen.has(key(nx, nz))) continue
          seen.add(key(nx, nz))
          prev.set(key(nx, nz), key(...cell))
          next.push([nx, nz])
        }
      }
      frontier = next
    }
    return { seen, prev, last }
  }

  // largest connected component inside the window
  const assigned = new Set()
  let best = null
  for (const c of region.cells) {
    if (assigned.has(key(c.cx, c.cz))) continue
    const r = sweep([c.cx, c.cz])
    r.seen.forEach(k => assigned.add(k))
    if (!best || r.seen.size > best.seen.size) best = r
  }
  if (!best) return []

  const far = sweep(best.last)
  const path = []
  let cur = key(...far.last)
  while (cur) {
    path.push(cur.split(',').map(Number))
    cur = far.prev.get(cur)
  }
  return path.reverse()
}
