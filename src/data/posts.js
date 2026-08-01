// ── Devlog / Blog post data ───────────────────────────────
// Add new posts to the top of the array so they appear first.

export const posts = [
  {
    id: 'how-a-dungeon-builds-itself',
    title: 'How a Dungeon Builds Itself',
    date: '2026-08-01',
    tags: ['Procedural Generation', 'Roguelike', 'Interactive'],
    excerpt:
      'Seven steps turn a handful of overlapping rectangles into a layout that is connected, loopable, and never strands the player. Take the assembly apart a stage at a time.',
    readTime: '5 min',
    body: [
      { type: 'p', text: 'Most procedural dungeons are built from the same lineage of algorithm, and almost none of the writing about it explains why each step exists. The steps are easy to list. What is harder to see is which decisions actually change how the finished map plays, and which are just bookkeeping.' },
      { type: 'p', text: 'So this is the algorithm drawn as a technical assembly. Each stage becomes a physical layer, and scrolling takes the layers apart so the structure underneath stays visible. Every shape below is real generator output, so changing the seed rebuilds a genuinely different dungeon rather than reshuffling decoration.' },
      { type: 'interactive', name: 'dungeon-exploded' },
      { type: 'h2', text: 'The steps that matter' },
      { type: 'p', text: 'Two of the seven do most of the work. Selecting rooms by size rather than by count is what ties the finished layout back to the scatter distribution, so a seed still governs how the map feels rather than just where things sit. And adding loops back after the spanning tree is the difference between a dungeon and a corridor: a minimum spanning tree guarantees the map is solvable, but it leaves exactly one path between any two rooms, which gives a player no flanking route, no escape route, and no reason to build a mental map.' },
      { type: 'p', text: 'The triangulation step is the one most often skipped, and skipping it is why hand-rolled generators produce corridors that cross the entire map to reach a room ten tiles away. Delaunay gives you candidate connections that favour near neighbours before you ever decide which to keep.' },
      { type: 'h2', text: 'Verification is not optional' },
      { type: 'p', text: 'The last step is a breadth-first search from the entrance. If a single room is unreachable, the layout is thrown away and the seed regenerated rather than shipped. Generators without that check are the ones that eventually strand a player behind a wall, and the bug surfaces in front of a player instead of in front of the developer.' },
      { type: 'p', text: 'This generator is the basis for the dungeon half of a game in progress: a tavern by day, a delve by night, where what you kill becomes tomorrow\u2019s menu. More on that when there is something playable to show.' },
    ],
  },
  {
    id: 'building-wincon',
    title: 'Building Wincon',
    date: '2026-07-30',
    tags: ['Wincon', 'TypeScript', 'Data Visualization'],
    excerpt:
      'A short look at turning League match timelines into useful coaching notes and a replay that shows why they matter.',
    readTime: '2 min',
    body: [
      { type: 'p', text: 'I started Wincon after spending too much time looking at post-game stat pages and still wondering what I should work on next. Riot\'s match timelines contain positions, gold, experience, objectives, and combat events for every player. I wanted to turn that data into one clear focus for the next set of games.' },
      { type: 'h2', text: 'Finding the Pattern' },
      { type: 'p', text: 'The analysis compares a player against the actual lane opponent at ten and fourteen minutes, maps deaths by location and game phase, and tracks objective and vision involvement. Explainable rules turn those measurements into coaching notes, so every recommendation can point back to the games that produced it.' },
      { type: 'h2', text: 'Making the Replay Useful' },
      { type: 'p', text: 'The replay became the most interesting part of the project. It animates all ten champions alongside wards, tower state, objectives, and the gold timeline. Playback pauses at coaching moments and frames the relevant players while leaving enough of the map visible to understand the play around them.' },
      { type: 'h2', text: 'Shipping the Demo' },
      { type: 'p', text: 'The public version uses an anonymized showcase match with seeded history, including the Locke versus Fizz replay. Player identifiers, the original match ID, and API keys stay out of the build. Forty-three automated tests cover the metrics, insight rules, replay moments, focus tracking, and report generation.' },
      { type: 'p', text: 'The live demo and source code are both public now. This is the first personal project where the analysis, interaction design, and presentation all feel like parts of the same finished idea.' },
    ],
  },
  {
    id: 'website-redesign-2026',
    title: 'New Site, New Chapter',
    date: '2026-05-03',
    tags: ['Meta', 'Announcement'],
    excerpt:
      'The site is live, the degree is done, and the next project is underway. Here\'s a quick update on where things stand.',
    readTime: '2 min',
    body: [
      { type: 'p', text: 'After a long time with a bare-bones placeholder page, I finally built a portfolio I\'m actually happy with. It sat on the to-do list for a while. Between finishing my internship and wrapping up my final semester at Arizona State, there wasn\'t much room for side projects. But it\'s done now, and it feels good to have a real home on the web.' },
      { type: 'h2', text: 'Graduating' },
      { type: 'p', text: 'I graduated from Arizona State University in May 2026 with a B.S. in Computer Science, Software Engineering focus. It\'s been four years of late nights and a lot of Unity projects. Glad to have it behind me, and even more glad to have come out the other side actually knowing what I want to do with it.' },
      { type: 'h2', text: 'What\'s Next' },
      { type: 'p', text: 'I\'m working on Black Signal, a first-person horror game set on a derelict space station. You explore it on foot, watching for anomalies while keeping up with the sensors and tasks that pull your focus. Solo project in Unity. It\'s early, but the skeleton is coming together.' },
      { type: 'p', text: 'I\'ll be posting updates here as it develops. If you want to follow along or get in touch, the links are in the footer.' },
    ],
  },
]
