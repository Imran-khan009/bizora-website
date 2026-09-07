import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  Heart,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productsApi, resolveAssetUrl } from '../services/api';
import { Product, SiteSettings } from '../types';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  siteSettings: SiteSettings | null;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate, siteSettings }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, subtotal, openCart, wishlist } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productsApi.getAll({ search: searchQuery, limit: 5 });
        setSearchResults(res.products);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Shop', route: 'shop' },
    { label: 'Categories', route: 'categories' },
    { label: 'About', route: 'about' },
    { label: 'Services', route: 'services' },
    { label: 'Blog', route: 'blog' },
    { label: 'Contact', route: 'contact' },
    { label: 'FAQ', route: 'faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>
          {siteSettings?.announcementText ||
            '✨ Flash Offer: FREE Express Delivery on orders over Rs. 3,500 across Pakistan! Use code BIZORA10'}
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => navigate('home')}
            className="cursor-pointer flex items-center select-none"
          >
            {siteSettings?.logoUrl ? (
              <img
                src={resolveAssetUrl(siteSettings.logoUrl)}
                alt={siteSettings.siteName || 'BIZORA'}
                className="h-10 max-w-[180px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center md:items-start">
                <span
                  style={{ width: '116.641px', height: '44px' }}
                  className="text-2xl sm:text-3xl font-black tracking-tighter text-indigo-600 inline-flex items-center"
                >
                  {siteSettings?.siteName || 'BIZORA'}
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-slate-400 font-bold -mt-0.5">
                  {siteSettings?.tagline || 'Atelier & Luxury'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(link => {
              const active = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.route}`}
                  onClick={() => navigate(link.route)}
                  className={`text-sm font-semibold transition-colors cursor-pointer py-1 relative ${
                    active
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <div className="relative" ref={searchRef}>
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Expandable Search Popup */}
              {searchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50">
                  <div className="relative">
                    <input
                      id="header-search-input"
                      type="text"
                      placeholder="Search watches, perfumes, shoes..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Search Results Preview */}
                  {isSearching ? (
                    <div className="py-4 text-center text-xs text-slate-400">Searching BIZORA catalog...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="mt-3 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {searchResults.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(`product/${p.id}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="py-2 px-1 flex items-center gap-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                            <p className="text-xs text-indigo-600 font-bold">
                              Rs. {(p.discountPrice || p.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <button
                          onClick={() => {
                            navigate(`shop?search=${encodeURIComponent(searchQuery)}`);
                            setSearchOpen(false);
                          }}
                          className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                          View all results in Shop →
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No products found matching "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              id="wishlist-btn"
              onClick={() => navigate('shop')}
              className="p-2.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors relative hidden sm:block"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Icon */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-slate-900 border border-slate-200/60"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                Rs. {subtotal.toLocaleString()}
              </span>
            </button>

            {/* User Account / Profile */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    id="user-account-dropdown-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 bg-white hover:border-indigo-500 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold uppercase shadow-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold hidden md:inline truncate max-w-[100px] text-slate-800">
                      {user?.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 font-bold rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          id="dropdown-admin-panel-btn"
                          onClick={() => {
                            navigate('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-indigo-700 font-bold hover:bg-indigo-50 flex items-center gap-2"
                        >
                          <Sliders className="w-4 h-4 text-indigo-600" />
                          Admin Dashboard
                        </button>
                      )}

                      <button
                        id="dropdown-account-btn"
                        onClick={() => {
                          navigate('account');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        My Profile & Address
                      </button>

                      <button
                        id="dropdown-orders-btn"
                        onClick={() => {
                          navigate('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        My Orders
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    id="header-login-btn"
                    onClick={() => navigate('login')}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 border border-slate-200 bg-white rounded-full hover:border-indigo-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    id="header-register-btn"
                    onClick={() => navigate('register')}
                    className="hidden sm:inline-block px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.route}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${
                  currentRoute === link.route
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-indigo-600" />
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => {
                navigate('cart');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="font-bold text-indigo-600">{totalItems} items</span>
            </button>
            <button
              onClick={() => {
                navigate('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
            >
              Order Tracking & History
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
