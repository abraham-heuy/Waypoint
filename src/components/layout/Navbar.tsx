import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const initials = user ? getUserInitials(user.name) : '';

  const productLinks = [
    { to: '/products/route-optimizer', label: 'Route Optimizer', description: 'The engine that powers your best route.' },
    { to: '/products/jezza-ai', label: 'Jezza AI', description: 'Your intelligent route planning assistant.' },
    { to: '/products/task-insights', label: 'Task Insights', description: 'Understand your performance and improve.' },
    { to: '/products/maps-integration', label: 'Maps Integration', description: 'Real maps, real directions, real-time.' },
    { to: '/products/cost-computation', label: 'Cost Computation', description: 'Understand the cost of every route.' },
  ];

  return (
    <header className="sticky top-0 z-[1000] border-b border-dispatch-line bg-dispatch-bg/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <span className="w-2.5 h-2.5 rounded-sm bg-dispatch-accent" />
          Waypoint
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-dispatch-dim">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="hover:text-dispatch-text transition-colors flex items-center gap-1">
              Products
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full pt-2 w-80">
                <div className="bg-dispatch-panel border border-dispatch-line rounded-xl shadow-xl p-4 grid gap-3">
                  {productLinks.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className="p-3 rounded-lg hover:bg-dispatch-panel2 transition-colors group"
                    >
                      <div className="font-semibold text-dispatch-text group-hover:text-dispatch-accent">
                        {p.label}
                      </div>
                      <p className="text-xs text-dispatch-dim mt-1">{p.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/pricing" className="hover:text-dispatch-text transition-colors">Pricing</Link>

          {/* Programs dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProgramsOpen(true)}
            onMouseLeave={() => setProgramsOpen(false)}
          >
            <button className="hover:text-dispatch-text transition-colors flex items-center gap-1">
              Programs
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {programsOpen && (
              <div className="absolute left-0 top-full pt-2 w-80">
                <div className="bg-dispatch-panel border border-dispatch-line rounded-xl shadow-xl p-4 grid grid-cols-2 gap-4">
                  <Link
                    to="/partnerships"
                    className="p-3 rounded-lg hover:bg-dispatch-panel2 transition-colors group"
                  >
                    <div className="font-semibold text-dispatch-text group-hover:text-dispatch-accent">Partnerships</div>
                    <p className="text-xs text-dispatch-dim mt-1">Integration and collaboration opportunities.</p>
                  </Link>
                  <Link
                    to="/programs"
                    className="p-3 rounded-lg hover:bg-dispatch-panel2 transition-colors group"
                  >
                    <div className="font-semibold text-dispatch-text group-hover:text-dispatch-accent">Programs</div>
                    <p className="text-xs text-dispatch-dim mt-1">Community and developer initiatives.</p>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-dispatch-text transition-colors">About</Link>
          <Link to="/contact" className="hover:text-dispatch-text transition-colors">Contact</Link>
          <Link to="/blog" className="hover:text-dispatch-text transition-colors">Blog</Link>
          <Link to="/faq" className="hover:text-dispatch-text transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-dispatch-accent/20 border border-dispatch-accent/30 flex items-center justify-center text-sm font-semibold text-dispatch-accent">
                  {initials}
                </div>
                <span className="text-sm text-dispatch-dim hidden lg:inline">Dashboard</span>
              </button>
            </div>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
              <Button size="sm" onClick={() => navigate('/get-started')}>Get started</Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-0.5 bg-dispatch-text transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`h-0.5 bg-dispatch-text transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-dispatch-text transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-dispatch-line px-4 sm:px-6 py-4 flex flex-col gap-4 bg-dispatch-bg">
          <div className="text-sm font-semibold text-dispatch-text mt-1">Products</div>
          <div className="pl-3 space-y-2">
            <Link to="/products/route-optimizer" onClick={() => setOpen(false)} className="block text-sm text-dispatch-dim hover:text-dispatch-text">Route Optimizer</Link>
            <Link to="/products/jezza-ai" onClick={() => setOpen(false)} className="block text-sm text-dispatch-dim hover:text-dispatch-text">Jezza AI</Link>
            <Link to="/products/task-insights" onClick={() => setOpen(false)} className="block text-sm text-dispatch-dim hover:text-dispatch-text">Task Insights</Link>
            <Link to="/products/maps-integration" onClick={() => setOpen(false)} className="block text-sm text-dispatch-dim hover:text-dispatch-text">Maps Integration</Link>
            <Link to="/products/cost-computation" onClick={() => setOpen(false)} className="block text-sm text-dispatch-dim hover:text-dispatch-text">Cost Computation</Link>
          </div>

          <Link to="/pricing" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text">Pricing</Link>

          <div className="text-sm font-semibold text-dispatch-text mt-1">Programs</div>
          <Link to="/partnerships" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text pl-3">Partnerships</Link>
          <Link to="/programs" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text pl-3">Programs</Link>

          <Link to="/about" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text">About</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text">Contact</Link>
          <Link to="/blog" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text">Blog</Link>
          <Link to="/faq" onClick={() => setOpen(false)} className="text-sm text-dispatch-dim hover:text-dispatch-text">FAQ</Link>

          <div className="flex items-center justify-between pt-2 border-t border-dispatch-line">
            <ThemeToggle />
            {user ? (
              <button onClick={() => { setOpen(false); navigate('/dashboard'); }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-dispatch-accent/20 border border-dispatch-accent/30 flex items-center justify-center text-sm font-semibold text-dispatch-accent">
                  {initials}
                </div>
                <span className="text-sm">Dashboard</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
                <Button size="sm" onClick={() => navigate('/get-started')}>Get started</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}