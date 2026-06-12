// ── Project data ──────────────────────────────────────────
// Images live in /public/images. Add links as work becomes public:
// links: { itch: '...', github: '...', demo: '...' }

export const projects = [
  {
    id: 'pixel-pirate-internship',
    title: 'Off-Road Champion',
    studio: 'Pixel Pirate Studio',
    description:
      'Nine-month game development internship on Off-Road Champion, a mobile racing game built in Unity. Designed and implemented the new-player onboarding flow, shipped a tournament update where players compete for virtual currency — backed by a web portal for standings and rewards — and ported the game to WebGL.',
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
      'A space horror game inspired by Observation Duty. You monitor a derelict space station through its security camera network, tracking anomalies and keeping the crew alive — if anything on board still is. Solo developed in Unity.',
    tags: ['Unity', 'C#', 'Horror', 'Solo', 'In Development'],
    image: '/images/black-signal-teaser.png',
    featured: true,
    links: {},
  },
  {
    id: 'fsae-lap-timing',
    title: 'Infrared Lap Timing System',
    studio: 'Sun Devil Motorsports · Formula SAE',
    description:
      'Trackside lap timing for ASU\'s Formula SAE racing team. An infrared gate detects the car each lap and feeds the data acquisition pipeline used to analyze on-track performance — built, tested, and iterated on real race weekends across three seasons.',
    tags: ['Embedded', 'Hardware', 'Telemetry', 'FSAE'],
    image: '/images/lap-timing.png',
    featured: false,
    links: {},
  },
]
