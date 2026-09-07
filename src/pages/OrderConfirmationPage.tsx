import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Order } from '../types';
import { ordersApi, resolveAssetUrl } from '../services/api';

interface OrderConfirmationPageProps {
  orderId: string;
  navigate: (route: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  navigate
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await ordersApi.getById(orderId);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-stone-500 font-medium">Retrieving your order invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Reference Not Found</h2>
        <p className="text-xs text-stone-500">
          We could not locate this order. Please verify your reference number.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Order Confirmed • Cash on Delivery
        </span>

        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900">
          Thank You, {order.customerInfo.fullName}
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded in our dispatch registry. Our concierge team is preparing your
          creation with white-glove packaging.
        </p>

        <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-xl text-xs font-mono font-bold text-stone-800">
          <span>Order Reference:</span>
          <span className="text-stone-950 font-extrabold">{order.id}</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-6">
          Estimated Order Journey
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-900">Order Placed</p>
            <p className="text-[11px] text-stone-400">Recorded</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-700">Atelier QA</p>
            <p className="text-[11px] text-stone-400">Within 12 Hours</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mx-auto">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-700">Courier Dispatch</p>
            <p className="text-[11px] text-stone-400">Express Post</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-700">Arrival & COD</p>
            <p className="text-[11px] text-stone-400">2-4 Business Days</p>
          </div>
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Details */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>Shipping Destination</span>
          </h3>

          <div className="text-xs text-stone-600 space-y-1.5 leading-relaxed">
            <p className="font-bold text-stone-900">{order.customerInfo.fullName}</p>
            <p>{order.customerInfo.address}</p>
            <p>
              {order.customerInfo.city}, {order.customerInfo.province} {order.customerInfo.postalCode}
            </p>
            <p className="pt-2 text-stone-900 font-semibold">
              📞 Contact: {order.customerInfo.phone}
            </p>
            {order.customerInfo.notes && (
              <p className="pt-2 text-stone-500 italic bg-stone-50 p-2.5 rounded-lg">
                Note: "{order.customerInfo.notes}"
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            <p>
              <strong>Payment Mode:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="capitalize font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {order.status}
              </span>
            </p>
          </div>
        </div>

        {/* Itemized Order Breakdown */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Purchased Items ({order.items.length})
          </h3>

          <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveAssetUrl(item.image)}
                    alt={item.name}
                    className="w-10 h-12 object-cover rounded-md border border-stone-200"
                  />
                  <div>
                    <p className="font-bold text-stone-900 line-clamp-1">{item.name}</p>
                    <p className="text-stone-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-stone-900 font-['Playfair_Display',serif]">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>- Rs. {order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Payable</span>
              <span className="font-['Playfair_Display',serif] text-base">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          id="confirmation-orders-btn"
          onClick={() => navigate('orders')}
          className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
        >
          View In My Orders
        </button>
        <button
          id="confirmation-continue-btn"
          onClick={() => navigate('shop')}
          className="w-full sm:w-auto px-8 py-3.5 border border-stone-300 hover:border-black text-stone-900 text-xs font-bold rounded-xl transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
