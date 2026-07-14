import { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import GrowthChart from '../../components/admin/GrowthChart';
import { fetchAdminDashboard, fetchAdminGrowth, type AdminDashboard, type GrowthPoint } from '../../lib/adminApi';

export default function AdminOverviewPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [growth, setGrowth] = useState<GrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [dashResult, growthResult] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminGrowth(30),
      ]);
      if (dashResult.ok && dashResult.data) setDashboard(dashResult.data);
      if (growthResult.ok && growthResult.data) setGrowth(growthResult.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="text-dispatch-dim text-sm">Loading platform overview…</div>;
  }
  if (!dashboard) {
    return <div className="text-dispatch-danger text-sm">Couldn't load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Platform overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total users" value={dashboard.totalUsers} />
        <StatCard label="Routes (7d)" value={dashboard.routesLast7Days} />
        <StatCard label="AI messages (7d)" value={dashboard.aiMessagesLast7Days} />
        <StatCard label="Pending KYC" value={dashboard.pendingKyc} accent={dashboard.pendingKyc > 0} />
        <StatCard label="Open partnerships" value={dashboard.openPartnershipRequests} />
        <StatCard label="Credits spent" value={dashboard.totalCreditsSpent} />
        <StatCard label="Total routes" value={dashboard.totalRoutePlans} />
        <StatCard
          label="Revenue"
          value={`$${(dashboard.totalRevenueCents / 100).toFixed(2)}`}
          accent
        />
      </div>

      <GrowthChart data={growth} />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
            Users by tier
          </div>
          <div className="space-y-2">
            {Object.entries(dashboard.usersByTier).map(([tier, count]) => (
              <div key={tier} className="flex justify-between text-sm">
                <span className="text-dispatch-dim capitalize">{tier}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
            Users by segment
          </div>
          <div className="space-y-2">
            {Object.entries(dashboard.usersBySegment).map(([segment, count]) => (
              <div key={segment} className="flex justify-between text-sm">
                <span className="text-dispatch-dim capitalize">{segment.replace('_', ' ')}</span>
                <span className="font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}