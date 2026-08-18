import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { PRODUCTS } from '../../constants/data';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { language, t } = useTranslation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const name = p.name[language]?.toLowerCase() || '';
      const desc = p.shortDescription[language]?.toLowerCase() || '';
      const cat = p.categoryLabel[language]?.toLowerCase() || '';
      const ing = p.ingredients[language]?.toLowerCase() || '';
      return name.includes(q) || desc.includes(q) || cat.includes(q) || ing.includes(q);
    });
  }, [query, language]);

  const quickSearches = [
    { label: 'Sut 3.2%', q: 'sut' },
    { label: 'Sariyog\' 82.5%', q: 'sariyog' },
    { label: 'Tvorog', q: 'tvorog' },
    { label: 'Laktozasiz', q: 'laktozasiz' },
    { label: 'Kefir / Qatiq', q: 'qatiq' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#151B22] rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#DCE3E8] dark:border-[#29323C]"
          >
            {/* Input Bar */}
            <div className="flex items-center px-6 py-4 border-b border-[#DCE3E8] dark:border-[#29323C] bg-[#EFF7FB] dark:bg-[#102C3C]">
              <Search className="w-5 h-5 text-[#C71925] dark:text-[#E32935] shrink-0 mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full bg-transparent text-base sm:text-lg text-[#17202A] dark:text-white placeholder-gray-400 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-[#59636D] hover:text-[#17202A] dark:hover:text-white rounded-full mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs font-semibold px-3 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#59636D] dark:text-gray-300 rounded-full transition-colors cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {!query.trim() ? (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#59636D] dark:text-gray-500 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#C71925] dark:text-[#E32935]" />
                    <span>Tezkor qidiruvlar:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {quickSearches.map((item) => (
                      <button
                        key={item.q}
                        onClick={() => setQuery(item.q)}
                        className="px-3.5 py-1.5 text-xs font-medium bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] rounded-full hover:bg-[#C71925] hover:text-white dark:hover:bg-[#E32935] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-[#59636D] dark:text-gray-500">
                    Ommabop mahsulotlar ro'yxatidan birini tanlang yoki qidiruv so'zini kiriting.
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#59636D] dark:text-gray-500 mb-2">
                    Topilgan natijalar ({searchResults.length}):
                  </div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#EFF7FB] dark:hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#DCE3E8] dark:hover:border-[#29323C] group"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.name[language]}
                          className="w-14 h-14 object-cover rounded-xl bg-gray-100 dark:bg-gray-800"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#17202A] dark:text-white group-hover:text-[#C71925] dark:group-hover:text-[#E32935] transition-colors">
                            {product.name[language]}
                          </h4>
                          <p className="text-xs text-[#59636D] dark:text-gray-400 line-clamp-1">
                            {product.categoryLabel[language]} · {product.fatContent} yog'lilik
                          </p>
                          <span className="text-xs font-semibold text-[#C71925] dark:text-[#E32935] mt-0.5 inline-block">
                            {product.volumeOptions[0]?.price.toLocaleString()} so'mdan
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C71925] dark:group-hover:text-[#E32935] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-base text-[#59636D] dark:text-gray-400">
                    "{query}" so'rovi bo'yicha mahsulot topilmadi.
                  </p>
                  <p className="text-xs text-[#59636D] dark:text-gray-500 mt-1">
                    Boshqa so'zlarni sinab ko'ring (masalan: sut, qatiq, sariyog', pishloq).
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
