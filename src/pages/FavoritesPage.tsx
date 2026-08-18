import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { PRODUCTS } from '../constants/data';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types';
import { Heart, ArrowRight, Trash2, PackageOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface FavoritesPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  const { language, t } = useTranslation();
  const { favoriteIds, clearFavorites } = useFavorites();

  const favoriteProducts = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C71925] dark:text-[#E32935] mb-1">
            <Heart className="w-4 h-4 text-[#C71925] fill-[#C71925]" />
            <span>Sevimlilar ro'yxati</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
            {t.nav.favorites}
          </h1>
          <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] mt-1">
            Siz yoqtirgan va keyinroq xarid qilish uchun saqlab qo'yilgan tabiiy mahsulotlar.
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            onClick={clearFavorites}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C71925] hover:text-[#A80F19] dark:text-[#E32935] dark:hover:text-[#FF4652] p-2 hover:bg-[#EFF7FB] dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Barchasini tozalash</span>
          </button>
        )}
      </div>

      {/* Content */}
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#17202A] dark:text-[#F5F7F9]">
            Sevimlilar ro'yxati hozircha bo'sh
          </h3>
          <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-sans leading-relaxed">
            Mahsulotlar kartochkasidagi yurakcha belgisini bosib, yoqtirgan sut mahsulotlaringizni shu yerga saqlashingiz mumkin.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => onNavigate('products')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Katalogga o'tish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
