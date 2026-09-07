import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, CheckCircle2, Clock, Trash2, Loader2 } from 'lucide-react';
import { ContactMessage } from '../../types';
import { contactApi } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const AdminInquiries: React.FC = () => {
  const { showToast } = useCart();
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getAll();
      setInquiries(res.contacts);
    } catch (err) {
      console.error('Failed to load inquiries', err);
      showToast('Error loading contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await contactApi.markRead(id);
      setInquiries(prev => prev.map(i => (i.id === id ? res.contact : i)));
      showToast('Inquiry marked as read');
    } catch (err: any) {
      showToast(err.message || 'Error updating inquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Customer Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Questions, bespoke tailoring inquiries, and feedback submitted through the contact form.
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
          {inquiries.filter(i => i.status === 'unread').length} Unread Messages
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading messages...</span>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No customer inquiries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map(item => (
              <div
                key={item.id}
                className={`p-6 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  item.status === 'unread' ? 'bg-indigo-50/20' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-indigo-700">{item.subject}</p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white/60 p-3 rounded-xl border border-slate-100">
                    "{item.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${item.email}`} className="hover:underline text-indigo-600">
                        {item.email}
                      </a>
                    </span>
                    {item.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${item.phone}`} className="hover:underline">
                          {item.phone}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {item.status === 'unread' && (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}
                  <a
                    href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.subject)}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
