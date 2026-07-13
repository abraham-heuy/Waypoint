import TiltCard from './Tiltcard';

// SVG icons as small inline components
const FeatureIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, JSX.Element> = {
    optimize: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    talk: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    car: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17h14M5 17a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" />
        <path d="M7 11l2-3h6l2 3" />
      </svg>
    ),
    adapt: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    track: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12v-2a5 5 0 00-5-5H8a5 5 0 00-5 5v2" />
        <path d="M3 12v5a2 2 0 002 2h14a2 2 0 002-2v-5" />
        <path d="M7 12h10" />
        <path d="M12 12v8" />
      </svg>
    ),
    grow: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-7l-3-3M12 15l3-3M12 15v7" />
        <path d="M5 12a7 7 0 0114 0" />
        <path d="M5 12a7 7 0 0114 0" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  };
  return <span className="w-8 h-8 text-dispatch-accent">{iconMap[type] || iconMap.optimize}</span>;
};

const FEATURES = [
  {
    title: 'Real drive-time optimization',
    body: 'Every route is solved against actual road travel times, not straight-line guesses — using an exact solver for small stop counts and a heuristic engine as your day grows.',
    icon: 'optimize',
  },
  {
    title: 'Plan by talking, not clicking',
    body: 'Tell the assistant your day in plain language — it turns that into stops, time windows, and an optimized order. Manual map placement is still there when you want it.',
    icon: 'talk',
  },
  {
    title: 'No car? No problem',
    body: 'Any leg of a route can fall back to a rideshare estimate, so errands and trips work whether or not you have your own vehicle.',
    icon: 'car',
  },
  {
    title: 'Built for how you work',
    body: 'Dashboards adapt to who you are — a delivery driver, a solo errand-runner, a trip planner, or a small team managing several routes at once.',
    icon: 'adapt',
  },
  {
    title: 'Know how you\'re doing',
    body: 'On-time rates, average stop duration, and feedback scores are tracked automatically, not something you have to calculate yourself.',
    icon: 'track',
  },
  {
    title: 'Grows with you',
    body: 'Start free with a handful of credits. Upgrade only once you need more stops per day, priority routing, or team features.',
    icon: 'grow',
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
      {/* Decorative background – animated route paths */}
      <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 200 Q300 100 500 250 T900 200"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="text-dispatch-accent animate-[dash_8s_linear_infinite]"
          />
          <path
            d="M150 500 Q400 600 600 450 T1000 550"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="text-dispatch-accentDim animate-[dash_10s_linear_infinite]"
          />
          <path
            d="M300 100 C500 0 700 300 900 150"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="text-dispatch-line animate-[dash_12s_linear_infinite]"
          />
        </svg>
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -100; }
          }
        `}</style>
      </div>

      {/* Header */}
      <div className="relative max-w-xl mb-12 z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything after "where do I go first."</h2>
        <p className="text-dispatch-dim text-sm sm:text-base leading-relaxed">
          Waypoint takes a list of places — however messy — and turns it into a route you can
          actually drive, walk, or hand to a rideshare, with the reasoning shown, not hidden.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {FEATURES.map((f, i) => (
          <TiltCard key={f.title} maxTilt={5} glare className="h-full">
            <div
              className="p-6 rounded-xl border border-dispatch-line bg-dispatch-panel/80 backdrop-blur-sm transition-all duration-300 hover:border-dispatch-accent/50 hover:shadow-xl hover:shadow-dispatch-accent/5 h-full flex flex-col group"
            >
              <FeatureIcon type={f.icon} />
              <h3 className="text-base font-semibold mt-4 mb-2">{f.title}</h3>
              <p className="text-sm text-dispatch-dim leading-relaxed flex-1">{f.body}</p>
              <div className="mt-4 text-xs font-mono text-dispatch-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore →
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}