import { useEffect, useState } from 'react';
import type { AiInsight } from '../../types';
import { fetchInsights } from '../../lib/api';
import { Card, Skeleton } from '../ui/primitives';

const KIND_STYLE: Record<AiInsight['kind'], string> = {
  suggestion: 'border-l-dispatch-accent',
  warning: 'border-l-dispatch-danger',
  summary: 'border-l-dispatch-dim',
};

export default function AiInsightsPanel({ routeId }: { routeId: string }) {
  const [insights, setInsights] = useState<AiInsight[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchInsights(routeId).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) setInsights(res.data);
      else setError('Insights are unavailable right now.');
    });
    return () => {
      cancelled = true;
    };
  }, [routeId]);

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">Route insights</h3>
      {!insights && !error && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {error && <p className="text-sm text-dispatch-dim">{error}</p>}
      {insights && (
        <div className="space-y-2.5">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`border-l-2 ${KIND_STYLE[ins.kind]} pl-3 py-1 text-xs text-dispatch-dim leading-relaxed`}
            >
              {ins.message}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
