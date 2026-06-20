// =============================================================================
// Audit Logs — Table Component
// =============================================================================
// Displays audit logs in a styled table using React Query for data fetching.
// Action badges are color-coded:
//   • INSERT      → aboitiz-success (green)
//   • UPDATE      → aboitiz-sand (accent)
//   • DELETE      → aboitiz-danger (red)
//   • SOFT_DELETE → aboitiz-danger (red, muted)
// =============================================================================

import type { AuditLog } from '../../../types';

// ─── Action Badge Color Mapping ──────────────────────────────────────────────

function getActionBadgeClasses(action: string): string {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase';

  switch (action) {
    case 'INSERT':
      return `${base} bg-aboitiz-success/15 text-aboitiz-success`;
    case 'UPDATE':
      return `${base} bg-aboitiz-sand/25 text-aboitiz-earth`;
    case 'DELETE':
      return `${base} bg-aboitiz-danger/15 text-aboitiz-danger`;
    case 'SOFT_DELETE':
      return `${base} bg-aboitiz-danger/10 text-aboitiz-danger/70`;
    default:
      return `${base} bg-aboitiz-primary/10 text-aboitiz-primary`;
  }
}

// ─── Date Formatter ──────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  total: number;
}

export default function AuditLogTable({
  logs,
  isLoading,
  isError,
  error,
  total,
}: AuditLogTableProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4" />
          <p className="text-sm text-aboitiz-primary">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-xl p-6 text-center">
        <p className="text-aboitiz-danger font-medium">Failed to load audit logs</p>
        <p className="text-sm text-aboitiz-danger/70 mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  // Empty State
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white/60 rounded-xl border border-aboitiz-primary/10 p-12 text-center">
        <p className="text-lg text-aboitiz-primary font-medium">No audit logs yet</p>
        <p className="text-sm text-aboitiz-primary/60 mt-1">
          Logs will appear here as database operations are performed.
        </p>
      </div>
    );
  }

  // Data Table
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-aboitiz-primary/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" id="audit-log-table">
          <thead>
            <tr className="border-b border-aboitiz-primary/10">
              <th className="px-5 py-3.5 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Action
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Table
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Record ID
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aboitiz-primary/5">
            {logs.map((log: AuditLog) => (
              <tr
                key={log.id}
                className="hover:bg-aboitiz-secondary/10 transition-colors duration-150 group"
              >
                <td className="px-5 py-3 text-sm text-aboitiz-textDark font-mono">
                  {log.id}
                </td>
                <td className="px-5 py-3">
                  <span className={getActionBadgeClasses(log.action)}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-aboitiz-textDark">
                  {log.tableName}
                </td>
                <td className="px-5 py-3 text-sm text-aboitiz-primary font-mono">
                  #{log.recordId}
                </td>
                <td className="px-5 py-3 text-sm text-aboitiz-primary">
                  {formatDate(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-5 py-3 border-t border-aboitiz-primary/10 bg-aboitiz-bgLight/50">
        <p className="text-xs text-aboitiz-primary">
          Showing {logs.length} logs on this page (Total {total} entries)
        </p>
      </div>
    </div>
  );
}
