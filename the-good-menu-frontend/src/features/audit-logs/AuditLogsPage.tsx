// =============================================================================
// Audit Logs — Page Component
// =============================================================================
// Top-level page for the /audit-logs route.
// Renders the page header and the AuditLogTable component.
// =============================================================================

import AuditLogTable from './components/AuditLogTable';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-aboitiz-textDark">
          📋 Audit Logs
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
