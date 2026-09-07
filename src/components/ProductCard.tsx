import React from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { resolveAssetUrl } from '../services/api';

interface ProductCardProps {
  product: Product;
  navigate: (route: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();

  const isSale = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = isSale
    ? Math.round(((product.price - (product.discountPrice || product.price)) / product.price) * 100)
    : 0;

  const inWish = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const displayPrice = product.discountPrice || product.price;
  const mainImg = product.mainImage || (product.images && product.images[0]) || '';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] bg-slate-50 rounded-xl mb-3 overflow-hidden">
        <img
          src={resolveAssetUrl(mainImg)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isSale && (
            <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-xs tracking-wider uppercase">
              Save {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full shadow-xs tracking-wider uppercase">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors shadow-xs z-10 ${
            inWish
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-slate-600 hover:text-indigo-600 hover:bg-white'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 justify-center">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => navigate(`product/${product.id}`)}
            className="flex-1 py-1.5 px-2.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-xs hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={e => {
              e.stopPropagation();
              if (!isOutOfStock) addToCart(product, 1);
            }}
            disabled={isOutOfStock}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock row */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="uppercase tracking-widest text-slate-400 font-bold text-[10px]">
              {product.category}
            </span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold text-[11px]">Sold Out</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold text-[11px]">Only {product.stock} Left</span>
            ) : (
              <span className="text-emerald-600 font-medium text-[11px]">In Stock</span>
            )}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => navigate(`product/${product.id}`)}
            className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 cursor-pointer line-clamp-2 leading-snug mb-2 transition-colors"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-slate-800 text-xs">{product.rating}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewsCount || product.reviews?.length || 0})</span>
          </div>
        </div>

        {/* Pricing & Add to cart button */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                Rs. {displayPrice.toLocaleString()}
              </span>
              {isSale && (
                <span className="text-xs text-slate-400 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            id={`card-add-btn-${product.id}`}
            onClick={() => !isOutOfStock && addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
            }`}
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
