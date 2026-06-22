// =============================================================================
// Products — Product List Component
// =============================================================================
// Fetches and displays all products in a styled table using React Query.
// Features:
//   • Loading spinner while data is being fetched.
//   • Empty state with a call-to-action.
//   • Edit button → raises onEdit callback to open ProductFormModal.
//   • Delete button → calls deleteProduct mutation, then invalidates 'products' query.
// =============================================================================

import type { Product } from '../../../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  onEdit: (product: Product) => void;
  onAddNew: () => void;
  onDelete: (product: Product) => void;
  isDeleting: boolean;
}

// ─── Macro Pill ───────────────────────────────────────────────────────────────

function MacroPill({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aboitiz-secondary/20 text-xs text-aboitiz-earth font-medium">
      <span className="font-semibold">{label}</span>
      {value}{unit}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductList({
  products,
  isLoading,
  isError,
  error,
  onEdit,
  onAddNew,
  onDelete,
  isDeleting,
}: ProductListProps) {

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
          <p className="text-sm text-aboitiz-primary">Loading ingredient catalog...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-xl p-6 text-center">
        <p className="text-aboitiz-danger font-medium">Failed to load products</p>
        <p className="text-sm text-aboitiz-danger/70 mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────────────────────────────────

  if (!products || products.length === 0) {
    return (
      <div className="bg-white/60 rounded-xl border border-aboitiz-primary/10 p-16 text-center">
        <div className="text-5xl mb-4">🥩</div>
        <p className="text-lg font-semibold text-aboitiz-textDark">No products found</p>
        <p className="text-sm text-aboitiz-primary mt-1 mb-6">
          Add ingredients to the catalog to start building meals.
        </p>
        <button
          id="product-list-empty-add-btn"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-aboitiz-earth text-white text-sm font-semibold hover:bg-aboitiz-earth/90 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add First Product
        </button>
      </div>
    );
  }

  // ─── Data Table ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-aboitiz-primary/10 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" id="product-list-table">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/60">
              <th className="px-5 py-4 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-4 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-4 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-4 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
                Macros (per 100g)
              </th>
              <th className="px-5 py-4 text-xs font-semibold text-aboitiz-primary uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-aboitiz-primary/5">
            {products.map((product: Product) => (
              <tr
                key={product.id}
                className="hover:bg-aboitiz-secondary/5 transition-colors duration-150 group"
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-aboitiz-primary/10 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://placehold.co/40x40/DDE4DD/787160?text=${product.name.charAt(0)}`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-aboitiz-bgLight flex items-center justify-center flex-shrink-0 text-aboitiz-primary font-bold text-sm border border-aboitiz-primary/10">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-aboitiz-textDark leading-tight">
                        {product.name}
                      </p>
                      <p className="text-xs text-aboitiz-primary mt-0.5">ID #{product.id}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-aboitiz-primary/10 text-aboitiz-primary">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-aboitiz-earth">
                    ₱{Number(product.price).toFixed(2)}
                  </span>
                </td>

                {/* Macros */}
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <MacroPill label="Cal" value={product.calories} unit=" kcal" />
                    <MacroPill label="P" value={product.proteinG} unit="g" />
                    <MacroPill label="C" value={product.carbsG} unit="g" />
                    <MacroPill label="F" value={product.fatG} unit="g" />
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      id={`product-edit-btn-${product.id}`}
                      onClick={() => onEdit(product)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-earth
                                 border border-aboitiz-earth/30 hover:bg-aboitiz-earth/10
                                 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      id={`product-delete-btn-${product.id}`}
                      onClick={() => onDelete(product)}
                      disabled={isDeleting}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-aboitiz-danger
                                 border border-aboitiz-danger/30 hover:bg-aboitiz-danger/10
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-colors duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-aboitiz-primary/10 bg-aboitiz-bgLight/40">
        <p className="text-xs text-aboitiz-primary">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
