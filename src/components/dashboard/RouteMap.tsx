import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Stop } from '../../types';

interface RouteMapProps {
  stops: Stop[];
  routeCoords?: [number, number][];
  onStopMoved?: (id: string, lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
  editable?: boolean;
  maxStops?: number;
  heightClassName?: string;
  center?: [number, number];
  zoom?: number;
}

function makeIcon(index: number, isDepot: boolean) {
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

export default function RouteMap({
  stops,
  routeCoords = [],
  onStopMoved,
  onMapClick,
  editable = true,
  maxStops = 14,
  heightClassName = 'h-64 sm:h-80 lg:h-96',
  center = [-1.283, 36.82],
  zoom = 12,
}: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLineRef = useRef<L.Polyline | null>(null);
  const onStopMovedRef = useRef(onStopMoved);
  const onMapClickRef = useRef(onMapClick);
  onStopMovedRef.current = onStopMoved;
  onMapClickRef.current = onMapClick;

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView(center, zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.(e.latlng.lat, e.latlng.lng);
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep markers in sync with stops (add/update/remove)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const seen = new Set<string>();
    stops.forEach((stop, idx) => {
      seen.add(stop.id);
      const isDepot = idx === 0;
      let marker = markersRef.current.get(stop.id);

      if (!marker) {
        marker = L.marker([stop.lat, stop.lng], {
          draggable: editable,
          icon: makeIcon(idx, isDepot),
        }).addTo(map);
        marker.on('dragend', () => {
          const ll = marker!.getLatLng();
          onStopMovedRef.current?.(stop.id, ll.lat, ll.lng);
        });
        markersRef.current.set(stop.id, marker);
      } else {
        marker.setLatLng([stop.lat, stop.lng]);
        marker.setIcon(makeIcon(idx, isDepot));
        marker.dragging?.[editable ? 'enable' : 'disable']?.();
      }
    });

    for (const [id, marker] of markersRef.current.entries()) {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }
  }, [stops, editable]);

  // draw the route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeLineRef.current) routeLineRef.current.remove();
    if (routeCoords.length > 1) {
      routeLineRef.current = L.polyline(routeCoords, {
        color: '#f2a93b',
        weight: 3,
        opacity: 0.85,
      }).addTo(map);
    }
  }, [routeCoords]);

  return (
    <div className={`relative w-full ${heightClassName} rounded-lg overflow-hidden border border-dispatch-line`}>
      <div ref={containerRef} className="absolute inset-0" />
      {editable && (
        <div className="absolute bottom-2 left-2 z-[500] text-[10px] font-mono bg-dispatch-bg/85 border border-dispatch-line rounded-full px-2.5 py-1 text-dispatch-dim pointer-events-none">
          Tap map to add · drag pins to move
        </div>
      )}
      {stops.length >= maxStops && (
        <div className="absolute bottom-2 right-2 z-[500] text-[10px] font-mono bg-dispatch-bg/85 border border-dispatch-line rounded-full px-2.5 py-1 text-dispatch-dim">
          Max {maxStops} stops
        </div>
      )}
    </div>
  );
}
