import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Globe, Heart, ShoppingBag, ShieldCheck, Factory, Info, BookOpen, MapPin, User, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const { favoritesCount } = useFavorites();
  const { totalItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { key: 'home', label: t.nav.home, icon: null },
    { key: 'products', label: t.nav.products, icon: ShoppingBag },
    { key: 'production', label: t.nav.production, icon: Factory },
    { key: 'about', label: t.nav.about, icon: Info },
    { key: 'certificates', label: t.nav.certificates, icon: ShieldCheck },
    { key: 'blog', label: t.nav.blog, icon: BookOpen },
    { key: 'contact', label: t.nav.contact, icon: MapPin },
    { key: 'favorites', label: t.nav.favorites, icon: Heart },
    { key: 'account', label: t.nav.account, icon: User },
  ];

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-4/5 max-w-xs bg-[#F8FAFC] dark:bg-[#151B22] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#DCE3E8] dark:border-[#29323C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/image/logo.png"
                  alt="SABO Logo"
                  className="h-8 w-auto object-contain rounded-lg"
                />
                <span className="text-xl font-bold tracking-tight text-[#17202A] dark:text-[#F5F7F9] font-serif">
                  SABO
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200/60 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="p-6 space-y-2 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#59636D] dark:text-[#AEB7C0] uppercase tracking-wider">
                  Menyu
                </span>
                
                {/* Dark mode switch in drawer */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#F5F7F9]"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#82C744]" />
                      <span>Kunduzgi</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#1684C4]" />
                      <span>Tungi</span>
                    </>
                  )}
                </button>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.key;
                return (
                  <button
                    key={link.key}
                    onClick={() => handleLinkClick(link.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-sm'
                        : 'text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#EFF7FB] dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-4 h-4 opacity-80" />}
                      <span>{link.label}</span>
                    </div>
                    {link.key === 'favorites' && favoritesCount > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#C71925] text-white">
                        {favoritesCount}
                      </span>
                    )}
                    {link.key === 'products' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] font-bold">
                        10+
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer & Language Selector */}
            <div className="p-6 border-t border-[#DCE3E8] dark:border-[#29323C] bg-white/80 dark:bg-[#1C242D] space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#59636D] dark:text-[#AEB7C0] mb-2">
                  <Globe className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                  <span>Tilni tanlang / Язык</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-2 text-xs font-bold uppercase rounded-xl transition-all ${
                        language === lang
                          ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-sm'
                          : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#E5F3FA]'
                      }`}
                    >
                      {lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href="tel:+998993451655"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-semibold hover:bg-[#C71925] hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                <div>
                  <div className="text-[10px] opacity-75">Qo'llab-quvvatlash markazi</div>
                  <div className="font-bold">+998 (99) 345-16-55</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

