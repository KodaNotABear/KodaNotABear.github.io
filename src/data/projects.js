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
      'A first-person horror game I\'m building solo in Unity, set on a derelict space station. You move through it on foot, watching for anomalies while the station\'s sensors and upkeep tasks keep pulling your attention away. Early in development.',
    tags: ['Unity', 'C#', 'Horror', 'First-Person', 'In Development'],
    image: '/images/black-signal-teaser.png',
    featured: false,
    links: {},
  },
  {
    id: 'league-stats-portal',
    title: 'League Stats Portal',
    studio: 'Arizona State University · Class Project',
    description:
      'A League of Legends stats site built in C# and ASP.NET for a web development course. A WCF service layer wraps the Riot Games API for Riot ID lookup, total champion mastery, and last-match stats, behind member and staff login flows with reCAPTCHA verification.',
    tags: ['C#', 'ASP.NET', 'Riot Games API', 'Web'],
    image: '/images/league-stats-portal.png',
    featured: false,
    links: {},
  },
  {
    id: 'vanilla-extended',
    title: 'Vanilla Extended',
    studio: 'Minecraft Modpack & Server',
    description:
      'A curated NeoForge modpack running on a dedicated server I host with Docker on a VPS. Ongoing live-ops work: custom datapacks and KubeJS scripts that patch cross-mod conflicts, plus Python tooling that decodes spark profiler captures to track down frame-time spikes across 400+ mods.',
    tags: ['Minecraft', 'NeoForge', 'Python', 'Docker / VPS', 'Live Ops'],
    image: '/images/vanilla-extended.png',
    featured: false,
    links: {},
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
