import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import RouteSummaryCard from '../../components/dashboard/RouteSummaryCard';
import AiInsightsPanel from '../../components/dashboard/AiInsightsPanel';
import AiAssistantPanel from '../../components/dashboard/AiAssistantPanel';
import { PerformanceCard, ActivityFeed } from '../../components/dashboard/PerformanceAndActivity';
import RouteMap from '../../components/dashboard/RouteMap';
import { useAuthStore } from '../../store/authStore';
import { fetchActiveRoute } from '../../lib/api';
import type { RoutePlan, Stop } from '../../types';

export default function DriverDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const navigate = useNavigate();
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchActiveRoute(user.id).then((res) => {
      if (res.ok && res.data) {
        setRoute(res.data);
      }
      setLoading(false);
    });
  }, [user]);

  // Build stops with proper typing
  const stops = route?.stops?.map((stop, idx) => {
    let eta: string | undefined;
    if (stop.eta) {
      try {
        const date = new Date(stop.eta);
        if (!isNaN(date.getTime())) {
          eta = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      } catch (_) { /* ignore */ }
    }
    return {
      id: stop.id || `stop-${idx}`,
      label: stop.address || `Stop ${idx + 1}`,
      lat: stop.lat,
      lng: stop.lng,
      eta,
    };
  }) ?? [];

  // Extract coordinates from geometry if present, else use stops to create simple path
  let routeCoords: [number, number][] = [];
  if (route?.geometry?.coordinates) {
    // convert [lng, lat] to [lat, lng]
    routeCoords = route.geometry.coordinates.map((coord) => [coord[1], coord[0]] as [number, number]);
  } else if (stops.length > 1) {
    // fallback: straight lines between stops
    routeCoords = stops.map((s) => [s.lat, s.lng] as [number, number]);
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Good to see you, {user.name.split(' ')[0]}.</h1>
        <p className="text-sm text-dispatch-dim">Here's what's on today's run.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Stops today" value={route?.stops?.length?.toString() ?? '0'} hint="Optimized order" />
        <StatCard label="Credits left" value={String(user.credits)} />
        <StatCard label="On-time rate" value="93%" hint="Last 30 days" />
        <StatCard label="Vehicle" value={user.transportMode ?? 'Not set'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {loading ? (
            <div className="animate-pulse bg-dispatch-panel/40 rounded-xl border border-dispatch-line h-72" />
          ) : (
            <RouteMap stops={stops} routeCoords={routeCoords} />
          )}
          <AiAssistantPanel />
        </div>
        <div className="space-y-5">
          <AiInsightsPanel routeId={route?.id || 'demo'} />
          <PerformanceCard userId={user.id} />
          <ActivityFeed userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}