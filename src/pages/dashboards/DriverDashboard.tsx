import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import RoutePlannerCard from '../../components/dashboard/RoutePlannerCard';
import { PerformanceCard, ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import { useAuthStore } from '../../store/authStore';

export default function DriverDashboard() {
  const user = useAuthStore((s) => s.user)!;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Good to see you, {user.name.split(' ')[0]}.</h1>
        <p className="text-sm text-dispatch-dim">Here's what's on today's run.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Credits left" value={String(user.credits)} />
        <StatCard label="On-time rate" value="93%" hint="Last 30 days" />
        <StatCard label="Plan" value={user.tier} />
        <StatCard label="Get around by" value={user.transportMode?.replace('_', ' ') ?? 'Not set'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RoutePlannerCard title="Today's run" />
        </div>
        <div className="space-y-5">
          <PerformanceCard userId={user.id} />
          <ActivityFeed userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
