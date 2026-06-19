// =============================================================================
// Planner — Schedule List Component
// =============================================================================
// Displays all scheduled meals grouped by date, ordered within each date
// by time slot (Breakfast → Lunch → Dinner).
// Features:
//   • Loading spinner while fetching.
//   • Empty state with call-to-action.
//   • Edit and Delete action buttons per schedule row.
//   • Delete uses useMutation and invalidates 'schedules' query on success.
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSchedules, deleteSchedule } from '../api/scheduleApi';
import type { Schedule, TimeSlot } from '../../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  onEdit: (schedule: Schedule) => void;
  onAddNew: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIME_SLOT_ORDER: Record<TimeSlot, number> = {
  Breakfast: 0,
  Lunch: 1,
  Dinner: 2,
};

const TIME_SLOT_EMOJI: Record<TimeSlot, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00'); // Treat as local
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Groups schedules by date, then sorts each group by time slot order. */
function groupByDate(schedules: Schedule[]): Map<string, Schedule[]> {
  const map = new Map<string, Schedule[]>();

  // Sort all schedules by date first, then time slot
  const sorted = [...schedules].sort((a, b) => {
    const dateCompare = a.scheduledDate.localeCompare(b.scheduledDate);
    if (dateCompare !== 0) return dateCompare;
    return TIME_SLOT_ORDER[a.timeSlot] - TIME_SLOT_ORDER[b.timeSlot];
  });

  for (const s of sorted) {
    const dateKey = s.scheduledDate.split('T')[0]; // Normalize to YYYY-MM-DD
    if (!map.has(dateKey)) {
      map.set(dateKey, []);
    }
    map.get(dateKey)!.push(s);
  }

  return map;
}

// ─── Time Slot Badge ──────────────────────────────────────────────────────────

function TimeSlotBadge({ slot }: { slot: TimeSlot }) {
  const colors: Record<TimeSlot, string> = {
    Breakfast: 'bg-aboitiz-sand/30 text-aboitiz-earth',
    Lunch: 'bg-aboitiz-secondary/25 text-aboitiz-textDark',
    Dinner: 'bg-aboitiz-primary/15 text-aboitiz-primary',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors[slot]}`}
    >
      {TIME_SLOT_EMOJI[slot]} {slot}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScheduleList({ onEdit, onAddNew }: ScheduleListProps) {
  const queryClient = useQueryClient();

  const {
    data: schedules,
    isLoading,
    isError,
    error,
  } = useQuery<Schedule[]>({
    queryKey: ['schedules'],
    queryFn: getSchedules,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  function handleDelete(schedule: Schedule) {
    const mealName = schedule.meal?.name ?? `Meal #${schedule.mealId}`;
    if (
      window.confirm(
        `Remove "${mealName}" from ${schedule.timeSlot} on ${formatDate(schedule.scheduledDate.split('T')[0])}?`
      )
    ) {
      deleteMutation.mutate(schedule.id);
    }
  }

  // ─── Loading State ───────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-aboitiz-secondary mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-aboitiz-primary">Loading your schedule…</p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-xl p-6 text-center">
        <p className="text-aboitiz-danger font-medium">Failed to load schedules</p>
        <p className="text-sm text-aboitiz-danger/70 mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────────────────────────────────

  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-white/60 rounded-xl border border-aboitiz-primary/10 p-16 text-center">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-lg font-semibold text-aboitiz-textDark">No meals scheduled yet</p>
        <p className="text-sm text-aboitiz-primary mt-1 mb-6">
          Start planning your week by scheduling your first meal.
        </p>
        <button
          id="schedule-list-empty-add-btn"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aboitiz-earth text-white text-sm font-semibold hover:bg-aboitiz-earth/90 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule First Meal
        </button>
      </div>
    );
  }

  // ─── Grouped List ────────────────────────────────────────────────────────────

  const grouped = groupByDate(schedules);

  return (
    <div className="space-y-6" id="schedule-list">
      {Array.from(grouped.entries()).map(([dateKey, daySchedules]) => (
        <div
          key={dateKey}
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-aboitiz-primary/10 shadow-sm overflow-hidden"
        >
          {/* Date Header */}
          <div className="px-5 py-4 border-b border-aboitiz-primary/10 bg-gradient-to-r from-aboitiz-earth/90 to-aboitiz-earth">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              📆 {formatDate(dateKey)}
            </h3>
          </div>

          {/* Rows */}
          <div className="divide-y divide-aboitiz-primary/5">
            {daySchedules.map((s) => (
              <div
                key={s.id}
                id={`schedule-row-${s.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-aboitiz-secondary/5 transition-colors duration-150"
              >
                {/* Time Slot Badge */}
                <TimeSlotBadge slot={s.timeSlot} />

                {/* Middle text container (Meal Name and Schedule ID) */}
                <div className="flex flex-col flex-1 justify-center min-w-0">
                  <p className="text-sm font-semibold text-aboitiz-textDark truncate">
                    {s.meal?.name ?? `Meal #${s.mealId}`}
                  </p>
                  <p className="text-xs text-aboitiz-primary mt-0.5">
                    Schedule #{s.id}
                  </p>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    id={`schedule-edit-btn-${s.id}`}
                    onClick={() => onEdit(s)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-earth
                               border border-aboitiz-earth/30 hover:bg-aboitiz-earth/10
                               transition-colors duration-150"
                  >
                    Edit
                  </button>
                  <button
                    id={`schedule-delete-btn-${s.id}`}
                    onClick={() => handleDelete(s)}
                    disabled={deleteMutation.isPending}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-danger
                               border border-aboitiz-danger/30 hover:bg-aboitiz-danger/10
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-aboitiz-primary">
        Showing {schedules.length} scheduled meal{schedules.length !== 1 ? 's' : ''} across{' '}
        {grouped.size} day{grouped.size !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
