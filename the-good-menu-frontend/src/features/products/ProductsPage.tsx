import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from './api/productApi';
import ProductList from './components/ProductList';
import ProductFormModal from './components/ProductFormModal';
import type { Product } from '../../types';
import { Beef, RefreshCw } from 'lucide-react';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || product.category === category;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
            <Beef className="w-6 h-6 text-aboitiz-primary" />
            Ingredient Catalog
          </h1>
          <p className="text-sm text-aboitiz-primary mt-1">
            Manage Aboitiz Food products and ingredients used across your meal recipes.
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
            id="products-page-add-btn"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-earth text-white
                       text-sm font-semibold hover:bg-aboitiz-earth/90 active:scale-95
                       transition-all duration-150 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/60 p-4 rounded-xl border border-aboitiz-primary/10 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1">
            Search by Name
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type ingredient name..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-aboitiz-primary/20 bg-white/80 focus:outline-none focus:ring-1 focus:ring-aboitiz-earth"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-xs font-semibold text-aboitiz-primary uppercase tracking-wider mb-1">
            Filter Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-aboitiz-primary/20 bg-white/80 focus:outline-none focus:ring-1 focus:ring-aboitiz-earth"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onEdit={handleEdit}
        onAddNew={handleAddNew}
      />

      {/* Create / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
}
