import {
  Product,
  Category,
  Order,
  ContactMessage,
  SiteSettings,
  AdminStats,
  User,
  MediaItem,
  WebsiteContent
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
let assetBaseUrl = '';

function apiUrl(endpoint: string): string {
  if (!API_BASE_URL) return endpoint;
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

// Fetch backend asset configuration
export async function initConfig(): Promise<string> {
  try {
    const res = await fetch(apiUrl('/api/config'));
    if (res.ok) {
      const data = await res.json();
      assetBaseUrl = data.assetBaseUrl || '';
    }
  } catch {
    assetBaseUrl = '';
  }
  return assetBaseUrl;
}

export function resolveAssetUrl(url: string | undefined): string {
  if (!url) return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Remove leading slash if base URL has trailing slash or vice versa
  const configuredBase = assetBaseUrl || import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.BASE_URL;
  const base = configuredBase.endsWith('/') ? configuredBase.slice(0, -1) : configuredBase;
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${base}${cleanPath}`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('bizora_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('bizora_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('bizora_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(endpoint), {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}: ${res.statusText}`);
  }

  return data as T;
}

// Auth API
export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => request<{ user: User }>('/api/auth/me'),
};

// Products API
export const productsApi = {
  getAll: (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    sale?: boolean;
    status?: string;
    stockStatus?: string;
    sort?: string;
    includeInactive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      if (params.category && params.category !== 'all') query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
      if (params.featured !== undefined) query.set('featured', params.featured.toString());
      if (params.sale !== undefined) query.set('sale', params.sale.toString());
      if (params.status && params.status !== 'all') query.set('status', params.status);
      if (params.stockStatus && params.stockStatus !== 'all') query.set('stockStatus', params.stockStatus);
      if (params.sort) query.set('sort', params.sort);
      if (params.includeInactive) query.set('includeInactive', 'true');
      if (params.page) query.set('page', params.page.toString());
      if (params.limit) query.set('limit', params.limit.toString());
    }
    const qStr = query.toString();
    return request<{
      products: Product[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/api/products${qStr ? `?${qStr}` : ''}`);
  },
  getById: (id: string) => request<{ product: Product; related: Product[] }>(`/api/products/${id}`),
  create: (payload: Partial<Product>) =>
    request<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<Product>) =>
    request<{ product: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  addReview: (productId: string, payload: { userName: string; rating: number; comment: string }) =>
    request<{ product: Product; review: any }>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// Categories API
export const categoriesApi = {
  getAll: () => request<{ categories: Category[] }>('/api/categories'),
  create: (payload: Partial<Category>) =>
    request<{ category: Category }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<Category>) =>
    request<{ category: Category }>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  create: (payload: {
    items: any[];
    customerInfo: any;
    deliveryFee?: number;
    discountAmount?: number;
    paymentMethod?: string;
  }) =>
    request<{ order: Order }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAll: (params?: { status?: string; search?: string; email?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.set('status', params.status);
      if (params.search) query.set('search', params.search);
      if (params.email) query.set('email', params.email);
    }
    const qStr = query.toString();
    return request<{ orders: Order[] }>(`/api/orders${qStr ? `?${qStr}` : ''}`);
  },
  getById: (id: string) => request<{ order: Order }>(`/api/orders/${id}`),
  updateStatus: (id: string, payload: { status?: string; paymentStatus?: string }) =>
    request<{ order: Order }>(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// Contact API
export const contactApi = {
  submit: (payload: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    request<{ message: string; contact: ContactMessage }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAll: () => request<{ contacts: ContactMessage[] }>('/api/contact'),
  markRead: (id: string) =>
    request<{ contact: ContactMessage }>(`/api/contact/${id}/read`, {
      method: 'PUT',
    }),
};

// Users API (Admin / Profile)
export const usersApi = {
  getAll: () => request<{ users: User[] }>('/api/users'),
  update: (id: string, payload: Partial<User>) =>
    request<{ user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// Settings API
export const settingsApi = {
  get: () => request<{ settings: SiteSettings }>('/api/settings'),
  update: (payload: Partial<SiteSettings>) =>
    request<{ settings: SiteSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// Admin Stats API
export const adminApi = {
  getStats: () => request<{ stats: AdminStats }>('/api/admin/stats'),
};

// Media API (Admin / Library)
export const mediaApi = {
  getAll: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.set('search', params.search);
      if (params.category && params.category !== 'all') query.set('category', params.category);
    }
    const qStr = query.toString();
    return request<{ media: MediaItem[] }>(`/api/media${qStr ? `?${qStr}` : ''}`);
  },
  upload: (payload: { fileData?: string; fileName?: string; name?: string; category?: string; url?: string }) =>
    request<{ media: MediaItem }>('/api/media/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/media/${id}`, {
      method: 'DELETE',
    }),
};

// Website Content API
export const contentApi = {
  get: () => request<{ content: WebsiteContent }>('/api/content'),
  update: (payload: Partial<WebsiteContent>) =>
    request<{ content: WebsiteContent }>('/api/content', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

