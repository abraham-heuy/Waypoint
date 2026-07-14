import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/kyc', label: 'KYC' },
  { to: '/admin/routes', label: 'Routes' },
  { to: '/admin/ai-activity', label: 'AI Activity' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/feedback', label: 'Feedback' },
  { to: '/admin/partnerships', label: 'Partnerships' },
  { to: '/admin/config', label: 'Config' },
  { to: '/admin/audit-log', label: 'Audit Log' },
];

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const initials = user ? getUserInitials(user.name) : '';

  function closeSidebar() {
    setSidebarOpen(false);
  }

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-5 border-b border-dispatch-line">
        <div>
          <div className="font-bold text-sm">Waypoint</div>
          <div className="text-[11px] text-dispatch-accent font-mono uppercase tracking-widest">
            Admin
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={closeSidebar} // close mobile sidebar on click
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                isActive
                  ? 'bg-dispatch-accent/10 text-dispatch-accent border border-dispatch-accentDim'
                  : 'text-dispatch-dim hover:text-dispatch-text hover:bg-dispatch-panel2 border border-transparent'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-dispatch-line">
        <button
          onClick={() => {
            closeSidebar();
            navigate('/dashboard');
          }}
          className="w-full text-left px-3 py-2 rounded-md text-xs text-dispatch-dim hover:text-dispatch-text hover:bg-dispatch-panel2 transition-colors"
        >
          ← Back to app
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-dispatch-bg text-dispatch-text">
      {/* Desktop sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-dispatch-line bg-dispatch-panel">
        {sidebarContent}
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-dispatch-line bg-dispatch-bg/90 backdrop-blur">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Hamburger button (visible on mobile) */}
            <button
              className="md:hidden p-2 -ml-2 text-dispatch-dim hover:text-dispatch-text"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="md:hidden font-bold text-sm">Waypoint Admin</div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user && (
                <div className="w-8 h-8 rounded-full bg-dispatch-accent text-[#1a1200] text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
              )}
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar (slide-in) */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-dispatch-panel border-r border-dispatch-line transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        {sidebarContent}
      </aside>
    </div>
  );
}