// =============================================================================
// Planner — Page Component
// =============================================================================
// Top-level page for the /planner route.
// Manages modal state and passes selected schedule for edit mode.
// =============================================================================

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSchedule } from './api/scheduleApi';
import ScheduleList from './components/ScheduleList';
import ScheduleFormModal from './components/ScheduleFormModal';
import DeleteModal from '../../components/common/DeleteModal';
import type { Schedule } from '../../types';
import { CalendarDays } from 'lucide-react';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00'); // Treat as local
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  function handleScheduleMeal() {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  }

  function handleEdit(schedule: Schedule) {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  }

  function handleDeleteRequest(schedule: Schedule) {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  }

  function handleDeleteConfirm() {
    if (scheduleToDelete) {
      deleteMutation.mutate(scheduleToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  }

  function handleDeleteClose() {
    setIsDeleteModalOpen(false);
    setScheduleToDelete(null);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-aboitiz-primary" />
            Weekly Planner
          </h1>
          <p className="text-sm text-aboitiz-primary mt-1">
            Schedule your meals across the week and stay on track with your nutrition goals.
          </p>
        </div>

        <button
          id="planner-page-schedule-btn"
          onClick={handleScheduleMeal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-earth text-white
                     text-sm font-semibold hover:bg-aboitiz-earth/90 active:scale-95
                     transition-all duration-150 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule a Meal
        </button>
      </div>

      {/* Schedule List */}
      <ScheduleList
        onEdit={handleEdit}
        onAddNew={handleScheduleMeal}
        onDelete={handleDeleteRequest}
        isDeleting={deleteMutation.isPending}
      />

      {/* Create / Edit Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={selectedSchedule}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Remove Scheduled Meal"
        message={
          scheduleToDelete
            ? `Remove "${scheduleToDelete.meal?.name ?? `Meal #${scheduleToDelete.mealId}`}" from ${scheduleToDelete.timeSlot} on ${formatDate(scheduleToDelete.scheduledDate.split('T')[0])}?`
            : ''
        }
      />
    </div>
  );
}
