import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import RoutePlannerCard from '../../components/dashboard/RoutePlannerCard';
import { ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import { useAuthStore } from '../../store/authStore';

export default function ErrandDashboard() {
  const user = useAuthStore((s) => s.user)!;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Hey, {user.name.split(' ')[0]}.</h1>
        <p className="text-sm text-dispatch-dim">
          Tap the map, drag pins around, or tell the assistant your errands — either way it plans the loop.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Credits left" value={String(user.credits)} />
        <StatCard label="Plan" value={user.tier} />
        <StatCard label="Get around by" value={user.transportMode?.replace('_', ' ') ?? 'Not set'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RoutePlannerCard title="Your errands" />
        </div>
        <div>
          <ActivityFeed userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
