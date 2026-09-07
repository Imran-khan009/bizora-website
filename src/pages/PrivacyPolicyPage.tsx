import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-stone-700">
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Legal & Compliance</span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-stone-400 mt-1">Effective Date: September 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">1. Commitment to Client Confidentiality</h2>
          <p>
            At BIZORA Atelier Private Limited ("BIZORA"), we treat your personal privacy with the highest
            discretion. This Privacy Policy details how client information is gathered, protected, and utilized
            exclusively to process luxury commissions, dispatch orders across Pakistan, and maintain bespoke services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">2. Information We Collect</h2>
          <p>
            When placing an order or registering an atelier account, we collect necessary shipping data including your
            full name, contact telephone number, delivery address, email, and special courier instructions.
            We do not sell, rent, or trade your personal data with third-party advertising networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">3. Payment & Transaction Security</h2>
          <p>
            For Cash on Delivery (COD) transactions, your payment is handed directly to our courier agent in Pakistan upon
            delivery. No debit/credit card information is captured on our servers for COD orders. Direct bank transfers
            are verified strictly via official bank statements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-stone-900 text-base">4. Data Retention and Client Rights</h2>
          <p>
            You may request an update, verification, or deletion of your account credentials and order history at any
            time by submitting an inquiry to <strong className="text-stone-900">privacy@bizora.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
