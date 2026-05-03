import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AmbientSound.module.css'

// Procedural ambient drone via Web Audio API — no audio files needed
function buildAmbience(ctx) {
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 3)
  master.connect(ctx.destination)

  // Low drone — two detuned oscillators for thickness
  function drone(freq, detune, gain) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.detune.value = detune
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g)
    g.connect(master)
    osc.start()
    return osc
  }

  drone(55,   0,   0.5)  // A1
  drone(55,  +8,   0.35) // A1 detuned slightly for beating
  drone(110,  0,   0.25) // A2
  drone(82.4, 0,   0.15) // E2 — unsettling tritone-ish against A

  // Filtered noise for atmospheric texture
  const bufLen = ctx.sampleRate * 4
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

  const noise = ctx.createBufferSource()
  noise.buffer = buf
  noise.loop = true

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 160
  lp.Q.value = 0.8

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.06

  noise.connect(lp)
  lp.connect(noiseGain)
  noiseGain.connect(master)
  noise.start()

  // Slow LFO tremolo on master
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.08
  lfo.type = 'sine'
  const lfoDepth = ctx.createGain()
  lfoDepth.gain.value = 0.015
  lfo.connect(lfoDepth)
  lfoDepth.connect(master.gain)
  lfo.start()

  return { master }
}

export default function AmbientSound() {
  const [on, setOn] = useState(false)
  const ctxRef  = useRef(null)
  const nodeRef = useRef(null)

  const start = useCallback(() => {
    if (ctxRef.current) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    nodeRef.current = buildAmbience(ctx)
  }, [])

  const stop = useCallback(() => {
    if (!ctxRef.current) return
    nodeRef.current?.master.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5)
    setTimeout(() => {
      ctxRef.current?.close()
      ctxRef.current = null
      nodeRef.current = null
    }, 1600)
  }, [])

  useEffect(() => {
    if (on) start(); else stop()
  }, [on, start, stop])

  // Clean up on unmount
  useEffect(() => () => { ctxRef.current?.close() }, [])

  return (
    <button
      className={`${styles.btn} ${on ? styles.on : ''}`}
      onClick={() => setOn(o => !o)}
      aria-label={on ? 'Disable ambient sound' : 'Enable ambient sound'}
      title={on ? 'Ambient: ON' : 'Ambient: OFF'}
    >
      {on ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  )
}
