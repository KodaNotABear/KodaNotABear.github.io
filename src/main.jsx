import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// ── Console Easter Egg ──────────────────────────────────────
const cyan  = 'color:#00d4ff;font-weight:bold'
const dim   = 'color:#6b7280'
const white = 'color:#fff;font-weight:600'
console.log(
  '%c    _     _  __ _   _  ____    ___  \n' +
  '   / \\   | |/ /| | | ||  _ \\  / _ \\ \n' +
  '  / _ \\  | \' / | | | || |_) || | | |\n' +
  ' / ___ \\ | . \\ | |_| ||  _ < | |_| |\n' +
  '/_/   \\_\\|_|\\_\\ \\___/ |_| \\_\\ \\___/ \n',
  cyan
)
console.log('%c  STUDIO', white)
console.log('%c  ─────────────────────────────────────────────────────────', dim)
console.log('%c  Hey, I see you\'re a developer too.', white)
console.log('%c  Want to work together?', dim)
console.log('%c  → koda@akuro.studio', cyan)
console.log('%c  ─────────────────────────────────────────────────────────', dim)
// ────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
