const PRINCIPLES = [
  {
    title: 'Real data over approximation',
    body: 'Every route is solved against actual road travel times. Straight-line distance is only ever a last-resort fallback, and we tell you when that happens.',
  },
  {
    title: 'Exact where it counts',
    body: 'For small stop counts, the underlying solver finds the mathematically optimal order, not a heuristic guess dressed up as one.',
  },
  {
    title: 'The assistant explains itself',
    body: 'When the AI reorders your stops or flags a tight time window, it says why, in plain language, rather than presenting a black-box answer.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Large Waypoint heading */}
      <div className="text-center mb-12">
        <div className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-dispatch-accent to-dispatch-accentDim bg-clip-text text-transparent">
          Waypoint
        </div>
        <p className="text-dispatch-dim text-lg mt-3">
          Route planning that shows its work – and helps you get things done.
        </p>
      </div>

      {/* Origin story */}
      <div className="mb-14">
        <p className="text-dispatch-dim leading-relaxed">
          I started building this tool while learning how the Held‑Karp algorithm works – a
          simple route optimiser that could find the shortest path through a few stops.
          <a
            href="https://route-optimizer-tool.netlify.app/"
            className="text-dispatch-accent hover:underline mx-1"
            target="_blank"
          >
            (see the original algorithm here)
          </a>
          As I kept adding features, it grew into a full platform that combines real‑world
          routing with AI assistance, rideshare integration, and team management. Today,
          Waypoint is the result of that journey: a tool that helps you plan smarter,
          move faster, and get more done.
        </p>
      </div>

      {/* What makes Waypoint unique */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-6 text-center">What makes Waypoint different</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Jezza bot</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Your personal planning assistant. Describe your day in plain language – “pharmacy,
              then groceries, pick up Sam by 4” – and Jezza turns it into a structured route with
              time windows, notes, and re‑optimisation suggestions. It explains every change.
              It also presents multiple route options and helps you choose the best one.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Real-time mapping</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Inbuilt Google Maps integration shows you the exact route, turn‑by‑turn directions,
              and live traffic. You can drag stops, add waypoints, and see the impact instantly.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Rideshare & errand orchestration</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Need a ride for a leg of your trip? Waypoint can estimate Uber, Bolt, or local
              rideshare costs and times. You can also assign errands to someone else – a team
              member, a delivery partner, or a virtual assistant – and track their progress
              in real time.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Delivery & profit optimisation</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              For teams and delivery drivers, Waypoint helps you reach higher targets – say,
              20 deliveries a day – by reducing wasted mileage and time. The system learns
              from past routes, suggests better stop sequences, and even recommends which
              orders to take to maximise revenue per hour.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Smart reminders</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Never miss a time window. Waypoint sends you gentle nudges when you need to leave
              for the next stop, and can sync with your calendar or phone notifications.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5">
            <div className="text-lg font-bold text-dispatch-accent mb-2">Assisted planning</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Combine manual map placement with AI suggestions. Jezza learns your preferences
              over time – preferred stops, typical travel modes, and even the best time of day
              for certain errands – and offers proactive recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* The goals */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-4 text-center">Our goals</h2>
        <ul className="space-y-3 text-dispatch-dim text-sm leading-relaxed list-disc list-inside max-w-2xl mx-auto">
          <li>
            <strong className="text-dispatch-text">Reduce mental overhead</strong> – so you can
            focus on the actual journey, not on juggling spreadsheets or timings.
          </li>
          <li>
            <strong className="text-dispatch-text">Save time and fuel</strong> – by using real
            road data and intelligent algorithms that cut unnecessary miles.
          </li>
          <li>
            <strong className="text-dispatch-text">Make optimisation transparent</strong> – so you
            understand why a route is ordered the way it is, and can trust the result.
          </li>
          <li>
            <strong className="text-dispatch-text">Adapt to how you move</strong> – whether you
            drive, walk, ride, or mix modes, Waypoint adjusts the route and the advice it gives.
          </li>
          <li>
            <strong className="text-dispatch-text">Enable seamless rideshare and delegation</strong>
            – so you can always choose the most convenient or cost‑effective way to complete your tasks.
          </li>
        </ul>
      </div>

      {/* Who can use it */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold mb-4 text-center">Who is Waypoint for</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm max-w-2xl mx-auto">
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Delivery drivers</div>
            <p className="text-dispatch-dim">Restaurant, courier, or package runs – time windows and tight schedules are handled automatically.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Errand runners</div>
            <p className="text-dispatch-dim">Pharmacy, groceries, bank, kids’ pickups – plan the whole loop in one go.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Travel planners</div>
            <p className="text-dispatch-dim">Multi‑day itineraries with sightseeing, meals, and transport – all optimised for time and enjoyment.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Small teams</div>
            <p className="text-dispatch-dim">Coordinate multiple drivers, share routes, and track performance across your fleet.</p>
          </div>
        </div>
      </div>

      {/* Principles (already present) */}
      <h2 className="text-xl font-semibold mb-6 text-center">What we optimize for</h2>
      <div className="space-y-6 max-w-2xl mx-auto">
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