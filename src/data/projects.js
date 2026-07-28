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
    id: 'create-cognition',
    title: 'Create: Cognition',
    studio: 'AKURO STUDIO · Create Add-on',
    description:
      'A Create add-on I wrote in Java for Minecraft (NeoForge 1.21.1). Surplus rotational power feeds a mechanical neural-network datacenter: gather data from mobs, train models of them, then run simulations that print their loot with zero spawned entities. A server-friendly answer to entity farm lag, now in beta with the full loop playable.',
    tags: ['Java', 'NeoForge', 'Create Add-on', 'Minecraft', 'Beta'],
    image: '/images/create-cognition.png',
    featured: true,
    links: {},
  },
  {
    id: 'noclip',
    title: 'Noclip',
    studio: 'Backrooms World Type for Minecraft',
    description:
      'A survival challenge I\'m building in Java for NeoForge 1.21.1: a procedural maze generator replaces the overworld with the endless yellow rooms of the backrooms, and the goal is completing vanilla progression from inside them. Rooms are data-driven, authored as structure templates that any datapack can extend. In development, open source.',
    tags: ['Java', 'NeoForge', 'Worldgen', 'Minecraft', 'In Development'],
    image: '/images/noclip.png',
    featured: false,
    links: { github: 'https://github.com/KodaNotABear/noclip' },
  },
  {
    id: 'black-signal',
    title: 'Black Signal',
    studio: 'AKURO STUDIO',
    description:
      'A first-person horror game I\'m building solo in Unity, set on a derelict space station. You move through it on foot, watching for anomalies while the station\'s sensors and upkeep tasks keep pulling your attention away. Early in development.',
    tags: ['Unity', 'C#', 'Horror', 'First-Person', 'In Development'],
    image: null,
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
    image: null,
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
    image: null,
    featured: false,
    links: {},
  },
]
