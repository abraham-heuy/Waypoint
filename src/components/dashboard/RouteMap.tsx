// components/dashboard/RouteMap.tsx
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../ui/primitives';

interface Stop {
  id: string;
  label: string;
  lat: number;
  lng: number;
  eta?: string;
}

interface RouteMapProps {
  stops: Stop[];
  routeCoords: [number, number][];
  className?: string;
}

function createIcon(index: number, isDepot: boolean) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:${isDepot ? '6px' : '50%'};
      background:${isDepot ? '#f2a93b' : '#1d252c'};border:2px solid #f2a93b;
      display:flex;align-items:center;justify-content:center;
      font-family:ui-monospace,monospace;font-size:11px;font-weight:700;
      color:${isDepot ? '#1a1200' : '#f2a93b'};box-shadow:0 1px 4px rgba(0,0,0,.5);">
      ${isDepot ? 'D' : index}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function RouteMap({ stops, routeCoords, className = '' }: RouteMapProps) {
  const center = useMemo(() => {
    if (stops.length === 0) return [0, 0] as [number, number];
    const lat = stops.reduce((sum, s) => sum + s.lat, 0) / stops.length;
    const lng = stops.reduce((sum, s) => sum + s.lng, 0) / stops.length;
    return [lat, lng] as [number, number];
  }, [stops]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative h-72 sm:h-96 w-full">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: 'rgb(var(--dispatch-bg))' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />
          <Polyline positions={routeCoords} pathOptions={{ color: '#f2a93b', weight: 3, opacity: 0.85 }} />
          {stops.map((s, i) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={createIcon(i, i === 0)} />
          ))}
        </MapContainer>
        <div className="absolute top-3 left-3 z-[500] text-[10px] font-mono uppercase tracking-wide bg-dispatch-bg/85 border border-dispatch-line rounded-full px-2.5 py-1 text-dispatch-dim">
          Optimized route
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="text-xl font-bold font-mono text-dispatch-accent">
              {routeCoords.length > 0 ? `${Math.round(routeCoords.length * 0.5)}m` : '--'}
            </div>
            <div className="text-[11px] text-dispatch-dim">Est. drive time</div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-dispatch-accent">
              {stops.length > 0 ? `${stops.length} stops` : '--'}
            </div>
            <div className="text-[11px] text-dispatch-dim">Total stops</div>
          </div>
        </div>
        <ol className="space-y-2.5">
          {stops.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2.5 text-xs">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] flex-shrink-0 border ${
                  i === 0
                    ? 'bg-dispatch-accent text-[#1a1200] border-dispatch-accent font-bold'
                    : 'bg-dispatch-panel2 text-dispatch-accent border-dispatch-line'
                }`}
              >
                {i === 0 ? 'D' : i}
              </span>
              <span className="flex-1">{s.label}</span>
              {s.eta && <span className="font-mono text-dispatch-dim">{s.eta}</span>}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}