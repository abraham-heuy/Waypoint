import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../layout/ThemeToggle';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const SEGMENT_LABEL: Record<string, string> = {
  solo: 'Individual',
  delivery: 'Delivery driver',
  field_team: 'Field team',
  enterprise: 'Enterprise',
};

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const initials = user ? getUserInitials(user.name) : '';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-dispatch-line bg-dispatch-bg/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div>
            <div className="font-bold text-sm">Waypoint</div>
            <div className="text-[11px] text-dispatch-dim">
              {user ? SEGMENT_LABEL[user.segment] ?? 'Dashboard' : 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono border border-dispatch-line rounded-full px-3 py-1.5">
                <span className="text-dispatch-dim">Credits</span>
                <span className="text-dispatch-accent font-semibold">{user.credits}</span>
              </div>
            )}
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}