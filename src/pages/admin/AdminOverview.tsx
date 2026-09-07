import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { AdminStats, Order, Product } from '../../types';

interface AdminOverviewProps {
  stats: AdminStats | null;
  orders: Order[];
  products: Product[];
  setActiveTab: (tab: any) => void;
  navigate: (route: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  orders,
  products,
  setActiveTab,
  navigate
}) => {
  const recentOrders = orders.slice(0, 5);
  const lowStock = products.filter(p => p.stock <= 5);

  return (
    <div className="space-y-8">
      {/* 1. Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Revenue
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Rs. {(stats?.totalRevenue ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across all fulfilled orders</span>
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Orders
          </span>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
            {stats?.totalOrders ?? orders.length}
          </p>
          <p className="text-[11px] text-slate-500">
            {orders.filter(o => o.status === 'pending').length} orders awaiting processing
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Catalog Items
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {products.length}
          </p>
          <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lowStock.length} items low on stock</span>
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Client Base
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {stats?.totalUsers ?? 1}
          </p>
          <p className="text-[11px] text-slate-500">Registered customers & accounts</p>
        </div>
      </div>

      {/* 2. Quick Action Shortcuts */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black tracking-tight">
              BIZORA Content & Catalog Control Shortcuts
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant management actions to keep your online store fresh, up to date, and selling.
            </p>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Preview Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <button
            onClick={() => setActiveTab('products')}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Add / Edit Products
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set individual prices, stock & picture galleries
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                Media Library
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload JPG/PNG/WEBP photos & manage assets
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Homepage CMS
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Edit Hero, About narrative, & Promo banners
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                Brand Logo & Settings
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload logo image, WhatsApp number & delivery rates
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Two Column Split: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentOrders.map(order => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      #{order.id.slice(0, 8)} • {order.shippingAddress.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-black text-slate-900 block">
                      Rs. {order.total.toLocaleString()}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-slate-100 text-slate-700">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Stock Health
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              {lowStock.length} Low Stock
            </span>
          </div>

          {lowStock.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="text-xs font-semibold text-slate-700">All inventory healthy!</p>
              <p className="text-[11px]">No products are currently under the 5 unit threshold.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map(prod => (
                <div
                  key={prod.id}
                  className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between text-xs"
                >
                  <div className="truncate max-w-[150px]">
                    <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                    <span className="text-[10px] text-slate-500 capitalize">{prod.category}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-[10px]">
                    {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} left`}
                  </span>
                </div>
              ))}
              <button
                onClick={() => setActiveTab('products')}
                className="w-full py-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Manage Inventory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
