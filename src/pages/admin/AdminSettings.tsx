import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Upload,
  Save,
  Trash2,
  Check,
  Globe,
  Truck,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { settingsApi, resolveAssetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';

export const AdminSettings: React.FC = () => {
  const { showToast } = useCart();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Logo media picker
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.get();
      setSettings(res.settings);
    } catch (err) {
      console.error('Failed to load settings', err);
      showToast('Error loading store settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await settingsApi.update(settings);
      showToast('BIZORA settings & branding updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLogo = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      logoUrl: ''
    });
    showToast('Custom logo removed. Default BIZORA typography will be displayed.');
  };

  if (loading || !settings) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Store Settings & Brand Identity
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure your brand logo, currency, contact channels, and delivery rates.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. BRAND LOGO MANAGEMENT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Website Logo Management
              </h3>
              <p className="text-xs text-slate-500">
                Upload your custom BIZORA logo emblem. If no image is provided, the website displays the default stylized typographic logo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo Preview Box */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Header Live Preview
              </span>

              <div className="h-20 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-3 shadow-xs">
                {settings.logoUrl ? (
                  <img
                    src={resolveAssetUrl(settings.logoUrl)}
                    alt="BIZORA Logo"
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-wider text-slate-900">
                      BIZORA
                    </span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  </div>
                )}
              </div>

              <span className="text-[11px] text-slate-500 block">
                {settings.logoUrl ? 'Using custom image logo' : 'Using default typographic logo'}
              </span>
            </div>

            {/* Logo Controls */}
            <div className="md:col-span-8 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Logo Asset URL / File
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.logoUrl || ''}
                  onChange={e => setSettings({ ...settings, logoUrl: e.target.value })}
                  placeholder="e.g. /uploads/bizora_logo.png or https://..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsLogoPickerOpen(true)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload / Browse
                </button>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove Logo (Revert to text)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Recommended: Transparent PNG or SVG, horizontal aspect ratio (e.g. 240x60px), max height 48px.
              </p>
            </div>
          </div>
        </div>

        {/* 2. GENERAL STORE SETTINGS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. SHIPPING & ORDERS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            Shipping & Order Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Shipping Fee (PKR)
              </label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={e => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Free Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={e =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. CONTACT & WHATSAPP SUPPORT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            Contact & Customer Support Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Order Channel
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+923001234567"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 5. SOCIAL MEDIA LINKS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Social Media Handles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
              <input
                type="text"
                value={settings.socialLinks.instagram || ''}
                onChange={e =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                  })
                }
                placeholder="https://instagram.com/bizora"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook</label>
              <input
                type="text"
                value={settings.socialLinks.facebook || ''}
                onChange={e =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })
                }
                placeholder="https://facebook.com/bizora"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">TikTok</label>
              <input
                type="text"
                value={settings.socialLinks.tiktok || ''}
                onChange={e =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                  })
                }
                placeholder="https://tiktok.com/@bizora"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Logo Media Picker */}
      <MediaPickerModal
        isOpen={isLogoPickerOpen}
        onClose={() => setIsLogoPickerOpen(false)}
        onSelect={url => {
          setSettings({ ...settings, logoUrl: url });
        }}
        title="Select or Upload BIZORA Brand Logo"
        defaultCategory="logos"
      />
    </div>
  );
};
