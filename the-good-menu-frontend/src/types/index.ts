// =============================================================================
// THE GOOD MENU — Frontend Type Definitions
// =============================================================================
// Strict TypeScript parity with NestJS backend Entities & DTOs.
// All property names use camelCase to match the backend entity property names.
// Timestamps are serialized as ISO-8601 strings over the wire (JSON).
// Password is intentionally excluded (select: false on backend).
// =============================================================================

// ─── User ────────────────────────────────────────────────────────────────────
// Mirrors: src/auth/entities/user.entity.ts
// Note: `password` is excluded — it uses `select: false` on the backend
// and must NEVER be represented on the frontend.
export interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ─── Product ─────────────────────────────────────────────────────────────────
// Mirrors: src/products/entities/product.entity.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ─── MealIngredient ──────────────────────────────────────────────────────────
// Mirrors: src/meals/entities/meal-ingredient.entity.ts
// Note: Either productId or customIngredientName is populated (CHECK constraint).
export interface MealIngredient {
  id: number;
  mealId: number;
  productId: number | null;
  product?: Product | null;
  quantity: string;
  customIngredientName: string | null;
}

// ─── Meal ────────────────────────────────────────────────────────────────────
// Mirrors: src/meals/entities/meal.entity.ts
export interface Meal {
  id: number;
  userId: number | null;
  name: string;
  preparationGuide: string;
  ingredients: MealIngredient[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ─── Schedule ────────────────────────────────────────────────────────────────
// Mirrors: src/schedules/entities/schedule.entity.ts
export type TimeSlot = 'Breakfast' | 'Lunch' | 'Dinner';

export interface Schedule {
  id: number;
  userId: number;
  mealId: number;
  meal?: Meal;
  scheduledDate: string;
  timeSlot: TimeSlot;
  createdAt: string;
  updatedAt: string;
}

// ─── AuditLog ────────────────────────────────────────────────────────────────
// Mirrors: src/audit-logs/entities/audit-log.entity.ts
export interface AuditLog {
  id: number;
  userId: number | null;
  action: string;
  tableName: string;
  recordId: number;
  changes: Record<string, unknown>;
  createdAt: string;
}

// ─── Auth DTOs ───────────────────────────────────────────────────────────────
// Request/response types for authentication endpoints.
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
