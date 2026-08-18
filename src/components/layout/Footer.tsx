import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, ShieldCheck, Heart, ArrowUp, Send as TelegramIcon } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { showToast } from '../ui/Toast';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast({
        type: 'error',
        title: 'Xatolik',
        message: 'Iltimos, to\'g\'ri email manzilini kiriting.',
      });
      return;
    }
    showToast({
      type: 'success',
      title: 'Obuna bo\'ldingiz!',
      message: 'SABO yangiliklari va maxsus chegirmalaridan xabardor bo\'lasiz.',
    });
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D1117] dark:bg-[#070A0E] text-white pt-16 pb-24 lg:pb-12 border-t border-[#29323C] relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1684C4]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#C71925]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/image/logo.png"
                alt="SABO Logo"
                className="h-11 w-auto object-contain bg-white/95 p-1 rounded-2xl shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white font-serif leading-none">
                  SABO
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#2498D1] mt-0.5">
                  Tabiiylik sari intilamiz
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm font-sans">
              Tabiatdan dasturxoningizgacha. Eng toza, sifatli va foydali SABO tabiiy sut mahsulotlarini xonadoningizga yetkazib beramiz.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#2498D1] border border-white/10">
                <ShieldCheck className="w-4 h-4" />
                <span>ISO 9001:2015 & HACCP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#82C744] border border-white/10">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Halol</span>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2498D1]">
              Katalog
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'milk' })}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  SABO Sutlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'kefir_yogurt' })}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  SABO Kefir va Qatiq
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'sourcream_butter' })}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  SABO Smetana & Qaymoq
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'cheese' })}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Tabiiy Pishloqlar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products', { category: 'desserts' })}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Mevali Yogurtlar
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2498D1]">
              Kompaniya
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Biz haqimizda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('production')}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Ishlab chiqarish
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('certificates')}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Sifat sertifikatlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Retseptlar va Maqolalar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#2498D1] hover:underline transition-colors"
                >
                  Filiallar va Aloqa
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#2498D1]">
              Aloqa va Buyurtma
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Eng yangi chegirmalar, aksiyalar va yangi mahsulotlardan xabardor bo'ling.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email manzilingiz"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-full text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2498D1]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[#C71925] hover:bg-[#A80F19] text-white rounded-full transition-colors"
                  aria-label="Obuna bo'lish"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="space-y-1.5 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#2498D1]" />
                <a href="tel:+998993451655" className="hover:text-white">
                  +998 (99) 345-16-55
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#2498D1]" />
                <a href="https://t.me/SaboMilk" target="_blank" rel="noopener noreferrer" className="hover:text-white text-[#2498D1]">
                  Telegram: @SaboMilk
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2498D1]" />
                <span>Toshkent sh., Yangihayot t.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} SABO (Sabo Milky). Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-gray-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Natural Health
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <span>Yuqoriga</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
