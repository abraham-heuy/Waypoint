import { useEffect, useState, useMemo } from 'react';
import StatCard from '../../components/admin/StatCard';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import {
  fetchPartnerships,
  reviewPartnership,
  type PartnershipRequest,
} from '../../lib/adminApi';

// Generate rich mock data when real data is empty
function generateMockPartnerships(): PartnershipRequest[] {
  return [
    {
      id: 'part1',
      companyName: 'Green Logistics',
      contactName: 'Jane Doe',
      contactEmail: 'jane@greenlogistics.com',
      message: 'We are looking to integrate your route optimization into our fleet management platform. We serve 50+ drivers daily and think this could be a great fit.',
      integrationType: 'api',
      status: 'new',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      nature: 'Fleet integration for last-mile delivery optimization.',
      callRequested: true,
    },
    {
      id: 'part2',
      companyName: 'QuickRide',
      contactName: 'Bob Smith',
      contactEmail: 'bob@quickride.co',
      message: 'We want to partner with you for rideshare integration. Our users need real-time route planning with rideshare fallback.',
      integrationType: 'rideshare',
      status: 'in_review',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      nature: 'Rideshare fallback integration for urban mobility.',
      callRequested: false,
    },
    {
      id: 'part3',
      companyName: 'MediTrans',
      contactName: 'Alice Kim',
      contactEmail: 'alice@meditrans.com',
      message: 'We deliver medical supplies and need a reliable route optimizer that handles time windows and urgency.',
      integrationType: 'other',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      nature: 'Medical supply chain optimization with strict time windows.',
      callRequested: true,
    },
    {
      id: 'part4',
      companyName: 'EcoRide',
      contactName: 'Carlos Mendez',
      contactEmail: 'carlos@ecoride.io',
      message: 'We are building a sustainable transport platform and want to include your API for route planning.',
      integrationType: 'api',
      status: 'declined',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      nature: 'Sustainability-focused transport platform.',
      callRequested: false,
    },
  ];
}

export default function AdminPartnershipsPage() {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  // Filter
  const [statusFilter, setStatusFilter] = useState('');

  // Detail modal
  const [selected, setSelected] = useState<PartnershipRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Action states
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    fetchPartnerships()
      .then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setRequests(res.data);
          setIsMock(false);
        } else {
          setRequests(generateMockPartnerships());
          setIsMock(true);
        }
      })
      .catch(() => {
        setRequests(generateMockPartnerships());
        setIsMock(true);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = useMemo(() => {
    if (!statusFilter) return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  // Stats
  const total = requests.length;
  const statusCounts = {
    new: requests.filter((r) => r.status === 'new').length,
    in_review: requests.filter((r) => r.status === 'in_review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    declined: requests.filter((r) => r.status === 'declined').length,
  };

  const openModal = (row: PartnershipRequest) => {
    setSelected(row);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const handleReview = async (status: 'approved' | 'declined') => {
    if (!selected) return;
    setReviewing(true);
    const result = await reviewPartnership(selected.id, status);
    setReviewing(false);
    if (result.ok) {
      setRequests((prev) => prev.map((r) => r.id === selected.id ? { ...r, status } : r));
      closeModal();
    } else {
      alert(result.error || 'Review failed');
    }
  };

  // Generate mailto link
  const generateMailto = (partnership: PartnershipRequest) => {
    const subject = encodeURIComponent(`Partnership inquiry: ${partnership.companyName}`);
    const body = encodeURIComponent(
      `Hello ${partnership.contactName || 'team'},\n\n` +
      `Thank you for your interest in partnering with Waypoint.\n\n` +
      `Company: ${partnership.companyName}\n` +
      `Integration type: ${partnership.integrationType || 'Not specified'}\n` +
      `Message: ${partnership.message || 'No message provided.'}\n\n` +
      (partnership.nature ? `Nature of collaboration: ${partnership.nature}\n\n` : '') +
      (partnership.callRequested ? 'You have requested a short call. Please let us know your availability.\n\n' : '') +
      'We will get back to you shortly.\n\n' +
      'Best regards,\n' +
      'Waypoint Team'
    );
    return `mailto:${partnership.contactEmail}?subject=${subject}&body=${body}`;
  };

  if (loading) return <div className="text-dispatch-dim text-sm">Loading partnership requests…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Partnerships</h1>
        {isMock && (
          <div className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded-full">
             Mock data
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total requests" value={total} />
        <StatCard label="New" value={statusCounts.new} accent={statusCounts.new > 0} />
        <StatCard label="In review" value={statusCounts.in_review} />
        <StatCard label="Approved" value={statusCounts.approved} />
        <StatCard label="Declined" value={statusCounts.declined} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in_review">In review</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setStatusFilter('')}
        >
          Clear filters
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={[
          { key: 'companyName', header: 'Company' },
          {
            key: 'contactName',
            header: 'Contact',
            render: (row: PartnershipRequest) => row.contactName || row.contactEmail,
          },
          { key: 'integrationType', header: 'Integration' },
          {
            key: 'status',
            header: 'Status',
            render: (row: PartnershipRequest) => (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  row.status === 'new' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                  : row.status === 'in_review' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                  : row.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                  : 'bg-red-500/10 text-red-500 border border-red-500/30'
                }`}
              >
                {row.status.replace('_', ' ')}
              </span>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row: PartnershipRequest) => new Date(row.createdAt).toLocaleDateString(),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: PartnershipRequest) => (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openModal(row)}>
                  View
                </Button>
              </div>
            ),
          },
        ]}
        rows={filteredRequests}
        loading={false}
        error={null}
        emptyMessage="No partnership requests found."
      />

      {/* Detail Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold">{selected.companyName}</h2>
              <button
                onClick={closeModal}
                className="text-dispatch-dim hover:text-dispatch-text"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-dispatch-dim">Contact</span>
                  <div className="font-medium">{selected.contactName || '—'}</div>
                </div>
                <div>
                  <span className="text-dispatch-dim">Email</span>
                  <div className="font-medium">{selected.contactEmail}</div>
                </div>
                <div>
                  <span className="text-dispatch-dim">Integration type</span>
                  <div className="font-medium">{selected.integrationType || '—'}</div>
                </div>
                <div>
                  <span className="text-dispatch-dim">Status</span>
                  <div className="font-medium capitalize">{selected.status.replace('_', ' ')}</div>
                </div>
                <div>
                  <span className="text-dispatch-dim">Submitted</span>
                  <div className="font-medium">{new Date(selected.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-dispatch-dim">Short call requested</span>
                  <div className="font-medium">{selected.callRequested ? ' Yes' : 'No'}</div>
                </div>
              </div>

              {selected.nature && (
                <div>
                  <span className="text-dispatch-dim">Nature of collaboration</span>
                  <div className="italic text-dispatch-text mt-1 p-3 bg-dispatch-panel2 rounded border border-dispatch-line">
                    “{selected.nature}”
                  </div>
                </div>
              )}

              {selected.message && (
                <div>
                  <span className="text-dispatch-dim">Full message</span>
                  <div className="mt-1 p-3 bg-dispatch-panel2 rounded border border-dispatch-line whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-dispatch-line">
              {selected.status === 'new' || selected.status === 'in_review' ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReview('approved')}
                    loading={reviewing}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReview('declined')}
                    loading={reviewing}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <span className="text-xs text-dispatch-dim">This request has been {selected.status}.</span>
              )}
              <a
                href={generateMailto(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-dispatch-line bg-dispatch-panel hover:bg-dispatch-panel2 transition-colors text-dispatch-text"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}