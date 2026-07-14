export type UserSegment = 'solo' | 'field_team' | 'delivery' | 'enterprise';

export type PlanTier = 'free' | 'plus' | 'pro' | 'business';
export type TransportMode = 'own_vehicle' | 'rideshare' | 'mixed' | 'walking';
export interface User {
  id: string;
  name: string;
  email: string;
  segment: UserSegment;
  tier: PlanTier;
  credits: number;
  avatarInitials: string;
  createdAt: string;
  lastActiveAt: string;
  homeCity?: string;
  /** @deprecated use transportMode — kept optional for older mock data */
  vehicleType?: 'car' | 'bike' | 'motorbike' | 'on_foot' | 'none';
  transportMode?: TransportMode;
  isSuperadmin?: boolean;
}

export interface Stop {
  id: string;
  label: string;
  lat: number;
  lng: number;
  address?: string;
  windowStart?: string; // "09:00"
  windowEnd?: string;
  notes?: string;
  status?: 'pending' | 'done' | 'skipped';
  eta?: string | Date;  
}

export interface RouteLeg {
  fromStopId: string;
  toStopId: string;
  seconds: number;
  meters: number;
  mode: 'drive' | 'walk' | 'rideshare';
  rideshareEstimate?: {
    provider: 'uber' | 'bolt';
    lowFare: number;
    highFare: number;
    currency: string;
    etaMinutes: number;
  };
}

export interface RoutePlan {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  stops: Stop[];
  orderedStopIds: string[];
  legs: RouteLeg[];
  totalSeconds: number;
  totalMeters: number;
  totalCostEstimate?: number;
  roundTrip: boolean;
  segment: UserSegment;
  /** Real road-following polyline, [lng, lat] pairs (GeoJSON convention),
   * as returned by the routing engine (e.g. OSRM). Falls back to straight
   * lines between ordered stops on the client if omitted. */
  geometry?: { type: 'LineString'; coordinates: [number, number][] };
  /** Set when this plan belongs to a driver on a business/team account. */
  driverId?: string;
  driverName?: string;
}

export interface AiInsight {
  id: string;
  kind: 'suggestion' | 'warning' | 'summary';
  message: string;
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  /** Present on an assistant message when it successfully parsed stops out
   * of the conversation. The UI shows these as a proposal the person can
   * accept before they're written onto the map/route. */
  parsedStops?: Stop[];
}


export interface PerformanceScore {
  onTimeRate: number; // 0-1
  avgStopMinutes: number;
  completedStops: number;
  totalStops: number;
  feedbackAverage: number; // 0-5
  periodLabel: string;
}

export interface ActivityItem {
  id: string;
  type: 'route_completed' | 'route_created' | 'credit_used' | 'plan_upgraded' | 'feedback_received';
  message: string;
  timestamp: string;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  price: number;
  billingPeriod: 'month' | 'one_time';
  creditsPerMonth: number | 'unlimited';
  maxStopsPerRoute: number;
  features: string[];
  highlighted?: boolean;
}

export interface OnboardingAnswers {
  segment: UserSegment | null;
  primary_goal: string | null;
  stops_per_day: number | null;  
  transport_mode: 'car' | 'bike' | 'walk' | 'van' | 'public_transit' | null;
  team_size: number | null;       
}

export interface TeamMember {
  id: string;
  name: string;
  status: 'on_route' | 'finished' | 'idle';
  stopsAssigned: number;
  stopsCompleted: number;
  onTimeRate: number; // 0-1
  activeRouteId?: string;
}

export interface BillingSummary {
  tier: PlanTier;
  renewsOn?: string; // ISO date, absent for free tier
  paymentMethodLast4?: string;
  creditsRemaining: number | 'unlimited';
  history: { id: string; date: string; description: string; amount: number }[];
}
/** Generic wrapper every real endpoint should return, so the client can
 * treat success/error/loading uniformly regardless of which route it hit. */
export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
