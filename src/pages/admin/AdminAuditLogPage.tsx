import { useEffect, useState, useMemo } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/primitives';
import {
  fetchAuditLog,
  type AuditLogEntry,
} from '../../lib/adminApi';
import { toast } from '../../store/toastStore';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [adminIdFilter, setAdminIdFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [limit, setLimit] = useState(100);

  // Modal for viewing meta
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAuditLog(
      adminIdFilter || undefined,
      actionFilter || undefined,
      limit
    );
    setLoading(false);
    if (result.ok && result.data) {
      // Apply date filters client-side if needed (or backend supports them)
      let filtered = result.data;
      if (dateFrom) {
        const from = new Date(dateFrom);
        filtered = filtered.filter((l) => new Date(l.createdAt) >= from);
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        filtered = filtered.filter((l) => new Date(l.createdAt) <= to);
      }
      setLogs(filtered);
    } else {
      setError(result.error || 'Failed to load audit log');
    }
  };

  useEffect(() => {
    loadLogs();
  }, [adminIdFilter, actionFilter, limit]); 

  const openModal = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedLog(null);
  };

  const columns = [
    { key: 'adminId', header: 'Admin ID', render: (row: AuditLogEntry) => row.adminId.slice(0, 8) + '…' },
    { key: 'action', header: 'Action' },
    { key: 'targetType', header: 'Target Type', render: (row: AuditLogEntry) => row.targetType || '—' },
    { key: 'targetId', header: 'Target ID', render: (row: AuditLogEntry) => row.targetId ? row.targetId.slice(0, 8) + '…' : '—' },
    {
      key: 'meta',
      header: 'Meta',
      render: (row: AuditLogEntry) => (
        <button
          onClick={() => openModal(row)}
          className="text-xs text-dispatch-accent hover:underline"
        >
          View details
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: AuditLogEntry) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Audit Log</h1>
        <Button size="sm" onClick={loadLogs} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end p-4 rounded-lg border border-dispatch-line bg-dispatch-panel">
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Admin ID</label>
          <Input
            type="text"
            value={adminIdFilter}
            onChange={(e) => setAdminIdFilter(e.target.value)}
            placeholder="Admin ID"
            className="w-40"
          />
        </div>
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Action</label>
          <Input
            type="text"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="e.g. user.update"
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
        <div>
          <label className="text-xs text-dispatch-dim block mb-1">Limit</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setAdminIdFilter('');
            setActionFilter('');
            setDateFrom('');
            setDateTo('');
            setLimit(100);
          }}
        >
          Clear filters
        </Button>
      </div>

      {error && <div className="text-dispatch-danger text-sm">{error}</div>}

      <AdminTable
        columns={columns}
        rows={logs}
        loading={loading}
        error={null}
        emptyMessage="No audit log entries found."
      />

      {/* Meta details modal */}
      {modalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold">Audit entry details</h2>
              <button onClick={closeModal} className="text-dispatch-dim hover:text-dispatch-text">
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Admin ID</span>
                <span className="font-mono">{selectedLog.adminId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Action</span>
                <span>{selectedLog.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Target Type</span>
                <span>{selectedLog.targetType || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Target ID</span>
                <span>{selectedLog.targetId || '—'}</span>
              </div>
              <div>
                <span className="text-dispatch-dim">Meta</span>
                <pre className="mt-1 p-3 bg-dispatch-panel2 rounded border border-dispatch-line text-xs font-mono overflow-auto max-h-60 whitespace-pre-wrap">
                  {selectedLog.meta ? JSON.stringify(selectedLog.meta, null, 2) : '—'}
                </pre>
              </div>
              <div className="flex justify-between">
                <span className="text-dispatch-dim">Created at</span>
                <span>{new Date(selectedLog.createdAt).toLocaleString()}</span>
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