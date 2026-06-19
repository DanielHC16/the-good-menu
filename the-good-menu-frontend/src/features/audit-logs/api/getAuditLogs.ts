// =============================================================================
// Audit Logs — API Layer
// =============================================================================
// Fetches audit logs from GET /audit-logs using the centralized Axios instance.
// =============================================================================

import api from '../../../hooks/useApi';
import type { AuditLog } from '../../../types';

/**
 * Fetches all audit log entries from the backend.
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data } = await api.get<AuditLog[]>('/audit-logs');
  return data;
}
