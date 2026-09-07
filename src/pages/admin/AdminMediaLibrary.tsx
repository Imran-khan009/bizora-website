import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Copy,
  Trash2,
  Check,
  Eye,
  X,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { MediaItem } from '../../types';
import { mediaApi, resolveAssetUrl } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const AdminMediaLibrary: React.FC = () => {
  const { showToast } = useCart();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState('products');
  const [uploadTitle, setUploadTitle] = useState('');

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fullscreen Preview
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Delete State
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await mediaApi.getAll({
        search: search.trim() || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      });
      setMediaList(res.media);
    } catch (err) {
      console.error('Failed to load media', err);
      showToast('Error loading media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image file must be under 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewData || !selectedFile) {
      showToast('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      const res = await mediaApi.upload({
        fileData: previewData,
        fileName: selectedFile.name,
        name: uploadTitle || selectedFile.name,
        category: uploadCategory
      });
      showToast(`Asset "${res.media.name}" uploaded successfully!`);
      setSelectedFile(null);
      setPreviewData('');
      setUploadTitle('');
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Asset URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await mediaApi.delete(itemToDelete.id);
      showToast('Media item deleted');
      setItemToDelete(null);
      fetchMedia();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete media');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Media & Image Library
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Centralized hub for all BIZORA product photos, marketing banners, and branding logos.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Upload New Image
        </h3>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
            {previewData ? (
              <div className="space-y-3">
                <img
                  src={previewData}
                  alt="Upload Preview"
                  className="h-44 mx-auto object-contain rounded-xl border border-slate-200 shadow-sm bg-white"
                />
                <p className="text-xs text-slate-600 font-semibold">{selectedFile?.name}</p>
                <label className="inline-block text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer underline">
                  Choose different file
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2 py-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    Click to browse or drag and drop image here
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {previewData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Oxford Shoes Front Angle"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="products">Products</option>
                  <option value="banners">Banners</option>
                  <option value="logos">Logos</option>
                  <option value="categories">Categories</option>
                  <option value="general">General</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? 'Uploading to Server...' : 'Upload & Save to Library'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'products', 'banners', 'logos', 'categories', 'general'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading media assets...</span>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No media assets found</p>
            <p className="text-xs text-slate-400">Upload your first image using the box above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map(item => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={resolveAssetUrl(item.url)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />

                    {/* Category tag */}
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md capitalize backdrop-blur-xs">
                      {item.category || 'general'}
                    </span>

                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
                        title="View Full Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(item.url, item.id)}
                        className={`p-2 rounded-lg transition-colors shadow-sm ${
                          isCopied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Copy Image URL"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 truncate" title={item.url}>
                      {item.url}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{previewItem.name}</h4>
                <span className="text-[11px] font-mono text-slate-500">{previewItem.url}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-100 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={resolveAssetUrl(previewItem.url)}
                alt={previewItem.name}
                className="max-h-[50vh] object-contain rounded-xl shadow-md bg-white"
              />
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => copyToClipboard(previewItem.url, previewItem.id)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy URL
              </button>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Image Asset</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to delete <strong>"{itemToDelete.name}"</strong>?
              </p>
              <p className="text-[11px] text-slate-400">
                Products or sections linking to this image will no longer display it.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
