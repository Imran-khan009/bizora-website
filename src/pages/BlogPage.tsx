import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPageProps {
  navigate: (route: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const articles = [
    {
      id: 1,
      title: 'The Architecture of Full-Grain Leather: How to Care for Goodyear-Welted Footwear',
      excerpt:
        'Discover the conditioning rituals, cedar shoetree techniques, and beeswax polishes required to preserve artisanal calfskin for over thirty years.',
      category: 'Footwear & Leather',
      date: 'September 2026',
      author: 'Master Cordwainer Tariq',
      image:
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Pure Agarwood Demystified: Distinguishing Genuine Cambodian Oud from Synthetics',
      excerpt:
        'A comprehensive guide into tree inoculation, steam distillation, and natural resin maturation that grants BIZORA parfums exceptional longevity.',
      category: 'High Perfumery',
      date: 'August 2026',
      author: 'Olfactory Nose Jean-Marc',
      image:
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Understanding Automatic Calibers: The Romance of Mechanical Chronographs',
      excerpt:
        'Why true connoisseurs prioritize 28,800 vph balance wheels, column-wheel escapements, and sapphire exhibition casebacks over digital electronics.',
      category: 'Haute Horlogerie',
      date: 'July 2026',
      author: 'Horologist H. Rashid',
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Atelier Journal & Gazette
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-stone-900">
          The BIZORA Chronicles
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Essays, guides, and masterclass articles examining artisanal tailoring, horology mechanics, and
          fragrance connoisseurship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map(a => (
          <article
            key={a.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="text-[#d4af37] font-bold uppercase tracking-wider">
                    {a.category}
                  </span>
                  <span>{a.date}</span>
                </div>
                <h3 className="font-['Playfair_Display',serif] text-base font-bold text-stone-900 leading-snug">
                  {a.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">{a.excerpt}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 italic">By {a.author}</span>
              <button
                onClick={() => navigate('shop')}
                className="font-bold text-stone-900 hover:text-black flex items-center gap-1"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
