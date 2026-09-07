import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  navigate: (route: string) => void;
  siteSettings: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ navigate, siteSettings }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#111] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Brand Value Pillars Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">100% Authentic</h4>
              <p className="text-xs text-stone-400 mt-0.5">Direct from certified ateliers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#d4af37]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pay upon arrival across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#d4af37]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">7-Day Guarantee</h4>
              <p className="text-xs text-stone-400 mt-0.5">Effortless exchange & returns</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-[#d4af37]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Concierge Support</h4>
              <p className="text-xs text-stone-400 mt-0.5">Dedicated style specialists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => navigate('home')}>
              <span className="font-['Playfair_Display',serif] text-3xl font-bold tracking-widest text-white">
                BIZORA
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
                Haute Horlogerie, Fragrance & Leather
              </p>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 max-w-sm">
              BIZORA represents the pinnacle of modern luxury commerce in Pakistan. From bespoke full-grain
              footwear and rare oud parfums to precision mechanical chronographs and sartorial garments.
            </p>

            <div className="space-y-2 text-xs text-stone-400 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{siteSettings?.address || 'MM Alam Road, Gulberg III, Lahore, Pakistan'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{siteSettings?.contactPhone || '+92 (300) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{siteSettings?.contactEmail || 'concierge@bizora.com'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop?category=shoes')} className="hover:text-white transition-colors">
                  Artisan Shoes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop?category=perfumes')} className="hover:text-white transition-colors">
                  Pure Parfums
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop?category=watches')} className="hover:text-white transition-colors">
                  Horology Watches
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop?category=fashion')} className="hover:text-white transition-colors">
                  Tailored Fashion
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-white transition-colors">
                  Browse Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Client Service</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('orders')} className="hover:text-white transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors">
                  Bespoke Services
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">The BIZORA Society</h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to receive private preview access, atelier releases, and exclusive seasonal invitations.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <button
                id="newsletter-submit-btn"
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold bg-[#d4af37] text-stone-950 rounded-lg hover:bg-[#c59b27] transition-colors flex items-center justify-center gap-2"
              >
                <span>Join VIP Newsletter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Welcome to the BIZORA Society.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} BIZORA Atelier Ltd. All rights reserved.</p>

        {/* Accepted Payment badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-stone-400 font-medium">Supported Payments:</span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-300 font-semibold">
            Cash on Delivery (COD)
          </span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-400">
            JazzCash (Integration Ready)
          </span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-400">
            Easypaisa (Integration Ready)
          </span>
          <span className="px-2 py-1 bg-stone-900 border border-stone-800 rounded text-[11px] text-stone-400">
            Direct Bank Wire
          </span>
        </div>
      </div>
    </footer>
  );
};
