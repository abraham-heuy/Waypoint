const PRINCIPLES = [
  { title: 'Real data over approximation', body: 'Every route is solved against actual road travel times. Straight-line distance is only ever a last-resort fallback, and we tell you when that happens.' },
  { title: 'Exact where it counts', body: 'For small stop counts, the underlying solver finds the mathematically optimal order — not a heuristic guess dressed up as one.' },
  { title: 'The assistant explains itself', body: 'When the AI reorders your stops or flags a tight time window, it says why, in plain language, rather than presenting a black-box answer.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="inline-block text-xs font-mono uppercase tracking-widest text-dispatch-accent border border-dispatch-accentDim rounded-full px-3 py-1 mb-6">
        About
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        We think route planning should show its work.
      </h1>
      <p className="text-dispatch-dim leading-relaxed mb-6">
        Waypoint started from a simple frustration: most route tools either make you do everything
        manually, or hide the reasoning behind a single "optimize" button. We wanted both real
        optimization — the kind built on actual road data and proper algorithms — and a plain-language
        explanation of why the route looks the way it does.
      </p>
      <p className="text-dispatch-dim leading-relaxed mb-14">
        Today that means one platform serving very different days: a restaurant courier working
        through lunch orders, someone running a Saturday's worth of errands, a traveler mapping out
        a week in a new city, and small teams coordinating a handful of drivers — all on the same
        underlying engine.
      </p>

      <h2 className="text-xl font-semibold mb-6">What we optimize for</h2>
      <div className="space-y-6">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="border-l-2 border-dispatch-accentDim pl-5">
            <h3 className="text-sm font-semibold mb-1.5">{p.title}</h3>
            <p className="text-sm text-dispatch-dim leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
