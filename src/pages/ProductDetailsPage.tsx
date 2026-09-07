import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Share2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { productsApi, resolveAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsPageProps {
  productId: string;
  navigate: (route: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  navigate
}) => {
  const { addToCart, isInWishlist, toggleWishlist, showToast } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await productsApi.getById(productId);
        setProduct(res.product);
        setRelated(res.related || []);
        setActiveImageIdx(0);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await productsApi.addReview(product.id, {
        userName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setProduct(res.product);
      setReviewSubmitted(true);
      setReviewName('');
      setReviewComment('');
      showToast('Thank you! Your verified review has been published.');
      setTimeout(() => setReviewSubmitted(false), 5000);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-stone-200 rounded-lg w-3/4" />
            <div className="h-6 bg-stone-200 rounded-lg w-1/4" />
            <div className="h-32 bg-stone-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Creation Not Found</h2>
        <p className="text-xs text-stone-500">The product you are looking for may have been archived.</p>
        <button
          onClick={() => navigate('shop')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
        >
          Return to Atelier Shop
        </button>
      </div>
    );
  }

  const isSale = Boolean(product.discountPrice && product.discountPrice < product.price);
  const displayPrice = product.discountPrice || product.price;
  const isOutOfStock = product.stock <= 0;
  const inWish = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => navigate('home')} className="hover:text-black">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button onClick={() => navigate('shop')} className="hover:text-black">
          Shop
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <button
          onClick={() => navigate(`shop?category=${product.category}`)}
          className="capitalize hover:text-black"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Visual Stage */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 sm:w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIdx === idx ? 'border-stone-900 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={resolveAssetUrl(img)}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Image */}
          <div className="flex-1 aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 relative group shadow-sm">
            <img
              src={resolveAssetUrl(product.images[activeImageIdx] || product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {isSale && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full shadow-md uppercase">
                Special Price
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-colors ${
                inWish ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-stone-700 hover:text-black hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="inline-block uppercase tracking-widest text-[#d4af37] font-bold text-xs">
              {product.category} collection
            </span>
            <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-stone-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3 text-xs text-stone-500">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-900">{product.rating}</span>
              <span>•</span>
              <span className="underline cursor-pointer">
                {product.reviewsCount || product.reviews?.length || 0} patron reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium">Atelier Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-950">
                  Rs. {displayPrice.toLocaleString()}
                </span>
                {isSale && (
                  <span className="text-sm text-stone-400 line-through font-semibold">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Tag */}
            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                  Only {product.stock} Left
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Ready To Dispatch
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Atelier Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-100">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                      {spec.key}
                    </p>
                    <p className="text-xs font-semibold text-stone-800 mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                <button
                  id="product-qty-minus"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={isOutOfStock || quantity <= 1}
                  className="p-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-bold text-xs text-stone-900">{quantity}</span>
                <button
                  id="product-qty-plus"
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-3 text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="product-add-to-cart-btn"
                onClick={() => !isOutOfStock && addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
            </div>

            {/* Buy Now (Direct Checkout) */}
            <button
              id="product-buy-now-btn"
              onClick={() => {
                if (!isOutOfStock) {
                  addToCart(product, quantity);
                  navigate('checkout');
                }
              }}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 bg-[#d4af37] hover:bg-[#c59b27] text-stone-950 text-xs font-bold rounded-xl transition-colors shadow-md disabled:opacity-40 cursor-pointer"
            >
              Instant Buy with Cash on Delivery
            </button>
          </div>

          {/* Value props mini list */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-500">
            <div className="p-2 bg-stone-50 rounded-lg">
              <Truck className="w-4 h-4 mx-auto text-stone-800 mb-1" />
              <span>Express Delivery</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <ShieldCheck className="w-4 h-4 mx-auto text-stone-800 mb-1" />
              <span>Certified Original</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <RotateCcw className="w-4 h-4 mx-auto text-stone-800 mb-1" />
              <span>7-Day Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Submission Section */}
      <section className="border-t border-stone-200 pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Patron Feedback</span>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-900 mt-1">
              Client Reviews & Ratings
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{rev.userName}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">{rev.comment}</p>
                  <p className="text-[10px] text-stone-400">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                No reviews yet for this creation. Be the first patron to leave a testimonial!
              </div>
            )}
          </div>

          {/* Write a Review Box */}
          <div className="lg:col-span-5">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-stone-900">Share Your Experience</h4>
              <p className="text-xs text-stone-500">
                Help other connoisseurs make an informed choice regarding craftsmanship and fit.
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
                  <input
                    id="review-name-input"
                    type="text"
                    required
                    placeholder="e.g. Asad Qureshi"
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review</label>
                  <textarea
                    id="review-comment-input"
                    required
                    rows={4}
                    placeholder="Tell us about the scent notes, leather finish, or packaging..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                  />
                </div>

                <button
                  id="submit-review-btn"
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Publishing...' : 'Submit Verified Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="border-t border-stone-200 pt-12 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Complete The Look</span>
            <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-stone-900 mt-1">
              Related Creations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
