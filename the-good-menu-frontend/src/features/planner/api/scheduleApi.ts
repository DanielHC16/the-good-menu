// =============================================================================
// Planner — Schedule API Layer
// =============================================================================
// CRUD functions for the /schedules endpoint using the centralized Axios instance.
// Payloads are sanitized to match the backend CreateScheduleDto exactly:
//   { userId, mealId, scheduledDate, timeSlot }
// =============================================================================

import api from '../../../hooks/useApi';
import type { Schedule, TimeSlot } from '../../../types';

// ─── Request Payload Types ────────────────────────────────────────────────────

export interface SchedulePayload {
  userId: number;
  mealId: number;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetches all schedules (with eager-loaded meal relation).
 * GET /schedules
 */
export async function getSchedules(): Promise<Schedule[]> {
  const { data } = await api.get<Schedule[]>('/schedules');
  return data;
}

/**
 * Creates a new schedule entry.
 * POST /schedules
 */
export async function createSchedule(payload: SchedulePayload): Promise<Schedule> {
  const sanitized = {
    userId: Number(payload.userId),
    mealId: Number(payload.mealId),
    scheduledDate: payload.scheduledDate,
    timeSlot: payload.timeSlot,
  };
  const { data } = await api.post<Schedule>('/schedules', sanitized);
  return data;
}

/**
 * Updates an existing schedule by ID.
 * PATCH /schedules/:id
 */
export async function updateSchedule(id: number, payload: Partial<SchedulePayload>): Promise<Schedule> {
  const sanitized: Record<string, unknown> = {};
  if (payload.userId !== undefined) sanitized.userId = Number(payload.userId);
  if (payload.mealId !== undefined) sanitized.mealId = Number(payload.mealId);
  if (payload.scheduledDate !== undefined) sanitized.scheduledDate = payload.scheduledDate;
  if (payload.timeSlot !== undefined) sanitized.timeSlot = payload.timeSlot;

  const { data } = await api.patch<Schedule>(`/schedules/${id}`, sanitized);
  return data;
}

/**
 * Hard-deletes a schedule by ID.
 * DELETE /schedules/:id
 */
export async function deleteSchedule(id: number): Promise<void> {
  await api.delete(`/schedules/${id}`);
}
