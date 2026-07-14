import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import RoutePlannerCard from '../../components/dashboard/RoutePlannerCard';
import { Card } from '../../components/ui/primitives';
import { useAuthStore } from '../../store/authStore';

const DAYS = [
  { label: 'Day 1', summary: 'Old Town — 4 stops · 2h 10m walking' },
  { label: 'Day 2', summary: 'Museums district — 3 stops · 1h 40m' },
  { label: 'Day 3', summary: 'Coastal day trip — 5 stops · 3h 20m driving' },
];

export default function TouristDashboard() {
  const user = useAuthStore((s) => s.user)!;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Planning your trip, {user.name.split(' ')[0]}.</h1>
        <p className="text-sm text-dispatch-dim">Describe what you want to see, or build each day on the map.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Days planned" value="3" />
        <StatCard label="Total stops" value="12" />
        <StatCard label="Credits left" value={String(user.credits)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RoutePlannerCard title="Today" loadExisting={false} />
        </div>
        <Card className="p-5">
          <h3 className="text-sm font-semibold mb-4">Trip overview</h3>
          <ul className="space-y-3">
            {DAYS.map((d) => (
              <li key={d.label} className="text-xs">
                <div className="font-mono text-dispatch-accent mb-0.5">{d.label}</div>
                <div className="text-dispatch-dim">{d.summary}</div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-dispatch-dim mt-4 pt-4 border-t border-dispatch-line leading-relaxed">
            Multi-day planning (saving each day separately) needs a "day" field on saved routes —
            see the API notes below for what that endpoint should look like.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
