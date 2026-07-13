export type UserSegment = 'solo' | 'field_team' | 'delivery' | 'enterprise';

export type PlanTier = 'free' | 'plus' | 'pro' | 'business';

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
  transportMode: 'car' | 'bike' | 'motorbike' | 'on_foot' | 'none';
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
  eta?: string
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
  geometry?: {
    coordinates: [number, number][]; // [lng, lat]
  };
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
/** Generic wrapper every real endpoint should return, so the client can
 * treat success/error/loading uniformly regardless of which route it hit. */
export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
