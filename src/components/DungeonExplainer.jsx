import { useEffect, useRef, useState } from 'react'
import { createScene } from '../lib/exploded'
import styles from './DungeonExplainer.module.css'

// The seven algorithm stages, mapped onto the five physical layers of the
// drawing. Stages are the process; layers are the result, so several stages
// point at the same layer.
const BEATS = [
  {
    key: 'scatter',
    num: '01',
    title: 'Scatter',
    layer: 1,
    body: 'Every room spawns at a random point inside a disc, with width and height drawn from a distribution skewed small. Two multiplied rolls instead of one is the whole trick: it makes most rooms modest and a few of them large. Uniform sizes produce a dungeon that reads as mush, because nothing stands out enough to become a landmark.',
  },
  {
    key: 'separate',
    num: '02',
    title: 'Separate',
    layer: 1,
    body: 'Each overlapping pair pushes apart along its axis of least penetration, repeatedly, until the map settles. Resolving the shallower axis matters: rooms slide past each other instead of leaping, so the layout keeps the rough shape the scatter gave it. This is steering separation, the same idea as boids, run on rectangles.',
  },
  {
    key: 'select',
    num: '03',
    title: 'Select',
    layer: 1,
    body: 'Rooms above the mean area become the dungeon’s real spaces. The rest are not deleted, they drop to the substrate layer and wait. Choosing by size rather than by count is what ties the layout back to the scatter distribution, so the seed still governs how the finished map feels.',
  },
  {
    key: 'triangulate',
    num: '04',
    title: 'Triangulate',
    layer: 3,
    body: 'A Delaunay triangulation over the room centers produces candidate connections that strongly favour near neighbours. This is the step people skip, and skipping it is why hand-rolled generators produce corridors that cross the entire map to reach a room ten tiles away. The faint hairlines are the candidates that lost.',
  },
  {
    key: 'span',
    num: '05',
    title: 'Span',
    layer: 3,
    body: 'A minimum spanning tree connects every room using the shortest total corridor, and guarantees the dungeon is solvable. On its own it plays badly: exactly one path between any two rooms is a corridor, not a place. Adding back a fraction of the discarded edges creates loops, which is what gives a player flanking routes, escape routes, and a reason to build a mental map.',
  },
  {
    key: 'carve',
    num: '06',
    title: 'Carve',
    layer: 2,
    body: 'Corridors run as right-angled elbows between room centers, alternating which axis goes first so the map does not develop a visual grain. Any room from the substrate that a corridor passes through is promoted to a hallway. That single rule is what produces the irregular, hand-placed look, and it costs nothing: the rooms were already there.',
  },
  {
    key: 'verify',
    num: '07',
    title: 'Verify',
    layer: 4,
    body: 'Breadth-first search from the entrance, one ring at a time. If a single room fails to be reached, the layout is thrown away and the seed is regenerated rather than shipped. Generators without this step are the ones that eventually strand a player behind a wall, and the bug surfaces in front of a player rather than in front of the developer.',
  },
]

const COLUMN = 380

export default function DungeonExplainer() {
  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  const sceneRef = useRef(null)
  const beatRefs = useRef([])
  const [seed, setSeed] = useState('tavern')
  const [active, setActive] = useState(0)

  useEffect(() => {
    const scene = createScene(canvasRef.current)
    sceneRef.current = scene
    scene.attachScroll(trackRef.current)

    const applyInset = () => scene.setInset(window.innerWidth > 980 ? COLUMN : 0)
    applyInset()
    window.addEventListener('resize', applyInset)

    // active beat is whichever card is nearest the vertical middle
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = Number(e.target.dataset.i)
          setActive(i)
          scene.setFocus(BEATS[i].layer)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    beatRefs.current.forEach(el => el && io.observe(el))

    if (import.meta.env.DEV) window.__dungeon = { scene, beats: BEATS }
    return () => {
      io.disconnect()
      window.removeEventListener('resize', applyInset)
      scene.destroy()
      sceneRef.current = null
      if (import.meta.env.DEV) delete window.__dungeon
    }
  }, [])

  const onSeed = value => {
    setSeed(value)
    sceneRef.current?.setSeed(value.trim())
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={styles.ctl}>
          <label htmlFor="dx-seed">Seed</label>
          <input
            id="dx-seed"
            type="text"
            value={seed}
            onChange={e => onSeed(e.target.value)}
            spellCheck="false"
          />
        </div>
        <button type="button" onClick={() => onSeed(Math.random().toString(36).slice(2, 8))}>
          Reroll
        </button>
        <p className={styles.hint}>Scroll to take it apart. Drag the drawing to look from elsewhere.</p>
      </div>

      <div className={styles.track} ref={trackRef}>
        <div className={styles.sticky}>
          <canvas ref={canvasRef} className={styles.stage} />
        </div>

        <div className={styles.beats}>
          {BEATS.map((b, i) => (
            <section
              key={b.key}
              data-i={i}
              ref={el => (beatRefs.current[i] = el)}
              className={styles.beat}
            >
              <article className={`${styles.card} ${active === i ? styles.cardOn : ''}`}>
                <p className={styles.cardNum}>
                  {b.num} <span>/ 07</span>
                </p>
                <h2 className={styles.cardTitle}>{b.title}</h2>
                <p className={styles.cardBody}>{b.body}</p>
              </article>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
