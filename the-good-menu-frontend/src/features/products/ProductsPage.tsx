// =============================================================================
// Products — Page Component
// =============================================================================
// Top-level page for the /products route.
// Manages modal open/close state and passes the selected product for editing.
// =============================================================================

import { useState } from 'react';
import ProductList from './components/ProductList';
import ProductFormModal from './components/ProductFormModal';
import type { Product } from '../../types';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleAddNew() {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aboitiz-textDark">🥩 Ingredient Catalog</h1>
          <p className="text-sm text-aboitiz-primary mt-1">
            Manage Aboitiz Food products used across your meal recipes.
          </p>
        </div>

        <button
          id="products-page-add-btn"
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-earth text-white
                     text-sm font-semibold hover:bg-aboitiz-earth/90 active:scale-95
                     transition-all duration-150 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Product List */}
      <ProductList onEdit={handleEdit} onAddNew={handleAddNew} />

      {/* Create / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
}
