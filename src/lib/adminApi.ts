import { request } from './api';
import type { ActivityItem, ApiResult } from '../types';

//  Types 

export interface AdminDashboard {
  totalUsers: number;
  usersByTier: Record<string, number>;
  usersBySegment: Record<string, number>;
  totalRoutePlans: number;
  routesLast7Days: number;
  totalCreditsSpent: number;
  aiMessagesLast7Days: number;
  pendingKyc: number;
  openPartnershipRequests: number;
  totalRevenueCents: number;
}

export interface GrowthPoint {
  date: string;
  newUsers: number;
  revenueCents: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  tier: string;
  credits: number;
  segment: string | null;
  kycStatus: string;
  isActive: boolean;
  isSuperadmin: boolean;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  routeCount: number;
  totalCreditsSpent: number;
  recentActivity: ActivityItem[];
  payments: PaymentRecord[];
}

export interface KycRecord {
  id: string;
  userId: string;
  status: string;
  documents: Record<string, any>[];
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface RoutePlanSummary {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  stopCount: number;
  roundTrip: boolean;
  totalDistanceKm: number;
  totalDurationMin: number;
  solverUsed: string;
  createdAt: string;
}

export interface AiActivity {
  id: string;
  userId: string;
  role: string;
  content: string;
  creditsCharged: number;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planId: string;
  amountCents: number;
  provider: string;
  status: string;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

export interface FeedbackRecord {
  id: string;
  userId: string;
  routePlanId: string | null;
  score: number;
  comment: string | null;
  createdAt: string;
}

export interface PartnershipRequest {
  id: string;
  companyName: string;
  contactName: string | null;
  contactEmail: string;
  message: string | null;
  integrationType: string | null;
  status: string;
  createdAt: string;
}

export interface PlatformConfig {
  key: string;
  value: Record<string, any>;
  description: string | null;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  meta: Record<string, any> | null;
  createdAt: string;
}

//  API functions

export function fetchAdminDashboard(): Promise<ApiResult<AdminDashboard>> {
  return request<AdminDashboard>('/admin/dashboard');
}

export function fetchAdminGrowth(days = 30): Promise<ApiResult<GrowthPoint[]>> {
  return request<GrowthPoint[]>(`/admin/dashboard/growth?days=${days}`);
}

export function fetchAdminUsers(
  q?: string,
  tier?: string,
  segment?: string,
  kycStatus?: string,
  limit = 50,
  offset = 0
): Promise<ApiResult<AdminUser[]>> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (tier) params.set('tier', tier);
  if (segment) params.set('segment', segment);
  if (kycStatus) params.set('kyc_status', kycStatus);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return request<AdminUser[]>(`/admin/users?${params.toString()}`);
}

export function fetchAdminUserDetail(userId: string): Promise<ApiResult<AdminUserDetail>> {
  return request<AdminUserDetail>(`/admin/users/${userId}`);
}

export function updateAdminUser(
  userId: string,
  payload: { isActive?: boolean; tier?: string; credits?: number; isSuperadmin?: boolean }
): Promise<ApiResult<AdminUser>> {
  return request<AdminUser>(`/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function fetchKyc(status?: string): Promise<ApiResult<KycRecord[]>> {
  const params = status ? `?status=${status}` : '';
  return request<KycRecord[]>(`/admin/kyc${params}`);
}

export function reviewKyc(recordId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<ApiResult<KycRecord>> {
  return request<KycRecord>(`/admin/kyc/${recordId}/review`, {
    method: 'POST',
    body: JSON.stringify({ status, rejection_reason: rejectionReason }),
  });
}

export function fetchAdminRoutes(userId?: string, limit = 50, offset = 0): Promise<ApiResult<RoutePlanSummary[]>> {
  const params = new URLSearchParams();
  if (userId) params.set('user_id', userId);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return request<RoutePlanSummary[]>(`/admin/routes?${params.toString()}`);
}

export function fetchAiActivity(limit = 100): Promise<ApiResult<AiActivity[]>> {
  return request<AiActivity[]>(`/admin/ai-activity?limit=${limit}`);
}

export function fetchPayments(limit = 100): Promise<ApiResult<PaymentRecord[]>> {
  return request<PaymentRecord[]>(`/admin/payments?limit=${limit}`);
}

export function fetchCreditTransactions(userId?: string, reason?: string, limit = 100): Promise<ApiResult<CreditTransaction[]>> {
  const params = new URLSearchParams();
  if (userId) params.set('user_id', userId);
  if (reason) params.set('reason', reason);
  params.set('limit', String(limit));
  return request<CreditTransaction[]>(`/admin/credit-transactions?${params.toString()}`);
}

export function fetchFeedback(minScore?: number, maxScore?: number, limit = 100): Promise<ApiResult<FeedbackRecord[]>> {
  const params = new URLSearchParams();
  if (minScore !== undefined) params.set('min_score', String(minScore));
  if (maxScore !== undefined) params.set('max_score', String(maxScore));
  params.set('limit', String(limit));
  return request<FeedbackRecord[]>(`/admin/feedback?${params.toString()}`);
}

export function fetchPartnerships(status?: string): Promise<ApiResult<PartnershipRequest[]>> {
  const params = status ? `?status=${status}` : '';
  return request<PartnershipRequest[]>(`/admin/partnerships${params}`);
}

export function reviewPartnership(requestId: string, status: 'in_review' | 'approved' | 'declined'): Promise<ApiResult<PartnershipRequest>> {
  return request<PartnershipRequest>(`/admin/partnerships/${requestId}/review`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export function fetchConfig(): Promise<ApiResult<PlatformConfig[]>> {
  return request<PlatformConfig[]>('/admin/config');
}

export function upsertConfig(key: string, value: Record<string, any>, description?: string): Promise<ApiResult<PlatformConfig>> {
  return request<PlatformConfig>(`/admin/config/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value, description }),
  });
}

export function deleteConfig(key: string): Promise<ApiResult<void>> {
  return request<void>(`/admin/config/${key}`, { method: 'DELETE' });
}

export function fetchAuditLog(adminId?: string, action?: string, limit = 100): Promise<ApiResult<AuditLogEntry[]>> {
  const params = new URLSearchParams();
  if (adminId) params.set('admin_id', adminId);
  if (action) params.set('action', action);
  params.set('limit', String(limit));
  return request<AuditLogEntry[]>(`/admin/audit-log?${params.toString()}`);
}




export interface AiMetrics {
  totalRequests: number;
  totalTokens: number;
  totalCostCents: number;
  avgResponseMs: number;
  successRate: number;                  // 0-1
  errorRate: number;                    // 0-1
  avgTokensPerRequest: number;
  requestsByDay: { date: string; count: number; tokens: number; costCents: number; errors: number }[];
  requestTypes: { type: string; count: number; avgLatencyMs: number }[];
  latencyPercentiles: { p50: number; p90: number; p95: number; p99: number };
  costByModel: { model: string; costCents: number; tokenCount: number }[];
  models: { name: string; requests: number; avgTokens: number }[];
  promptTemplates: { id: string; name: string; version: string; active: boolean }[];
}

export interface AiPipeline {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'training';
  lastRun: string | null;
  accuracy: number | null;
}

export interface AiTrainingJob {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}

// Mock AI metrics
export function fetchAiMetrics(): Promise<ApiResult<AiMetrics>> {
  const days = 30;
  const now = Date.now();
  const requestsByDay = Array.from({ length: days }, (_, i) => {
    const date = new Date(now - (days - 1 - i) * 86400000).toISOString().slice(0, 10);
    const count = Math.floor(Math.random() * 50) + 10;
    const errors = Math.floor(Math.random() * 5);
    const tokens = Math.floor(Math.random() * 6000) + 1000;
    const costCents = Math.floor((tokens / 1000) * (0.5 + Math.random() * 0.3) * 100);
    return { date, count, tokens, costCents, errors };
  });

  const mock: AiMetrics = {
    totalRequests: requestsByDay.reduce((sum, d) => sum + d.count, 0),
    totalTokens: requestsByDay.reduce((sum, d) => sum + d.tokens, 0),
    totalCostCents: requestsByDay.reduce((sum, d) => sum + d.costCents, 0),
    avgResponseMs: Math.floor(Math.random() * 200) + 100,
    successRate: 0.95 + Math.random() * 0.04,
    errorRate: 0.01 + Math.random() * 0.02,
    avgTokensPerRequest: Math.floor((requestsByDay.reduce((s, d) => s + d.tokens, 0) / requestsByDay.reduce((s, d) => s + d.count, 0))),
    requestsByDay,
    requestTypes: [
      { type: 'Route optimization', count: 400, avgLatencyMs: 280 },
      { type: 'Insights generation', count: 250, avgLatencyMs: 220 },
      { type: 'Chat assistant', count: 150, avgLatencyMs: 180 },
      { type: 'Feedback summarization', count: 80, avgLatencyMs: 150 },
      { type: 'Other', count: 30, avgLatencyMs: 120 },
    ],
    latencyPercentiles: { p50: 120, p90: 320, p95: 450, p99: 800 },
    costByModel: [
      { model: 'gpt-4', costCents: 8500, tokenCount: 850000 },
      { model: 'gpt-3.5-turbo', costCents: 2500, tokenCount: 1200000 },
      { model: 'claude-3', costCents: 1200, tokenCount: 60000 },
    ],
    models: [
      { name: 'gpt-4', requests: 800, avgTokens: 450 },
      { name: 'gpt-3.5-turbo', requests: 400, avgTokens: 200 },
      { name: 'claude-3', requests: 34, avgTokens: 600 },
    ],
    promptTemplates: [
      { id: 'p1', name: 'Route Planner v1', version: '1.2.0', active: true },
      { id: 'p2', name: 'Insight Generator', version: '2.0.0', active: false },
      { id: 'p3', name: 'Feedback Summarizer', version: '1.0.1', active: true },
    ],
  };
  return Promise.resolve({ ok: true, data: mock });
}

export function fetchAiPipelines(): Promise<ApiResult<AiPipeline[]>> {
  const mock: AiPipeline[] = [
    { id: 'pipe1', name: 'Intent Classification', status: 'active', lastRun: new Date().toISOString(), accuracy: 0.92 },
    { id: 'pipe2', name: 'Named Entity Extraction', status: 'active', lastRun: new Date().toISOString(), accuracy: 0.88 },
    { id: 'pipe3', name: 'Route Optimization LLM', status: 'inactive', lastRun: null, accuracy: null },
  ];
  return Promise.resolve({ ok: true, data: mock });
}

export function fetchAiTrainingJobs(): Promise<ApiResult<AiTrainingJob[]>> {
  const mock: AiTrainingJob[] = [
    { id: 't1', name: 'Fine-tune on Route Data v3', status: 'completed', progress: 100, createdAt: new Date().toISOString() },
    { id: 't2', name: 'Add restaurant stop support', status: 'running', progress: 65, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 't3', name: 'Test new prompt template', status: 'queued', progress: 0, createdAt: new Date().toISOString() },
  ];
  return Promise.resolve({ ok: true, data: mock });
}



// i use the persona i need for the paymens as i work on the endpoint? // Add these interfaces

export interface PaymentStats {
  totalRevenueCents: number;
  totalPayments: number;
  avgPaymentCents: number;
  successRate: number;
  revenueByDay: { date: string; amountCents: number }[];
  statusBreakdown: { status: string; count: number; totalCents: number }[];
  providerBreakdown: { provider: string; count: number; totalCents: number }[];
  recentPayments: PaymentRecord[];
}


//payment stats
export function fetchPaymentStats(days = 30): Promise<ApiResult<PaymentStats>> {
  return request<PaymentStats>(`/admin/payments/stats?days=${days}`);
}

// Reconfigure payment settings (mock)
export function updatePaymentSettings(payload: {
  provider: string;
  apiKey: string;
  webhookUrl: string;
}): Promise<ApiResult<{ success: boolean }>> {
  return Promise.resolve({ ok: true, data: { success: true } });
}


// if /feedback endpoint returns empty then rollback to:// Add this mock function if the endpoint doesn't return data
export function fetchFeedbackMock(): ApiResult<FeedbackRecord[]> {
  const mock: FeedbackRecord[] = Array.from({ length: 50 }, (_, i) => ({
    id: `fb_${i + 1}`,
    userId: `usr_${Math.floor(Math.random() * 10) + 1}`,
    routePlanId: Math.random() > 0.5 ? `route_${i}` : null,
    score: Math.round((Math.random() * 4 + 1) * 10) / 10,
    comment: ['Great route, saved me 20 minutes!', 'Had some issues with the directions.', 'Perfect, exactly as planned.', 'The app is really helpful.', 'Found a better route myself.', 'I love the AI insights.', 'The map is a bit slow.', 'Very intuitive.', 'Would recommend to others.', 'The optimization is impressive.'][Math.floor(Math.random() * 10)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));
  return { ok: true, data: mock };
}


//for patnership, this is the data i need defined and sent to the UI
// Add to the interfaces (already there)
export interface PartnershipRequest {
  id: string;
  companyName: string;
  contactName: string | null;
  contactEmail: string;
  message: string | null;
  integrationType: string | null;
  callRequested: boolean;
  nature: string | null;
  status: string;
  createdAt: string;
}