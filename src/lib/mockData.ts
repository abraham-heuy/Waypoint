import type {
  User,
  RoutePlan,
  AiInsight,
  PerformanceScore,
  ActivityItem,
  PricingPlan,
  Stop,
  TeamMember,
  BillingSummary,
} from '../types';

export const MOCK_USER: User = {
  id: 'usr_demo_1',
  name: 'Amina Otieno',
  email: 'amina@example.com',
  segment: 'solo',
  tier: 'free',
  credits: 12,
  avatarInitials: 'AO',
  createdAt: '2026-05-01T08:00:00Z',
  lastActiveAt: '2026-07-12T17:30:00Z',
  homeCity: 'Nairobi',
  transportMode: 'car',
};

function stop(id: string, label: string, lat: number, lng: number, extra: Partial<Stop> = {}): Stop {
  return { id, label, lat, lng, ...extra };
}

export const MOCK_STOPS: Stop[] = [
  stop('s0', 'Depot — Kitchen', -1.2833, 36.8167),
  stop('s1', 'Order #2291 — Kilimani', -1.2921, 36.8219, { windowEnd: '12:30', status: 'pending' }),
  stop('s2', 'Order #2292 — Parklands', -1.2676, 36.8108, { windowEnd: '12:45', status: 'pending' }),
  stop('s3', 'Order #2293 — Westlands', -1.2635, 36.8027, { windowEnd: '13:00', status: 'pending' }),
  stop('s4', "Order #2294 — Lang'ata", -1.3031, 36.7823, { windowEnd: '13:15', status: 'pending' }),
];

export const MOCK_ROUTE_PLAN: RoutePlan = {
  id: 'plan_demo_1',
  title: "Today's Deliveries",
  ownerId: 'usr_demo_1',
  createdAt: '2026-07-13T09:00:00Z',
  stops: MOCK_STOPS,
  orderedStopIds: ['s0', 's1', 's3', 's2', 's4', 's0'],
  legs: [
    { fromStopId: 's0', toStopId: 's1', seconds: 640, meters: 4200, mode: 'drive' },
    { fromStopId: 's1', toStopId: 's3', seconds: 520, meters: 3100, mode: 'drive' },
    { fromStopId: 's3', toStopId: 's2', seconds: 700, meters: 5300, mode: 'drive' },
    { fromStopId: 's2', toStopId: 's4', seconds: 980, meters: 8900, mode: 'drive' },
    { fromStopId: 's4', toStopId: 's0', seconds: 760, meters: 6100, mode: 'drive' },
  ],
  totalSeconds: 3600,
  totalMeters: 27600,
  roundTrip: true,
  segment: 'solo',
};

export const MOCK_INSIGHTS: AiInsight[] = [
  {
    id: 'ins_1',
    kind: 'suggestion',
    message: 'Doing Westlands before Parklands saves about 6 minutes given current traffic.',
    createdAt: '2026-07-13T09:01:00Z',
  },
  {
    id: 'ins_2',
    kind: 'warning',
    message: "Order #2294 in Lang'ata has a tight window — leave by 12:55 to make it on time.",
    createdAt: '2026-07-13T09:01:30Z',
  },
  {
    id: 'ins_3',
    kind: 'summary',
    message: 'Your route today covers 27.6 km and should take about 1h with current conditions.',
    createdAt: '2026-07-13T09:02:00Z',
  },
];

export const MOCK_PERFORMANCE: PerformanceScore = {
  onTimeRate: 0.93,
  avgStopMinutes: 6.4,
  completedStops: 142,
  totalStops: 153,
  feedbackAverage: 4.7,
  periodLabel: 'Last 30 days',
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'route_completed', message: 'Completed "Today\'s Deliveries" — 5 stops', timestamp: '2026-07-12T14:20:00Z' },
  { id: 'a2', type: 'feedback_received', message: 'New 5-star rating from Order #2288', timestamp: '2026-07-12T14:25:00Z' },
  { id: 'a3', type: 'credit_used', message: 'Used 1 credit for route optimization', timestamp: '2026-07-12T09:05:00Z' },
  { id: 'a4', type: 'route_created', message: 'Created a new 6-stop route', timestamp: '2026-07-11T08:40:00Z' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'drv_1', name: 'James M.', status: 'on_route', stopsAssigned: 8, stopsCompleted: 5, onTimeRate: 0.96, activeRouteId: 'plan_demo_1' },
  { id: 'drv_2', name: 'Grace W.', status: 'on_route', stopsAssigned: 6, stopsCompleted: 3, onTimeRate: 0.89, activeRouteId: 'plan_demo_1' },
  { id: 'drv_3', name: 'Peter K.', status: 'finished', stopsAssigned: 5, stopsCompleted: 5, onTimeRate: 1.0 },
];

export const MOCK_BILLING: BillingSummary = {
  tier: 'free',
  creditsRemaining: 12,
  history: [
    { id: 'inv_1', date: '2026-06-13', description: 'Plus plan — June', amount: 6 },
    { id: 'inv_2', date: '2026-05-13', description: 'Plus plan — May', amount: 6 },
  ],
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    creditsPerMonth: 15,
    maxStopsPerRoute: 6,
    features: ['15 route credits / month', 'Up to 6 stops per route', 'Manual + map stop entry', 'Basic route insights'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 6,
    billingPeriod: 'month',
    creditsPerMonth: 150,
    maxStopsPerRoute: 12,
    features: ['150 route credits / month', 'Up to 12 stops per route', 'AI planning assistant', 'Rideshare cost comparison', 'Performance analytics'],
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    billingPeriod: 'month',
    creditsPerMonth: 'unlimited',
    maxStopsPerRoute: 20,
    features: ['Unlimited route credits', 'Up to 20 stops per route', 'Priority routing engine', 'Multi-day planning', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 49,
    billingPeriod: 'month',
    creditsPerMonth: 'unlimited',
    maxStopsPerRoute: 40,
    features: ['Everything in Pro', 'Multi-driver assignment', 'Team dashboards', 'Delivery success scoring', 'API access'],
  },
];
