// =============================================================================
// Audit Logs — Page Component
// =============================================================================
// Top-level page for the /audit-logs route.
// Renders the page header and the AuditLogTable component.
// =============================================================================

import AuditLogTable from './components/AuditLogTable';
import { ShieldAlert } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-aboitiz-primary" />
          Audit Logs
        </h1>
        <p className="text-sm text-aboitiz-primary mt-1">
          Immutable record of all database operations tracked by The Watchtower.
        </p>
      </div>

      {/* Audit Log Table */}
      <AuditLogTable />
    </div>
  );
}
