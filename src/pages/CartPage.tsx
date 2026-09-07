import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveAssetUrl } from '../services/api';

interface CartPageProps {
  navigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discountCode,
    discountAmount,
    applyDiscountCode,
    removeDiscountCode,
    total,
    totalItems
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyDiscountCode(inputCode.trim());
      setInputCode('');
    }
  };

  const freeDeliveryThreshold = 3500;
  const neededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-900">
            Your Shopping Bag Is Empty
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            You haven't added any handcrafted leather footwear, luxury fragrances, or horology watches to your bag yet.
          </p>
        </div>
        <button
          id="cart-empty-explore-btn"
          onClick={() => navigate('shop')}
          className="px-8 py-3.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
        >
          Explore The BIZORA Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-stone-200 pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Review Selection</span>
          <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-900 mt-1">
            Shopping Bag ({totalItems} items)
          </h1>
        </div>
        <button
          id="clear-all-cart-btn"
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 transition-colors font-medium"
        >
          Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {neededForFree > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-900">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Add <strong className="font-bold">Rs. {neededForFree.toLocaleString()}</strong> more to your order to unlock <strong>FREE Express Delivery</strong> across Pakistan!
              </span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
            {cart.map(item => {
              const price = item.product.discountPrice || item.product.price;
              const itemTotal = price * item.quantity;
              return (
                <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <img
                    src={resolveAssetUrl(item.product.images[0])}
                    alt={item.product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      {item.product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`product/${item.product.id}`)}
                      className="text-sm font-bold text-stone-900 hover:text-stone-700 cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Unit Price: Rs. {price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-stone-600 hover:bg-stone-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="font-['Playfair_Display',serif] text-base font-bold text-stone-900">
                        Rs. {itemTotal.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#d4af37]" />
              <span>Privilege Voucher Code</span>
            </h4>

            {discountCode ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-800">{discountCode} Applied (-10%)</span>
                </div>
                <button
                  onClick={removeDiscountCode}
                  className="text-emerald-700 hover:text-emerald-900 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  placeholder="Enter code (e.g. BIZORA10)"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-400">
              Try <strong className="text-stone-700">BIZORA10</strong> for 10% VIP order savings.
            </p>
          </div>

          {/* Summary Details */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-stone-900">Order Summary</h4>

            <div className="space-y-2 text-xs text-stone-600 pb-4 border-b border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Pakistan Express)</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `Rs. ${deliveryFee}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Privilege Code Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline text-stone-900">
              <span className="text-sm font-bold">Total Payable</span>
              <span className="font-['Playfair_Display',serif] text-2xl font-bold">
                Rs. {total.toLocaleString()}
              </span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('checkout')}
              className="w-full py-4 bg-[#111] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                <span>Cash on Delivery across Pakistan</span>
              </p>
              <p>Delivery in 2-4 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
