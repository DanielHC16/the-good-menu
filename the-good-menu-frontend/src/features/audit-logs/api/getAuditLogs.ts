// =============================================================================
// Audit Logs — API Layer
// =============================================================================
// Fetches audit logs from GET /audit-logs using the centralized Axios instance.
// =============================================================================

import api from '../../../hooks/useApi';
import type { AuditLog } from '../../../types';

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetches audit log entries from the backend with pagination.
 */
export async function getAuditLogs(page: number = 1, limit: number = 10): Promise<PaginatedAuditLogs> {
  const { data } = await api.get<PaginatedAuditLogs>(`/audit-logs?page=${page}&limit=${limit}`);
  return data;
}
