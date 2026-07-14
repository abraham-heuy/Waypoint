import { useEffect, useState, useMemo } from 'react';
import StatCard from '../../components/admin/StatCard';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/primitives';
import {
  fetchFeedback,
  type FeedbackRecord,
} from '../../lib/adminApi';

// Helper to generate mock feedback (used only when endpoint returns no data)
function generateMockFeedback(): FeedbackRecord[] {
  const comments = [
    'Great route, saved me 20 minutes!',
    'Had some issues with the directions.',
    'Perfect, exactly as planned.',
    'The app is really helpful.',
    'Found a better route myself.',
    'I love the AI insights.',
    'The map is a bit slow.',
    'Very intuitive.',
    'Would recommend to others.',
    'The optimization is impressive.',
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: `fb_mock_${i + 1}`,
    userId: `usr_mock_${Math.floor(Math.random() * 10) + 1}`,
    routePlanId: Math.random() > 0.5 ? `route_mock_${i}` : null,
    score: Math.round((Math.random() * 4 + 1) * 10) / 10,
    comment: comments[Math.floor(Math.random() * comments.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  // Filters
  const [minScore, setMinScore] = useState<string>('');
  const [maxScore, setMaxScore] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal for expanding comment
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedback()
      .then((res) => {
        if (res.ok && res.data && res.data.length > 0) {
          setFeedback(res.data);
          setIsMock(false);
        } else {
          // No real data – use mock with warning
          setFeedback(generateMockFeedback());
          setIsMock(true);
        }
      })
      .catch(() => {
        // On network error, also fallback to mock
        setFeedback(generateMockFeedback());
        setIsMock(true);
        setError(null); // clear error because we have mock
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    let result = feedback;
    const min = parseFloat(minScore);
    const max = parseFloat(maxScore);
    if (!isNaN(min)) {
      result = result.filter((f) => f.score >= min);
    }
    if (!isNaN(max)) {
      result = result.filter((f) => f.score <= max);
    }
    if (userIdFilter) {
      result = result.filter((f) => f.userId.includes(userIdFilter));
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((f) => new Date(f.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((f) => new Date(f.createdAt) <= to);
    }
    return result;
  }, [feedback, minScore, maxScore, userIdFilter, dateFrom, dateTo]);

  // Stats
  const total = feedback.length;
  const avgScore = total > 0 ? feedback.reduce((s, f) => s + f.score, 0) / total : 0;
  const lowCount = feedback.filter((f) => f.score < 3).length;
  const highCount = feedback.filter((f) => f.score >= 4).length;

  // Score distribution (1-5)
  const distribution = Array.from({ length: 5 }, (_, i) => {
    const score = i + 1;
    const count = feedback.filter((f) => Math.round(f.score) === score).length;
    return { score, count };
  });
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  const openModal = (record: FeedbackRecord) => {
    setSelectedFeedback(record);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  if (loading) return <div className="text-dispatch-dim text-sm">Loading feedback…</div>;
  if (error) return <div className="text-dispatch-danger text-sm">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Feedback</h1>

      {/* Mock warning banner */}
      {isMock && (
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3 text-sm text-yellow-800 dark:text-yellow-300">
          ⚠️ No real feedback data found in the backend. Showing <strong>mock data</strong> for demonstration purposes only.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total feedback" value={total} />
        <StatCard label="Average score" value={avgScore.toFixed(1)} accent />
        <StatCard label="Low score (<3)" value={lowCount} />
        <StatCard label="High score (≥4)" value={highCount} accent />
      </div>

      {/* Score distribution */}
      <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
          Score distribution
        </div>
        <div className="flex items-end h-24 gap-2">
          {distribution.map((d) => (
            <div key={d.score} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-dispatch-accent rounded-t"
                style={{
                  height: `${(d.count / maxCount) * 80}px`,
                  opacity: 0.7 + (d.count / maxCount) * 0.3,
                }}
              />
              <span className="text-[10px] text-dispatch-dim mt-1">{d.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Min score</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Max score</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            className="w-24 px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
            placeholder="5"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">User ID</label>
          <Input
            type="text"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            placeholder="User ID"
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
            setMinScore('');
            setMaxScore('');
            setUserIdFilter('');
            setDateFrom('');
            setDateTo('');
          }}
        >
          Clear filters
        </Button>
      </div>

      {/* Feedback table */}
      <AdminTable
        columns={[
          { key: 'id', header: 'ID', render: (row: FeedbackRecord) => row.id.slice(0, 8) + '…' },
          { key: 'userId', header: 'User ID', render: (row: FeedbackRecord) => row.userId.slice(0, 8) + '…' },
          {
            key: 'score',
            header: 'Score',
            render: (row: FeedbackRecord) => (
              <span className={`font-mono ${row.score >= 4 ? 'text-green-500' : row.score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                {row.score.toFixed(1)}
              </span>
            ),
          },
          {
            key: 'comment',
            header: 'Comment',
            render: (row: FeedbackRecord) => (
              <div className="max-w-xs truncate text-dispatch-dim">
                {row.comment || '—'}
              </div>
            ),
          },
          {
            key: 'routePlanId',
            header: 'Route',
            render: (row: FeedbackRecord) => row.routePlanId ? row.routePlanId.slice(0, 8) + '…' : '—',
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row: FeedbackRecord) => new Date(row.createdAt).toLocaleDateString(),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row: FeedbackRecord) => (
              <Button size="sm" variant="secondary" onClick={() => openModal(row)}>
                View
              </Button>
            ),
          },
        ]}
        rows={filteredFeedback}
        loading={false}
        error={null}
        emptyMessage="No feedback matches the filters."
      />

      {/* View modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-lg w-full p-6 space-y-4">
            <h2 className="text-lg font-bold">Feedback details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dispatch-dim">ID</span>
                <span className="font-mono">{selectedFeedback.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">User</span>
                <span className="font-mono">{selectedFeedback.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Score</span>
                <span className={`font-mono ${selectedFeedback.score >= 4 ? 'text-green-500' : selectedFeedback.score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {selectedFeedback.score.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Route</span>
                <span className="font-mono">{selectedFeedback.routePlanId || '—'}</span>
              </div>
              <div>
                <span className="text-dispatch-dim">Comment</span>
                <p className="mt-1 p-3 bg-dispatch-panel2 rounded border border-dispatch-line whitespace-pre-wrap">
                  {selectedFeedback.comment || 'No comment provided.'}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Date</span>
                <span>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}