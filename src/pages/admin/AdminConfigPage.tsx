import { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/primitives';
import {
  fetchConfig,
  upsertConfig,
  deleteConfig,
  type PlatformConfig,
} from '../../lib/adminApi';
import { toast } from '../../store/toastStore';

export default function AdminConfigPage() {
  const [configs, setConfigs] = useState<PlatformConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  // Modal state for edit/add
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const loadConfigs = async () => {
    setLoading(true);
    const result = await fetchConfig();
    setLoading(false);
    if (result.ok && result.data) {
      setConfigs(result.data);
      setIsMock(false);
    } else {
      // If no real data, we can show mock for demonstration
      // But we'll just show empty state with a message.
      setConfigs([]);
      setIsMock(true);
      setError(null);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const openEditModal = (config: PlatformConfig) => {
    setEditingKey(config.key);
    setFormKey(config.key);
    setFormValue(JSON.stringify(config.value, null, 2));
    setFormDescription(config.description || '');
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingKey(null);
    setFormKey('');
    setFormValue('{}');
    setFormDescription('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingKey(null);
    setFormKey('');
    setFormValue('');
    setFormDescription('');
  };

  const handleSubmit = async () => {
    if (!formKey.trim()) {
      toast.error('Key is required');
      return;
    }
    try {
      const parsedValue = JSON.parse(formValue);
      setSubmitting(true);
      const result = await upsertConfig(formKey.trim(), parsedValue, formDescription || undefined);
      setSubmitting(false);
      if (result.ok) {
        toast.success(`Config "${formKey}" saved`);
        loadConfigs();
        closeModal();
      } else {
        toast.error(result.error || 'Failed to save config');
      }
    } catch (e) {
      setSubmitting(false);
      toast.error('Invalid JSON value');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete config "${key}"?`)) return;
    const result = await deleteConfig(key);
    if (result.ok) {
      toast.success(`Config "${key}" deleted`);
      loadConfigs();
    } else {
      toast.error(result.error || 'Failed to delete');
    }
  };

  const columns = [
    { key: 'key', header: 'Key' },
    {
      key: 'value',
      header: 'Value',
      render: (row: PlatformConfig) => (
        <div className="text-xs font-mono truncate max-w-xs">
          {JSON.stringify(row.value).slice(0, 60)}
        </div>
      ),
    },
    { key: 'description', header: 'Description', render: (row: PlatformConfig) => row.description || '—' },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (row: PlatformConfig) => new Date(row.updatedAt).toLocaleString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: PlatformConfig) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleDelete(row.key)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-dispatch-dim text-sm">Loading config…</div>;
  if (error) return <div className="text-dispatch-danger text-sm">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Platform Config</h1>
        <Button size="sm" onClick={openAddModal}>Add new config</Button>
      </div>

      {isMock && configs.length === 0 && (
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3 text-sm text-yellow-800 dark:text-yellow-300">
          No config data found in the backend. You can add a new config to get started.
        </div>
      )}

      <AdminTable
        columns={columns}
        rows={configs}
        loading={false}
        error={null}
        emptyMessage="No configs found. Add one to get started."
      />

      {/* Edit/Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl max-w-2xl w-full p-6 space-y-4">
            <h2 className="text-lg font-bold">
              {editingKey ? `Edit config: ${editingKey}` : 'New config'}
            </h2>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">Key</label>
              <Input
                type="text"
                value={formKey}
                onChange={(e) => setFormKey(e.target.value)}
                placeholder="my.config.key"
                disabled={!!editingKey}
              />
            </div>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">Value (JSON)</label>
              <textarea
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm font-mono focus:border-dispatch-accent focus:outline-none"
                placeholder='{"key": "value"}'
              />
            </div>
            <div>
              <label className="block text-xs text-dispatch-dim mb-1">Description</label>
              <Input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="What this config does"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSubmit} loading={submitting}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}