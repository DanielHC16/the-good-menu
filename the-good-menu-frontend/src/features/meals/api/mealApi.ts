// =============================================================================
// Meals — API Layer
// =============================================================================
// CRUD functions for the /meals endpoint using the centralized Axios instance.
// Create/Update payloads handle the nested `ingredients` array,
// mapping each ingredient to { productId, quantity } as required by the backend.
// =============================================================================

import api from '../../../hooks/useApi';
import type { Meal } from '../../../types';

// ─── Request Payload Types ────────────────────────────────────────────────────

export interface MealIngredientPayload {
  productId: number | null;
  quantity: string;
  /** Used when productId is null */
  customIngredientName?: string;
}

export interface MealPayload {
  name: string;
  preparationGuide: string;
  ingredients: MealIngredientPayload[];
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetches all meals with their full ingredient details.
 * GET /meals
 */
export async function getMeals(): Promise<Meal[]> {
  const { data } = await api.get<Meal[]>('/meals');
  return data;
}

/**
 * Creates a new meal with nested ingredients.
 * POST /meals
 * Each ingredient must include `productId` and `quantity`.
 */
export async function createMeal(payload: MealPayload): Promise<Meal> {
  const mappedIngredients = (payload.ingredients || []).map((ing) => {
    let productId: number | null = null;
    if (ing.productId !== null && ing.productId !== undefined) {
      const parsed = Number(ing.productId);
      if (!isNaN(parsed) && parsed > 0) {
        productId = parsed;
      }
    }
    const customIngredientName = (ing.customIngredientName && typeof ing.customIngredientName === 'string' && ing.customIngredientName.trim() !== '')
      ? ing.customIngredientName.trim()
      : null;

    return {
      productId,
      quantity: String(ing.quantity || ''),
      customIngredientName,
    };
  });

  const filteredIngredients = mappedIngredients.filter(
    (ing) => !(ing.productId === null && ing.customIngredientName === null)
  );

  const sanitized = {
    name: payload.name,
    preparationGuide: payload.preparationGuide,
    ingredients: filteredIngredients,
  };

  const { data } = await api.post<Meal>('/meals', sanitized);
  return data;
}

/**
 * Updates an existing meal by ID.
 * PATCH /meals/:id
 * Replaces the full ingredients array if provided.
 */
export async function updateMeal(id: number, payload: Partial<MealPayload>): Promise<Meal> {
  const sanitized: any = {};
  if (payload.name !== undefined) sanitized.name = payload.name;
  if (payload.preparationGuide !== undefined) sanitized.preparationGuide = payload.preparationGuide;
  if (payload.ingredients !== undefined) {
    const mappedIngredients = payload.ingredients.map((ing) => {
      let productId: number | null = null;
      if (ing.productId !== null && ing.productId !== undefined) {
        const parsed = Number(ing.productId);
        if (!isNaN(parsed) && parsed > 0) {
          productId = parsed;
        }
      }
      const customIngredientName = (ing.customIngredientName && typeof ing.customIngredientName === 'string' && ing.customIngredientName.trim() !== '')
        ? ing.customIngredientName.trim()
        : null;

      return {
        productId,
        quantity: String(ing.quantity || ''),
        customIngredientName,
      };
    });

    sanitized.ingredients = mappedIngredients.filter(
      (ing) => !(ing.productId === null && ing.customIngredientName === null)
    );
  }

  const { data } = await api.patch<Meal>(`/meals/${id}`, sanitized);
  return data;
}

/**
 * Deletes a meal by ID (conditional: soft or hard delete based on schedule links).
 * DELETE /meals/:id
 */
export async function deleteMeal(id: number): Promise<void> {
  await api.delete(`/meals/${id}`);
}
