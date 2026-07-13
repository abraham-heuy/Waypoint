import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const NAV_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

// Helper to get user initials
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const initials = user ? getUserInitials(user.name) : '';

  return (
    <header className="sticky top-0 z-[1000] border-b border-dispatch-line bg-dispatch-bg/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
          <span className="w-2.5 h-2.5 rounded-sm bg-dispatch-accent" />
          Waypoint
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-dispatch-dim">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-dispatch-text transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                aria-label="Go to dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-dispatch-accent/20 border border-dispatch-accent/30 flex items-center justify-center text-sm font-semibold text-dispatch-accent">
                  {initials}
                </div>
                <span className="text-sm text-dispatch-dim hidden lg:inline">Dashboard</span>
              </button>
            </div>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/get-started')}>
                Get started
              </Button>
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

      {open && (
        <div className="md:hidden border-t border-dispatch-line px-4 sm:px-6 py-4 flex flex-col gap-4 bg-dispatch-bg">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-sm text-dispatch-dim hover:text-dispatch-text"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-dispatch-line">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate('/dashboard');
                }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-dispatch-accent/20 border border-dispatch-accent/30 flex items-center justify-center text-sm font-semibold text-dispatch-accent">
                  {initials}
                </div>
                <span className="text-sm">Dashboard</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate('/get-started')}>
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}