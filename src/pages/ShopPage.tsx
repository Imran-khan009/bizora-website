import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  PackageX
} from 'lucide-react';
import { Product, Category } from '../types';
import { productsApi, categoriesApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  navigate: (route: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialCategory = 'all',
  initialSearch = ''
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(initialSearch);
  const [sort, setSort] = useState<string>('featured');
  const [saleOnly, setSaleOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(40000);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Filter drawer toggle on mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await productsApi.getAll({
          category: category !== 'all' ? category : undefined,
          search: search.trim() || undefined,
          maxPrice: maxPrice < 40000 ? maxPrice : undefined,
          sale: saleOnly ? true : undefined,
          sort: sort !== 'featured' ? sort : undefined,
          page,
          limit: 8
        });

        let filtered = res.products;
        if (inStockOnly) {
          filtered = filtered.filter(p => p.stock > 0);
        }

        setProducts(filtered);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [category, search, sort, saleOnly, inStockOnly, maxPrice, page]);

  const resetFilters = () => {
    setCategory('all');
    setSearch('');
    setSort('featured');
    setSaleOnly(false);
    setInStockOnly(false);
    setMaxPrice(40000);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Atelier Catalogue</span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            The BIZORA Collection
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {products.length} of {total} artisan handcrafted creations
          </p>
        </div>

        {/* Search & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <input
              id="shop-search-input"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>

          <button
            id="mobile-filters-toggle-btn"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden p-2.5 bg-stone-100 rounded-xl border border-stone-300 text-stone-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`md:block space-y-6 bg-white p-5 rounded-2xl border border-stone-200 ${
            mobileFiltersOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800">Categories</h4>
            <div className="flex flex-col gap-1 text-xs">
              <button
                id="filter-cat-all"
                onClick={() => {
                  setCategory('all');
                  setPage(1);
                }}
                className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  category === 'all'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>All Products</span>
                <span>{total}</span>
              </button>

              {categories.map(c => (
                <button
                  key={c.id}
                  id={`filter-cat-${c.slug}`}
                  onClick={() => {
                    setCategory(c.slug);
                    setPage(1);
                  }}
                  className={`text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    category.toLowerCase() === c.slug.toLowerCase()
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{c.name}</span>
                  {(c as any).productCount !== undefined && (
                    <span className="text-[11px] opacity-70">{(c as any).productCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-800">Max Budget</span>
              <span className="font-semibold text-stone-900">Rs. {maxPrice.toLocaleString()}</span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min="2000"
              max="40000"
              step="1000"
              value={maxPrice}
              onChange={e => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Rs. 2,000</span>
              <span>Rs. 40,000</span>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-800">Status</h4>
            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                id="toggle-sale-only"
                type="checkbox"
                checked={saleOnly}
                onChange={e => {
                  setSaleOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
              />
              <span>Sale & Discounts Only</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                id="toggle-instock-only"
                type="checkbox"
                checked={inStockOnly}
                onChange={e => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded text-stone-900 focus:ring-stone-900 accent-stone-900"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid & Sorting */}
        <main className="md:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <span className="font-semibold text-stone-800">Active Category:</span>
              <span className="px-2.5 py-1 bg-stone-100 rounded-md font-bold uppercase text-stone-900 text-[10px]">
                {category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Sort By:</span>
              <select
                id="shop-sort-select"
                value={sort}
                onChange={e => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>

          {/* Product Items */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 bg-stone-200/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No creations matched your criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range, clearing search terms, or exploring other categories.
              </p>
              <button
                id="reset-empty-filters-btn"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(prod => (
                <ProductCard key={prod.id} product={prod} navigate={navigate} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                id="pagination-prev-btn"
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg border border-stone-200 disabled:opacity-30 hover:bg-stone-50 text-stone-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    page === pNum
                      ? 'bg-stone-900 text-white'
                      : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {pNum}
                </button>
              ))}
              <button
                id="pagination-next-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg border border-stone-200 disabled:opacity-30 hover:bg-stone-50 text-stone-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
