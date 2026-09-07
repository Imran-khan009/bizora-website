import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Tag,
  Star,
  ExternalLink,
  Loader2,
  ArrowUpDown,
  Layers,
  Copy
} from 'lucide-react';
import { Product, Category } from '../../types';
import { productsApi, categoriesApi, resolveAssetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';

export const AdminProducts: React.FC = () => {
  const { showToast } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Media Picker state for selecting an image slot
  const [mediaPickerTargetIndex, setMediaPickerTargetIndex] = useState<number | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Data
  const initialForm = {
    name: '',
    category: 'shoes',
    sku: '',
    shortDescription: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
    ],
    featured: false,
    sale: false,
    status: 'active' as 'active' | 'inactive'
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll({
          search: search.trim() || undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          stockStatus: stockFilter !== 'all' ? stockFilter : undefined,
          sort: sortOption,
          includeInactive: true,
          limit: 100
        }),
        categoriesApi.getAll()
      ]);
      setProducts(prodRes.products);
      setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load products', err);
      showToast('Error loading products list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [categoryFilter, statusFilter, stockFilter, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProductsAndCategories();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    const defaultCat = categories[0]?.slug || 'shoes';
    setFormData({
      ...initialForm,
      category: defaultCat,
      sku: `BZ-${defaultCat.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      sku: prod.sku || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      stock: prod.stock,
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [''],
      featured: Boolean(prod.featured),
      sale: Boolean(prod.sale),
      status: prod.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formData.images];
    updated[index] = val;
    setFormData(prev => ({ ...prev, images: updated }));
  };

  const addImageSlot = () => {
    if (formData.images.length >= 6) {
      showToast('Maximum 6 images allowed per product');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageSlot = (index: number) => {
    if (formData.images.length <= 1) {
      showToast('A product requires at least one image');
      return;
    }
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updated }));
  };

  const handleMediaPickerSelect = (url: string) => {
    if (mediaPickerTargetIndex !== null) {
      handleImageChange(mediaPickerTargetIndex, url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required');
      return;
    }
    if (formData.price <= 0) {
      showToast('Please enter a valid price');
      return;
    }

    // Filter out empty image strings
    const validImages = formData.images.filter(img => img.trim().length > 0);
    if (validImages.length === 0) {
      validImages.push('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop');
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name.trim(),
        category: formData.category,
        sku: formData.sku.trim() || undefined,
        shortDescription: formData.shortDescription.trim() || undefined,
        description: formData.description.trim(),
        price: Number(formData.price),
        discountPrice: formData.discountPrice > 0 ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        images: validImages,
        featured: formData.featured,
        sale: formData.sale,
        status: formData.status
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        showToast(`Product "${formData.name}" updated successfully!`);
      } else {
        await productsApi.create(payload);
        showToast(`Product "${formData.name}" created successfully!`);
      }

      setIsModalOpen(false);
      fetchProductsAndCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
      fetchProductsAndCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Product Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your entire BIZORA catalog, individual product pricing, inventory, and visual assets.
          </p>
        </div>
        <button
          id="btn-add-new-product"
          onClick={openAddModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-4 relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt;0)</option>
              <option value="low_stock">Low Stock (≤5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="md:col-span-2">
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Quick Result Indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900">{products.length}</strong> products
          </span>
          <span className="text-indigo-600 font-semibold">
            Individual prices live on storefront
          </span>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading BIZORA products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No products found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or add your first product to the catalog.
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU / Category</th>
                  <th className="py-3.5 px-4">Price (PKR)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(prod => {
                  const mainImage = prod.images?.[0] || '';
                  const isLowStock = prod.stock > 0 && prod.stock <= 5;
                  const isOutOfStock = prod.stock <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveAssetUrl(mainImage)}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 bg-slate-100"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 truncate hover:text-indigo-600 transition-colors" title={prod.name}>
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate line-clamp-1 mt-0.5">
                              {prod.shortDescription || prod.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU / Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-700 font-medium block">
                          {prod.sku || '—'}
                        </span>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md capitalize">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {prod.discountPrice ? (
                            <>
                              <span className="font-bold text-indigo-600 text-xs block">
                                Rs. {prod.discountPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through block">
                                Rs. {prod.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-slate-900 text-xs">
                              Rs. {prod.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOutOfStock
                                ? 'bg-rose-500'
                                : isLowStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              isOutOfStock
                                ? 'text-rose-600 font-bold'
                                : isLowStock
                                ? 'text-amber-600 font-bold'
                                : 'text-slate-700'
                            }`}
                          >
                            {isOutOfStock ? 'Out of Stock' : `${prod.stock} in stock`}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                            prod.status === 'inactive'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {prod.status === 'inactive' ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          )}
                        </span>
                      </td>

                      {/* Badges (Featured / Sale) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {prod.featured && (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/60 rounded text-[9px] font-bold">
                              Featured
                            </span>
                          )}
                          {prod.sale && (
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/60 rounded text-[9px] font-bold">
                              Sale
                            </span>
                          )}
                          {!prod.featured && !prod.sale && (
                            <span className="text-slate-400 text-[10px]">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-edit-prod-${prod.id}`}
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-prod-${prod.id}`}
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingProduct
                    ? `Updating ${editingProduct.name}`
                    : 'Create a new catalog item with individualized pricing, pictures, and stock.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    showLivePreview
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showLivePreview ? 'Hide Preview' : 'Card Preview'}
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Form & Live Preview */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <form
                onSubmit={handleSubmit}
                id="product-form"
                className={`space-y-5 ${showLivePreview ? 'lg:col-span-7' : 'lg:col-span-12'}`}
              >
                {/* 1. Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Product Basics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., BIZORA Black Leather Oxford"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium capitalize"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g., BZ-SHO-3499"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Pricing & Inventory */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Pricing & Inventory
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Individual Price (PKR) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="e.g., 3499"
                        min="0"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Discount Price (PKR)
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice || ''}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            discountPrice: e.target.value ? Number(e.target.value) : 0
                          })
                        }
                        placeholder="Optional sale price"
                        min="0"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                        min="0"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Product Images */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      3. Product Images ({formData.images.length}/6)
                    </h4>
                    <button
                      type="button"
                      onClick={addImageSlot}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Picture
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Upload pictures from your computer or pick from the Media Library. The first picture serves as the main storefront thumbnail.
                  </p>

                  <div className="space-y-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200"
                      >
                        {/* Thumbnail Preview */}
                        <div className="w-14 h-14 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden border border-slate-300 relative group">
                          {imgUrl ? (
                            <img
                              src={resolveAssetUrl(imgUrl)}
                              alt={`Slot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <span className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                            {idx === 0 ? 'Main' : `#${idx + 1}`}
                          </span>
                        </div>

                        {/* URL input */}
                        <div className="flex-1 w-full space-y-1">
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={e => handleImageChange(idx, e.target.value)}
                            placeholder="Image URL (e.g. /uploads/... or https://...)"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                          <span className="text-[10px] text-slate-400">
                            {idx === 0
                              ? 'Primary picture shown in cards & search'
                              : idx === 1
                              ? 'Front view'
                              : idx === 2
                              ? 'Side view'
                              : 'Additional angle/detail view'}
                          </span>
                        </div>

                        {/* Pick from Media Library Button */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTargetIndex(idx);
                              setIsMediaPickerOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-indigo-600 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Upload or pick from library"
                          >
                            <Upload className="w-3 h-3" />
                            Browse
                          </button>

                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageSlot(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Descriptions */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    4. Descriptions
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description (Card Subtitle)
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief one-line summary for product cards..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Product Description *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed materials, craftsmanship, sizing, and luxury specifications..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* 5. Status & Visibility Badges */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    5. Visibility & Toggles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Status */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Product Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            status: e.target.value as 'active' | 'inactive'
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>

                    {/* Featured toggle */}
                    <label className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Featured</span>
                        <span className="text-[10px] text-slate-500">Show in homepage section</span>
                      </div>
                    </label>

                    {/* Sale toggle */}
                    <label className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.sale}
                        onChange={e => setFormData({ ...formData, sale: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Sale Badge</span>
                        <span className="text-[10px] text-slate-500">Highlight promotional discount</span>
                      </div>
                    </label>
                  </div>
                </div>
              </form>

              {/* Card Preview Column (When toggled) */}
              {showLivePreview && (
                <div className="lg:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      Live Storefront Card Preview
                    </span>
                    <span className="text-[10px] text-slate-400">Professional Polish Theme</span>
                  </div>

                  <div className="max-w-xs mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={resolveAssetUrl(formData.images[0])}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {formData.featured && (
                          <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                        {formData.sale && (
                          <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded-md capitalize">
                        {formData.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {formData.name || 'Untitled Product'}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {formData.shortDescription || formData.description || 'No description provided.'}
                      </p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <div>
                          {formData.discountPrice ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-black text-indigo-600">
                                Rs. {formData.discountPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                Rs. {formData.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-black text-slate-900">
                              Rs. {formData.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {formData.stock > 0 ? `${formData.stock} left` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    This shows how customers will experience this item on the BIZORA storefront.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All prices and pictures update instantly upon saving.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Publish Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Product Confirmation
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete this product?
              </p>
              <p className="text-xs font-bold text-slate-800 bg-slate-50 py-2 px-3 rounded-lg mt-2">
                "{productToDelete.name}"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                This action cannot be undone. It will be removed from your catalog immediately.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Media Picker Modal for uploading/selecting pictures */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setMediaPickerTargetIndex(null);
        }}
        onSelect={handleMediaPickerSelect}
        title="Select or Upload Product Image"
        defaultCategory="products"
      />
    </div>
  );
};
