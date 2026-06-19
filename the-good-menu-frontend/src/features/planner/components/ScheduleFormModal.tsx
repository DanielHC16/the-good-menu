// =============================================================================
// Planner — Schedule Form Modal Component
// =============================================================================
// Handles both Create and Edit modes for a schedule entry.
// Features:
//   • useQuery to fetch Meals list for a <select> dropdown.
//   • HTML <input type="date"> for scheduledDate.
//   • <select> for timeSlot (Breakfast, Lunch, Dinner).
//   • Reads current userId from useAuth context.
//   • On success, invalidates 'schedules' query to refresh the list.
// =============================================================================

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSchedule, updateSchedule, type SchedulePayload } from '../api/scheduleApi';
import { getMeals } from '../../meals/api/mealApi';
import { useAuth } from '../../../hooks/useAuth';
import type { Meal, Schedule, TimeSlot } from '../../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, opens in Edit mode pre-filled with this schedule. */
  schedule?: Schedule | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_SLOTS: TimeSlot[] = ['Breakfast', 'Lunch', 'Dinner'];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScheduleFormModal({ isOpen, onClose, schedule }: ScheduleFormModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditMode = Boolean(schedule);

  const [mealId, setMealId] = useState<number | ''>('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('Breakfast');
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch Meals for Dropdown ───────────────────────────────────────────────
  const { data: meals = [], isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: ['meals'],
    queryFn: getMeals,
    enabled: isOpen,
  });

  // ─── Sync State on Prop Change ──────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (schedule) {
      setMealId(schedule.mealId);
      // Backend may return scheduledDate as full ISO — extract the date portion
      setScheduledDate(schedule.scheduledDate.split('T')[0]);
      setTimeSlot(schedule.timeSlot);
    } else {
      setMealId('');
      setScheduledDate('');
      setTimeSlot('Breakfast');
    }
    setError(null);
  }, [schedule, isOpen]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (payload: SchedulePayload) => createSchedule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to schedule meal.'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SchedulePayload>) => updateSchedule(schedule!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to update schedule.'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ─── Submit ─────────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!mealId) {
      setError('Please select a meal.');
      return;
    }
    if (!scheduledDate) {
      setError('Please select a date.');
      return;
    }
    if (!user?.id) {
      setError('Authentication error — no user ID found.');
      return;
    }

    const payload: SchedulePayload = {
      userId: user.id,
      mealId: Number(mealId),
      scheduledDate,
      timeSlot,
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  if (!isOpen) return null;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-aboitiz-textDark/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-aboitiz-primary/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/50">
          <div>
            <h2 id="schedule-modal-title" className="text-lg font-semibold text-aboitiz-textDark">
              {isEditMode ? '✏️ Edit Schedule' : '📅 Schedule a Meal'}
            </h2>
            <p className="text-xs text-aboitiz-primary mt-0.5">
              {isEditMode
                ? 'Update the scheduled date, time slot, or meal.'
                : 'Pick a meal, a date, and a time slot to add it to your plan.'}
            </p>
          </div>
          <button
            onClick={onClose}
            id="schedule-modal-close-btn"
            className="p-2 rounded-lg text-aboitiz-primary hover:bg-aboitiz-primary/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-lg px-4 py-3 text-sm text-aboitiz-danger">
              {error}
            </div>
          )}

          {/* Meal Dropdown */}
          <div>
            <label htmlFor="schedule-meal" className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Meal <span className="text-aboitiz-danger">*</span>
            </label>
            {mealsLoading ? (
              <p className="text-xs text-aboitiz-primary/60 italic">Loading meals…</p>
            ) : (
              <select
                id="schedule-meal"
                value={mealId}
                onChange={(e) => setMealId(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                           text-sm text-aboitiz-textDark
                           focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                           transition duration-150"
              >
                <option value="">Select a meal…</option>
                {meals.map((m: Meal) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label htmlFor="schedule-date" className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Date <span className="text-aboitiz-danger">*</span>
            </label>
            <input
              id="schedule-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                         text-sm text-aboitiz-textDark
                         focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                         transition duration-150"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label htmlFor="schedule-time-slot" className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Time Slot <span className="text-aboitiz-danger">*</span>
            </label>
            <select
              id="schedule-time-slot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                         text-sm text-aboitiz-textDark
                         focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                         transition duration-150"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              id="schedule-form-cancel-btn"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-aboitiz-primary
                         border border-aboitiz-primary/20 hover:bg-aboitiz-bgLight transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="schedule-form-submit-btn"
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                         bg-aboitiz-earth hover:bg-aboitiz-earth/90
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-colors shadow-sm"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </span>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Schedule Meal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
