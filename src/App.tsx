/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/ui/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ProductionPage } from './pages/ProductionPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { RecipesBlogPage } from './pages/RecipesBlogPage';
import { ContactBranchesPage } from './pages/ContactBranchesPage';
import { FavoritesPage } from './pages/FavoritesPage';

// Modals & Drawers
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/auth/ProfileModal';

import { Product, ProductCategory } from './types';

function MainAppShell() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialCategory, setInitialCategory] = useState<ProductCategory | 'all'>('all');
  const [initialArticleId, setInitialArticleId] = useState<string | undefined>(undefined);

  const { isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useAuth();

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct]);

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'account') {
      handleOpenAuthOrProfile();
      return;
    }

    if (params?.category) {
      setInitialCategory(params.category);
    } else {
      setInitialCategory('all');
    }

    if (params?.articleId) {
      setInitialArticleId(params.articleId);
    } else {
      setInitialArticleId(undefined);
    }

    setCurrentPage(page);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product_detail');
  };

  const handleOpenAuthOrProfile = () => {
    if (user) {
      setIsProfileModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D1117] text-[#17202A] dark:text-[#F5F7F9] flex flex-col font-sans selection:bg-[#C71925] selection:text-white transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-[#0D1117] text-white py-2 px-4 text-center text-xs font-medium border-b border-[#29323C] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#73B832] dark:bg-[#82C744] animate-pulse" />
            <span>Toshkent bo'ylab 150 000 so'mdan yuqori buyurtmalarga <strong className="text-[#E32935]">bepul yetkazib berish!</strong></span>
          </div>
          <div className="flex items-center gap-4 text-gray-300 text-[11px]">
            <span>📞 Yagona koll-markaz: <strong className="text-white">+998 (71) 200-88-99</strong></span>
            <span>❄️ Sovutilgan termo-yetkazish (+4°C)</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Main View Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            initialCategory={initialCategory}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product_detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentPage('products')}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'production' && (
          <ProductionPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'certificates' && (
          <CertificatesPage />
        )}

        {currentPage === 'blog' && (
          <RecipesBlogPage
            initialArticleId={initialArticleId}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'contact' && (
          <ContactBranchesPage />
        )}

        {currentPage === 'favorites' && (
          <FavoritesPage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sidebar Menu Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(_order) => {
          setIsCheckoutOpen(false);
          setIsProfileModalOpen(true);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile & Orders Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <MainAppShell />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

