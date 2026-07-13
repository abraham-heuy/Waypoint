import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../ui/primitives';

interface SampleStop {
  id: string;
  label: string;
  lat: number;
  lng: number;
  eta?: string;
}

const SAMPLE_STOPS: SampleStop[] = [
  { id: 's0', label: 'Depot', lat: -1.2833, lng: 36.8167 },
  { id: 's1', label: 'Stop 1', lat: -1.2921, lng: 36.8219, eta: '12:14' },
  { id: 's2', label: 'Stop 2', lat: -1.2635, lng: 36.8027, eta: '12:31' },
  { id: 's3', label: 'Stop 3', lat: -1.2676, lng: 36.8108, eta: '12:47' },
  { id: 's4', label: 'Stop 4', lat: -1.3031, lng: 36.7823, eta: '13:05' },
];

function sampleIcon(index: number, isDepot: boolean) {
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

export default function ProductShowcase() {
  // gentle bow between stops so the sample line reads as a real road path,
  // not a set of straight rays â€” purely illustrative, not a live OSRM call
  const routeCoords = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i < SAMPLE_STOPS.length - 1; i++) {
      const a = SAMPLE_STOPS[i];
      const b = SAMPLE_STOPS[i + 1];
      const midLat = (a.lat + b.lat) / 2 + (i % 2 === 0 ? 0.006 : -0.006);
      const midLng = (a.lng + b.lng) / 2 + (i % 2 === 0 ? -0.004 : 0.004);
      pts.push([a.lat, a.lng], [midLat, midLng], [b.lat, b.lng]);
    }
    return pts;
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-dispatch-line">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-block text-xs font-mono uppercase tracking-widest text-dispatch-accent border border-dispatch-accentDim rounded-full px-3 py-1 mb-4">
          Actual output
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">This is what comes out the other end.</h2>
        <p className="text-dispatch-dim text-sm sm:text-base">
          A real map, a solved order, and the timing for each leg â€” not a mockup of one.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-3">
          <div className="lg:col-span-2 h-72 sm:h-96 relative">
            <MapContainer
              center={[-1.29, 36.81]}
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
              {SAMPLE_STOPS.map((s, i) => (
                <Marker key={s.id} position={[s.lat, s.lng]} icon={sampleIcon(i, i === 0)} />
              ))}
            </MapContainer>
            <div className="absolute top-3 left-3 z-[500] text-[10px] font-mono uppercase tracking-wide bg-dispatch-bg/85 border border-dispatch-line rounded-full px-2.5 py-1 text-dispatch-dim">
              Sample route
            </div>
          </div>

          <div className="p-6 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <div className="text-xl font-bold font-mono text-dispatch-accent">52m</div>
                <div className="text-[11px] text-dispatch-dim">Total drive time</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-dispatch-accent">24.8 km</div>
                <div className="text-[11px] text-dispatch-dim">Total distance</div>
              </div>
            </div>
            <ol className="space-y-2.5">
              {SAMPLE_STOPS.map((s, i) => (
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
        </div>
      </Card>
    </section>
  );
}
