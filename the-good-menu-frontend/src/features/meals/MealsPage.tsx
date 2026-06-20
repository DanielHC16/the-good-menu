// =============================================================================
// Meals — Page Component
// =============================================================================
// Top-level page for the /meals route.
// Manages modal state and passes selected meal for edit mode.
// =============================================================================

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMeals } from './api/mealApi';
import MealList from './components/MealList';
import MealFormModal from './components/MealFormModal';
import type { Meal } from '../../types';
import { Utensils, RefreshCw } from 'lucide-react';
import SkeletonTable from '../../components/ui/SkeletonTable';

export default function MealsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const {
    data: meals = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Meal[]>({
    queryKey: ['meals'],
    queryFn: getMeals,
  });

  const filteredAndSortedMeals = meals
    .filter((meal) => meal.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      // 'newest'
      return b.id - a.id;
    });

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-aboitiz-primary/20 text-aboitiz-primary hover:bg-aboitiz-secondary/10 hover:text-aboitiz-earth transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="meals-page-create-btn"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-primary text-white
                       text-sm font-semibold hover:bg-aboitiz-primary/90 active:scale-95
                       transition-all duration-150 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Meal
          </button>
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/60 p-4 rounded-xl border border-aboitiz-primary/10 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1">
            Search Meals
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type recipe name..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-aboitiz-primary/20 bg-white/80 focus:outline-none focus:ring-1 focus:ring-aboitiz-earth"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-aboitiz-primary/20 bg-white/80 focus:outline-none focus:ring-1 focus:ring-aboitiz-earth"
          >
            <option value="newest">Newest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Meal List Grid */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <MealList
            meals={filteredAndSortedMeals}
            isLoading={false}
            isError={isError}
            error={error}
            onEdit={handleEdit}
            onAddNew={handleCreateNew}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <MealFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        meal={selectedMeal}
      />
    </div>
  );
}
