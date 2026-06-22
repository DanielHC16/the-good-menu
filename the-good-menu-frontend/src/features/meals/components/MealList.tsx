// =============================================================================
// Meals — Meal List Component
// =============================================================================
// Displays all meals as a responsive card grid using React Query.
// Each card shows: Meal name, preparation guide preview, ingredient list.
// Features:
//   • Loading spinner while fetching.
//   • Empty state with a call-to-action.
//   • Edit and Delete action buttons per card.
//   • Delete uses useMutation and invalidates 'meals' query on success.
// =============================================================================

import type { Meal, MealIngredient } from '../../../types';
import { Utensils } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MealListProps {
  meals: Meal[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  onEdit: (meal: Meal) => void;
  onAddNew: () => void;
  onDelete: (meal: Meal) => void;
  isDeleting: boolean;
}

// ─── Ingredient Row ───────────────────────────────────────────────────────────

function IngredientRow({ ingredient }: { ingredient: MealIngredient }) {
  const name = ingredient.product?.name ?? ingredient.customIngredientName ?? 'Unknown ingredient';
  return (
    <li className="flex items-center gap-2 text-sm text-aboitiz-textDark">
      <span className="w-1.5 h-1.5 rounded-full bg-aboitiz-secondary flex-shrink-0" />
      <span className="truncate">{name}</span>
      <span className="ml-auto text-xs text-aboitiz-primary flex-shrink-0">{ingredient.quantity}</span>
    </li>
  );
}

// ─── Meal Card ────────────────────────────────────────────────────────────────

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
  isDeleting: boolean;
}

function MealCard({ meal, onEdit, onDelete, isDeleting }: MealCardProps) {
  const GUIDE_PREVIEW_LENGTH = 140;
  const guide =
    meal.preparationGuide.length > GUIDE_PREVIEW_LENGTH
      ? `${meal.preparationGuide.slice(0, GUIDE_PREVIEW_LENGTH)}…`
      : meal.preparationGuide;

  return (
    <div
      id={`meal-card-${meal.id}`}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10
                 shadow-sm hover:shadow-md hover:-translate-y-0.5
                 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-br from-aboitiz-earth/90 to-aboitiz-earth px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white leading-tight line-clamp-2">
            {meal.name}
          </h3>
          <span className="flex-shrink-0 text-xs font-medium text-white/60 bg-white/10 rounded-full px-2 py-0.5">
            #{meal.id}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 px-5 py-4 space-y-4">
        {/* Preparation Guide Preview */}
        {guide && (
          <div>
            <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Preparation Guide
            </p>
            <p className="text-sm text-aboitiz-textDark/80 leading-relaxed">{guide}</p>
          </div>
        )}

        {/* Ingredients */}
        <div>
          <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-2">
            Ingredients ({meal.ingredients?.length ?? 0})
          </p>
          {meal.ingredients && meal.ingredients.length > 0 ? (
            <ul className="space-y-1.5">
              {meal.ingredients.slice(0, 5).map((ing) => (
                <IngredientRow key={ing.id} ingredient={ing} />
              ))}
              {meal.ingredients.length > 5 && (
                <li className="text-xs text-aboitiz-primary pl-3.5">
                  +{meal.ingredients.length - 5} more ingredient{meal.ingredients.length - 5 !== 1 ? 's' : ''}
                </li>
              )}
            </ul>
          ) : (
            <p className="text-xs text-aboitiz-primary/60 italic">No ingredients added yet.</p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 border-t border-aboitiz-primary/8 bg-aboitiz-bgLight/30 flex items-center justify-end gap-2">
        <button
          id={`meal-edit-btn-${meal.id}`}
          onClick={() => onEdit(meal)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-earth
                     border border-aboitiz-earth/30 hover:bg-aboitiz-earth/10
                     transition-colors duration-150"
        >
          Edit
        </button>
        <button
          id={`meal-delete-btn-${meal.id}`}
          onClick={() => onDelete(meal)}
          disabled={isDeleting}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-danger
                     border border-aboitiz-danger/30 hover:bg-aboitiz-danger/10
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MealList({
  meals,
  isLoading,
  isError,
  error,
  onEdit,
  onAddNew,
  onDelete,
  isDeleting,
}: MealListProps) {
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
          <p className="text-sm text-aboitiz-primary">Loading meal recipes...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-xl p-6 text-center">
        <p className="text-aboitiz-danger font-medium">Failed to load meals</p>
        <p className="text-sm text-aboitiz-danger/70 mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────────────────────────────────

  if (!meals || meals.length === 0) {
    return (
      <div className="bg-white/60 rounded-xl border border-aboitiz-primary/10 p-16 text-center">
        <div className="mb-4 flex justify-center">
          <Utensils className="w-12 h-12 text-aboitiz-primary/40" />
        </div>
        <p className="text-lg font-semibold text-aboitiz-textDark">No meals found</p>
        <p className="text-sm text-aboitiz-primary mt-1 mb-6">
          Create your first meal recipe to get started planning your menu.
        </p>
        <button
          id="meal-list-empty-add-btn"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aboitiz-primary text-white text-sm font-semibold hover:bg-aboitiz-primary/90 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create First Meal
        </button>
      </div>
    );
  }

  // ─── Card Grid ───────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="meal-list-grid">
        {meals.map((meal: Meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>
      <p className="text-xs text-aboitiz-primary mt-4">
        Showing {meals.length} meal{meals.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
