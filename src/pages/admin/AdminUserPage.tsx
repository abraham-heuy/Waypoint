import { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { fetchAdminUsers, type AdminUser } from '../../lib/adminApi';
import { useNavigate } from 'react-router-dom';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminUsers()
      .then((res) => {
        if (res.ok && res.data) setUsers(res.data);
        else setError(res.error || 'Failed to load users');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'tier', header: 'Tier', render: (row: AdminUser) => <span className="capitalize">{row.tier}</span> },
    { key: 'credits', header: 'Credits' },
    { key: 'segment', header: 'Segment', render: (row: AdminUser) => row.segment || '—' },
    { key: 'isActive', header: 'Status', render: (row: AdminUser) => (row.isActive ? 'Active' : 'Inactive') },
    { key: 'createdAt', header: 'Joined', render: (row: AdminUser) => new Date(row.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Users</h1>
      <AdminTable
        columns={columns}
        rows={users}
        loading={loading}
        error={error}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        emptyMessage="No users found."
      />
    </div>
  );
}