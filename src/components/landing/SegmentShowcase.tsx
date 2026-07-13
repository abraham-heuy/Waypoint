import { useState } from 'react';
import type { UserSegment } from '../../types';
import TiltCard from './Tiltcard';

const SEGMENTS: {
  id: UserSegment;
  label: string;
  blurb: string;
  detail: string;
  icon: string; // icon key
}[] = [
  {
    id: 'driver',
    label: 'Delivery drivers',
    blurb: 'Restaurant and courier runs',
    detail:
      'Drop in today\'s orders, get the fastest sequence with time-window awareness, and track on-time performance and customer feedback over time.',
    icon: 'truck',
  },
  {
    id: 'errand',
    label: 'Individuals',
    blurb: 'Errands around town',
    detail:
      'Pharmacy, groceries, the bank, picking up the kids — plan the whole loop in one go, and compare driving yourself against a rideshare leg.',
    icon: 'bag',
  },
  {
    id: 'tourist',
    label: 'Trip planners',
    blurb: 'A day or week of sightseeing',
    detail:
      'Feed in the places you want to see, get a realistic day-by-day itinerary that accounts for opening hours and actual travel time between stops.',
    icon: 'map',
  },
  {
    id: 'business',
    label: 'Small teams',
    blurb: 'Multiple drivers, one dashboard',
    detail:
      'Assign stops across a small fleet, see everyone\'s route at a glance, and track delivery success scores across the team.',
    icon: 'briefcase',
  },
];

// SVG icons (compact)
const ICON_SVGS: Record<string, string> = {
  truck: 'M5 17h14M5 17a2 2 0 01-2-2V7a2 2 0 012-2h10l4 4v6a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2M9 17v-4m6 4v-4M7 10h8',
  bag: 'M3 7h18M3 7a2 2 0 01-2-2V5a2 2 0 012-2h18a2 2 0 012 2v0a2 2 0 01-2 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 7V5a4 4 0 018 0v2',
  map: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  briefcase: 'M21 13.255A23.93 23.93 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
};

const SegmentIcon = ({ type }: { type: string }) => (
  <span className="w-10 h-10 text-dispatch-accent">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {ICON_SVGS[type]?.split(' ').map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  </span>
);

export default function SegmentShowcase() {
  const [active, setActive] = useState<UserSegment>('driver');
  const current = SEGMENTS.find((s) => s.id === active)!;

  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 overflow-hidden">
      {/* Subtle background dots pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-dispatch-accent" />
          <circle cx="30" cy="20" r="1.5" fill="currentColor" className="text-dispatch-accentDim" />
          <circle cx="50" cy="40" r="1.5" fill="currentColor" className="text-dispatch-accent" />
          <circle cx="70" cy="10" r="1.5" fill="currentColor" className="text-dispatch-line" />
          <circle cx="90" cy="30" r="1.5" fill="currentColor" className="text-dispatch-accentDim" />
          <circle cx="20" cy="70" r="1.5" fill="currentColor" className="text-dispatch-accent" />
          <circle cx="60" cy="80" r="1.5" fill="currentColor" className="text-dispatch-line" />
          <circle cx="80" cy="60" r="1.5" fill="currentColor" className="text-dispatch-accentDim" />
        </svg>
      </div>

      <h2 className="relative text-2xl sm:text-3xl font-bold mb-8 text-center z-10">
        Built for however you move through a day.
      </h2>

      {/* Filter buttons */}
      <div className="relative flex flex-wrap justify-center gap-2 mb-10 z-10">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-300 ${
              active === s.id
                ? 'bg-dispatch-accent text-[#1a1200] border-dispatch-accent shadow-lg shadow-dispatch-accent/20 scale-105'
                : 'border-dispatch-line text-dispatch-dim hover:text-dispatch-text hover:border-dispatch-accentDim'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active card with tilt */}
      <div className="relative max-w-2xl mx-auto z-10">
        <TiltCard key={current.id} maxTilt={6} glare className="w-full">
          <div className="p-8 rounded-xl border border-dispatch-line bg-dispatch-panel/90 backdrop-blur-sm transition-all duration-300 hover:border-dispatch-accent/40 hover:shadow-xl hover:shadow-dispatch-accent/5 text-center">
            <div className="flex justify-center mb-4">
              <SegmentIcon type={current.icon} />
            </div>
            <div className="text-xs uppercase tracking-wide text-dispatch-accent font-mono mb-2">
              {current.blurb}
            </div>
            <p className="text-sm sm:text-base text-dispatch-dim leading-relaxed max-w-md mx-auto">
              {current.detail}
            </p>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}