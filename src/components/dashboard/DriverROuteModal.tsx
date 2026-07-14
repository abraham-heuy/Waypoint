import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import RouteMap from './RouteMap';
import { Skeleton } from '../ui/primitives';
import { fetchRouteById } from '../../lib/api';
import type { RoutePlan } from '../../types';

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}

export default function DriverRouteModal({
  open,
  onClose,
  routeId,
  driverName,
}: {
  open: boolean;
  onClose: () => void;
  routeId: string | null;
  driverName: string;
}) {
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !routeId) return;
    setLoading(true);
    setPlan(null);
    fetchRouteById(routeId).then((res) => {
      if (res.ok && res.data) setPlan(res.data);
      setLoading(false);
    });
  }, [open, routeId]);

  const routeCoords: [number, number][] =
    plan?.orderedStopIds
      .map((id) => plan.stops.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => [s.lat, s.lng] as [number, number]) ?? [];

  return (
    <Modal open={open} onClose={onClose} title={`${driverName}'s route`} size="lg">
      {loading || !routeId ? (
        <Skeleton className="h-72 w-full" />
      ) : plan ? (
        <div>
          <RouteMap stops={plan.stops} routeCoords={routeCoords} editable={false} heightClassName="h-64 sm:h-80" />
          <div className="flex gap-5 mt-4 font-mono text-xs text-dispatch-dim">
            <span>
              Time <span className="text-dispatch-text">{formatDuration(plan.totalSeconds)}</span>
            </span>
            <span>
              Distance <span className="text-dispatch-text">{(plan.totalMeters / 1000).toFixed(1)} km</span>
            </span>
            <span>
              Stops <span className="text-dispatch-text">{plan.stops.length}</span>
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-dispatch-dim">No active route for this driver right now.</p>
      )}
    </Modal>
  );
}
