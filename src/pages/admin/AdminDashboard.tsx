import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Sliders,
  MessageSquare,
  Settings,
  ExternalLink,
  Plus,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Product, Order, ContactMessage, SiteSettings, AdminStats } from '../../types';
import { adminApi, productsApi, ordersApi, settingsApi, contactApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// Extracted admin page tabs
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminWebsiteContent } from './AdminWebsiteContent';
import { AdminInquiries } from './AdminInquiries';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  navigate: (route: string) => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'media'
  | 'content'
  | 'inquiries'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, inqRes] = await Promise.all([
        adminApi.getStats(),
        productsApi.getAll({ limit: 50, includeInactive: true }),
        ordersApi.getAll(),
        contactApi.getAll()
      ]);
      setStats(statsRes.stats);
      setProducts(prodRes.products);
      setOrders(ordRes.orders);
      setInquiries(inqRes.contacts);
    } catch (err) {
      console.error('Failed to load admin summary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const unreadInquiries = inquiries.filter(i => i.status === 'unread').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded-full border border-indigo-200/50 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              BIZORA Admin Suite
            </span>
            <span className="text-xs text-slate-500 font-medium">Full Content & Product CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Storefront & Operations Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('shop')}
            className="px-4 py-2 border border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 bg-white shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Store</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders</span>
          {pendingOrders > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] font-black rounded-full">
              {pendingOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customers</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'media'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Media Library</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'content'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Website Content</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries</span>
          {unreadInquiries > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full">
              {unreadInquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Logo</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            orders={orders}
            products={products}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        )}

        {activeTab === 'products' && <AdminProducts />}

        {activeTab === 'categories' && <AdminCategories />}

        {activeTab === 'orders' && <AdminOrders />}

        {activeTab === 'customers' && <AdminCustomers />}

        {activeTab === 'media' && <AdminMediaLibrary />}

        {activeTab === 'content' && <AdminWebsiteContent />}

        {activeTab === 'inquiries' && <AdminInquiries />}

        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};
