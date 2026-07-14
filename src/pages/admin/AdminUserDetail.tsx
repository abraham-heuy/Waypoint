import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchAdminUserDetail,
  updateAdminUser,
  type AdminUserDetail,
} from '../../lib/adminApi';
import Button from '../../components/ui/Button';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    isActive: false,
    tier: 'free',
    credits: 0,
    isSuperadmin: false,
  });

  useEffect(() => {
    if (!id) return;
    fetchAdminUserDetail(id)
      .then((res) => {
        if (res.ok && res.data) {
          setUser(res.data);
          setEditForm({
            isActive: res.data.isActive,
            tier: res.data.tier,
            credits: res.data.credits,
            isSuperadmin: res.data.isSuperadmin,
          });
        } else {
          setError(res.error || 'Failed to load user');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleUpdate() {
    if (!user) return;
    setUpdating(true);
    const result = await updateAdminUser(user.id, editForm);
    setUpdating(false);
    if (result.ok && result.data) {
      // Update local state with new data
      setUser({
        ...user,
        isActive: result.data.isActive,
        tier: result.data.tier,
        credits: result.data.credits,
        isSuperadmin: result.data.isSuperadmin,
      });
      setEditForm({
        isActive: result.data.isActive,
        tier: result.data.tier,
        credits: result.data.credits,
        isSuperadmin: result.data.isSuperadmin,
      });
    } else {
      setError(result.error || 'Update failed');
    }
  }

  if (loading) {
    return <div className="text-dispatch-dim text-sm">Loading user…</div>;
  }
  if (error) {
    return <div className="text-dispatch-danger text-sm">{error}</div>;
  }
  if (!user) {
    return <div className="text-dispatch-dim text-sm">User not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="text-sm text-dispatch-dim hover:text-dispatch-text transition-colors"
        >
          ← Back to users
        </button>
        <h1 className="text-xl font-bold">{user.name}</h1>
        <span className="text-xs font-mono bg-dispatch-panel2 px-2 py-1 rounded border border-dispatch-line">
          {user.id.slice(0, 8)}…
        </span>
      </div>

      {/* User info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Email</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Tier</span>
            <span className="text-sm capitalize">{user.tier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Credits</span>
            <span className="text-sm font-mono">{user.credits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Segment</span>
            <span className="text-sm">{user.segment || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Status</span>
            <span className={`text-sm ${user.isActive ? 'text-green-500' : 'text-dispatch-danger'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Superadmin</span>
            <span className={`text-sm ${user.isSuperadmin ? 'text-dispatch-accent' : 'text-dispatch-dim'}`}>
              {user.isSuperadmin ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">KYC</span>
            <span className="text-sm">{user.kycStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Joined</span>
            <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Total routes</span>
            <span className="text-sm font-mono">{user.routeCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dispatch-dim text-sm">Credits spent</span>
            <span className="text-sm font-mono">{user.totalCreditsSpent}</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-4">
        <h2 className="text-sm font-semibold">Edit user</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-dispatch-dim mb-1">Status</label>
            <select
              value={editForm.isActive ? 'active' : 'inactive'}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
              className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-dispatch-dim mb-1">Tier</label>
            <select
              value={editForm.tier}
              onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="team">Team</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-dispatch-dim mb-1">Credits</label>
            <input
              type="number"
              value={editForm.credits}
              onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-dispatch-dim">Superadmin</label>
            <input
              type="checkbox"
              checked={editForm.isSuperadmin}
              onChange={(e) => setEditForm({ ...editForm, isSuperadmin: e.target.checked })}
              className="w-4 h-4 accent-dispatch-accent"
            />
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleUpdate}
          loading={updating}
          disabled={updating}
        >
          Save changes
        </Button>
        {error && <p className="text-xs text-dispatch-danger">{error}</p>}
      </div>

      {/* Recent activity */}
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-3">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        {user.recentActivity.length === 0 ? (
          <p className="text-xs text-dispatch-dim">No activity recorded.</p>
        ) : (
          <ul className="space-y-2">
            {user.recentActivity.map((item) => (
              <li key={item.id} className="flex justify-between text-xs border-b border-dispatch-line/50 py-2">
                <span className="text-dispatch-dim">{item.message}</span>
                <span className="text-dispatch-dim/60">{new Date(item.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Payments */}
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-3">
        <h2 className="text-sm font-semibold">Payments</h2>
        {user.payments.length === 0 ? (
          <p className="text-xs text-dispatch-dim">No payments found.</p>
        ) : (
          <ul className="space-y-2">
            {user.payments.map((p) => (
              <li key={p.id} className="flex justify-between text-xs border-b border-dispatch-line/50 py-2">
                <span className="text-dispatch-dim">
                  ${(p.amountCents / 100).toFixed(2)} – {p.provider} ({p.status})
                </span>
                <span className="text-dispatch-dim/60">{new Date(p.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}