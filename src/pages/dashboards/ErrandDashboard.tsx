import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import RouteSummaryCard from '../../components/dashboard/RouteSummaryCard';
import AiAssistantPanel from '../../components/dashboard/AiAssistantPanel';
import { ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import { useAuthStore } from '../../store/authStore';

export default function ErrandDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Hey, {user.name.split(' ')[0]}.</h1>
        <p className="text-sm text-dispatch-dim">Tell the assistant your errands, or plan them on the map yourself.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Credits left" value={String(user.credits)} />
        <StatCard label="Plan" value={user.tier} />
        <StatCard label="Get around by" value={user.vehicleType ?? 'Not set'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <AiAssistantPanel />
          <RouteSummaryCard userId={user.id} onPlanNew={() => navigate('/planner')} />
        </div>
        <div>
          <ActivityFeed userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
