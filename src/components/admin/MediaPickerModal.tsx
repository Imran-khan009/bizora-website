import React, { useState, useEffect } from 'react';
import { X, Upload, Search, Check, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { MediaItem } from '../../types';
import { mediaApi, resolveAssetUrl } from '../../services/api';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  defaultCategory?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Image',
  defaultCategory = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(defaultCategory);

  // Upload tab state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState('products');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Direct URL state
  const [manualUrl, setManualUrl] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !selectedFile) {
      setUploadError('Please choose an image file.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await mediaApi.upload({
        fileData: previewUrl,
        fileName: selectedFile.name,
        category: uploadCategory
      });
      onSelect(res.media.url);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onSelect(manualUrl.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Media Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Paste Image URL
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. LIBRARY TAB */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search images by filename or url..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </form>

                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="products">Products</option>
                  <option value="banners">Banners</option>
                  <option value="logos">Logos</option>
                  <option value="categories">Categories</option>
                  <option value="general">General</option>
                </select>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs">Loading media assets...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">No media images found. Upload one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[450px] overflow-y-auto pr-1">
                  {mediaList.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-600 cursor-pointer transition-all shadow-sm hover:shadow-md"
                    >
                      <img
                        src={resolveAssetUrl(item.url)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                        <Check className="w-5 h-5 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium line-clamp-2">
                          Select Image
                        </span>
                      </div>
                      <span className="absolute bottom-1 left-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. UPLOAD TAB */}
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="h-44 mx-auto object-contain rounded-lg border border-slate-200 shadow-sm"
                    />
                    <p className="text-xs text-slate-600 font-medium">{selectedFile?.name}</p>
                    <label className="inline-block text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer underline">
                      Choose another file
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                        Click to choose image file
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        PNG, JPG, or WEBP (Max 5MB)
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

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-700">Category:</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="products">Products</option>
                  <option value="banners">Banners</option>
                  <option value="logos">Logos</option>
                  <option value="categories">Categories</option>
                  <option value="general">General</option>
                </select>
              </div>

              {uploadError && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg">
                  {uploadError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!previewUrl || isUploading}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isUploading ? 'Uploading...' : 'Upload & Use'}
                </button>
              </div>
            </form>
          )}

          {/* 3. URL TAB */}
          {activeTab === 'url' && (
            <form onSubmit={handleManualUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={e => setManualUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              {manualUrl && (
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center">
                  <p className="text-[10px] text-slate-500 mb-2 font-medium">Image Preview</p>
                  <img
                    src={resolveAssetUrl(manualUrl)}
                    alt="Preview"
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="h-36 mx-auto object-contain rounded-lg border border-slate-200"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!manualUrl.trim()}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  Use URL
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
