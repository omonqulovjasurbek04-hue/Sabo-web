import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, Phone, Globe, ChevronDown, User, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenMobileMenu,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { favoritesCount } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', label: t.nav.home },
    { key: 'products', label: t.nav.products },
    { key: 'production', label: t.nav.production },
    { key: 'about', label: t.nav.about },
    { key: 'certificates', label: t.nav.certificates },
    { key: 'blog', label: t.nav.blog },
    { key: 'contact', label: t.nav.contact },
  ];

  const languageLabels: Record<Language, { label: string; flag: string }> = {
    uz: { label: "O'zbek", flag: 'UZ' },
    ru: { label: 'Русский', flag: 'RU' },
    en: { label: 'English', flag: 'EN' },
  };

  return (
    <>
      {/* Top Banner with Delivery message & hotline */}
      <div className="bg-[#0D1117] text-white text-xs py-2 px-4 border-b border-[#29323C] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#73B832] animate-pulse" />
              {t.nav.fastDelivery}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/80 hidden md:inline">{t.nav.freeDeliveryAbove}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="tel:+998993451655"
              className="flex items-center gap-1.5 text-white/90 hover:text-[#2498D1] transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#2498D1]" />
              <span>{t.nav.callCenter} (+998 99 345-16-55)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#1C242D]/95 backdrop-blur-md shadow-md py-3 border-b border-[#DCE3E8] dark:border-[#29323C]'
            : 'bg-white/90 dark:bg-[#151B22]/90 backdrop-blur-sm py-4 border-b border-[#DCE3E8]/60 dark:border-[#29323C]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <img
                src="/image/logo.png"
                alt="SABO Logo"
                className="h-10 sm:h-11 w-auto object-contain rounded-xl group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-[#17202A] dark:text-[#F5F7F9] font-serif leading-none">
                  SABO
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1684C4] dark:text-[#2498D1] mt-0.5">
                  Natural Dairy
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    className={`px-3.5 py-2 text-sm font-semibold rounded-full transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                        : 'text-[#17202A]/80 dark:text-[#AEB7C0] hover:text-[#C71925] dark:hover:text-white hover:bg-[#EFF7FB] dark:hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-[#17202A] dark:text-gray-200 hover:text-[#C71925] dark:hover:text-[#2498D1] hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-full transition-all flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? "Kunduzgi rejim (Light Mode)" : "Tungi rejim (Dark Mode)"}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-[#82C744] transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-[#1684C4] transition-transform" />
              )}
            </button>

            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 sm:px-4 sm:py-2 text-[#17202A] dark:text-gray-200 hover:text-[#C71925] dark:hover:text-[#2498D1] hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-full transition-all flex items-center gap-2 text-xs font-semibold"
              title="Qidiruv"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
              <span className="hidden xl:inline text-gray-500 dark:text-gray-400">{t.common.search}...</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-[#17202A] dark:text-gray-200 hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Language selector"
              >
                <Globe className="w-3.5 h-3.5 text-[#1684C4] dark:text-[#2498D1]" />
                <span>{languageLabels[language].flag}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1C242D] rounded-2xl shadow-xl border border-[#DCE3E8] dark:border-white/10 py-1.5 z-20 overflow-hidden">
                    {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors ${
                          language === lang
                            ? 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935]'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{languageLabels[lang].label}</span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {languageLabels[lang].flag}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Favorites Icon */}
            <button
              onClick={() => onNavigate('favorites')}
              className="relative p-2.5 text-[#17202A] dark:text-gray-200 hover:text-[#C71925] dark:hover:text-[#E32935] hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-full transition-all hidden sm:flex items-center justify-center cursor-pointer"
              title="Sevimlilar"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#C71925] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={() => onNavigate('account')}
              className="p-2.5 text-[#17202A] dark:text-gray-200 hover:text-[#C71925] dark:hover:text-[#2498D1] hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-full transition-all hidden md:flex items-center justify-center cursor-pointer"
              title="Shaxsiy kabinet"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#C71925] hover:bg-[#A80F19] dark:bg-[#E32935] dark:hover:bg-[#FF4652] active:scale-95 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-white text-[#C71925] text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">{t.nav.cart}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={onOpenMobileMenu}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white rounded-xl hover:bg-gray-200/60 dark:hover:bg-white/10 lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

