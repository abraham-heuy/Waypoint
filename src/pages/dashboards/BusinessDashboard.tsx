import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { PerformanceCard, ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import { Card } from '../../components/ui/primitives';
import { useAuthStore } from '../../store/authStore';

const DRIVERS = [
  { name: 'James M.', stops: 8, status: 'On route', onTime: '96%' },
  { name: 'Grace W.', stops: 6, status: 'On route', onTime: '89%' },
  { name: 'Peter K.', stops: 5, status: 'Finished', onTime: '100%' },
];

export default function BusinessDashboard() {
  const user = useAuthStore((s) => s.user)!;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Team overview.</h1>
        <p className="text-sm text-dispatch-dim">3 drivers active today across 19 stops.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active drivers" value="3" />
        <StatCard label="Stops today" value="19" />
        <StatCard label="Team on-time" value="94%" />
        <StatCard label="Credits left" value={String(user.credits)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-sm font-semibold mb-4">Drivers</h3>
          <div className="space-y-3">
            {DRIVERS.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-sm border-b border-dispatch-line last:border-b-0 pb-3 last:pb-0"
              >
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-[11px] text-dispatch-dim">{d.stops} stops · {d.status}</div>
                </div>
                <div className="font-mono text-xs text-dispatch-accent">{d.onTime}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <PerformanceCard userId={user.id} />
          <ActivityFeed userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
