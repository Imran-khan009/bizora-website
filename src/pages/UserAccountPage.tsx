import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Package, Shield, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usersApi } from '../services/api';

interface UserAccountPageProps {
  navigate: (route: string) => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({ navigate }) => {
  const { user, logout, isAdmin, refreshUser } = useAuth();
  const { showToast } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Lahore',
    province: user?.address?.province || 'Punjab',
    postalCode: user?.address?.postalCode || ''
  });
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('login');
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.update(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        }
      });
      await refreshUser();
      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Atelier Society Member
          </span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            My Account & Profile
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Member since {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate('admin')}
              className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <button
            onClick={() => {
              logout();
              showToast('You have signed out.');
              navigate('home');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Quick Stats / Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-stone-900 text-[#d4af37] font-['Playfair_Display',serif] text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">{user.name}</h3>
              <p className="text-xs text-stone-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-700">
                Role: {user.role}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Quick Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('orders')}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 rounded-xl text-left flex items-center justify-between font-bold text-stone-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-600" />
                  <span>View My Orders</span>
                </span>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('shop')}
                className="w-full p-3 bg-stone-50 hover:bg-stone-100 rounded-xl text-left flex items-center justify-between font-bold text-stone-800 transition-colors"
              >
                <span>Explore Creations</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details / Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Personal Information & Shipping Address
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-stone-900 underline hover:text-black"
              >
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-stone-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Full Name
                    </span>
                    <span className="text-stone-900 font-bold text-sm mt-0.5 block">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Email Address
                    </span>
                    <span className="text-stone-900 font-bold text-sm mt-0.5 block">{user.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Phone Number
                    </span>
                    <span className="text-stone-900 font-semibold mt-0.5 block">
                      {user.phone || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Delivery Address
                    </span>
                    <span className="text-stone-900 font-semibold mt-0.5 block">
                      {user.address?.street
                        ? `${user.address.street}, ${user.address.city}, ${user.address.province} ${user.address.postalCode || ''}`
                        : 'No default address saved'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
