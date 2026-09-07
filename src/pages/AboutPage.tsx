import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Award, Users, ArrowRight } from 'lucide-react';
import { WebsiteContent } from '../types';
import { contentApi, resolveAssetUrl } from '../services/api';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const [content, setContent] = useState<WebsiteContent | null>(null);

  useEffect(() => {
    contentApi
      .get()
      .then(res => setContent(res.content))
      .catch(() => {});
  }, []);

  const aboutHeading = content?.about?.heading || 'Honoring Century-Old Atelier Disciplines';
  const aboutDescription =
    content?.about?.description ||
    'Every pair of BIZORA footwear begins with hand-selected full-grain cowhide and calfskin. Our cordwainers shape each last manually, utilizing genuine Blake stitching and Goodyear welting techniques that allow footwear to mold seamlessly to your gait over decades.';
  const aboutSecondaryDescription =
    content?.about?.secondaryDescription ||
    'In parallel, our olfactory laboratory formulates concentrated extrait de parfums using wild agarwood resin harvested from Assam and Cambodia, combined with natural Bulgarian rose and rare ambergris.';
  const aboutImage =
    content?.about?.image ||
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            The BIZORA Manifesto
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Craftsmanship Born From Obsession.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            BIZORA was established with a singular objective: to deliver peerless luxury,
            haute horlogerie, and master-crafted leatherwork to connoisseurs across Pakistan
            without the traditional European markup.
          </p>
        </div>
      </section>

      {/* Heritage Narrative (Dynamic from CMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Our Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {aboutHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {aboutDescription}
            </p>
            {aboutSecondaryDescription && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {aboutSecondaryDescription}
              </p>
            )}

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-slate-200">
              <div>
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 mt-1">Full-Grain Certified Leathers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">40%+</p>
                <p className="text-xs text-slate-500 mt-1">Extrait Fragrance Concentration</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl border border-slate-200">
            <img
              src={resolveAssetUrl(aboutImage)}
              alt="Artisan shoe crafting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Foundations
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              The Four Pillars of BIZORA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-900">Material Integrity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero synthetic fillers. Only pure metals, sapphire crystal glasses, and natural organic oils.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-900">Horological Mastery</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Precision automatic and mechanical calibers regulated to chronometer standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-900">Direct Atelier Value</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No middleman distributor margins. High-craft luxury delivered straight to your door.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="text-sm font-bold text-slate-900">Pakistan-Wide Trust</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect before acceptance with nationwide Cash on Delivery and hassle-free exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Experience BIZORA In Person
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Visit our flagship atelier in Lahore or order online with guaranteed express delivery.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('shop')}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-lg transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
          <button
            onClick={() => navigate('contact')}
            className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer"
          >
            Contact Concierge
          </button>
        </div>
      </section>
    </div>
  );
};
