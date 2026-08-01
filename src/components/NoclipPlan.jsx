import { useEffect, useRef, useState } from 'react'
import { createNoclipView } from '../lib/noclipView'
import styles from './NoclipPlan.module.css'

export default function NoclipPlan() {
  const canvasRef = useRef(null)
  const viewRef = useRef(null)
  const [seed, setSeed] = useState('noclip')
  const [zones, setZones] = useState(true)
  const [spin, setSpin] = useState(true)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const view = createNoclipView(canvasRef.current)
    viewRef.current = view
    view.run()
    view.orbit(true)
    if (import.meta.env.DEV) window.__noclip = view
    return () => {
      view.destroy()
      viewRef.current = null
      if (import.meta.env.DEV) delete window.__noclip
    }
  }, [])

  const onClick = () => {
    const v = viewRef.current
    if (!v) return
    // a drag that ended over the canvas should not count as a click
    if (v.dragMoved() > 4) return
    const target = v.state.hover
    if (!target) return
    const [ax, az] = target
    const identical = v.rederive(ax, az)
    if (identical === undefined) return
    setStatus(
      identical
        ? `Chunk (${ax}, ${az}) re-derived on its own: identical.`
        : `Chunk (${ax}, ${az}) differed. That would be a generator bug.`
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.frame}>
        <canvas ref={canvasRef} className={styles.canvas} onClick={onClick} />
      </div>

      <div className={styles.controls}>
        <div className={styles.ctl}>
          <label htmlFor="nc-seed">World seed</label>
          <input
            id="nc-seed"
            type="text"
            value={seed}
            spellCheck="false"
            onChange={e => {
              setSeed(e.target.value)
              viewRef.current?.setSeed(e.target.value)
            }}
          />
        </div>

        <button type="button" onClick={() => viewRef.current?.run()}>Build again</button>
        <button type="button" className={styles.ghost} onClick={() => viewRef.current?.finish()}>
          Skip
        </button>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={spin}
            onChange={e => { setSpin(e.target.checked); viewRef.current?.orbit(e.target.checked) }}
          />
          Orbit
        </label>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={zones}
            onChange={e => { setZones(e.target.checked); viewRef.current?.toggleZones(e.target.checked) }}
          />
          Zone bounds
        </label>
      </div>

      <p className={styles.status}>
        {status || 'Drag to turn. Click a chunk to re-derive it on its own.'}
      </p>

      <ul className={styles.legend}>
        <li><i style={{ background: '#c2b57d' }} />Wall, 4 blocks</li>
        <li><i style={{ background: '#9d9260' }} />Warehouse pillar, 23 blocks</li>
        <li><i style={{ background: '#332f24' }} />Open halls</li>
        <li><i style={{ background: '#2b2820' }} />Corridor maze</li>
        <li><i style={{ background: '#1e1d18' }} />Warehouse void</li>
      </ul>
    </div>
  )
}
