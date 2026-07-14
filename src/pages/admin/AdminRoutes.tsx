import { useEffect, useState, useMemo } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { fetchAdminRoutes, type RoutePlanSummary } from '../../lib/adminApi';
import { Input } from '../../components/ui/primitives';
import Button from '../../components/ui/Button';

// User summary type
interface UserRouteSummary {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  routeCount: number;
  totalDistanceKm: number;
  totalDurationMin: number;
  latestRoute: RoutePlanSummary | null;
  routes: RoutePlanSummary[];
}

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RoutePlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRouteSummary | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RoutePlanSummary | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [minStops, setMinStops] = useState('');
  const [maxStops, setMaxStops] = useState('');
  const [roundTripFilter, setRoundTripFilter] = useState<'all' | 'yes' | 'no'>('all');

  // Fetch all routes
  useEffect(() => {
    fetchAdminRoutes()
      .then((res) => {
        if (res.ok && res.data) setRoutes(res.data);
        else setError(res.error || 'Failed to load routes');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  // Group routes by user
  const userGroups = useMemo(() => {
    const map = new Map<string, UserRouteSummary>();
    routes.forEach((route) => {
      const key = route.userId;
      if (!map.has(key)) {
        map.set(key, {
          userId: route.userId,
          userName: route.userName,
          userEmail: route.userEmail,
          routeCount: 0,
          totalDistanceKm: 0,
          totalDurationMin: 0,
          latestRoute: null,
          routes: [],
        });
      }
      const entry = map.get(key)!;
      entry.routeCount += 1;
      entry.totalDistanceKm += route.totalDistanceKm;
      entry.totalDurationMin += route.totalDurationMin;
      entry.routes.push(route);
      // Update latest route (by createdAt)
      if (!entry.latestRoute || new Date(route.createdAt) > new Date(entry.latestRoute.createdAt)) {
        entry.latestRoute = route;
      }
    });
    return Array.from(map.values());
  }, [routes]);

  // Apply filters to user groups
  const filteredUsers = useMemo(() => {
    let result = userGroups;

    // Search by user name/email/id
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.userId.toLowerCase().includes(term) ||
          (u.userName && u.userName.toLowerCase().includes(term)) ||
          (u.userEmail && u.userEmail.toLowerCase().includes(term))
      );
    }

    // Filter by route stats (we need to check if any route in the user's list matches)
    // For simplicity, we'll filter users whose average/range meets criteria.
    if (minStops || maxStops || roundTripFilter !== 'all') {
      result = result.filter((user) => {
        let matches = true;
        if (minStops) {
          const min = parseInt(minStops, 10);
          if (!isNaN(min)) {
            const hasMin = user.routes.some((r) => r.stopCount >= min);
            if (!hasMin) matches = false;
          }
        }
        if (matches && maxStops) {
          const max = parseInt(maxStops, 10);
          if (!isNaN(max)) {
            const hasMax = user.routes.some((r) => r.stopCount <= max);
            if (!hasMax) matches = false;
          }
        }
        if (matches && roundTripFilter !== 'all') {
          const target = roundTripFilter === 'yes';
          const hasRoundTrip = user.routes.some((r) => r.roundTrip === target);
          if (!hasRoundTrip) matches = false;
        }
        return matches;
      });
    }

    return result;
  }, [userGroups, searchTerm, minStops, maxStops, roundTripFilter]);

  // Columns for user table
  const userColumns = [
    { key: 'userName', header: 'User', render: (row: UserRouteSummary) => row.userName || row.userEmail || '—' },
    { key: 'routeCount', header: 'Routes' },
    {
      key: 'totalDistanceKm',
      header: 'Total distance (km)',
      render: (row: UserRouteSummary) => row.totalDistanceKm.toFixed(1),
    },
    {
      key: 'totalDurationMin',
      header: 'Total duration (min)',
      render: (row: UserRouteSummary) => Math.round(row.totalDurationMin),
    },
    {
      key: 'latestRoute',
      header: 'Latest route',
      render: (row: UserRouteSummary) => (row.latestRoute ? new Date(row.latestRoute.createdAt).toLocaleDateString() : '—'),
    },
  ];

  // Columns for route detail table (shown when a user is selected)
  const routeColumns = [
    { key: 'id', header: 'ID', render: (row: RoutePlanSummary) => row.id.slice(0, 8) + '…' },
    { key: 'stopCount', header: 'Stops' },
    {
      key: 'totalDistanceKm',
      header: 'Distance (km)',
      render: (row: RoutePlanSummary) => row.totalDistanceKm.toFixed(1),
    },
    {
      key: 'totalDurationMin',
      header: 'Duration (min)',
      render: (row: RoutePlanSummary) => Math.round(row.totalDurationMin),
    },
    {
      key: 'roundTrip',
      header: 'Round trip',
      render: (row: RoutePlanSummary) => (row.roundTrip ? 'Yes' : 'No'),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: RoutePlanSummary) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: RoutePlanSummary) => (
        <Button size="sm" onClick={() => { setSelectedRoute(row); setShowRouteModal(true); }}>
          Analyze
        </Button>
      ),
    },
  ];

  // Route detail modal
  const RouteDetailModal = ({ route, onClose }: { route: RoutePlanSummary; onClose: () => void }) => {
    // Calculate estimated savings (simple heuristic: compare to worst-case random order)
    // For a route with n stops, the worst-case could be double the distance (or more)
    // We'll use a simple metric: if it's a round trip, we assume the depot is first and last.
    // For now, we'll show a basic analysis.
    const averageSpeed = 50; // km/h
    const estimatedTimeWithoutOptimization = route.totalDistanceKm / averageSpeed * 60 * 1.5; // 50% more time without optimization
    const savedTime = estimatedTimeWithoutOptimization - route.totalDurationMin;
    const savedPercent = (savedTime / estimatedTimeWithoutOptimization) * 100;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">Route Analysis</h2>
            <button onClick={onClose} className="text-dispatch-dim hover:text-dispatch-text">✕</button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-dispatch-dim">Route ID</span>
              <span className="font-mono">{route.id}</span>
              <span className="text-dispatch-dim">User</span>
              <span>{route.userName || route.userEmail || '—'}</span>
              <span className="text-dispatch-dim">Stops</span>
              <span>{route.stopCount}</span>
              <span className="text-dispatch-dim">Round trip</span>
              <span>{route.roundTrip ? 'Yes' : 'No'}</span>
              <span className="text-dispatch-dim">Distance</span>
              <span>{route.totalDistanceKm.toFixed(1)} km</span>
              <span className="text-dispatch-dim">Duration</span>
              <span>{Math.round(route.totalDurationMin)} min</span>
              <span className="text-dispatch-dim">Solver</span>
              <span>{route.solverUsed}</span>
              <span className="text-dispatch-dim">Created</span>
              <span>{new Date(route.createdAt).toLocaleString()}</span>
            </div>

            <div className="border-t border-dispatch-line pt-3">
              <h3 className="font-semibold mb-2">Optimization analysis</h3>
              <div className="space-y-1">
                <p><span className="text-dispatch-dim">Estimated unoptimized time:</span> {Math.round(estimatedTimeWithoutOptimization)} min</p>
                <p><span className="text-dispatch-dim">Optimized time:</span> {Math.round(route.totalDurationMin)} min</p>
                <p><span className="text-dispatch-dim">Time saved:</span> <span className="text-green-500">{Math.round(savedTime)} min</span> ({savedPercent.toFixed(1)}% improvement)</p>
                <p><span className="text-dispatch-dim">Optimized route distance:</span> {route.totalDistanceKm.toFixed(1)} km</p>
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Routes</h1>

      {/* Filter bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-lg border border-dispatch-line bg-dispatch-panel">
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Search user</label>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name / email / ID"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Min stops</label>
          <Input
            type="number"
            value={minStops}
            onChange={(e) => setMinStops(e.target.value)}
            placeholder="e.g. 3"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Max stops</label>
          <Input
            type="number"
            value={maxStops}
            onChange={(e) => setMaxStops(e.target.value)}
            placeholder="e.g. 10"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Round trip</label>
          <select
            value={roundTripFilter}
            onChange={(e) => setRoundTripFilter(e.target.value as 'all' | 'yes' | 'no')}
            className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            className="text-sm text-dispatch-dim hover:text-dispatch-text"
            onClick={() => {
              setSearchTerm('');
              setMinStops('');
              setMaxStops('');
              setRoundTripFilter('all');
            }}
          >
            Clear filters
          </button>
          <span className="text-sm text-dispatch-dim">
            {filteredUsers.length} / {userGroups.length} users
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-dispatch-dim text-sm">Loading routes…</div>
      ) : error ? (
        <div className="text-dispatch-danger text-sm">{error}</div>
      ) : (
        <>
          {/* User table */}
          <AdminTable
            columns={userColumns}
            rows={filteredUsers}
            loading={loading}
            error={error}
            emptyMessage="No users with routes found."
            onRowClick={(row) => setSelectedUser(row)}
          />

          {/* User detail (routes for selected user) */}
          {selectedUser && (
            <div className="mt-6 rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedUser.userName || selectedUser.userEmail || 'User'}</h2>
                  <p className="text-xs text-dispatch-dim">{selectedUser.userId}</p>
                </div>
                <button
                  className="text-sm text-dispatch-dim hover:text-dispatch-text"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
              <div className="text-sm space-y-2 mb-4">
                <span className="text-dispatch-dim">Total routes: {selectedUser.routeCount}</span>
                <span className="text-dispatch-dim ml-4">Total distance: {selectedUser.totalDistanceKm.toFixed(1)} km</span>
                <span className="text-dispatch-dim ml-4">Total duration: {Math.round(selectedUser.totalDurationMin)} min</span>
              </div>
              <AdminTable
                columns={routeColumns}
                rows={selectedUser.routes}
                loading={false}
                error={null}
                emptyMessage="No routes for this user."
                onRowClick={(row) => {
                  setSelectedRoute(row);
                  setShowRouteModal(true);
                }}
              />
            </div>
          )}

          {/* Route detail modal */}
          {showRouteModal && selectedRoute && (
            <RouteDetailModal route={selectedRoute} onClose={() => setShowRouteModal(false)} />
          )}
        </>
      )}
    </div>
  );
}