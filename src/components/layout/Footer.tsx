import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-dispatch-line mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-bold mb-3">
            <span className="w-2.5 h-2.5 rounded-sm bg-dispatch-accent" />
            Waypoint
          </div>
          <p className="text-dispatch-dim text-xs leading-relaxed">
            Route planning for drivers, errands, trips, and teams.
          </p>
        </div>

        {/* Products */}
        <div>
          <div className="text-xs uppercase tracking-wide text-dispatch-dim mb-3">Products</div>
          <ul className="space-y-2 text-dispatch-dim">
            <li><Link to="/products/route-optimizer" className="hover:text-dispatch-text">Route Optimizer</Link></li>
            <li><Link to="/products/jezza-ai" className="hover:text-dispatch-text">Jezza AI</Link></li>
            <li><Link to="/products/task-insights" className="hover:text-dispatch-text">Task Insights</Link></li>
            <li><Link to="/products/maps-integration" className="hover:text-dispatch-text">Maps Integration</Link></li>
            <li><Link to="/products/cost-computation" className="hover:text-dispatch-text">Cost Computation</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <div className="text-xs uppercase tracking-wide text-dispatch-dim mb-3">Company</div>
          <ul className="space-y-2 text-dispatch-dim">
            <li><Link to="/about" className="hover:text-dispatch-text">About</Link></li>
            <li><Link to="/careers" className="hover:text-dispatch-text">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-dispatch-text">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-dispatch-text">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <div className="text-xs uppercase tracking-wide text-dispatch-dim mb-3">Legal</div>
          <ul className="space-y-2 text-dispatch-dim">
          <li><Link to="/privacy" className="hover:text-dispatch-text">Privacy</Link></li>
          <li><Link to="/terms" className="hover:text-dispatch-text">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dispatch-line py-5 text-center text-xs text-dispatch-dim">
        © 2026 Waypoint. Built on real routing + assistant.
      </div>
    </footer>
  );
}