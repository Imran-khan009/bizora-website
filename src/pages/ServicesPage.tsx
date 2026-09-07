import React from 'react';
import {
  Sparkles,
  Scissors,
  Gift,
  ShieldCheck,
  Watch,
  Truck,
  ArrowRight
} from 'lucide-react';

interface ServicesPageProps {
  navigate: (route: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const services = [
    {
      icon: Scissors,
      title: 'Bespoke Footwear & Lasting',
      description:
        'Custom foot measuring, individual calfskin selection, and made-to-order Goodyear-welted Oxfords and Derby shoes crafted to your exact anatomical specifications.',
      tag: 'Atelier Tailoring'
    },
    {
      icon: Sparkles,
      title: 'Personalized Olfactory Profiling',
      description:
        'Private consultation sessions to determine your signature scent palette across rare Cambodian agarwood, amber, Bulgarian rose, and Tuscan leather extracts.',
      tag: 'Fragrance Concierge'
    },
    {
      icon: Watch,
      title: 'Horology Regulation & Maintenance',
      description:
        'Precision timing testing, demagnetization, sapphire crystal replacement, and comprehensive mechanical servicing for high-grade automatic chronographs.',
      tag: 'Timepiece Care'
    },
    {
      icon: Gift,
      title: 'Corporate & VIP Executive Gifting',
      description:
        'Custom-embossed leather presentation boxes, luxury pen sets, and branded curations tailored for boardrooms, law firms, and distinguished celebratory occasions.',
      tag: 'Executive Suites'
    },
    {
      icon: Truck,
      title: 'White-Glove Nationwide Express',
      description:
        'Specialized insured courier delivery across all regions of Pakistan with sealed tamper-evident security bags and Cash on Delivery flexibility.',
      tag: 'Logistics'
    },
    {
      icon: ShieldCheck,
      title: 'Authentication & Provenance Registry',
      description:
        'Every timepiece and artisan leather creation is accompanied by an authenticated serial certificate ensuring genuine provenance and heirloom value.',
      tag: 'Guaranteed Authentic'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Bespoke Atelier Offerings
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-stone-900">
          Tailored Luxury Services
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Beyond ready-to-wear collections, BIZORA extends personalized artisanal commissions and
          white-glove styling care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs hover:shadow-xl hover:border-stone-400 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 text-[#d4af37] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">{s.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => navigate('contact')}
                  className="text-xs font-bold text-stone-900 hover:text-black flex items-center gap-1 group"
                >
                  <span>Request Service Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
