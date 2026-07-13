import { useEffect, useState } from 'react';
import type { RoutePlan } from '../../types';
import { fetchActiveRoute } from '../../lib/api';
import { Card, Skeleton } from '../ui/primitives';
import Button from '../ui/Button';

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}

export default function RouteSummaryCard({ userId, onPlanNew }: { userId: string; onPlanNew: () => void }) {
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchActiveRoute(userId)
      .then((res) => {
        if (cancelled) return;
        if (res.ok && res.data) setPlan(res.data);
        else setError('Could not load today\'s route.');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  if (error || !plan) {
    return (
      <Card className="p-5 text-center">
        <p className="text-sm text-dispatch-dim mb-4">{error ?? 'No active route yet.'}</p>
        <Button onClick={onPlanNew}>Plan a route</Button>
      </Card>
    );
  }

  const stopsById = Object.fromEntries(plan.stops.map((s) => [s.id, s]));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{plan.title}</h3>
        <span className="text-xs font-mono text-dispatch-dim">
          {formatDuration(plan.totalSeconds)} · {(plan.totalMeters / 1000).toFixed(1)} km
        </span>
      </div>
      <ol className="space-y-2">
        {plan.orderedStopIds.map((id, i) => {
          const stop = stopsById[id];
          if (!stop) return null;
          const isDepot = i === 0 || i === plan.orderedStopIds.length - 1;
          return (
            <li key={`${id}-${i}`} className="flex items-center gap-3 text-sm">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono flex-shrink-0 border ${
                  isDepot
                    ? 'bg-dispatch-accent text-[#1a1200] border-dispatch-accent font-bold'
                    : 'bg-dispatch-panel2 text-dispatch-accent border-dispatch-line'
                }`}
              >
                {isDepot ? 'D' : i}
              </span>
              <span className="flex-1">{stop.label}</span>
              {stop.windowEnd && (
                <span className="text-[11px] font-mono text-dispatch-dim">by {stop.windowEnd}</span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 pt-4 border-t border-dispatch-line flex justify-end">
        <Button size="sm" variant="secondary" onClick={onPlanNew}>
          Plan a new route
        </Button>
      </div>
    </Card>
  );
}
