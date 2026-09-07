import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { contactApi } from '../services/api';
import { useCart } from '../context/CartContext';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await contactApi.submit(formData);
      setSuccessSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
      showToast('Inquiry received! Our concierge will contact you within 24 hours.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          White-Glove Service
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-stone-900">
          Connect With The Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          Whether you require bespoke shoe sizing, perfume consultations, corporate gifting, or order assistance,
          our dedicated concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Flagship Atelier Details
            </h3>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-900">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Showroom & Atelier</h4>
                  <p className="mt-0.5 leading-relaxed">
                    BIZORA House, Plot 14-C, MM Alam Road, Gulberg III, Lahore, Punjab 54000, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-900">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Direct Phone & WhatsApp</h4>
                  <p className="mt-0.5">+92 (300) 123-4567 / +92 (42) 3571-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-900">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Official Email</h4>
                  <p className="mt-0.5">concierge@bizora.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-900">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Atelier Working Hours</h4>
                  <p className="mt-0.5">Monday – Saturday: 10:00 AM – 9:00 PM PKT</p>
                  <p className="text-[11px] text-stone-400">Sunday: Closed for private appointments</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => navigate('faq')}
                className="w-full py-2.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-stone-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                <span>Send An Atelier Inquiry</span>
              </h3>
              <span className="text-[10px] text-stone-400">Direct Backend Submission</span>
            </div>

            {successSubmitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">Thank you for contacting BIZORA.</p>
                  <p>Your message has been received by our client services team. We will respond promptly.</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    placeholder="e.g. Daniyal Siddiqui"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="daniyal@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="contact-phone-input"
                    type="tel"
                    placeholder="0300-1234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject-select"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bespoke Shoe Sizing">Bespoke Shoe Sizing</option>
                    <option value="Perfume Consultation">Perfume Consultation</option>
                    <option value="Order Tracking / COD">Order Tracking / COD</option>
                    <option value="Corporate / VIP Gifting">Corporate / VIP Gifting</option>
                    <option value="Returns / Exchange">Returns & Exchange</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Message <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={5}
                  placeholder="Please describe how we can assist you..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Message...' : 'Dispatch Inquiry to Concierge'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
