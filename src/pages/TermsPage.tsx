import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-stone-700">
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Terms of Service</span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Terms & Conditions of Sale
        </h1>
        <p className="text-xs text-stone-400 mt-1">Effective Date: September 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">1. Atelier Sales Agreement</h2>
          <p>
            By placing an order via the BIZORA website or client concierge, you confirm your acceptance of these Terms.
            All products listed are subject to atelier availability and rigorous pre-dispatch inspection.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">2. Cash on Delivery & Order Verification</h2>
          <p>
            To prevent fraudulent or misdirected dispatches, BIZORA reserves the right to contact clients via phone call
            or SMS/WhatsApp to verify delivery details before releasing shipments to our courier partners.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">3. 7-Day Exchange Guarantee</h2>
          <p>
            Footwear and lifestyle items may be exchanged within 7 days of receipt provided they remain unworn, unaltered,
            and in original gift packaging. Due to hygiene considerations, opened parfum bottles with broken seals cannot
            be returned unless damaged during transit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">4. 2-Year Horology Warranty</h2>
          <p>
            All BIZORA automatic and mechanical timepieces include a 2-year warranty covering internal caliber defects.
            Normal wear, water damage exceeding depth ratings, or unauthorized third-party repairs void this warranty.
          </p>
        </section>
      </div>
    </div>
  );
};
