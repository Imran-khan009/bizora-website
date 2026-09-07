import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { SiteSettings } from './types';
import { settingsApi } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogPage } from './pages/BlogPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await settingsApi.get();
        setSiteSettings(res.settings);
      } catch (err) {
        console.error('Failed to load site settings', err);
      }
    }
    loadSettings();

    // Parse initial hash route if any
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) {
      setCurrentRoute(hash);
    }

    const handleHashChange = () => {
      const h = window.location.hash.replace('#/', '').replace('#', '');
      setCurrentRoute(h || 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Parser
  const renderPage = () => {
    // Product Details: e.g. product/prod_1
    if (currentRoute.startsWith('product/')) {
      const productId = currentRoute.split('/')[1];
      return <ProductDetailsPage productId={productId} navigate={navigate} />;
    }

    // Order confirmation: e.g. order-confirmation/ord_123
    if (currentRoute.startsWith('order-confirmation/')) {
      const orderId = currentRoute.split('/')[1];
      return <OrderConfirmationPage orderId={orderId} navigate={navigate} />;
    }

    // Shop with search or category query: e.g. shop?category=shoes or shop?search=watch
    if (currentRoute.startsWith('shop')) {
      const queryPart = currentRoute.includes('?') ? currentRoute.split('?')[1] : '';
      const params = new URLSearchParams(queryPart);
      const cat = params.get('category') || 'all';
      const q = params.get('search') || '';
      return <ShopPage key={`${cat}-${q}`} navigate={navigate} initialCategory={cat} initialSearch={q} />;
    }

    switch (currentRoute) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'categories':
        return <CategoriesPage navigate={navigate} />;
      case 'cart':
        return <CartPage navigate={navigate} />;
      case 'checkout':
        return <CheckoutPage navigate={navigate} />;
      case 'orders':
        return <OrderHistoryPage navigate={navigate} />;
      case 'about':
        return <AboutPage navigate={navigate} />;
      case 'services':
        return <ServicesPage navigate={navigate} />;
      case 'blog':
        return <BlogPage navigate={navigate} />;
      case 'faq':
        return <FAQPage navigate={navigate} />;
      case 'contact':
        return <ContactPage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'register':
        return <RegisterPage navigate={navigate} />;
      case 'account':
        return <UserAccountPage navigate={navigate} />;
      case 'admin':
        return <AdminDashboard navigate={navigate} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500/20 selection:text-indigo-900">
      <Header
        currentRoute={currentRoute}
        navigate={navigate}
        announcementText={siteSettings?.announcementText}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer navigate={navigate} siteSettings={siteSettings} />
      <CartDrawer navigate={navigate} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
