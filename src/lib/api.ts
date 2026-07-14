import type {
  ApiResult,
  User,
  RoutePlan,
  AiInsight,
  AiChatMessage,
  PerformanceScore,
  ActivityItem,
  PricingPlan,
  OnboardingAnswers,
  Stop,
  TeamMember,      // new
  BillingSummary,  // new
} from '../types';
import {
  MOCK_USER,
  MOCK_ROUTE_PLAN,
  MOCK_INSIGHTS,
  MOCK_PERFORMANCE,
  MOCK_ACTIVITY,
  PRICING_PLANS,
  MOCK_TEAM,       // new – define in mockData.ts
  MOCK_BILLING,    // new – define in mockData.ts
} from './mockData';

// ---------- Configuration ----------
const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 8000;

// ---------- Core request helper ----------
export async function request<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  if (!API_BASE) {
    return { ok: false, error: 'no_api_configured' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (init?.headers) {
    if (Array.isArray(init.headers)) {
      for (const [key, value] of init.headers) {
        headers[key] = value;
      }
    } else if (init.headers instanceof Headers) {
      for (const [key, value] of init.headers.entries()) {
        headers[key] = value;
      }
    } else {
      Object.assign(headers, init.headers);
    }
  }

  try {
    const resp = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeout);

    if (resp.status === 401) {
      return { ok: false, error: 'unauthorized' };
    }
    if (!resp.ok) {
      let errorMessage = `http_${resp.status}`;
      try {
        const errorBody = await resp.json();
        if (errorBody.detail) {
          if (Array.isArray(errorBody.detail)) {
            errorMessage = errorBody.detail
              .map((e: any) => e.msg || e)
              .join('; ');
          } else {
            errorMessage = errorBody.detail;
          }
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (_) {
        // fallback
      }
      return { ok: false, error: errorMessage };
    }

    const data = (await resp.json()) as T;
    return { ok: true, data };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : 'unknown_error';
    return { ok: false, error: message };
  }
}

// ---------- Mock fallback helper ----------
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ---------- Auth ----------

export async function login(email: string, password: string): Promise<ApiResult<User>> {
  if (!API_BASE) {
    // Dev fallback
    if (!email || !password) {
      return { ok: false, error: 'missing_credentials' };
    }
    const user = await delay({ ...MOCK_USER, email });
    return { ok: true, data: user };
  }

  const result = await request<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.ok && result.data) {
    return { ok: true, data: result.data.user };
  }
  return { ok: false, error: result.error || 'Login failed' };
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<ApiResult<User>> {
  if (!API_BASE) {
    // Dev fallback
    if (!name || !email || password.length < 6) {
      return { ok: false, error: 'invalid_signup_details' };
    }
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const user = await delay({
      ...MOCK_USER,
      id: `usr_${Date.now()}`,
      name,
      email,
      avatarInitials: initials,
      credits: 15,
      tier: 'free' as const,
    });
    return { ok: true, data: user };
  }

  const result = await request<{ user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  if (result.ok && result.data) {
    return { ok: true, data: result.data.user };
  }
  return { ok: false, error: result.error || 'Signup failed' };
}

export async function logout(): Promise<ApiResult<void>> {
  if (!API_BASE) {
    return { ok: true, data: undefined };
  }
  return request<void>('/auth/logout', { method: 'POST' });
}

export async function getCurrentUser(): Promise<ApiResult<User>> {
  if (!API_BASE) {
    const user = await delay({ ...MOCK_USER });
    return { ok: true, data: user };
  }
  return request<User>('/auth/me');
}

export async function refreshToken(): Promise<ApiResult<{ user: User }>> {
  if (!API_BASE) {
    const user = await delay({ ...MOCK_USER });
    return { ok: true, data: { user } };
  }
  return request<{ user: User }>('/auth/refresh', { method: 'POST' });
}

export async function completeOnboarding(
  userId: string,
  answers: OnboardingAnswers
): Promise<ApiResult<User>> {
  return request<User>(`/users/${userId}/onboarding`, {
    method: 'POST',
    body: JSON.stringify(answers),
  });
}

// ---------- Routes ----------
export async function fetchActiveRoute(userId: string): Promise<ApiResult<RoutePlan>> {
  const real = await request<RoutePlan>(`/users/${userId}/routes/active`);
  if (real.ok) return real;
  return { ok: true, data: await delay(MOCK_ROUTE_PLAN, 500) };
}

export async function optimizeRoute(
  stops: Stop[],
  roundTrip: boolean
): Promise<ApiResult<RoutePlan>> {
  const real = await request<RoutePlan>('/routes/optimize', {
    method: 'POST',
    body: JSON.stringify({ stops, roundTrip }),
  });
  if (real.ok) return real;
  if (stops.length < 2) return { ok: false, error: 'need_at_least_two_stops' };
  return {
    ok: true,
    data: await delay({ ...MOCK_ROUTE_PLAN, stops, roundTrip }, 700),
  };
}

// ---------- AI (kept as mock) ----------
export async function fetchInsights(routeId: string): Promise<ApiResult<AiInsight[]>> {
  return { ok: true, data: await delay(MOCK_INSIGHTS, 450) };
}

export async function sendAiChatMessage(
  userId: string,
  message: string,
  history: AiChatMessage[]
): Promise<ApiResult<AiChatMessage>> {
  if (!message.trim()) return { ok: false, error: 'empty_message' };
  const reply: AiChatMessage = {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content:
      "I'm running in demo mode right now (no AI endpoint connected yet), but here's what I'd normally do: break your message into stops, check opening hours and time windows, then hand it to the optimizer. Once VITE_API_BASE_URL is set, I'll respond for real.",
    createdAt: new Date().toISOString(),
  };
  return { ok: true, data: await delay(reply, 600) };
}

// ---------- Analytics / profile ----------
export async function fetchPerformance(userId: string): Promise<ApiResult<PerformanceScore>> {
  const real = await request<PerformanceScore>(`/users/${userId}/performance`);
  if (real.ok) return real;
  return { ok: true, data: await delay(MOCK_PERFORMANCE, 400) };
}

export async function fetchActivity(userId: string): Promise<ApiResult<ActivityItem[]>> {
  const real = await request<ActivityItem[]>(`/users/${userId}/activity`);
  if (real.ok) return real;
  return { ok: true, data: await delay(MOCK_ACTIVITY, 400) };
}

// ---------- Billing ----------
export async function fetchPricingPlans(): Promise<ApiResult<PricingPlan[]>> {
  const real = await request<PricingPlan[]>('/billing/plans');
  if (real.ok) return real;
  return { ok: true, data: await delay(PRICING_PLANS, 300) };
}

export async function upgradePlan(userId: string, planId: string): Promise<ApiResult<User>> {
  const real = await request<User>(`/users/${userId}/billing/upgrade`, {
    method: 'POST',
    body: JSON.stringify({ planId }),
  });
  if (real.ok) return real;
  return {
    ok: true,
    data: await delay({ ...MOCK_USER, id: userId, tier: planId as User['tier'] }, 500),
  };
}

// ---------- NEW: Fetch a specific route by id ----------
export async function fetchRouteById(routeId: string): Promise<ApiResult<RoutePlan>> {
  const real = await request<RoutePlan>(`/routes/${routeId}`);
  if (real.ok) return real;
  return { ok: true, data: await delay({ ...MOCK_ROUTE_PLAN, id: routeId }, 400) };
}

// ---------- NEW: Team (business accounts) ----------
export async function fetchTeam(userId: string): Promise<ApiResult<TeamMember[]>> {
  const real = await request<TeamMember[]>(`/users/${userId}/team`);
  if (real.ok) return real;
  return { ok: true, data: await delay(MOCK_TEAM, 450) };
}

// ---------- NEW: Update user profile ----------
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'name' | 'homeCity' | 'transportMode'>>
): Promise<ApiResult<User>> {
  const real = await request<User>(`/users/${userId}/profile`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  if (real.ok) return real;
  return { ok: true, data: await delay({ ...MOCK_USER, id: userId, ...updates }, 500) };
}

// ---------- NEW: Reset user data ----------
export async function resetUserData(userId: string): Promise<ApiResult<{ success: true }>> {
  const real = await request<{ success: true }>(`/users/${userId}/reset`, { method: 'POST' });
  if (real.ok) return real;
  return { ok: true, data: await delay({ success: true }, 600) };
}

// ---------- NEW: Billing summary ----------
export async function fetchBillingSummary(userId: string): Promise<ApiResult<BillingSummary>> {
  const real = await request<BillingSummary>(`/users/${userId}/billing`);
  if (real.ok) return real;
  return { ok: true, data: await delay(MOCK_BILLING, 400) };
}

// ---------- NEW: Cancel subscription ----------
export async function cancelSubscription(userId: string): Promise<ApiResult<User>> {
  const real = await request<User>(`/users/${userId}/billing/cancel`, { method: 'POST' });
  if (real.ok) return real;
  return { ok: true, data: await delay({ ...MOCK_USER, id: userId, tier: 'free' as const }, 500) };
}

// ---------- Rideshare ----------
export async function fetchRideshareEstimate(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): Promise<ApiResult<{ provider: string; lowFare: number; highFare: number; etaMinutes: number }>> {
  const real = await request<{ provider: string; lowFare: number; highFare: number; etaMinutes: number }>(
    '/rideshare/estimate',
    { method: 'POST', body: JSON.stringify({ fromLat, fromLng, toLat, toLng }) }
  );
  if (real.ok) return real;
  return {
    ok: true,
    data: await delay({ provider: 'uber', lowFare: 4.5, highFare: 7.2, etaMinutes: 6 }, 400),
  };
}


/**
 * Submit a public partnership inquiry (used on the /partnerships page).
 * This endpoint should be unauthenticated; it creates a pending partnership
 * request in the backend for admin review.
 */
export async function submitPartnershipRequest(payload: {
  companyName: string;
  contactName?: string;
  contactEmail: string;
  message: string;
  integrationType?: string;
  callRequested?: boolean;
  nature?: string;
}): Promise<ApiResult<{ id: string }>> {
  // If API_BASE is set, call real endpoint; else mock
  if (!API_BASE) {
    await delay(null, 800);
    return { ok: true, data: { id: `part_mock_${Date.now()}` } };
  }
  return request<{ id: string }>('/partnerships/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
