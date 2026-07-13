import { useEffect, useState } from 'react';
import type { PerformanceScore, ActivityItem } from '../../types';
import { fetchPerformance, fetchActivity } from '../../lib/api';
import { Card, Skeleton } from '../ui/primitives';

export function PerformanceCard({ userId }: { userId: string }) {
  const [perf, setPerf] = useState<PerformanceScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPerformance(userId).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        setPerf(res.data);
        setError(null);
      } else {
        setError(res.error || 'Failed to load performance');
        setPerf(null);
      }
    }).catch(() => {
      setError('Network error');
      setPerf(null);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Show error state
  if (error) {
    return (
      <Card className="p-5">
        <div className="text-sm text-dispatch-danger">{error}</div>
      </Card>
    );
  }

  // Show loading skeleton
  if (!perf) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  // Safe fallbacks – ensure all metrics are numbers
  const onTimeRate = typeof perf.onTimeRate === 'number' ? perf.onTimeRate : 0;
  const feedbackAverage = typeof perf.feedbackAverage === 'number' ? perf.feedbackAverage : 0;
  const avgStopMinutes = typeof perf.avgStopMinutes === 'number' ? perf.avgStopMinutes : 0;
  const completedStops = typeof perf.completedStops === 'number' ? perf.completedStops : 0;
  const totalStops = typeof perf.totalStops === 'number' ? perf.totalStops : 0;
  const periodLabel = perf.periodLabel || 'This period';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Performance</h3>
        <span className="text-[11px] text-dispatch-dim">{periodLabel}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-lg font-bold font-mono">{Math.round(onTimeRate * 100)}%</div>
          <div className="text-[11px] text-dispatch-dim">On-time rate</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono">{feedbackAverage.toFixed(1)}</div>
          <div className="text-[11px] text-dispatch-dim">Avg. feedback / 5</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono">{avgStopMinutes.toFixed(1)}m</div>
          <div className="text-[11px] text-dispatch-dim">Avg. stop time</div>
        </div>
        <div>
          <div className="text-lg font-bold font-mono">
            {completedStops}/{totalStops}
          </div>
          <div className="text-[11px] text-dispatch-dim">Stops completed</div>
        </div>
      </div>
    </Card>
  );
}

const TYPE_LABEL: Record<ActivityItem['type'], string> = {
  route_completed: 'Route',
  route_created: 'Route',
  credit_used: 'Credits',
  plan_upgraded: 'Billing',
  feedback_received: 'Feedback',
};

export function ActivityFeed({ userId }: { userId: string }) {
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchActivity(userId).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        setItems(res.data);
        setError(null);
      } else {
        setError(res.error || 'Failed to load activity');
        setItems(null);
      }
    }).catch(() => {
      setError('Network error');
      setItems(null);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) {
    return (
      <Card className="p-5">
        <div className="text-sm text-dispatch-danger">{error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">Recent activity</h3>
      {!items && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}
      {items && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 text-xs">
              <span className="text-dispatch-accent font-mono uppercase text-[10px] w-16 flex-shrink-0 pt-0.5">
                {TYPE_LABEL[item.type] || item.type}
              </span>
              <span className="text-dispatch-dim">{item.message}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}