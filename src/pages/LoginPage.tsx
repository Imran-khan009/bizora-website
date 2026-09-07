import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface LoginPageProps {
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password);
      showToast('Welcome back to BIZORA Atelier');
      navigate('home');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'customer') => {
    setLoading(true);
    setError('');
    const targetEmail = role === 'admin' ? 'admin@bizora.com' : 'customer@bizora.com';
    const targetPass = 'bizora123';
    setEmail(targetEmail);
    setPassword(targetPass);

    try {
      await login(targetEmail, targetPass);
      showToast(role === 'admin' ? 'Logged in as Atelier Administrator' : 'Logged in as VIP Patron');
      navigate(role === 'admin' ? 'admin' : 'home');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Atelier Society
        </span>
        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-stone-900">
          Sign In To BIZORA
        </h1>
        <p className="text-xs text-stone-500">
          Access your order registry, bespoke measurements, and VIP privilege perks.
        </p>
      </div>

      {/* Quick Demo Credentials Panel */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 space-y-2.5">
        <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-stone-900" />
          <span>Instant One-Click Demo Access</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            className="py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-left"
          >
            <span className="block text-[10px] text-amber-700 uppercase font-semibold">Admin Panel</span>
            <span>admin@bizora.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            disabled={loading}
            className="py-2 px-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-left"
          >
            <span className="block text-[10px] text-emerald-700 uppercase font-semibold">Patron Account</span>
            <span>customer@bizora.com</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                required
                placeholder="e.g. patron@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          <span>Do not have an atelier account yet? </span>
          <button
            onClick={() => navigate('register')}
            className="font-bold text-stone-900 underline hover:text-black ml-1"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
