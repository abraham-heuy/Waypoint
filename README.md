# Waypoint — Route Planning Platform

A mobile-first, interactive route planning application built with React, TypeScript, Tailwind CSS, and Zustand. It features a 3D landing page, animated statistics, segmented dashboards, and a full route optimization backend.

## Quick Start

### Prerequisites

- Node.js (v18+)
- Python 3.11+ (for backend)
- PostgreSQL (or SQLite for development)

### Frontend Setup

```bash
git clone <repository>
cd frontend
npm install
npm run dev

## Structure

```
src/
  lib/
    api.ts          every backend call, real-endpoint-first with mock fallback
    mockData.ts      dummy data used as fallback and for local dev
  store/             zustand: auth/session, theme, toasts
  types/             shared domain types — the contract your API should fulfill
  components/
    layout/          navbar, footer, theme toggle
    landing/          hero (3D), feature grid, segment showcase, pricing cards
    dashboard/         shared widgets used across all four dashboards
    ui/                Button, Input, Card, Toast, ErrorBoundary, Skeleton
  pages/
    LandingPage, AboutPage, ContactPage, BlogPages, PricingPage
    LoginPage, SignupPage, OnboardingWizardPage, ChoosePlanPage
    RoutePlannerPage   seam for the full map+solver UI (built separately)
    dashboards/         DriverDashboard, ErrandDashboard, TouristDashboard,
                        BusinessDashboard, DashboardRouter
```

## Flow

Landing → **Get started** → signup → onboarding wizard (segment, stop volume,
transport mode, team size if business) → choose a plan or continue free with
starter credits → segment-specific dashboard.

## Theming

Dark/light is driven entirely by CSS variables in `src/index.css` (`:root` vs
`.light`), toggled via a class on `<html>`. Tailwind utility classes (`bg-dispatch-bg`,
`text-dispatch-text`, etc.) don't need `dark:` variants — the same class resolves to
different RGB values depending on the active theme. Preference persists to
`localStorage` and falls back to the OS preference on first visit.

---

## API endpoints to build

Every function in `src/lib/api.ts` already defines the exact request/response shape
it expects — this section is the plain-English version of the same contract.

### Auth

**`POST /auth/signup`**
Body: `{ name, email, password }`
Returns: a `User` object (see `src/types/index.ts`) with `tier: 'free'` and starter
`credits` (15 to match the Free plan). Should reject duplicate emails and weak
passwords server-side even though the client also validates.

**`POST /auth/login`**
Body: `{ email, password }`
Returns: `User` on success, 401 on bad credentials. Consider returning a session
token/cookie alongside the user object — the client currently only stores the user
object in `localStorage`, so if you add token auth you'll want to extend `authStore.ts`
to store and attach it.

**`POST /users/:id/onboarding`**
Body: the `OnboardingAnswers` shape — `segment`, `stopsPerDay`, `transportMode`,
optionally `teamSize`. Returns the updated `User` (mainly `segment` set). This
determines which of the four dashboards the user sees from then on.

### Routes

**`GET /users/:id/routes/active`**
Returns the user's current/most-recent `RoutePlan` — stops, solved order, per-leg
duration/distance, totals. Powers the "Route Plan" summary card on every dashboard.
Should return 404 (client treats any failure as "no active route yet" and shows a
"Plan a route" prompt) if nothing exists yet.

**`POST /routes/optimize`**
Body: `{ stops: Stop[], roundTrip: boolean }`
Returns a solved `RoutePlan`. This is where your Held-Karp (small n) / OR-Tools
(larger n) solver from the standalone optimizer plugs in directly — same stop shape,
same output shape. Should deduct one credit from the calling user server-side and
reject with a clear error if they're out of credits (don't rely on the client's
credit count as the source of truth).

**`GET /routes/:id/insights`**
Returns `AiInsight[]` — short, plain-language observations about a solved route
("doing X before Y saves 6 minutes", "this stop has a tight window"). Can be generated
by a lightweight LLM prompt over the route's legs and time windows, or by rule-based
heuristics to start.

### AI assistant

**`POST /ai/chat`**
Body: `{ userId, message, history: AiChatMessage[] }`
Returns a single new `AiChatMessage` from the assistant. This is the important one:
the assistant should not just chat — when the user describes stops in free text
("pharmacy, then groceries, then pick up Sam by 4"), it should extract structured
stops (label, rough location if inferable, time window) and either call
`/routes/optimize` itself and describe the result, or return the structured stops for
the client to send to `/routes/optimize`. Decide which side does the optimize call
based on how much you want the client to orchestrate vs. the backend.
Should deduct one credit per message server-side.

### Analytics / profile

**`GET /users/:id/performance`**
Returns a `PerformanceScore` — on-time rate, average stop duration, completed/total
stops, average feedback score, over a period you choose (dashboards currently label
it "Last 30 days").

**`GET /users/:id/activity`**
Returns a reverse-chronological `ActivityItem[]` — route completions, credit usage,
plan upgrades, feedback received. Used for the activity feed on every dashboard.

### Billing

**`GET /billing/plans`**
Returns `PricingPlan[]` — id, name, price, billing period, credits per month (or
`'unlimited'`), max stops per route, feature list, and an optional `highlighted` flag
for the plan you want visually emphasized. Both the public pricing page and the
post-onboarding plan chooser hit this same endpoint.

**`POST /users/:id/billing/upgrade`**
Body: `{ planId }`
Returns the updated `User` with the new `tier`. This is also the natural place to
integrate a real payment provider (Stripe etc.) — the client currently just calls
this after a mock 500ms "checkout" delay, so swapping in a real checkout flow (e.g.
redirecting to Stripe Checkout, then calling this endpoint on webhook confirmation)
doesn't require any other UI change.

### Rideshare

**`POST /rideshare/estimate`**
Body: `{ fromLat, fromLng, toLat, toLng }`
Returns `{ provider, lowFare, highFare, etaMinutes }`. This is the seam for a real
Uber/Bolt price-estimate API — used to offer a rideshare alternative on any leg of a
route for users without their own vehicle.

---

