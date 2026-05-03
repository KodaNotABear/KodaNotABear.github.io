import { useEffect, useRef, useState } from 'react'
import styles from './MiniGame.module.css'

const CELL = 20
const COLS = 20
const ROWS = 20
const SPEED_INIT = 130
const SPEED_MIN = 60

function randFood(snake) {
  const cells = []
  for (let x = 0; x < COLS; x++)
    for (let y = 0; y < ROWS; y++)
      if (!snake.some(s => s.x === x && s.y === y))
        cells.push({ x, y })
  return cells[Math.floor(Math.random() * cells.length)]
}

function newState() {
  const snake = [{ x: 11, y: 10 }, { x: 10, y: 10 }, { x: 9, y: 10 }]
  return { snake, dx: 1, dy: 0, ndx: 1, ndy: 0, food: randFood(snake), score: 0, over: false, started: false }
}

export default function MiniGame() {
  const [open, setOpen]               = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [displayOver, setDisplayOver]   = useState(false)
  const [hiScore, setHiScore]           = useState(() => Number(localStorage.getItem('snakeHi')) || 0)
  const canvasRef = useRef(null)
  const seqRef    = useRef([])

  // Trigger: type S-N-A-K-E anywhere (outside inputs)
  useEffect(() => {
    const SEQ = 'SNAKE'
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      seqRef.current.push(e.key.toUpperCase())
      if (seqRef.current.length > SEQ.length) seqRef.current.shift()
      if (seqRef.current.join('') === SEQ) {
        setOpen(true)
        seqRef.current = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Game loop — lives entirely inside this effect to avoid stale closure issues
  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = COLS * CELL, H = ROWS * CELL
    let g = newState()
    let timerId = null

    function draw() {
      ctx.fillStyle = '#0a0b0f'
      ctx.fillRect(0, 0, W, H)

      // Dot grid
      ctx.fillStyle = 'rgba(0,212,255,0.06)'
      for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
          ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2)

      if (!g.started) {
        ctx.fillStyle = 'rgba(0,212,255,0.55)'
        ctx.font = '13px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('Press any arrow key to start', W / 2, H / 2)
        return
      }

      // Food
      ctx.fillStyle = '#7c3aed'
      ctx.shadowColor = '#7c3aed'
      ctx.shadowBlur = 14
      ctx.fillRect(g.food.x * CELL + 3, g.food.y * CELL + 3, CELL - 6, CELL - 6)
      ctx.shadowBlur = 0

      // Snake (head bright, tail fades)
      g.snake.forEach((seg, i) => {
        const alpha = i === 0 ? 1 : Math.max(0.28, 1 - i * 0.045)
        ctx.fillStyle = i === 0 ? '#00d4ff' : `rgba(0,212,255,${alpha})`
        ctx.shadowColor = '#00d4ff'
        ctx.shadowBlur = i === 0 ? 12 : 3
        ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
      })
      ctx.shadowBlur = 0

      // Game-over overlay
      if (g.over) {
        ctx.fillStyle = 'rgba(10,11,15,0.82)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#ff4d4d'
        ctx.font = 'bold 26px monospace'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#ff4d4d'
        ctx.shadowBlur = 14
        ctx.fillText('GAME OVER', W / 2, H / 2 - 20)
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(0,212,255,0.85)'
        ctx.font = '13px monospace'
        ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 + 8)
        ctx.fillText('Enter to restart · Esc to quit', W / 2, H / 2 + 32)
      }
    }

    function startLoop(speed = SPEED_INIT) {
      timerId = setInterval(tick, speed)
    }

    function tick() {
      if (g.over || !g.started) return
      g.dx = g.ndx; g.dy = g.ndy
      const head = { x: g.snake[0].x + g.dx, y: g.snake[0].y + g.dy }

      // Collision
      if (
        head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        g.snake.some(s => s.x === head.x && s.y === head.y)
      ) {
        g.over = true
        setDisplayOver(true)
        if (g.score > (Number(localStorage.getItem('snakeHi')) || 0)) {
          localStorage.setItem('snakeHi', String(g.score))
          setHiScore(g.score)
        }
        draw()
        return
      }

      const ate = head.x === g.food.x && head.y === g.food.y
      g.snake = [head, ...g.snake]
      if (ate) {
        g.score += 10
        setDisplayScore(g.score)
        g.food = randFood(g.snake)
        // Speed up
        clearInterval(timerId)
        startLoop(Math.max(SPEED_MIN, SPEED_INIT - Math.floor(g.score / 50) * 10))
      } else {
        g.snake.pop()
      }
      draw()
    }

    const DIRS = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0] }
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key === 'Enter' && g.over) {
        clearInterval(timerId)
        g = newState()
        setDisplayScore(0)
        setDisplayOver(false)
        startLoop()
        draw()
        return
      }
      const d = DIRS[e.key]
      if (d) {
        e.preventDefault()
        if (!g.started) g.started = true
        if (d[0] !== -g.dx || d[1] !== -g.dy) { g.ndx = d[0]; g.ndy = d[1] }
      }
    }

    window.addEventListener('keydown', onKey)
    draw()
    startLoop()

    return () => {
      clearInterval(timerId)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>SNAKE.EXE</span>
          <div className={styles.scores}>
            <span>Score: <strong>{displayScore}</strong></span>
            <span>Best: <strong>{hiScore}</strong></span>
          </div>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className={styles.canvas}
        />
        <p className={styles.hint}>Arrow keys to move · Enter restart · Esc close</p>
      </div>
    </div>
  )
}
