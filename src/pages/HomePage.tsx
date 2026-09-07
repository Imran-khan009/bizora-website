import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  Tag,
  Zap,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { Product, Category, WebsiteContent } from '../types';
import { productsApi, categoriesApi, contentApi, resolveAssetUrl } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, contentRes] = await Promise.all([
          productsApi.getAll({ featured: true, limit: 8 }),
          categoriesApi.getAll(),
          contentApi.get()
        ]);
        setFeaturedProducts(prodRes.products);
        setCategories(catRes.categories);
        setContent(contentRes.content);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Icon selector for Why Choose Us
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'Clock':
        return <Clock className="w-6 h-6" />;
      case 'CheckCircle':
        return <CheckCircle className="w-6 h-6" />;
      case 'RotateCcw':
        return <RotateCcw className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  // Safe hero fallback
  const heroEyebrow = content?.hero?.eyebrow || 'The Atelier Collection • Summer 2026';
  const heroHeading = content?.hero?.heading || 'The Pinnacle of Premium Craft.';
  const heroDescription =
    content?.hero?.description ||
    'Discover our curated selection of high-performance timepieces, pure extrait parfums, handcrafted leather footwear, and tailored menswear. Engineered with uncompromising standards and nationwide Cash on Delivery across Pakistan.';
  const heroButtonText = content?.hero?.buttonText || 'Shop Now';
  const heroButtonLink = content?.hero?.buttonLink || 'shop';
  const heroSecondaryText = content?.hero?.secondaryButtonText || 'Learn More';
  const heroSecondaryLink = content?.hero?.secondaryButtonLink || 'about';
  const heroImage =
    content?.hero?.image ||
    content?.hero?.heroImage ||
    `${import.meta.env.BASE_URL}uploads/regenerated_image_1788787466475.png`;

  // Safe promo banner fallback
  const promo = content?.promoBanner;
  const whyChooseUs = content?.whyChooseUs;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION (Dynamic from CMS) */}
      <section className="relative bg-indigo-950 text-white overflow-hidden py-16 lg:py-24 border-b border-indigo-900/50">
        {/* Luminous Ambient Glow */}
        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full bg-gradient-to-l from-indigo-500/20 via-indigo-500/10 to-transparent pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="uppercase tracking-[0.3em] text-[10px] font-bold text-indigo-300 block">
                {heroEyebrow}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {heroHeading}
              </h1>

              <p className="text-indigo-100/90 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroDescription}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => navigate(heroButtonLink.replace(/^\//, ''))}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-sm rounded-full transition-all shadow-xl hover:shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{heroButtonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600" />
                </button>

                <button
                  id="hero-explore-bizora-btn"
                  onClick={() => navigate(heroSecondaryLink.replace(/^\//, ''))}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-900/50 hover:bg-indigo-900/80 text-white font-bold text-sm rounded-full border border-white/20 transition-colors flex items-center justify-center cursor-pointer backdrop-blur-xs"
                >
                  {heroSecondaryText}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-indigo-900/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-bold text-indigo-300">100%</p>
                  <p className="text-xs text-indigo-200/70">Authentic Luxury</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Express</p>
                  <p className="text-xs text-indigo-200/70">COD Nationwide</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4.9/5</p>
                  <p className="text-xs text-indigo-200/70">Client Rating</p>
                </div>
              </div>
            </div>

            {/* Right Visual Stage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-indigo-800/60 bg-indigo-900/40">
                <img
                  src={resolveAssetUrl(heroImage)}
                  alt="BIZORA Showcase"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-transparent to-indigo-950/20" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-indigo-950/80 backdrop-blur-md border border-white/10 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">
                        Curated Selection
                      </span>
                      <h4 className="text-sm font-bold mt-0.5">BIZORA Masterpiece</h4>
                    </div>
                    <span className="text-sm font-bold text-indigo-300">Certified Authentic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Atelier Curations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Shop By Category</h2>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              id={`cat-card-${cat.slug}`}
              onClick={() => navigate(`shop?category=${cat.slug}`)}
              className="group cursor-pointer flex flex-col items-center text-center p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border-2 border-slate-100 group-hover:border-indigo-600 transition-colors">
                <img
                  src={resolveAssetUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-0.5">Explore</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Exceptional Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View All Products &rarr;</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-slate-200/70 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map(prod => (
              <ProductCard key={prod.id} product={prod} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL SECTION (Dynamic from CMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-indigo-800/40 shadow-xl">
          {promo?.image && (
            <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-35 pointer-events-none overflow-hidden">
              <img
                src={resolveAssetUrl(promo.image)}
                alt="Promo Banner"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-indigo-500 text-white text-xs font-extrabold rounded-full tracking-wider uppercase">
              Exclusive Privilege
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              {promo?.heading || 'The Sovereign Collection.'}
            </h2>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              {promo?.description ||
                'Order handcrafted royal footwear, rare pure agarwood perfumes, or executive chronographs today and receive complimentary express shipping plus an extra 10% off with invitation code.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {promo?.promoCode && (
                <div className="px-4 py-2 bg-indigo-900/80 border border-indigo-700 rounded-xl text-xs font-mono font-bold text-indigo-200 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>CODE: {promo.promoCode}</span>
                </div>
              )}
              <button
                id="promo-shop-btn"
                onClick={() => navigate((promo?.buttonLink || 'shop').replace(/^\//, ''))}
                className="px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs rounded-full transition-colors cursor-pointer shadow-md"
              >
                {promo?.buttonText || 'Shop Collection'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE BIZORA (Dynamic from CMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Unrivaled Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {whyChooseUs?.title || 'Why Discerning Clients Choose BIZORA'}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            {whyChooseUs?.subtitle ||
              'Every creation is inspected by our master horologists and leather artisans before dispatch.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {(
            whyChooseUs?.items || [
              {
                id: '1',
                title: 'Quality Products',
                description:
                  '100% genuine full-grain leather, Swiss-standard movements, and certified natural oils.',
                icon: 'Award'
              },
              {
                id: '2',
                title: 'Trusted Service',
                description:
                  'Transparent order tracking, authenticated guarantees, and direct communication.',
                icon: 'ShieldCheck'
              },
              {
                id: '3',
                title: 'Fast Delivery',
                description:
                  'Express 2-4 day delivery across Lahore, Karachi, Islamabad, and all Pakistan regions.',
                icon: 'Truck'
              },
              {
                id: '4',
                title: 'Secure Shopping',
                description:
                  'Pay upon safe delivery with Cash on Delivery or verified direct banking transfer.',
                icon: 'CheckCircle'
              },
              {
                id: '5',
                title: '24/7 Concierge',
                description:
                  'Dedicated styling consultations, sizing guidance, and post-purchase care.',
                icon: 'Clock'
              }
            ]
          ).map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center space-y-3 shadow-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                {renderIcon(item.icon)}
              </div>
              <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Verified Reviews
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The Royal Oxford leather shoes arrived in Karachi in pristine condition. The Blake-stitched
                sole and calfskin leather rival heritage European cobblers at a fraction of the cost."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Barrister Shahzad Khan</p>
                <p className="text-[11px] text-slate-400">Karachi, Pakistan</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "BIZORA Oud Royale is pure mastery. A 14-hour longevity with rich Cambodian agarwood and
                saffron. I get compliments every time I wear it to executive summits."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Dr. Mueen Baig</p>
                <p className="text-[11px] text-slate-400">Islamabad, Pakistan</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Ordered the Chrono Master Automatic watch with COD. It has a beautiful sapphire glass and
                smooth mechanical sweeping hand. Incredible luxury package."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Daniyal Rehman</p>
                <p className="text-[11px] text-slate-400">Lahore, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
