// =============================================================================
// Meals — Page Component
// =============================================================================
// Top-level page for the /meals route.
// Manages modal state and passes selected meal for edit mode.
// =============================================================================

import { useState } from 'react';
import MealList from './components/MealList';
import MealFormModal from './components/MealFormModal';
import type { Meal } from '../../types';
import { Utensils } from 'lucide-react';

export default function MealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  function handleCreateNew() {
    setSelectedMeal(null);
    setIsModalOpen(true);
  }

  function handleEdit(meal: Meal) {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMeal(null);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
            <Utensils className="w-6 h-6 text-aboitiz-primary" />
            Meal Recipes
          </h1>
          <p className="text-sm text-aboitiz-primary mt-1">
            Create and manage meal recipes using Aboitiz Food products as ingredients.
          </p>
        </div>

        <button
          id="meals-page-create-btn"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-primary text-white
                     text-sm font-semibold hover:bg-aboitiz-primary/90 active:scale-95
                     transition-all duration-150 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Meal
        </button>
      </div>

      {/* Meal List Grid */}
      <MealList onEdit={handleEdit} onAddNew={handleCreateNew} />

      {/* Create / Edit Modal */}
      <MealFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        meal={selectedMeal}
      />
    </div>
  );
}
