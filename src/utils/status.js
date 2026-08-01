// Maps a project status to a semantic colour variant.
//
// Statuses use ONE vocabulary, release stage, so the chips compare cleanly:
//   Shipped · Beta · Alpha · In development · Past work
// Distribution channel and content format belong on the links and the copy,
// not in the status chip.
//
// good = shipped, warm = usable but unfinished, cool = not usable yet,
// neutral = no longer active
export function statusVariant(status = '') {
  const s = status.toLowerCase()
  if (s.includes('shipped') || s.includes('released')) return 'good'
  if (s.includes('beta') || s.includes('alpha')) return 'warm'
  if (s.includes('past') || s.includes('archived') || s.includes('season')) return 'neutral'
  return 'cool'
}
