// Maps a project status string to a semantic color variant.
// good = shipped, warm = beta, cool = in progress, neutral = archived / past
export function statusVariant(status = '') {
  const s = status.toLowerCase()
  if (s.includes('shipped')) return 'good'
  if (s.includes('beta')) return 'warm'
  if (s.includes('archived') || s.includes('season')) return 'neutral'
  return 'cool'
}
