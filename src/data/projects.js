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
    nda: 'Some details are restricted pending NDA expiry.',
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'Off-Road Champion is a live mobile racing game built in Unity. I joined Pixel Pirate Studio as a game development intern and spent nine months working inside a professional Unity team: daily standups, sprint planning, and features shipping to a live game.',
        ],
      },
      {
        heading: 'What I built',
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
          'This was live-game work: features I built went out to an existing player base as part of a team\'s release cycle, not a solo repo. It is the part of my experience closest to how a studio operates day to day.',
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
      'A Create add-on I wrote in Java for Minecraft (NeoForge 1.21.1). Surplus rotational power feeds a mechanical neural-network datacenter: gather data from mobs, train models of them, then run simulations that print their loot with zero spawned entities. A server-friendly answer to entity farm lag, now in beta with the full loop playable.',
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
    id: 'noclip',
    title: 'Noclip',
    studio: 'Backrooms World Type for Minecraft',
    role: 'Solo developer · Open source',
    period: 'Jul 2026 – Present',
    status: 'In development',
    tagline: 'The backrooms as a survival world type, procedural maze included.',
    description:
      'A survival challenge I\'m building in Java for NeoForge 1.21.1: a procedural maze generator replaces the overworld with the endless yellow rooms of the backrooms, and the goal is completing vanilla progression from inside them. Rooms are data-driven, authored as structure templates that any datapack can extend. In development, open source.',
    tags: ['Java', 'NeoForge', 'Worldgen', 'Minecraft', 'In Development'],
    image: '/images/noclip.png',
    featured: false,
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
    id: 'black-signal',
    title: 'Black Signal',
    studio: 'AKURO STUDIO',
    role: 'Solo developer',
    period: '2026 – Present',
    status: 'Prototyping',
    tagline: 'Solo first-person horror on a derelict space station.',
    description:
      'A first-person horror game I\'m building solo in Unity, set on a derelict space station. You move through it on foot, watching for anomalies while the station\'s sensors and upkeep tasks keep pulling your attention away. Early in development.',
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
    id: 'league-stats-portal',
    title: 'League Stats Portal',
    studio: 'Arizona State University · Class Project',
    role: 'Class project',
    period: 'Spring 2026',
    status: 'Archived',
    tagline: 'A League of Legends stats portal in C# and ASP.NET.',
    description:
      'A League of Legends stats site built in C# and ASP.NET for a web development course. A WCF service layer wraps the Riot Games API for Riot ID lookup, total champion mastery, and last-match stats, behind member and staff login flows with reCAPTCHA verification.',
    tags: ['C#', 'ASP.NET', 'Riot Games API', 'Web'],
    image: null,
    featured: false,
    links: {},
    caseStudy: [
      {
        heading: 'Overview',
        paragraphs: [
          'A League of Legends stats site built in C# and ASP.NET for a web development course at ASU.',
        ],
      },
      {
        heading: 'Under the hood',
        bullets: [
          'A WCF service layer wraps the Riot Games API: Riot ID lookup, total champion mastery, and last-match stats.',
          'Member and staff login flows with reCAPTCHA verification, sessions, and cookies.',
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
