import { Link, useParams } from 'react-router-dom';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  tags: string[];
  body: string[];
}

const POSTS: Post[] = [
  {
    slug: 'why-straight-line-distance-lies',
    title: 'Why straight-line distance lies to you',
    excerpt: 'A route that looks shortest on paper can be the slowest one to drive. Here is what changes when you route on real roads.',
    date: 'July 2, 2026',
    readMins: 6,
    tags: ['Routing', 'Mapping', 'Optimization'],
    body: [
      'A straight line between two points ignores the one thing that actually matters for a driver: the roads that exist between them. This is often called the “as the crow flies” distance, and it is rarely the distance you will actually travel.',
      'Consider two stops that appear close on a map. They might be separated by a river with only one bridge, a one‑way system that forces a long detour, or a congested intersection that adds ten minutes of delay. Conversely, two stops that seem far apart might sit on the same fast arterial road, making the trip shorter than expected.',
      'Route optimization is only as good as the distance data feeding it. That is why every route here is solved against real drive‑time data first. We use a live road network that accounts for speed limits, traffic patterns, turn restrictions, and elevation changes. A straight‑line estimate is only ever used as a fallback, and when it is, we clearly label it as such.',
      'We also integrate with mapping services that provide live traffic updates, so your route adapts to current conditions. This approach, while more computationally expensive, produces routes that are actually faster and more reliable for drivers, couriers, and travellers.',
    ],
  },
  {
    slug: 'exact-vs-heuristic-routing',
    title: 'Exact vs. heuristic: when each one is right',
    excerpt: 'Ten stops and a hundred stops need genuinely different algorithms. Here is the line between them.',
    date: 'June 18, 2026',
    readMins: 7,
    tags: ['Algorithms', 'Performance', 'Optimization'],
    body: [
      'For a small number of stops, an exact algorithm like Held‑Karp can find the mathematically optimal order in well under a second. Held‑Karp uses dynamic programming to explore every possible permutation of stops, guaranteeing you the shortest possible route. This is perfect for daily errands, small delivery runs, or short sightseeing tours.',
      'Once the stop count grows past roughly 15, the memory and time that exact approach requires grows so fast that it becomes impractical. At that point, we switch to a heuristic solver. Heuristics do not guarantee perfect optimality, but they get very close (within a few percent) in a fraction of the time, and they scale to hundreds or even thousands of stops.',
      'The transition is automatic. Our solver evaluates the number of stops and the available computation time, then selects the best method for the job. It also uses a hybrid approach for intermediate sizes, combining exact pruning with heuristic search.',
      'Knowing which regime you are in, and switching seamlessly, matters more than picking one algorithm and hoping it scales. This adaptive philosophy is built into every route request, so you always get the best possible answer without having to think about the underlying mathematics.',
    ],
  },
  {
    slug: 'planning-a-week-not-a-day',
    title: 'Planning a week, not just a day',
    excerpt: 'Trip planning and recurring errands need a different shape of problem than a single day’s deliveries.',
    date: 'June 5, 2026',
    readMins: 5,
    tags: ['Trip planning', 'Multi‑day', 'Logistics'],
    body: [
      'A single day of delivery stops is one optimization problem. A week of sightseeing, or a recurring errand run, is really several smaller problems chained together with a shared budget of time and energy.',
      'That distinction is why multi‑day planning is not simply “run the same solver seven times”. It means deciding which stops belong on which day in the first place, often before any single day gets optimized at all. You also need to respect opening hours, user preferences (like wanting to visit certain places on certain days), and the fatigue that accumulates over multiple days of travel.',
      'Our approach treats each day as a separate route but optimises the allocation of stops to days jointly. We consider travel times between stops, the desired pace, and even the time needed for meals and rest. The result is a balanced, realistic itinerary that feels natural to follow.',
      'We also support dynamic re‑planning: if you finish early or get delayed, the system can reassign stops and re‑optimise on the fly, ensuring you always have a workable plan for the week ahead.',
    ],
  },
];

export function BlogListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">From the team</h1>
        <p className="text-dispatch-dim text-lg mt-2">
          Notes on routing, optimization, and building for how people actually move.
        </p>
      </div>

      <div className="space-y-8">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block rounded-xl border border-dispatch-line bg-dispatch-panel p-6 hover:border-dispatch-dim transition-all hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-dispatch-dim font-mono mb-2">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readMins} min read</span>
              <span>·</span>
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full border border-dispatch-line bg-dispatch-panel2 text-[10px] uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-dispatch-text">{post.title}</h2>
            <p className="text-dispatch-dim text-sm leading-relaxed">{post.excerpt}</p>
            <span className="inline-block mt-3 text-xs font-medium text-dispatch-accent group-hover:underline">
              Read article →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Post not found.</h1>
        <Link to="/blog" className="text-dispatch-accent text-sm hover:underline">
          Back to the blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <Link to="/blog" className="text-xs text-dispatch-dim hover:text-dispatch-text mb-6 inline-block">
        ← Back to the blog
      </Link>

      <div className="flex flex-wrap items-center gap-3 text-xs text-dispatch-dim font-mono mb-4">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readMins} min read</span>
        <span>·</span>
        <span className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full border border-dispatch-line bg-dispatch-panel2 text-[10px] uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-dispatch-text">{post.title}</h1>

      <div className="prose prose-invert max-w-none text-dispatch-dim leading-relaxed space-y-4">
        {post.body.map((para, i) => (
          <p key={i} className="text-base leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}