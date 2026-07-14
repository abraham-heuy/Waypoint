import { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { fetchKyc, reviewKyc, type KycRecord } from '../../lib/adminApi';
import { useNavigate } from 'react-router-dom';

export default function AdminKycPage() {
  const [records, setRecords] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const navigate = useNavigate();

  // Modal state
  const [selectedRecord, setSelectedRecord] = useState<KycRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchKyc(statusFilter);
    if (result.ok && result.data) {
      setRecords(result.data);
    } else {
      setError(result.error || 'Failed to load KYC records');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const openReviewModal = (record: KycRecord) => {
    setSelectedRecord(record);
    setReviewStatus('approved');
    setRejectionReason('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setRejectionReason('');
  };

  const handleReview = async () => {
    if (!selectedRecord) return;
    setReviewing(true);
    const result = await reviewKyc(
      selectedRecord.id,
      reviewStatus,
      reviewStatus === 'rejected' ? rejectionReason : undefined
    );
    setReviewing(false);
    if (result.ok) {
      closeModal();
      fetchRecords(); // refresh list
    } else {
      alert(result.error || 'Review failed');
    }
  };

  const columns = [
    {
      key: 'userId',
      header: 'User ID',
      render: (row: KycRecord) => (
        <button
          onClick={() => navigate(`/admin/users/${row.userId}`)}
          className="text-dispatch-accent hover:underline"
        >
          {row.userId.slice(0, 8)}…
        </button>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: KycRecord) => (
        <span
          className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full border ${
            row.status === 'pending'
              ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
              : row.status === 'approved'
              ? 'border-green-500/50 text-green-500 bg-green-500/10'
              : 'border-red-500/50 text-red-500 bg-red-500/10'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (row: KycRecord) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: KycRecord) => {
        if (row.status !== 'pending') {
          return <span className="text-xs text-dispatch-dim">Reviewed</span>;
        }
        return (
          <Button size="sm" onClick={() => openReviewModal(row)}>
            Review
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">KYC Verification</h1>
        <div className="flex items-center gap-2">
          <label className="text-xs text-dispatch-dim">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>
      </div>

      <AdminTable
        columns={columns}
        rows={records}
        loading={loading}
        error={error}
        emptyMessage="No KYC records found."
      />

      {/* Review Modal */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold">Review KYC</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-dispatch-dim">User ID:</span> {selectedRecord.userId}
              </p>
              <p>
                <span className="text-dispatch-dim">Submitted:</span>{' '}
                {new Date(selectedRecord.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="text-dispatch-dim">Documents:</span>{' '}
                {selectedRecord.documents.length} file(s)
              </p>
              {/* You can display document details if needed */}
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="radio"
                  value="approved"
                  checked={reviewStatus === 'approved'}
                  onChange={() => setReviewStatus('approved')}
                />
                Approve
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="radio"
                  value="rejected"
                  checked={reviewStatus === 'rejected'}
                  onChange={() => setReviewStatus('rejected')}
                />
                Reject
              </label>
              {reviewStatus === 'rejected' && (
                <div>
                  <label className="block text-xs text-dispatch-dim mb-1">Rejection reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
                    rows={3}
                    placeholder="Why is this rejected?"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={handleReview}
                loading={reviewing}
                disabled={reviewStatus === 'rejected' && !rejectionReason.trim()}
              >
                Submit review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}