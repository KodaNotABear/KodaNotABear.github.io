// ── Project data ──────────────────────────────────────────
// Images live in /public/images. Add links as work becomes public:
// links: { itch: '...', github: '...', demo: '...' }

export const projects = [
  {
    id: 'pixel-pirate-internship',
    title: 'Off-Road Champion',
    studio: 'Pixel Pirate Studio',
    description:
      'Nine months as a game development intern on Off-Road Champion, a mobile racing game built in Unity. Designed and implemented the new-player onboarding flow, shipped a tournament update with a companion web portal for standings and rewards, and ported the game to WebGL.',
    tags: ['Unity', 'C#', 'Mobile', 'WebGL', 'LiveOps', 'Professional'],
    image: '/images/off-road-champion.jpeg',
    featured: true,
    links: {},
  },
  {
    id: 'black-signal',
    title: 'Black Signal',
    studio: 'AKURO STUDIO',
    description:
      'An early prototype I\'m building solo in Unity, inspired by Observation Duty. You watch a derelict station through its security camera network and flag anomalies before they reach the crew. There\'s a small playable version of the core loop right here on the site.',
    tags: ['Unity', 'C#', 'Horror', 'Solo', 'Prototype'],
    image: '/images/black-signal-teaser.png',
    featured: false,
    links: { demo: '/black-signal' },
  },
  {
    id: 'fsae-lap-timing',
    title: 'Infrared Lap Timing System',
    studio: 'Sun Devil Motorsports · Formula SAE',
    description:
      'Trackside lap timing for ASU\'s Formula SAE racing team. An infrared gate detects the car each lap and feeds the team\'s data acquisition pipeline for on-track performance analysis. Built, tested, and iterated on real race weekends across three seasons.',
    tags: ['Embedded', 'Hardware', 'Telemetry', 'FSAE'],
    image: '/images/lap-timing.png',
    featured: false,
    links: {},
  },
]
