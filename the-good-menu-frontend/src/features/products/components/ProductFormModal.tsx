// =============================================================================
// Products — Form Modal Component
// =============================================================================
// Handles both Create and Edit modes for a product.
// - Create: opens with empty fields, calls createProduct mutation.
// - Edit:   opens pre-filled with the selected product, calls updateProduct mutation.
// On success, the 'products' query is invalidated to refresh the list.
// =============================================================================

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct, type ProductPayload } from '../api/productApi';
import type { Product } from '../../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, the modal opens in Edit mode pre-filled with this product. */
  product?: Product | null;
}

// ─── Initial Form State ───────────────────────────────────────────────────────

const emptyForm: ProductPayload = {
  name: '',
  category: '',
  price: 0,
  imageUrl: '',
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
};

// ─── Reusable Input Field ─────────────────────────────────────────────────────

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-aboitiz-danger">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={type === 'number' ? 'any' : undefined}
        className="w-full px-3.5 py-2.5 rounded-lg border border-aboitiz-primary/20 bg-white/80
                   text-sm text-aboitiz-textDark placeholder-aboitiz-primary/40
                   focus:outline-none focus:ring-2 focus:ring-aboitiz-secondary/50 focus:border-aboitiz-secondary
                   transition duration-150"
      />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(product);

  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  // Sync form state when the product prop changes (switching between create/edit)
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        calories: product.calories,
        proteinG: product.proteinG,
        carbsG: product.carbsG,
        fatG: product.fatG,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [product, isOpen]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to create product.'),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ProductPayload) => updateProduct(product!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
    onError: (err: Error) => setError(err.message || 'Failed to update product.'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleChange(field: keyof ProductPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isEditMode) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  }

  if (!isOpen) return null;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-aboitiz-textDark/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-aboitiz-primary/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/50">
          <div>
            <h2 id="product-modal-title" className="text-lg font-semibold text-aboitiz-textDark">
              {isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p className="text-xs text-aboitiz-primary mt-0.5">
              {isEditMode ? `Editing "${product?.name}"` : 'Fill in the details to add a new ingredient to the catalog.'}
            </p>
          </div>
          <button
            onClick={onClose}
            id="product-modal-close-btn"
            className="p-2 rounded-lg text-aboitiz-primary hover:bg-aboitiz-primary/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Error Banner */}
          {error && (
            <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-lg px-4 py-3 text-sm text-aboitiz-danger">
              {error}
            </div>
          )}

          {/* Row 1: Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="product-name"
              label="Product Name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="e.g., The Good Meat Pork Belly"
              required
            />
            <Field
              id="product-category"
              label="Category"
              value={form.category}
              onChange={handleChange('category')}
              placeholder="e.g., Pork, Beef, Poultry"
              required
            />
          </div>

          {/* Row 2: Price + Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="product-price"
              label="Price (₱)"
              type="number"
              value={form.price}
              onChange={handleChange('price')}
              placeholder="0.00"
              required
            />
            <Field
              id="product-image-url"
              label="Image URL"
              value={form.imageUrl}
              onChange={handleChange('imageUrl')}
              placeholder="https://..."
            />
          </div>

          {/* Macros Section */}
          <div>
            <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-3">
              Nutritional Information (per 100g)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field
                id="product-calories"
                label="Calories"
                type="number"
                value={form.calories}
                onChange={handleChange('calories')}
                placeholder="kcal"
              />
              <Field
                id="product-protein"
                label="Protein (g)"
                type="number"
                value={form.proteinG}
                onChange={handleChange('proteinG')}
                placeholder="0"
              />
              <Field
                id="product-carbs"
                label="Carbs (g)"
                type="number"
                value={form.carbsG}
                onChange={handleChange('carbsG')}
                placeholder="0"
              />
              <Field
                id="product-fat"
                label="Fat (g)"
                type="number"
                value={form.fatG}
                onChange={handleChange('fatG')}
                placeholder="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              id="product-form-cancel-btn"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-aboitiz-primary
                         border border-aboitiz-primary/20 hover:bg-aboitiz-bgLight transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="product-form-submit-btn"
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                         bg-aboitiz-earth hover:bg-aboitiz-earth/90
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
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
