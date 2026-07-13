import { Link, useParams } from 'react-router-dom';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMins: number;
  body: string[];
}

const POSTS: Post[] = [
  {
    slug: 'why-straight-line-distance-lies',
    title: 'Why straight-line distance lies to you',
    excerpt: 'A route that looks shortest on paper can be the slowest one to actually drive. Here\'s what changes when you route on real roads.',
    date: 'July 2, 2026',
    readMins: 4,
    body: [
      'A straight line between two points ignores the one thing that actually matters for a driver: the roads that exist between them.',
      'Two stops that look close on a map can be separated by a river, a one-way system, or twenty minutes of traffic — and two stops that look far apart might sit on the same fast arterial road.',
      'Route optimization is only as good as the distance data feeding it. That\'s why every route here is solved against real drive-time data first, and a straight-line estimate is only ever used as a fallback, clearly labeled as such.',
    ],
  },
  {
    slug: 'exact-vs-heuristic-routing',
    title: 'Exact vs. heuristic: when each one is right',
    excerpt: 'Ten stops and a hundred stops need genuinely different algorithms. Here\'s the line between them.',
    date: 'June 18, 2026',
    readMins: 5,
    body: [
      'For a small number of stops, an exact algorithm like Held-Karp can find the mathematically optimal order in well under a second.',
      'Once the stop count grows past roughly 15, the memory that exact approach needs grows too fast to be practical, and that\'s the point to switch to a heuristic solver that gets very close to optimal, very quickly, at any scale.',
      'Knowing which regime you\'re in — and switching automatically — matters more than picking one algorithm and hoping it scales.',
    ],
  },
  {
    slug: 'planning-a-week-not-a-day',
    title: 'Planning a week, not just a day',
    excerpt: 'Trip planning and recurring errands need a different shape of problem than a single day\'s deliveries.',
    date: 'June 5, 2026',
    readMins: 3,
    body: [
      'A single day of delivery stops is one optimization problem. A week of sightseeing, or a recurring errand run, is really several smaller problems chained together with a shared budget of time and energy.',
      'That distinction is why multi-day planning isn\'t just "run the same solver seven times" — it means deciding which stops belong on which day in the first place, often before any single day gets optimized at all.',
    ],
  },
];

export function BlogListPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">From the team.</h1>
      <p className="text-dispatch-dim mb-12">Notes on routing, optimization, and building for how people actually move.</p>
      <div className="space-y-8">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="block rounded-xl border border-dispatch-line bg-dispatch-panel p-6 hover:border-dispatch-dim transition-colors"
          >
            <div className="text-xs text-dispatch-dim font-mono mb-2">
              {p.date} · {p.readMins} min read
            </div>
            <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
            <p className="text-sm text-dispatch-dim leading-relaxed">{p.excerpt}</p>
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
        <Link to="/blog" className="text-dispatch-accent text-sm">
          Back to the blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <Link to="/blog" className="text-xs text-dispatch-dim hover:text-dispatch-text mb-6 inline-block">
        ← Back to the blog
      </Link>
      <div className="text-xs text-dispatch-dim font-mono mb-3">
        {post.date} · {post.readMins} min read
      </div>
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="space-y-5">
        {post.body.map((para, i) => (
          <p key={i} className="text-dispatch-dim leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
