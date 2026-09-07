import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveAssetUrl } from '../services/api';

interface CartDrawerProps {
  navigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    totalItems
  } = useCart();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 3500;
  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold text-stone-900">Your Shopping Bag ({totalItems})</h2>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Bar */}
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 mb-1.5">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              {neededForFreeDelivery === 0 ? (
                <span className="text-emerald-700 font-bold">🎉 Congratulations! You unlocked FREE Delivery</span>
              ) : (
                <span>
                  Add <strong className="text-stone-900 font-bold">Rs. {neededForFreeDelivery.toLocaleString()}</strong> more for FREE delivery
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore BIZORA's latest artisan footwear, luxury perfumes, and horology collections.
                </p>
                <button
                  id="drawer-empty-shop-btn"
                  onClick={() => {
                    closeCart();
                    navigate('shop');
                  }}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Explore The Collection
                </button>
              </div>
            ) : (
              cart.map(item => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="py-4 flex gap-4">
                    <img
                      src={resolveAssetUrl(item.product.images[0])}
                      alt={item.product.name}
                      className="w-18 h-22 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => {
                              closeCart();
                              navigate(`product/${item.product.id}`);
                            }}
                            className="text-xs font-bold text-stone-900 line-clamp-2 cursor-pointer hover:text-stone-700"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            id={`remove-item-btn-${item.product.id}`}
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mt-0.5">
                          {item.product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            id={`qty-minus-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${item.product.id}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900 font-['Playfair_Display',serif]">
                          Rs. {(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Across Pakistan)</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `Rs. ${deliveryFee}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>VIP Code Discount</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="font-['Playfair_Display',serif] text-base">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  id="drawer-view-cart-btn"
                  onClick={() => {
                    closeCart();
                    navigate('cart');
                  }}
                  className="py-3 px-4 border border-stone-300 hover:border-black text-stone-900 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  View Full Cart
                </button>
                <button
                  id="drawer-checkout-btn"
                  onClick={() => {
                    closeCart();
                    navigate('checkout');
                  }}
                  className="py-3 px-4 bg-[#111] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-stone-400 text-center">
                🛡️ Cash on Delivery available at checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
