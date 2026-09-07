import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Building,
  CreditCard,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';

interface CheckoutPageProps {
  navigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, subtotal, deliveryFee, discountAmount, total, clearCart, showToast } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'JazzCash' | 'Easypaisa' | 'Bank Transfer'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pakistanCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Other'
  ];

  const pakistanProvinces = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Islamabad Capital Territory',
    'Azad Jammu & Kashmir',
    'Gilgit-Baltistan'
  ];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty');
      navigate('shop');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Please fill in your full name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          notes: formData.notes
        },
        deliveryFee,
        discountAmount,
        paymentMethod
      };

      const res = await ordersApi.create(orderPayload);
      clearCart();
      showToast('Order confirmed successfully!');
      navigate(`order-confirmation/${res.order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500">Please add items from the atelier shop before checking out.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          Explore Creations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Secure Checkout</span>
        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-900 mt-1">
          Delivery & Payment Details
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Details Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Shipping Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>1. Shipping & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  placeholder="e.g. Asad Qureshi"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number (For Delivery Courier) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (For Order Updates)
                </label>
                <input
                  id="checkout-email-input"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address & House / Apartment Number <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-address-input"
                  type="text"
                  required
                  placeholder="House #12, Street 4, Phase 5, DHA"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City <span className="text-rose-600">*</span>
                </label>
                <select
                  id="checkout-city-select"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                >
                  {pakistanCities.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Province <span className="text-rose-600">*</span>
                </label>
                <select
                  id="checkout-province-select"
                  value={formData.province}
                  onChange={e => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                >
                  {pakistanProvinces.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Postal Code
                </label>
                <input
                  id="checkout-postal-input"
                  type="text"
                  placeholder="e.g. 54000"
                  value={formData.postalCode}
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Delivery Instructions / Gate Landmark
                </label>
                <textarea
                  id="checkout-notes-input"
                  rows={2}
                  placeholder="e.g. Please ring upper bell or call before arriving."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#d4af37]" />
              <span>2. Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-stone-900 bg-stone-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-1 accent-stone-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Cash on Delivery (Pakistan Nationwide)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Inspect your sealed luxury package and pay the courier cash upon arrival at your doorstep.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-stone-900 bg-stone-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="mt-1 accent-stone-900"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-stone-700" />
                    <span className="text-xs font-bold text-stone-900">Direct Bank Transfer</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Transfer directly to BIZORA Meezan Bank Corporate Account. Order processed upon receipt.
                  </p>
                  {paymentMethod === 'Bank Transfer' && (
                    <div className="mt-3 p-3 bg-stone-100 rounded-xl text-xs space-y-1 text-stone-700 border border-stone-200">
                      <p><strong>Bank:</strong> Meezan Bank Ltd</p>
                      <p><strong>Account Title:</strong> BIZORA Atelier Private Limited</p>
                      <p><strong>IBAN:</strong> PK62 MEZN 0001 0203 0405 0607</p>
                    </div>
                  )}
                </div>
              </label>

              {/* JazzCash / Easypaisa (Expandable Note) */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                  paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa'
                    ? 'border-stone-900 bg-stone-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash"
                  checked={paymentMethod === 'JazzCash'}
                  onChange={() => setPaymentMethod('JazzCash')}
                  className="mt-1 accent-stone-900"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-stone-700" />
                    <span className="text-xs font-bold text-stone-900">JazzCash / Easypaisa Mobile Wallet</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Our concierge will share the official merchant payment prompt via WhatsApp / SMS upon order confirmation.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Order Review ({cart.length} creations)
            </h3>

            {/* Items mini list */}
            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1">
              {cart.map(item => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-stone-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 font-['Playfair_Display',serif]">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Pakistan)</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryFee}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>VIP Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline text-stone-900">
              <span className="text-sm font-bold">Total Amount</span>
              <span className="font-['Playfair_Display',serif] text-2xl font-bold">
                Rs. {total.toLocaleString()}
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#111] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing Your Atelier Order...</span>
              ) : (
                <>
                  <span>Confirm Order ({paymentMethod})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-stone-400 text-center">
              <p className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-stone-800" />
                <span>SSL Encrypted Checkout • 100% Authentic Guarantee</span>
              </p>
              <p>No upfront credit card required for Cash on Delivery orders.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
