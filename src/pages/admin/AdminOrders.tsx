import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { ordersApi, resolveAssetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const AdminOrders: React.FC = () => {
  const { showToast } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order for detail modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAll();
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders', err);
      showToast('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await ordersApi.updateStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(res.order);
      }
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getCustomer = (order: Order) => {
    return (
      order.customerInfo ||
      order.shippingAddress || {
        fullName: 'Client',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: ''
      }
    );
  };

  const filteredOrders = orders.filter(o => {
    const cust = getCustomer(o);
    const orderStatus = (o.status || '').toLowerCase();
    const matchStatus = statusFilter === 'all' || orderStatus === statusFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      cust.fullName.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      cust.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/50';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200/50';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Order Fulfillment Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track customer orders, verify Cash on Delivery / card payments, and manage shipment tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            Total Orders: <strong className="text-slate-900">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
            st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st.toLowerCase()
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total (PKR)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => {
                  const cust = getCustomer(order);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{cust.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{cust.phone}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700">
                          {(order.items || []).reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-xs">
                          {(order.items || [])
                            .map(i => `${i.productName || 'Product'} (x${i.quantity})`)
                            .join(', ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 text-xs">
                          Rs. {order.total.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={e => handleUpdateStatus(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none capitalize ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Order #{selectedOrder.id}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer & Shipping */}
              {(() => {
                const cust = getCustomer(selectedOrder);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Customer Information
                      </span>
                      <p className="font-bold text-slate-900">{cust.fullName}</p>
                      <p className="text-slate-600 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {cust.email || 'N/A'}
                      </p>
                      <p className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cust.phone}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Delivery Address
                      </span>
                      <p className="text-slate-800 font-medium">{cust.address}</p>
                      <p className="text-slate-600">
                        {cust.city}, {cust.province || 'Pakistan'} {cust.postalCode}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Ordered Products
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveAssetUrl(item.productImage)}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.productName}</p>
                          <p className="text-[11px] text-slate-400">
                            Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">
                        Rs. {(item.quantity * item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee:</span>
                  <span>
                    Rs. {(selectedOrder.deliveryFee ?? selectedOrder.shippingFee ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-indigo-600">
                    Rs. {selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
