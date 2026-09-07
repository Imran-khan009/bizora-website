import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';
import { ordersApi, resolveAssetUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OrderHistoryPageProps {
  navigate: (route: string) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await ordersApi.getAll();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLookupError('');
    try {
      const res = await ordersApi.getById(searchId.trim());
      setSearchedOrder(res.order);
    } catch (err: any) {
      setLookupError('No order found with this Reference ID. Please verify and try again.');
      setSearchedOrder(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const map = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
          map[status] || 'bg-stone-100 text-stone-800'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Real-Time Logistics</span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Track & Order History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitor current dispatches or lookup any previous order reference.
          </p>
        </div>

        {/* Order Lookup Form */}
        <form onSubmit={handleLookup} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <input
              id="order-lookup-input"
              type="text"
              placeholder="Search Reference ID (e.g. ORD-1...)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
          <button
            id="order-lookup-submit"
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {lookupError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{lookupError}</span>
        </div>
      )}

      {/* Searched Order Card Highlight */}
      {searchedOrder && (
        <div className="p-6 bg-amber-50/60 border-2 border-amber-300 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900">
                Found Order
              </span>
              <h3 className="text-sm font-bold text-stone-900 mt-0.5">{searchedOrder.id}</h3>
            </div>
            {getStatusBadge(searchedOrder.status)}
          </div>
          <div className="text-xs text-stone-600 flex flex-wrap gap-4">
            <p><strong>Customer:</strong> {searchedOrder.customerInfo.fullName}</p>
            <p><strong>City:</strong> {searchedOrder.customerInfo.city}</p>
            <p><strong>Total:</strong> Rs. {searchedOrder.total.toLocaleString()}</p>
            <p><strong>Payment:</strong> {searchedOrder.paymentMethod}</p>
          </div>
          <button
            onClick={() => navigate(`order-confirmation/${searchedOrder.id}`)}
            className="text-xs font-bold text-stone-900 underline hover:text-black"
          >
            View Full Receipt & Journey →
          </button>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No previous orders found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You have not placed any orders with this session yet. Explore the catalogue and try Cash on Delivery today.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 hover:border-stone-300 transition-colors"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-stone-900">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-stone-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.customerInfo.city}, {order.customerInfo.province}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] text-stone-400">Total Payable</span>
                  <p className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
                    Rs. {order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
                  >
                    <img
                      src={resolveAssetUrl(item.image)}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold text-stone-800 font-['Playfair_Display',serif]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  Payment: <strong>{order.paymentMethod}</strong>
                </span>
                <button
                  onClick={() => navigate(`order-confirmation/${order.id}`)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl transition-colors"
                >
                  View Details & Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
