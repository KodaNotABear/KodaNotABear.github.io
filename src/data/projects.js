// ── Project data ──────────────────────────────────────────
// Images live in /public/images. Add links as work becomes public:
// links: { itch: '...', github: '...', demo: '...' }
//
// Each project also powers a case-study page at /portfolio/:id.
// caseStudy sections support `paragraphs` and/or `bullets`.
// All copy here is sourced from the resume and site text, nothing invented.

export const projects = [
  {
    id: 'pixel-pirate-internship',
    title: 'Off-Road Champion',
    studio: 'Pixel Pirate Studio',
    role: 'Game Development Intern',
    period: 'Aug 2025 – May 2026',
    status: 'Shipped',
    tagline: 'Nine months shipping features on a live Unity mobile racer.',
    description:
      'Nine months as a game development intern on Off-Road Champion, a mobile racing game built in Unity. Designed and implemented the new-player onboarding flow, shipped a tournament update with a companion web portal for standings and rewards, and ported the game to WebGL.',
    tags: ['Unity', 'C#', 'Mobile', 'WebGL', 'LiveOps', 'Professional'],
    image: '/images/off-road-champion.jpeg',
    featured: true,
    links: {},
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Off-Road Champion is a live mobile racing game built in Unity. Nine months as a game development intern at Pixel Pirate Studio meant working inside a professional Unity team: daily standups, sprint planning, and features shipping to a live game.',
        ],
      },
      {
        heading: 'Highlights',
        bullets: [
          'Designed and implemented the player onboarding system, guiding new players through core mechanics in their first session.',
          'Shipped a tournament update where players compete for virtual currency, connected to a web portal for live standings and rewards.',
          'Ported Off-Road Champion to WebGL for browser play.',
          'Collaborated with designers and producers in an Agile environment across daily standups and sprint planning.',
        ],
      },
      {
        heading: 'Why it matters',
        paragraphs: [
          'This was live-game work: features went out to an existing player base as part of a team\'s release cycle, not a solo repo. Of everything on this site, it is the closest to how a studio operates day to day.',
        ],
      },
    ],
  },
  {
    id: 'noclip',
    title: 'Noclip',
    studio: 'Backrooms World Type for Minecraft',
    role: 'Solo developer · Open source',
    period: 'Jul 2026 – Present',
    status: 'In development',
    tagline: 'The backrooms as a survival world type, procedural maze included.',
    description:
      'A survival challenge built in Java for NeoForge 1.21.1: a procedural maze generator replaces the overworld with the endless yellow rooms of the backrooms, and the goal is completing vanilla progression from inside them. Rooms are data-driven, authored as structure templates that any datapack can extend. In development, open source.',
    tags: ['Java', 'NeoForge', 'Worldgen', 'Minecraft', 'In Development'],
    image: '/images/noclip.png?v=2',
    featured: true,
    links: { github: 'https://github.com/KodaNotABear/noclip' },
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Noclip replaces the Minecraft overworld with the endless yellow rooms of the backrooms. The challenge is completing vanilla progression from inside the maze: same goals, hostile new world.',
        ],
      },
      {
        heading: 'The worldgen',
        bullets: [
          'A seed-stable procedural maze generator with zoned variety and guaranteed connectivity, so every world is different but never walls you off.',
          'Rooms are data-driven: structure NBT plus JSON templates, loadable from any datapack, so other creators can extend the maze without touching the mod.',
        ],
      },
      {
        heading: 'Status',
        paragraphs: [
          'In active development and open source. The generator and room template system are working; current work is on populating zones and progression pacing.',
        ],
      },
    ],
  },
  {
    id: 'create-cognition',
    title: 'Create: Cognition',
    studio: 'AKURO STUDIO · Create Add-on',
    role: 'Solo developer',
    period: 'Jun 2026 – Present',
    status: 'Beta',
    tagline: 'A mechanical neural-network datacenter for Minecraft, powered by rotational energy.',
    description:
      'A Create add-on written in Java for Minecraft (NeoForge 1.21.1). Surplus rotational power feeds a mechanical neural-network datacenter: gather data from mobs, train models of them, then run simulations that print their loot with zero spawned entities. A server-friendly answer to entity farm lag, now in beta with the full loop playable.',
    tags: ['Java', 'NeoForge', 'Create Add-on', 'Minecraft', 'Beta'],
    image: '/images/create-cognition.png',
    featured: true,
    links: {},
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Create: Cognition is a Create add-on written in Java for NeoForge 1.21.1. It turns surplus rotational power into compute for a mechanical neural-network datacenter: gather data from mobs, train models of them, then run simulations that print their loot with zero spawned entities.',
          'The design goal is performance: entity farms are one of the biggest sources of server lag in modded Minecraft, and Cognition replaces them with a simulation that produces the same loot without spawning anything.',
        ],
      },
      {
        heading: 'In the beta',
        bullets: [
          'Multiblock networks with flood-fill discovery and proportional compute allocation.',
          'Model grades and substrate tiers that gate progression.',
          'Sequenced-assembly recipes integrated with Create.',
          'An advancement tree and full balance configuration.',
        ],
      },
      {
        heading: 'Status',
        paragraphs: [
          'The first beta is shipped and the full gameplay loop is playable. Ongoing work is balance, polish, and compatibility across the Create ecosystem.',
        ],
      },
    ],
  },
  {
    id: 'black-signal',
    title: 'Black Signal',
    studio: 'AKURO STUDIO',
    role: 'Solo developer',
    period: '2026 – Present',
    status: 'Prototyping',
    tagline: 'Solo first-person horror on a derelict space station.',
    description:
      'A first-person horror game built solo in Unity, set on a derelict space station. You move through it on foot, watching for anomalies while the station\'s sensors and upkeep tasks keep pulling your attention away. Early in development.',
    tags: ['Unity', 'C#', 'Horror', 'First-Person', 'In Development'],
    image: null,
    featured: false,
    links: {},
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Black Signal is a first-person horror game set on a derelict space station, built solo in Unity. You move through the station on foot, watching for anomalies while its sensors and upkeep tasks keep pulling your attention away from the thing you should be watching.',
        ],
      },
      {
        heading: 'Status',
        paragraphs: [
          'Early prototyping. The current focus is the core loop: on-foot exploration with anomaly detection, and making divided attention feel dangerous rather than annoying.',
        ],
      },
    ],
  },
  {
    id: 'wincon',
    title: 'Wincon',
    studio: 'AKURO STUDIO · League of Legends Analytics',
    role: 'Solo developer',
    period: 'Jul 2026 – Present',
    status: 'Playable demo',
    tagline: 'A ranked review tool that turns match timelines into a clear coaching focus.',
    description:
      'Wincon reads League of Legends match timelines and finds the habits behind a player\'s results. It produces explainable coaching notes, maps every death, compares laning against the actual opponent, and replays all ten players around the moments worth reviewing.',
    tags: ['TypeScript', 'React', 'Riot Games API', 'Data Visualization', 'Testing'],
    image: '/images/wincon-dashboard.png',
    featured: true,
    links: {
      github: 'https://github.com/KodaNotABear/wincon',
      demo: '/wincon/',
    },
    gallery: ['/images/wincon-replay.png'],
    caseStudy: [
      {
        heading: 'The problem',
        paragraphs: [
          'Most League stat sites summarize the scoreboard. Wincon works from Match-V5 timeline frames and events to answer a more useful question: which repeated habit is holding this player back?',
          'The dashboard keeps the answer concrete. A player can choose one win condition for the next session, lock the current baseline, and measure progress using only the games played afterward.',
        ],
      },
      {
        heading: 'Analysis pipeline',
        bullets: [
          'A rate-limited Riot API client caches immutable match and timeline responses locally.',
          'Pure TypeScript analysis compares CS, gold, and XP against the actual lane opponent at 10 and 14 minutes.',
          'Death position, game phase, objective credit, vision, champion pool, momentum, and win-loss gaps feed explainable coaching rules.',
          'A seeded synthetic dataset drives the public demo and integration tests without exposing an API key or player data.',
        ],
      },
      {
        heading: 'Replay as a coaching tool',
        paragraphs: [
          'Each match becomes an animated map with ten moving champions, wards, tower state, objective timers, a gold timeline, and event markers. Playback pauses at coaching moments and frames the relevant players without hiding the rest of the play.',
          'The note beside the map explains the event in context and can turn that pattern into the player\'s next focus in one click.',
        ],
      },
      {
        heading: 'Quality',
        bullets: [
          '41 automated tests cover metrics, insights, replay moments, report generation, lockfile parsing, and focus progress.',
          'Strict TypeScript keeps the Riot data boundary and analysis contracts explicit.',
          'Responsive dashboard and replay layouts were checked at desktop and mobile sizes.',
          'Color and labels carry win-loss meaning together, with the match table serving as the accessible chart data view.',
        ],
      },
    ],
  },
  {
    id: 'fsae-lap-timing',
    title: 'Infrared Lap Timing System',
    studio: 'Sun Devil Motorsports · Formula SAE',
    role: 'Data Acquisition Developer',
    period: 'Jun 2022 – 2025',
    status: '3 seasons',
    tagline: 'Infrared lap timing for a Formula SAE race car.',
    description:
      'Trackside lap timing for ASU\'s Formula SAE racing team. An infrared gate detects the car each lap and feeds the team\'s data acquisition pipeline for on-track performance analysis. Built, tested, and iterated on real race weekends across three seasons.',
    tags: ['Embedded', 'Hardware', 'Telemetry', 'FSAE'],
    image: null,
    featured: false,
    links: {},
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Trackside lap timing for ASU\'s Formula SAE racing team: an infrared gate detects the car each lap and feeds the team\'s data acquisition pipeline for on-track performance analysis.',
        ],
      },
      {
        heading: 'On the car',
        bullets: [
          'Embedded systems for live telemetry capture, built and tested on a real race car.',
          'Integrated with the mechanical and electrical sub-teams to fit data systems across the vehicle.',
          'Iterated across race weekends over three seasons.',
        ],
      },
    ],
  },
]

export const getProject = id => projects.find(p => p.id === id)

export const nextProject = id => {
  const i = projects.findIndex(p => p.id === id)
  if (i === -1) return null
  return projects[(i + 1) % projects.length]
}
