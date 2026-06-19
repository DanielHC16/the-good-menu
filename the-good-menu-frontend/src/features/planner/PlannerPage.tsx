// =============================================================================
// Planner — Page Component
// =============================================================================
// Top-level page for the /planner route.
// Manages modal state and passes selected schedule for edit mode.
// =============================================================================

import { useState } from 'react';
import ScheduleList from './components/ScheduleList';
import ScheduleFormModal from './components/ScheduleFormModal';
import type { Schedule } from '../../types';

export default function PlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aboitiz-textDark">📅 Weekly Planner</h1>
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
      <ScheduleList onEdit={handleEdit} onAddNew={handleScheduleMeal} />

      {/* Create / Edit Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schedule={selectedSchedule}
      />
    </div>
  );
}
