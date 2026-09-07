export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: UserAddress;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku?: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: ProductReview[];
  featured: boolean;
  sale: boolean;
  status: 'active' | 'inactive';
  specifications?: ProductSpecification[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  status?: 'active' | 'inactive';
  featured?: boolean;
  productCount?: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
  category?: 'products' | 'banners' | 'logos' | 'categories' | 'general';
  createdAt: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface WebsiteContent {
  hero: {
    eyebrow?: string;
    heading: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    heroImage: string;
    featuredBadgeTitle?: string;
    featuredBadgeName?: string;
    featuredBadgePrice?: string;
  };
  about: {
    heading: string;
    description: string;
    image: string;
  };
  promo: {
    badge?: string;
    heading: string;
    description: string;
    code?: string;
    buttonText: string;
    buttonLink: string;
    bannerImage?: string;
  };
  whyChooseUs: WhyChooseUsItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerOrderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  customerInfo: CustomerOrderInfo;
  shippingAddress?: CustomerOrderInfo;
  subtotal: number;
  deliveryFee: number;
  shippingFee?: number;
  discountAmount?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded' | string;
  status: OrderStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  content?: WebsiteContent;
  currency: string;
  currencySymbol: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  announcementText: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: Order[];
}
