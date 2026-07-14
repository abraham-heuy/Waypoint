import { useCallback, useEffect, useRef, useState } from 'react';
import type { RoutePlan, Stop } from '../../types';
import { fetchActiveRoute, optimizeRoute } from '../../lib/api';
import RouteMap from './RouteMap';
import AiAssistantPanel from './AiAssistantPanel';
import AiInsightsPanel from './AiInsightsPanel';
import { Card, Skeleton } from '../ui/primitives';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';

const DEBOUNCE_MS = 600;
const MIN_STOPS = 1;

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}
function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}

interface RoutePlannerCardProps {
  title?: string;
  maxStops?: number;
  /** Whether to seed from the user's existing active route on mount. */
  loadExisting?: boolean;
}

export default function RoutePlannerCard({
  title = "Today's route",
  maxStops = 14,
  loadExisting = true,
}: RoutePlannerCardProps) {
  const user = useAuthStore((s) => s.user)!;
  const spendCredit = useAuthStore((s) => s.spendCredit);

  const [stops, setStops] = useState<Stop[]>([]);
  const [roundTrip, setRoundTrip] = useState(true);
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [initialLoading, setInitialLoading] = useState(loadExisting);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextStopIndex = useRef(1);

  const runSolve = useCallback(
    async (nextStops: Stop[], nextRoundTrip: boolean, chargeCredit: boolean) => {
      if (nextStops.length < MIN_STOPS + 1) {
        setPlan(null);
        return;
      }
      setSolving(true);
      setError(null);
      const result = await optimizeRoute(nextStops, nextRoundTrip);
      setSolving(false);
      if (result.ok && result.data) {
        setPlan(result.data);
        if (chargeCredit) spendCredit(1);
      } else {
        setError('Could not solve this route. Try again.');
        toast.error('Could not solve this route — try again in a moment.');
      }
    },
    [spendCredit]
  );

  const scheduleSolve = useCallback(
    (nextStops: Stop[], nextRoundTrip: boolean) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSolve(nextStops, nextRoundTrip, true), DEBOUNCE_MS);
    },
    [runSolve]
  );

  // seed from an existing active route, or start blank
  useEffect(() => {
    if (!loadExisting) {
      setInitialLoading(false);
      return;
    }
    let cancelled = false;
    fetchActiveRoute(user.id).then((res) => {
      if (cancelled) return;
      if (res.ok && res.data) {
        setStops(res.data.stops);
        setRoundTrip(res.data.roundTrip);
        setPlan(res.data);
        nextStopIndex.current = res.data.stops.length;
      }
      setInitialLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, loadExisting]);

  function handleMapClick(lat: number, lng: number) {
    if (stops.length >= maxStops) {
      toast.info(`You've reached the ${maxStops}-stop limit for your plan.`);
      return;
    }
    const isFirst = stops.length === 0;
    const stop: Stop = {
      id: `stop_${Date.now()}`,
      label: isFirst ? 'Start' : `Stop ${nextStopIndex.current}`,
      lat,
      lng,
      status: 'pending',
    };
    nextStopIndex.current += 1;
    const next = [...stops, stop];
    setStops(next);
    scheduleSolve(next, roundTrip);
  }

  function handleStopMoved(id: string, lat: number, lng: number) {
    const next = stops.map((s) => (s.id === id ? { ...s, lat, lng } : s));
    setStops(next);
    scheduleSolve(next, roundTrip);
  }

  function handleRemoveStop(id: string) {
    if (stops.length <= MIN_STOPS + 1) {
      toast.info('A route needs at least two stops.');
      return;
    }
    const next = stops.filter((s) => s.id !== id);
    setStops(next);
    scheduleSolve(next, roundTrip);
  }

  function handleStopsParsed(parsed: Stop[]) {
    if (stops.length + parsed.length > maxStops) {
      toast.error(`That would exceed your ${maxStops}-stop limit — add fewer at a time.`);
      return;
    }
    const next = [...stops, ...parsed];
    setStops(next);
    nextStopIndex.current += parsed.length;
    scheduleSolve(next, roundTrip);
  }

  function toggleRoundTrip() {
    const next = !roundTrip;
    setRoundTrip(next);
    if (stops.length >= MIN_STOPS + 1) runSolve(stops, next, false);
  }

  const routeCoords: [number, number][] = plan && plan.orderedStopIds
    ? plan.orderedStopIds
        .map((id) => stops.find((s) => s.id === id))
        .filter((s): s is Stop => Boolean(s))
        .map((s) => [s.lat, s.lng])
    : [];

  const orderedStops = plan && plan.orderedStopIds
    ? plan.orderedStopIds
        .map((id) => stops.find((s) => s.id === id))
        .filter((s): s is Stop => Boolean(s))
    : stops;

  if (initialLoading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleRoundTrip}
            className={`text-[11px] font-mono rounded-full border px-2.5 py-1 ${
              roundTrip ? 'text-dispatch-accent border-dispatch-accentDim' : 'text-dispatch-dim border-dispatch-line'
            }`}
          >
            Round trip: {roundTrip ? 'on' : 'off'}
          </button>
          <Button
            size="sm"
            variant="secondary"
            loading={solving}
            disabled={stops.length < MIN_STOPS + 1}
            onClick={() => runSolve(stops, roundTrip, true)}
          >
            Re-optimize
          </Button>
        </div>
      </div>

      <RouteMap
        stops={stops}
        routeCoords={routeCoords}
        onStopMoved={handleStopMoved}
        onMapClick={handleMapClick}
        maxStops={maxStops}
      />

      {stops.length === 0 && (
        <p className="text-xs text-dispatch-dim text-center mt-3">
          Tap the map to drop your first stop, or describe your day to the assistant below.
        </p>
      )}

      {plan && (
        <div className="flex gap-5 mt-4 pt-4 border-t border-dispatch-line font-mono text-xs">
          <span className="text-dispatch-dim">
            Time <span className="text-dispatch-text">{formatDuration(plan.totalSeconds)}</span>
          </span>
          <span className="text-dispatch-dim">
            Distance <span className="text-dispatch-text">{formatDistance(plan.totalMeters)}</span>
          </span>
        </div>
      )}

      {error && <p className="text-xs text-dispatch-danger mt-3">{error}</p>}

      {orderedStops.length > 0 && (
        <ul className="mt-4 space-y-2">
          {orderedStops.map((s, i) => {
            const isDepotRepeat = plan?.roundTrip && i === orderedStops.length - 1 && i > 0;
            return (
              <li key={`${s.id}-${i}`} className="flex items-center gap-2.5 text-xs">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] flex-shrink-0 border ${
                    i === 0
                      ? 'bg-dispatch-accent text-[#1a1200] border-dispatch-accent font-bold'
                      : 'bg-dispatch-panel2 text-dispatch-accent border-dispatch-line'
                  }`}
                >
                  {i === 0 ? 'D' : i}
                </span>
                <span className="flex-1">
                  {s.label}
                  {isDepotRepeat ? ' (return)' : ''}
                </span>
                {s.windowEnd && <span className="font-mono text-dispatch-dim">by {s.windowEnd}</span>}
                {i !== 0 && !isDepotRepeat && (
                  <button
                    onClick={() => handleRemoveStop(s.id)}
                    className="text-dispatch-dim hover:text-dispatch-danger px-1"
                    aria-label={`Remove ${s.label}`}
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5">
        <AiAssistantPanel onStopsParsed={handleStopsParsed} />
      </div>

      {plan && (
        <div className="mt-5">
          <AiInsightsPanel routeId={plan.id} />
        </div>
      )}
    </Card>
  );
}
