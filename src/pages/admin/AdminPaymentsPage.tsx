import { useEffect, useState, useMemo } from 'react';
import StatCard from '../../components/admin/StatCard';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/primitives';
import {
  fetchPayments,
  fetchCreditTransactions,
  fetchPaymentStats,
  type PaymentRecord,
  type CreditTransaction,
  type PaymentStats,
} from '../../lib/adminApi';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');

  // Config modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState({
    provider: 'stripe',
    apiKey: 'sk_test_...',
    webhookUrl: 'https://api.waypoint.com/webhooks/payment',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [paymentsRes, statsRes, txRes] = await Promise.all([
        fetchPayments(100),
        fetchPaymentStats(),
        fetchCreditTransactions(undefined, undefined, 100),
      ]);
      if (paymentsRes.ok && paymentsRes.data) setPayments(paymentsRes.data);
      else setError(paymentsRes.error || 'Failed to load payments');
      if (statsRes.ok && statsRes.data) setStats(statsRes.data);
      if (txRes.ok && txRes.data) setTransactions(txRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let result = payments;
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (providerFilter) {
      result = result.filter((p) => p.provider === providerFilter);
    }
    if (userIdFilter) {
      result = result.filter((p) => p.userId.includes(userIdFilter));
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((p) => new Date(p.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.createdAt) <= to);
    }
    return result;
  }, [payments, statusFilter, providerFilter, userIdFilter, dateFrom, dateTo]);

  if (loading) return <div className="text-dispatch-dim text-sm">Loading payments…</div>;
  if (error) return <div className="text-dispatch-danger text-sm">{error}</div>;
  if (!stats) return <div className="text-dispatch-dim text-sm">No payment data available.</div>;

  // Calculate max for chart
  const maxRevenue = Math.max(...stats.revenueByDay.map((d) => d.amountCents), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Payments & Billing</h1>
        <Button size="sm" onClick={() => setShowConfigModal(true)}>
          Reconfigure payment settings
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total revenue" value={`$${(stats.totalRevenueCents / 100).toFixed(2)}`} accent />
        <StatCard label="Total payments" value={stats.totalPayments} />
        <StatCard label="Avg payment" value={`$${(stats.avgPaymentCents / 100).toFixed(2)}`} />
        <StatCard label="Success rate" value={`${(stats.successRate * 100).toFixed(1)}%`} />
      </div>

      {/* Revenue chart */}
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
          Daily revenue (last 30 days)
        </div>
        <svg viewBox="0 0 100 40" className="w-full h-32" preserveAspectRatio="none">
          {stats.revenueByDay.map((d, i) => {
            const height = (d.amountCents / maxRevenue) * 36;
            const x = (i / stats.revenueByDay.length) * 100;
            return (
              <rect
                key={d.date}
                x={x}
                y={40 - height}
                width={100 / stats.revenueByDay.length * 0.7}
                height={height}
                className="fill-dispatch-accent"
                opacity={0.85}
              >
                <title>{`${d.date}: $${(d.amountCents / 100).toFixed(2)}`}</title>
              </rect>
            );
          })}
        </svg>
      </div>

      {/* Breakdowns */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
            Status breakdown
          </div>
          <div className="space-y-2">
            {stats.statusBreakdown.map((s) => (
              <div key={s.status} className="flex justify-between text-sm">
                <span className="text-dispatch-dim capitalize">{s.status}</span>
                <span className="font-mono">
                  {s.count} payments · ${(s.totalCents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
            Provider distribution
          </div>
          <div className="space-y-2">
            {stats.providerBreakdown.map((p) => (
              <div key={p.provider} className="flex justify-between text-sm">
                <span className="text-dispatch-dim capitalize">{p.provider}</span>
                <span className="font-mono">
                  {p.count} payments · ${(p.totalCents / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and table */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-dispatch-dim block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            >
              <option value="">All</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dispatch-dim block mb-1">Provider</label>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            >
              <option value="">All</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="uber">Uber</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dispatch-dim block mb-1">User ID</label>
            <Input
              type="text"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              placeholder="Search user..."
              className="w-40"
            />
          </div>
          <div>
            <label className="text-xs text-dispatch-dim block mb-1">Date from</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-dispatch-dim block mb-1">Date to</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setStatusFilter('');
              setProviderFilter('');
              setUserIdFilter('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Clear filters
          </Button>
        </div>

        <AdminTable
          columns={[
            { key: 'id', header: 'ID', render: (row: PaymentRecord) => row.id.slice(0, 8) + '…' },
            { key: 'userId', header: 'User ID', render: (row: PaymentRecord) => row.userId.slice(0, 8) + '…' },
            { key: 'planId', header: 'Plan' },
            {
              key: 'amountCents',
              header: 'Amount',
              render: (row: PaymentRecord) => `$${(row.amountCents / 100).toFixed(2)}`,
            },
            { key: 'provider', header: 'Provider' },
            {
              key: 'status',
              header: 'Status',
              render: (row: PaymentRecord) => (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    row.status === 'succeeded'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                      : row.status === 'failed'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                      : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                  }`}
                >
                  {row.status}
                </span>
              ),
            },
            {
              key: 'createdAt',
              header: 'Date',
              render: (row: PaymentRecord) => new Date(row.createdAt).toLocaleDateString(),
            },
          ]}
          rows={filteredPayments}
          loading={false}
          error={null}
          emptyMessage="No payments match the filters."
        />

        {/* Credit transactions table */}
        <div className="pt-4 border-t border-dispatch-line">
          <h2 className="text-sm font-semibold mb-3">Credit transactions (recent)</h2>
          <AdminTable
            columns={[
              { key: 'id', header: 'ID', render: (row: CreditTransaction) => row.id.slice(0, 8) + '…' },
              { key: 'userId', header: 'User ID', render: (row: CreditTransaction) => row.userId.slice(0, 8) + '…' },
              {
                key: 'amount',
                header: 'Amount',
                render: (row: CreditTransaction) => `${row.amount > 0 ? '+' : ''}${row.amount}`,
              },
              { key: 'reason', header: 'Reason' },
              { key: 'balanceAfter', header: 'Balance after' },
              {
                key: 'createdAt',
                header: 'Date',
                render: (row: CreditTransaction) => new Date(row.createdAt).toLocaleDateString(),
              },
            ]}
            rows={transactions}
            loading={false}
            error={null}
            emptyMessage="No credit transactions."
          />
        </div>
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold">Payment settings</h2>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">Provider</label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">API Key</label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
                placeholder="sk_..."
              />
            </div>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">Webhook URL</label>
              <input
                type="url"
                value={config.webhookUrl}
                onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  // mock save
                  setShowConfigModal(false);
                }}
              >
                Save settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}