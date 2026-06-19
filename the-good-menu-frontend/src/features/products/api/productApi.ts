// =============================================================================
// Products — API Layer
// =============================================================================
// CRUD functions for the /products endpoint using the centralized Axios instance.
// Used by React Query hooks in the ProductList and ProductFormModal components.
// =============================================================================

import api from '../../../hooks/useApi';
import type { Product } from '../../../types';

// ─── Request Payload Types ────────────────────────────────────────────────────

export interface ProductPayload {
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetches all products from the catalog.
 * GET /products
 */
export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

/**
 * Creates a new product in the catalog.
 * POST /products
 */
export async function createProduct(payload: ProductPayload): Promise<Product> {
  const sanitized = {
    name: payload.name,
    category: payload.category,
    price: Number(payload.price),
    imageUrl: payload.imageUrl,
    calories: Number(payload.calories),
    proteinG: Number(payload.proteinG),
    carbsG: Number(payload.carbsG),
    fatG: Number(payload.fatG),
  };
  const { data } = await api.post<Product>('/products', sanitized);
  return data;
}

/**
 * Updates an existing product by ID.
 * PATCH /products/:id
 */
export async function updateProduct(id: number, payload: Partial<ProductPayload>): Promise<Product> {
  const sanitized: Partial<ProductPayload> = {};
  if (payload.name !== undefined) sanitized.name = payload.name;
  if (payload.category !== undefined) sanitized.category = payload.category;
  if (payload.price !== undefined) sanitized.price = Number(payload.price);
  if (payload.imageUrl !== undefined) sanitized.imageUrl = payload.imageUrl;
  if (payload.calories !== undefined) sanitized.calories = Number(payload.calories);
  if (payload.proteinG !== undefined) sanitized.proteinG = Number(payload.proteinG);
  if (payload.carbsG !== undefined) sanitized.carbsG = Number(payload.carbsG);
  if (payload.fatG !== undefined) sanitized.fatG = Number(payload.fatG);

  const { data } = await api.patch<Product>(`/products/${id}`, sanitized);
  return data;
}

/**
 * Soft-deletes a product by ID.
 * DELETE /products/:id
 */
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
