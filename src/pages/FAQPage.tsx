import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQPageProps {
  navigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work across Pakistan?',
      a: 'We offer hassle-free Cash on Delivery nationwide. Once you place an order, our concierge confirms details via WhatsApp or phone. When the courier arrives at your address (in Lahore, Karachi, Islamabad, or any provincial city), you hand the cash payment directly to the courier upon receiving your package.'
    },
    {
      q: 'Are all BIZORA creations 100% genuine and authentic?',
      a: 'Without exception. Every leather shoe is crafted from certified full-grain cowhide/calfskin, our horology calibers feature genuine mechanical movements with sapphire crystal glass, and all perfumes are formulated as high-concentration extraits using natural oils.'
    },
    {
      q: 'What are the delivery charges and delivery times?',
      a: 'Delivery is completely FREE on all orders over Rs. 3,500. For orders under Rs. 3,500, a standard nationwide delivery fee of Rs. 250 applies. Delivery takes 1-2 business days within Lahore and 2-4 business days for Karachi, Islamabad, Rawalpindi, Peshawar, Quetta, and other cities.'
    },
    {
      q: 'What is BIZORA’s exchange and return policy?',
      a: 'We provide an effortless 7-day exchange guarantee. If your shoes need a different size, or you wish to exchange an unworn creation in original condition with tags and packaging intact, simply notify our concierge via WhatsApp or email for immediate pickup and exchange.'
    },
    {
      q: 'Do your automatic watches include a warranty?',
      a: 'Yes. All BIZORA automatic and mechanical timepieces are backed by our 2-Year International Horology Atelier Warranty against movement irregularities and manufacturing defects.'
    },
    {
      q: 'Can I visit a physical showroom in Pakistan?',
      a: 'Yes! Our flagship showroom and atelier is located at MM Alam Road, Gulberg III, Lahore. You are warmly welcomed to book a bespoke fitting or experience our fragrances in person.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Client Guidance
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Clear answers regarding Cash on Delivery, sizing, authentication guarantees, and courier dispatch.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
              >
                <span className="font-bold text-sm text-stone-900">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-stone-100 rounded-3xl text-center space-y-4">
        <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-stone-900">
          Have an unlisted question?
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Our client services concierge is ready to assist you via phone or online inquiry.
        </p>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors inline-flex items-center gap-2"
        >
          <span>Contact Atelier Concierge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
