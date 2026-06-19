// =============================================================================
// Meals — Meal Form Modal Component
// =============================================================================
// Handles both Create and Edit modes for a Meal.
// Complex form features:
//   • Standard text inputs for Name and Preparation Guide.
//   • Dynamic ingredients list: add/remove rows.
//   • Each ingredient row has a Product dropdown (fetched via useQuery)
//     and a Quantity text input.
//   • On success, 'meals' query is invalidated to refresh MealList.
// =============================================================================

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMeal, updateMeal, type MealPayload, type MealIngredientPayload } from '../api/mealApi';
import { getProducts } from '../../products/api/productApi';
import type { Meal, Product } from '../../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, opens in Edit mode pre-filled with this meal. */
  meal?: Meal | null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface IngredientRow {
  /** Unique key for React list rendering */
  _key: number;
  productId: number | null;
  quantity: string;
}

const newIngredientRow = (key: number): IngredientRow => ({
  _key: key,
  productId: null,
  quantity: '',
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function MealFormModal({ isOpen, onClose, meal }: MealFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(meal);

  const [name, setName] = useState('');
  const [preparationGuide, setPreparationGuide] = useState('');
  const [ingredients, setIngredients] = useState<IngredientRow[]>([newIngredientRow(0)]);
  const [nextKey, setNextKey] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // ─── Fetch Products for Dropdown ────────────────────────────────────────────
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: isOpen, // Only fetch when modal is open
  });

  // ─── Sync State on Prop Change ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (meal) {
      setName(meal.name);
      setPreparationGuide(meal.preparationGuide);
      if (meal.ingredients && meal.ingredients.length > 0) {
        const rows: IngredientRow[] = meal.ingredients.map((ing, i) => ({
          _key: i,
          productId: ing.productId,
          quantity: ing.quantity,
        }));
        setIngredients(rows);
        setNextKey(rows.length);
      } else {
        setIngredients([newIngredientRow(0)]);
        setNextKey(1);
      }
    } else {
      setName('');
      setPreparationGuide('');
      setIngredients([newIngredientRow(0)]);
      setNextKey(1);
    }
    setError(null);
  }, [meal, isOpen]);

  // ─── Ingredient Handlers ─────────────────────────────────────────────────────

  function addIngredient() {
    setIngredients((prev) => [...prev, newIngredientRow(nextKey)]);
    setNextKey((k) => k + 1);
  }

  function removeIngredient(key: number) {
    setIngredients((prev) => prev.filter((row) => row._key !== key));
  }

  function updateIngredientProduct(key: number, productId: number | null) {
    setIngredients((prev) =>
      prev.map((row) => (row._key === key ? { ...row, productId } : row))
    );
  }

  function updateIngredientQuantity(key: number, quantity: string) {
    setIngredients((prev) =>
      prev.map((row) => (row._key === key ? { ...row, quantity } : row))
    );
  }

  // ─── Build Payload ───────────────────────────────────────────────────────────

  function buildPayload(): MealPayload {
    const ingredientPayloads: MealIngredientPayload[] = ingredients
      .filter((row) => row.productId !== null || row.quantity.trim() !== '')
      .map((row) => ({
        productId: row.productId,
        quantity: row.quantity.trim(),
      }));

    return {
      name: name.trim(),
      preparationGuide: preparationGuide.trim(),
      ingredients: ingredientPayloads,
    };
  }

  // ─── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (payload: MealPayload) => createMeal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to create meal.'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: MealPayload) => updateMeal(meal!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to update meal.'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Meal name is required.');
      return;
    }

    const payload = buildPayload();
    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  if (!isOpen) return null;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-aboitiz-textDark/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-aboitiz-primary/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/50 rounded-t-2xl flex-shrink-0">
          <div>
            <h2 id="meal-modal-title" className="text-lg font-semibold text-aboitiz-textDark">
              {isEditMode ? '✏️ Edit Meal' : '🍽️ Create New Meal'}
            </h2>
            <p className="text-xs text-aboitiz-primary mt-0.5">
              {isEditMode ? `Editing "${meal?.name}"` : 'Define a meal recipe with ingredients from the catalog.'}
            </p>
          </div>
          <button
            onClick={onClose}
            id="meal-modal-close-btn"
            className="p-2 rounded-lg text-aboitiz-primary hover:bg-aboitiz-primary/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-lg px-4 py-3 text-sm text-aboitiz-danger">
              {error}
            </div>
          )}

          {/* Meal Name */}
          <div>
            <label htmlFor="meal-name" className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Meal Name <span className="text-aboitiz-danger">*</span>
            </label>
            <input
              id="meal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sinigang na Baboy"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                         text-sm text-aboitiz-textDark placeholder-aboitiz-primary/40
                         focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                         transition duration-150"
            />
          </div>

          {/* Preparation Guide */}
          <div>
            <label htmlFor="meal-prep-guide" className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
              Preparation Guide
            </label>
            <textarea
              id="meal-prep-guide"
              value={preparationGuide}
              onChange={(e) => setPreparationGuide(e.target.value)}
              placeholder="Describe the cooking steps…"
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                         text-sm text-aboitiz-textDark placeholder-aboitiz-primary/40
                         focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                         transition duration-150 resize-none"
            />
          </div>

          {/* Dynamic Ingredients Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Ingredients
              </p>
              <button
                type="button"
                id="meal-add-ingredient-btn"
                onClick={addIngredient}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-aboitiz-earth
                           hover:text-aboitiz-earth/80 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Ingredient
              </button>
            </div>

            {/* Loading products */}
            {productsLoading && (
              <p className="text-xs text-aboitiz-primary/60 italic mb-2">Loading product catalog…</p>
            )}

            <div className="space-y-2.5">
              {ingredients.map((row, index) => (
                <div key={row._key} className="flex items-center gap-2">
                  {/* Product Dropdown */}
                  <select
                    id={`meal-ingredient-product-${row._key}`}
                    value={row.productId ?? ''}
                    onChange={(e) =>
                      updateIngredientProduct(
                        row._key,
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                    className="flex-1 px-3 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                               text-sm text-aboitiz-textDark
                               focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                               transition duration-150"
                  >
                    <option value="">Select a product…</option>
                    {products.map((p: Product) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* Quantity Input */}
                  <input
                    id={`meal-ingredient-qty-${row._key}`}
                    type="text"
                    value={row.quantity}
                    onChange={(e) => updateIngredientQuantity(row._key, e.target.value)}
                    placeholder="e.g., 500g"
                    className="w-28 px-3 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                               text-sm text-aboitiz-textDark placeholder-aboitiz-primary/40
                               focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                               transition duration-150"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    id={`meal-remove-ingredient-btn-${row._key}`}
                    onClick={() => removeIngredient(row._key)}
                    disabled={ingredients.length === 1 && index === 0}
                    className="p-2 rounded-lg text-aboitiz-danger/60 hover:text-aboitiz-danger hover:bg-aboitiz-danger/10
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-colors flex-shrink-0"
                    aria-label="Remove ingredient"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-aboitiz-primary/10 bg-aboitiz-bgLight/30 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            id="meal-form-cancel-btn"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-aboitiz-primary
                       border border-aboitiz-primary/20 hover:bg-aboitiz-bgLight transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="meal-form"
            id="meal-form-submit-btn"
            disabled={isPending}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                       bg-aboitiz-primary hover:bg-aboitiz-primary/90
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors shadow-sm"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </span>
            ) : isEditMode ? (
              'Save Changes'
            ) : (
              'Create Meal'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
