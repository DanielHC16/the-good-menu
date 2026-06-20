import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAuditLogs } from './api/getAuditLogs';
import AuditLogTable from './components/AuditLogTable';
import { ShieldAlert, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import SkeletonTable from '../../components/ui/SkeletonTable';

export default function AuditLogsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['audit-logs', page, limit],
    queryFn: () => getAuditLogs(page, limit),
  });

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-aboitiz-primary" />
            Audit Logs
          </h1>
          <p className="text-sm text-aboitiz-primary mt-1">
            Immutable record of all database operations tracked by The Watchtower.
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['audit-logs'] })}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-aboitiz-primary/20 text-aboitiz-primary hover:bg-aboitiz-secondary/10 hover:text-aboitiz-earth transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          title="Refresh logs"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="min-h-[600px]">
        {isLoading ? (
          <SkeletonTable rowCount={10} />
        ) : (
          <AuditLogTable
            logs={logs}
            isLoading={false}
            isError={isError}
            error={error}
            total={total}
          />
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 bg-white/70 backdrop-blur-sm rounded-xl border border-aboitiz-primary/10 px-5 py-3 shadow-sm">
        <p className="text-xs text-aboitiz-primary font-medium">
          Page {page} of {totalPages} (Total: {total} entries)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1 || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-aboitiz-primary/20 text-xs font-semibold text-aboitiz-textDark hover:bg-aboitiz-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-aboitiz-primary/20 text-xs font-semibold text-aboitiz-textDark hover:bg-aboitiz-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm cursor-pointer"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
