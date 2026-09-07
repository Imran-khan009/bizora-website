import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';
import { categoriesApi, resolveAssetUrl } from '../services/api';

interface CategoriesPageProps {
  navigate: (route: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Curated Portfolios
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-stone-900">
          Atelier Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Explore specialized departments from master horology and artisanal footwear to pure amber &
          agarwood fragrances.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-80 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`shop?category=${cat.slug}`)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-stone-200 hover:shadow-xl hover:border-stone-400 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={resolveAssetUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                    Atelier Department
                  </span>
                  <h3 className="font-['Playfair_Display',serif] text-xl font-bold">{cat.name}</h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-stone-500 leading-relaxed">{cat.description}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-black">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
