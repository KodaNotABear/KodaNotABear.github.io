// ── Devlog / Blog post data ───────────────────────────────
// Add new posts to the top of the array so they appear first.

export const posts = [
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
