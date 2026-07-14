import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { PerformanceCard, ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import { Card, Skeleton } from '../../components/ui/primitives';
import { useAuthStore } from '../../store/authStore';
import { fetchTeam } from '../../lib/api';
import type { TeamMember } from '../../types';
import DriverRouteModal from '../../components/dashboard/DriverROuteModal';

const STATUS_LABEL: Record<TeamMember['status'], string> = {
  on_route: 'On route',
  finished: 'Finished',
  idle: 'Idle',
};

export default function BusinessDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<TeamMember | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTeam(user.id).then((res) => {
      if (!cancelled && res.ok && res.data) setTeam(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const activeDrivers = team?.filter((d) => d.status === 'on_route').length ?? 0;
  const totalStops = team?.reduce((sum, d) => sum + d.stopsAssigned, 0) ?? 0;
  const teamOnTime = team && team.length > 0
    ? Math.round((team.reduce((sum, d) => sum + d.onTimeRate, 0) / team.length) * 100)
    : null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Team overview.</h1>
        <p className="text-sm text-dispatch-dim">
          {team ? `${activeDrivers} drivers active today across ${totalStops} stops.` : 'Loading team status…'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active drivers" value={team ? String(activeDrivers) : '—'} />
        <StatCard label="Stops today" value={team ? String(totalStops) : '—'} />
        <StatCard label="Team on-time" value={teamOnTime !== null ? `${teamOnTime}%` : '—'} />
        <StatCard label="Credits left" value={String(user.credits)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-sm font-semibold mb-4">Drivers</h3>
          {!team ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {team.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDriver(d)}
                  disabled={!d.activeRouteId}
                  className="w-full flex items-center justify-between text-sm text-left border-b border-dispatch-line last:border-b-0 pb-3 last:pb-0 disabled:cursor-default"
                >
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-[11px] text-dispatch-dim">
                      {d.stopsCompleted}/{d.stopsAssigned} stops · {STATUS_LABEL[d.status]}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-dispatch-accent">
                      {Math.round(d.onTimeRate * 100)}%
                    </span>
                    {d.activeRouteId && (
                      <span className="text-[11px] text-dispatch-dim underline underline-offset-2">
                        View route
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
        <div className="space-y-5">
          <PerformanceCard userId={user.id} />
          <ActivityFeed userId={user.id} />
        </div>
      </div>

      <DriverRouteModal
        open={selectedDriver !== null}
        onClose={() => setSelectedDriver(null)}
        routeId={selectedDriver?.activeRouteId ?? null}
        driverName={selectedDriver?.name ?? ''}
      />
    </DashboardLayout>
  );
}
