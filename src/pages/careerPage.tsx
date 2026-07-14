import { useState } from 'react';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/primitives';
import { toast } from '../store/toastStore';

export default function CareersPage() {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  // Filter states (even though no roles exist, we keep the UI consistent)
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    setSubscribing(true);
    // Mock subscription – in a real app you'd call an API
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubscribing(false);
    toast.success('You\'ve been added to our talent community. We\'ll reach out when roles open.');
    setSubscribeEmail('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Join the team</h1>
        <p className="text-dispatch-dim text-lg leading-relaxed">
          At Waypoint, we are building the system for intelligent mobility.
          Our work spans route optimisation, artificial intelligence, and real‑time
          logistics – from theory to production. We believe that better routing
          means less wasted time, lower emissions, and more equitable access to
          goods and services. If you share that conviction, we would love to hear
          from you.
        </p>
      </div>

      {/* Why Waypoint */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Why Waypoint</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Research‑driven engineering</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              We combine rigorous algorithmic research with practical software
              engineering. Our team publishes, prototypes, and deploys – often
              on the same day. You will work on problems that matter, with tools
              that scale.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Real‑world impact</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Every route we optimise saves time, fuel, and frustration. Our
              technology is used by delivery drivers, fleet managers, trip
              planners, and humanitarian organisations. You will see your work
              make a tangible difference in people’s daily lives.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Open culture</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              We value curiosity, transparency, and collaboration. Our team spans
              multiple disciplines and continents, and we believe the best ideas
              come from diverse perspectives. We support each other, learn in
              public, and share our failures as openly as our successes.
            </p>
          </div>
        </div>
      </div>

      {/* Who we're looking for */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Who we are looking for</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-dispatch-dim text-sm leading-relaxed">
          <p>
            We are building a team of people who are not only exceptional in
            their domain but also deeply motivated by the problem we are solving.
            You do not need to have a background in logistics or transportation –
            but you should be excited about learning it.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong className="text-dispatch-text">Engineers</strong> – who love
              building robust, performant systems and are comfortable working
              across the stack, from algorithms to APIs to frontend maps.
            </li>
            <li>
              <strong className="text-dispatch-text">Researchers</strong> – who
              are fascinated by combinatorial optimisation, machine learning, and
              the intersection of the two, and who can translate papers into
              production code.
            </li>
            <li>
              <strong className="text-dispatch-text">Designers &amp; product
              thinkers</strong> – who care deeply about user experience and can
              turn complex data into intuitive, beautiful tools.
            </li>
            <li>
              <strong className="text-dispatch-text">Mission‑driven builders</strong>
              – who want to work on climate, mobility, and equity challenges,
              and who bring a growth mindset, empathy, and a collaborative spirit
              to everything they do.
            </li>
          </ul>
          <p className="mt-4">
            We are not looking for a specific set of credentials or years of
            experience – we are looking for people who are smart, kind, and
            eager to make an impact.
          </p>
        </div>
      </div>

      {/* Open positions – with filters, but no roles */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-6 text-center">Open positions</h2>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl border border-dispatch-line bg-dispatch-panel">
          <div className="flex items-center gap-2">
            <label className="text-xs text-dispatch-dim font-mono uppercase tracking-wider">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
            >
              <option>All</option>
              <option>Engineering</option>
              <option>Research</option>
              <option>Design</option>
              <option>Operations</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-dispatch-dim font-mono uppercase tracking-wider">
              Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
            >
              <option>All</option>
              <option>Remote</option>
              <option>Nairobi</option>
              <option>San Francisco</option>
              <option>London</option>
            </select>
          </div>
          <span className="text-xs text-dispatch-dim ml-auto">
            Sorry, No open roles at this time
          </span>
        </div>

        {/* No roles message */}
        <div className="text-center py-12 rounded-xl border border-dispatch-line border-dashed bg-dispatch-panel/40">
          <div className="max-w-md mx-auto">
            <p className="text-dispatch-text font-semibold mb-2">We are not actively hiring right now</p>
            <p className="text-dispatch-dim text-sm">
              But we are always on the lookout for exceptional people. Join our talent
              community and we will reach out when a role that matches your profile
              becomes available.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button type="submit" loading={subscribing} size="sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* How to reach out */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="rounded-2xl border border-dispatch-line bg-dispatch-panel p-8">
          <h2 className="text-2xl font-semibold mb-4">Let’s talk</h2>
          <p className="text-dispatch-dim text-sm mb-6">
            Even if we do not have a role listed, we are always interested in
            meeting talented people who align with our mission. Send us a note
            with your background, what excites you about Waypoint, and how you
            think you could contribute – we will get back to you within a week.
          </p>
          <a
            href="mailto:info@waypoint.com?subject=Career inquiry"
            className="inline-block px-6 py-3 rounded-lg border border-dispatch-accent bg-dispatch-accent text-[#1a1200] font-medium hover:opacity-90 transition-opacity"
          >
            Email us at info@waypoint.com
          </a>
          <p className="text-xs text-dispatch-dim mt-4">
            We review every message personally and will reply to all genuine inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}