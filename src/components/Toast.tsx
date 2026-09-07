import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-[#111] text-white px-5 py-3 rounded-xl shadow-2xl border border-stone-800 flex items-center gap-3 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
