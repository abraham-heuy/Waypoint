import { useNavigate } from 'react-router-dom';
import PricingCards from '../components/landing/PricingCards';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing, real value</h1>
        <p className="text-dispatch-dim text-sm sm:text-base leading-relaxed">
          Every plan includes the same powerful route optimizer and AI assistant.
          You pay for flexibility,<b> ie:</b> more routes, more stops, and the ability to
          scale as your needs grow.
        </p>
      </div>

      {/* Why we price */}
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4 text-center">Why we price this way</h2>
        <div className="space-y-4 text-dispatch-dim text-sm leading-relaxed">
          <p>
            Waypoint is built on real algorithms, real road data, and live AI services.
            Every time you plan a route, we compute actual drive times, fetch traffic data,
            and run optimisation solvers – all of which have real infrastructure costs.
            We price transparently so you only pay for what you use, and we never hide
            costs behind confusing tiers.
          </p>
          <p>
            Your subscription directly supports:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Infrastructure</strong> – mapping APIs, solver compute, and real‑time traffic services.</li>
            <li><strong>AI development</strong> – continuous improvement of Jezza, our AI assistant.</li>
            <li><strong>Support</strong> – responsive, helpful support for all users, regardless of plan.</li>
            <li><strong>New features</strong> – every month we ship updates that make routing smarter and faster.</li>
          </ul>
        </div>
      </div>

      {/* What paying means */}
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-semibold mb-4 text-center">What paying gets you</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">More routes</div>
            <p className="text-dispatch-dim">Monthly credits that let you run more optimisations – no surprise overage fees.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">More stops per route</div>
            <p className="text-dispatch-dim">Plan complex itineraries with 14, 30, or even 100+ stops in a single route.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Team features</div>
            <p className="text-dispatch-dim">Share routes, assign stops to drivers, and track team performance.</p>
          </div>
          <div className="rounded-lg border border-dispatch-line/50 bg-dispatch-panel/40 p-4">
            <div className="font-semibold text-dispatch-accent">Priority support</div>
            <p className="text-dispatch-dim">Get help faster when you need it – your time matters.</p>
          </div>
        </div>
        <p className="text-xs text-dispatch-dim/60 text-center mt-4">
          All plans include the same core optimisation engine and Jezza AI. No feature is locked behind a paywall – only volume and support scale.
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">Tiers</h2>
      {/* Pricing cards */}
      <PricingCards onSelect={() => navigate('/get-started')} />

      {/* FAQ teaser or final note */}
      <div className="text-center max-w-2xl mx-auto mt-16 pt-8 border-t border-dispatch-line">
        <h3 className="text-base font-semibold mb-2">Still have questions?</h3>
        <p className="text-dispatch-dim text-sm">
          We’re happy to help you choose the right plan for your needs.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/contact" className="text-dispatch-accent hover:underline text-sm">
            Contact us
          </Link>
          <Link to="/faq" className="text-dispatch-dim hover:text-dispatch-text text-sm">
            Read our FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}