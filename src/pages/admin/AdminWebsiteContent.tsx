import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Save,
  Check,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { WebsiteContent, WhyChooseUsItem } from '../../types';
import { contentApi, resolveAssetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';

export const AdminWebsiteContent: React.FC = () => {
  const { showToast } = useCart();

  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Active section tab
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'promo' | 'whyChooseUs'>('hero');

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string>('');

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await contentApi.get();
      setContent(res.content);
    } catch (err) {
      console.error('Failed to load content', err);
      showToast('Error loading website content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content) return;

    setSaving(true);
    try {
      await contentApi.update(content);
      showToast('Website content updated successfully! Public storefront is live with your changes.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (url: string) => {
    if (!content) return;

    if (mediaPickerTarget === 'hero') {
      setContent({
        ...content,
        hero: { ...content.hero, image: url }
      });
    } else if (mediaPickerTarget === 'about') {
      setContent({
        ...content,
        about: { ...content.about, image: url }
      });
    } else if (mediaPickerTarget === 'promo') {
      setContent({
        ...content,
        promoBanner: { ...content.promoBanner, image: url }
      });
    }
  };

  // Why choose us helpers
  const handleAddWhyChooseUsItem = () => {
    if (!content) return;
    const newItem: WhyChooseUsItem = {
      id: `wcu_${Date.now()}`,
      title: 'New Service Promise',
      description: 'Describe the exclusive benefit or luxury warranty offered to BIZORA customers.',
      icon: 'ShieldCheck'
    };
    setContent({
      ...content,
      whyChooseUs: {
        ...content.whyChooseUs,
        items: [...content.whyChooseUs.items, newItem]
      }
    });
  };

  const handleUpdateWhyChooseUsItem = (index: number, field: keyof WhyChooseUsItem, value: string) => {
    if (!content) return;
    const updated = [...content.whyChooseUs.items];
    updated[index] = { ...updated[index], [field]: value };
    setContent({
      ...content,
      whyChooseUs: {
        ...content.whyChooseUs,
        items: updated
      }
    });
  };

  const handleRemoveWhyChooseUsItem = (index: number) => {
    if (!content) return;
    if (content.whyChooseUs.items.length <= 1) {
      showToast('At least one feature point is required');
      return;
    }
    const updated = content.whyChooseUs.items.filter((_, i) => i !== index);
    setContent({
      ...content,
      whyChooseUs: {
        ...content.whyChooseUs,
        items: updated
      }
    });
  };

  if (loading || !content) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-xs font-semibold">Loading CMS content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Homepage Content Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit text, headings, banners, and marketing sections dynamically without touching code.
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 pt-3 rounded-2xl shadow-sm overflow-x-auto gap-3">
        {[
          { id: 'hero', label: '1. Hero Section' },
          { id: 'about', label: '2. About Brand' },
          { id: 'promo', label: '3. Promotional Banner' },
          { id: 'whyChooseUs', label: '4. Why Choose Us' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeSection === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. HERO SECTION */}
      {activeSection === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hero Section Editor</h3>
              <p className="text-xs text-slate-500">
                Primary above-the-fold banner welcoming visitors to BIZORA.
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Live on Homepage
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={content.hero.eyebrow}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, eyebrow: e.target.value }
                    })
                  }
                  placeholder="e.g., Luxury Redefined"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Headline *
                </label>
                <input
                  type="text"
                  value={content.hero.heading}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, heading: e.target.value }
                    })
                  }
                  placeholder="e.g., Step Into Unrivaled Elegance"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black text-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={content.hero.description}
                  onChange={e =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value }
                    })
                  }
                  placeholder="Compelling value proposition for BIZORA..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttonText}
                    onChange={e =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, buttonText: e.target.value }
                      })
                    }
                    placeholder="Shop Collection"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={content.hero.buttonLink}
                    onChange={e =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, buttonLink: e.target.value }
                      })
                    }
                    placeholder="/shop"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonText || ''}
                    onChange={e =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonText: e.target.value }
                      })
                    }
                    placeholder="Explore Lookbook"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonLink || ''}
                    onChange={e =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, secondaryButtonLink: e.target.value }
                      })
                    }
                    placeholder="/lookbook"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Hero Image & Live Preview */}
            <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Hero Image Asset</span>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('hero');
                    setIsMediaPickerOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image
                </button>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
                <img
                  src={resolveAssetUrl(content.hero.image)}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="text"
                value={content.hero.image}
                onChange={e =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, image: e.target.value }
                  })
                }
                placeholder="Hero image URL"
                className="w-full px-3 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-600"
              />

              <p className="text-[11px] text-slate-400">
                Recommended aspect ratio: 16:9 or 4:3 high-resolution luxury product or lifestyle shot.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ABOUT SECTION */}
      {activeSection === 'about' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">About BIZORA Story Editor</h3>
            <p className="text-xs text-slate-500">
              Brand heritage, artisan craft ethos, and customer values narrative.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={e =>
                    setContent({
                      ...content,
                      about: { ...content.about, title: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Story Paragraph 1 *
                </label>
                <textarea
                  rows={3}
                  value={content.about.description}
                  onChange={e =>
                    setContent({
                      ...content,
                      about: { ...content.about, description: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Story Paragraph 2 (Secondary)
                </label>
                <textarea
                  rows={3}
                  value={content.about.secondaryDescription || ''}
                  onChange={e =>
                    setContent({
                      ...content,
                      about: { ...content.about, secondaryDescription: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">About Section Photo</span>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('about');
                    setIsMediaPickerOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image
                </button>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
                <img
                  src={resolveAssetUrl(content.about.image)}
                  alt="About Brand"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="text"
                value={content.about.image}
                onChange={e =>
                  setContent({
                    ...content,
                    about: { ...content.about, image: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. PROMO BANNER */}
      {activeSection === 'promo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Promotional Banner Editor</h3>
            <p className="text-xs text-slate-500">
              Middle homepage callout with promo discount codes and special sales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  value={content.promoBanner.heading}
                  onChange={e =>
                    setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner, heading: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Description *
                </label>
                <textarea
                  rows={2}
                  value={content.promoBanner.description}
                  onChange={e =>
                    setContent({
                      ...content,
                      promoBanner: { ...content.promoBanner, description: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Promo Code (e.g. LUXE20)
                  </label>
                  <input
                    type="text"
                    value={content.promoBanner.promoCode}
                    onChange={e =>
                      setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner, promoCode: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-indigo-600 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={content.promoBanner.buttonText}
                    onChange={e =>
                      setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner, buttonText: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={content.promoBanner.buttonLink}
                    onChange={e =>
                      setContent({
                        ...content,
                        promoBanner: { ...content.promoBanner, buttonLink: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Banner Background Photo</span>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('promo');
                    setIsMediaPickerOpen(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image
                </button>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-200">
                <img
                  src={resolveAssetUrl(content.promoBanner.image)}
                  alt="Promo Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="text"
                value={content.promoBanner.image}
                onChange={e =>
                  setContent({
                    ...content,
                    promoBanner: { ...content.promoBanner, image: e.target.value }
                  })
                }
                className="w-full px-3 py-1.5 text-[11px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. WHY CHOOSE US / FEATURES */}
      {activeSection === 'whyChooseUs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Why Choose Us Points</h3>
              <p className="text-xs text-slate-500">
                Trust guarantees, delivery commitments, and craftsmanship guarantees.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddWhyChooseUsItem}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Guarantee Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={content.whyChooseUs.title}
                onChange={e =>
                  setContent({
                    ...content,
                    whyChooseUs: { ...content.whyChooseUs, title: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={content.whyChooseUs.subtitle}
                onChange={e =>
                  setContent({
                    ...content,
                    whyChooseUs: { ...content.whyChooseUs, subtitle: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4 pt-2">
            {content.whyChooseUs.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    Card #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveWhyChooseUsItem(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => handleUpdateWhyChooseUsItem(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => handleUpdateWhyChooseUsItem(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating or Bottom Save Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-slate-200">
            Unsaved changes will not appear on the storefront until you click Save.
          </span>
        </div>
        <button
          onClick={() => handleSaveAll()}
          disabled={saving}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? 'Publishing...' : 'Save & Publish Live'}
        </button>
      </div>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title="Select Content Image Asset"
        defaultCategory="banners"
      />
    </div>
  );
};
