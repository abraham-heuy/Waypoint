import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Skeleton } from '../ui/primitives';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';
import * as api from '../../lib/api';
import type { BillingSummary, TransportMode } from '../../types';

type Tab = 'profile' | 'billing' | 'danger';

const TRANSPORT_OPTIONS: { value: TransportMode; label: string }[] = [
  { value: 'own_vehicle', label: 'My own vehicle' },
  { value: 'rideshare', label: 'Rideshare' },
  { value: 'mixed', label: 'A mix of both' },
  { value: 'walking', label: 'Mostly on foot' },
];

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('profile');
  // DashboardLayout only renders this modal when a user is present
  const user = useAuthStore((s) => s.user)!;
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  // profile form state
  const [name, setName] = useState(user?.name ?? '');
  const [homeCity, setHomeCity] = useState(user?.homeCity ?? '');
  const [transportMode, setTransportMode] = useState<TransportMode | undefined>(user?.transportMode);
  const [savingProfile, setSavingProfile] = useState(false);

  // billing
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // danger zone
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name);
    setHomeCity(user.homeCity ?? '');
    setTransportMode(user.transportMode);
    api.fetchBillingSummary(user.id).then((res) => {
      if (res.ok && res.data) setBilling(res.data);
    });
  }, [open, user]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    const res = await api.updateUserProfile(user.id, { name, homeCity, transportMode });
    setSavingProfile(false);
    if (res.ok && res.data) {
      updateUser(res.data);
      toast.success('Profile updated.');
    } else {
      toast.error('Could not save changes — try again.');
    }
  }

  async function handleCancelPlan() {
    setCancelling(true);
    const res = await api.cancelSubscription(user.id);
    setCancelling(false);
    if (res.ok && res.data) {
      updateUser(res.data);
      toast.success('Subscription cancelled — you\'re back on the Free plan.');
    } else {
      toast.error('Could not cancel right now — try again.');
    }
  }

  async function handleReset() {
    setResetting(true);
    const res = await api.resetUserData(user.id);
    setResetting(false);
    setConfirmingReset(false);
    if (res.ok) {
      toast.success('Your saved routes and history have been cleared.');
      onClose();
      window.location.reload();
    } else {
      toast.error('Could not reset your data — try again.');
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings" size="lg">
      <div className="flex gap-1 mb-5 border-b border-dispatch-line -mt-1 pb-3">
        {(
          [
            ['profile', 'Profile'],
            ['billing', 'Billing'],
            ['danger', 'Danger zone'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              tab === id ? 'bg-dispatch-accent text-[#1a1200]' : 'text-dispatch-dim hover:text-dispatch-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="space-y-4">
          <Input id="settings-name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            id="settings-city"
            label="Home city"
            value={homeCity}
            onChange={(e) => setHomeCity(e.target.value)}
            placeholder="e.g. Nairobi"
          />
          <div>
            <label className="block text-xs font-medium text-dispatch-dim mb-1.5">Getting around by</label>
            <div className="grid grid-cols-2 gap-2">
              {TRANSPORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTransportMode(opt.value)}
                  className={`text-left text-xs px-3 py-2.5 rounded-lg border ${
                    transportMode === opt.value
                      ? 'border-dispatch-accent bg-dispatch-accent/10'
                      : 'border-dispatch-line text-dispatch-dim'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button loading={savingProfile} onClick={handleSaveProfile}>
              Save changes
            </Button>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-5">
          {!billing ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div className="rounded-lg border border-dispatch-line bg-dispatch-panel2 p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-dispatch-dim mb-1">Current plan</div>
                  <div className="text-base font-semibold capitalize">{billing.tier}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-dispatch-dim mb-1">Credits</div>
                  <div className="font-mono text-dispatch-accent">
                    {billing.creditsRemaining === 'unlimited' ? 'Unlimited' : billing.creditsRemaining}
                  </div>
                </div>
              </div>

              {billing.tier !== 'free' && (
                <Button variant="secondary" size="sm" loading={cancelling} onClick={handleCancelPlan}>
                  Cancel subscription
                </Button>
              )}

              <div>
                <div className="text-xs uppercase tracking-wide text-dispatch-dim font-bold mb-2">
                  Billing history
                </div>
                {billing.history.length === 0 ? (
                  <p className="text-xs text-dispatch-dim">No billing history yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {billing.history.map((h) => (
                      <li key={h.id} className="flex justify-between text-xs">
                        <span className="text-dispatch-dim">
                          {h.date} · {h.description}
                        </span>
                        <span className="font-mono">${h.amount.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'danger' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-dispatch-danger/40 bg-dispatch-danger/5 p-4">
            <h4 className="text-sm font-semibold text-dispatch-danger mb-1.5">Reset saved data</h4>
            <p className="text-xs text-dispatch-dim leading-relaxed mb-3">
              Clears your saved routes, stops, and activity history. Your account, billing, and
              credits are not affected. This cannot be undone.
            </p>
            {!confirmingReset ? (
              <Button variant="danger" size="sm" onClick={() => setConfirmingReset(true)}>
                Reset saved data
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="danger" size="sm" loading={resetting} onClick={handleReset}>
                  Yes, reset everything
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmingReset(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-dispatch-line p-4">
            <h4 className="text-sm font-semibold mb-1.5">Log out</h4>
            <p className="text-xs text-dispatch-dim leading-relaxed mb-3">
              Ends this session on this device.
            </p>
            <Button variant="secondary" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
