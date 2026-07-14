// components/admin/AdminTable.tsx
import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export default function AdminTable<T extends Record<string, any>>({
  columns,
  rows,
  onRowClick,
  loading = false,
  error = null,
  emptyMessage = 'No items found.',
}: AdminTableProps<T>) {
  if (loading) {
    return <div className="text-dispatch-dim text-sm">Loading…</div>;
  }
  if (error) {
    return <div className="text-dispatch-danger text-sm">{error}</div>;
  }
  if (rows.length === 0) {
    return <div className="text-dispatch-dim text-sm">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-dispatch-line">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left py-3 px-3 font-mono text-xs uppercase tracking-wider text-dispatch-dim">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-dispatch-line/50 hover:bg-dispatch-panel2 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3 px-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}