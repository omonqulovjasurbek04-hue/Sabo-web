import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Badge } from '../ui/Badge';
import { showToast } from '../ui/Toast';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const { language, t } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const defaultOption = product.volumeOptions.find((v) => v.isDefault) || product.volumeOptions[0];
  const [selectedVolume, setSelectedVolume] = useState<string>(defaultOption.volume);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const currentOption = product.volumeOptions.find((v) => v.volume === selectedVolume) || defaultOption;
  const currentPrice = currentOption.price;
  const isFav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVolume, 1);
    setIsAddedRecently(true);
    showToast({
      type: 'success',
      title: t.common.addedToCart,
      message: `${product.name[language]} (${selectedVolume})`,
    });
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
    showToast({
      type: 'info',
      title: !isFav ? 'Sevimlilarga qo\'shildi' : 'Sevimlilardan o\'chirildi',
      message: product.name[language],
    });
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white dark:bg-[#151B22] rounded-3xl p-4 sm:p-5 border border-[#DCE3E8] dark:border-[#29323C] hover:border-[#1684C4]/40 dark:hover:border-[#2498D1]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Media & Badges Container */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#EFF7FB] dark:bg-[#102C3C] mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {product.isOrganic && (
            <Badge variant="accent" size="sm">
              {t.common.organic}
            </Badge>
          )}
          {product.isBestseller && (
            <Badge variant="primary" size="sm">
              {t.common.bestseller}
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="secondary" size="sm">
              {t.common.newBadge}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFav}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-200 backdrop-blur-sm ${
            isFav
              ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-md scale-105'
              : 'bg-white/90 dark:bg-[#151B22]/90 text-[#59636D] dark:text-[#AEB7C0] hover:text-[#C71925] dark:hover:text-[#E32935] hover:bg-white'
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Product Image (Original Colors Preserved) */}
        <img
          src={product.images[0]}
          alt={product.name[language]}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Fat Content Tag */}
        <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 bg-white/95 dark:bg-[#1C242D]/95 backdrop-blur-sm rounded-lg text-[11px] font-bold text-[#17202A] dark:text-[#F5F7F9] shadow-xs border border-black/5 dark:border-white/10">
          {product.fatContent} yog'
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#59636D] dark:text-[#AEB7C0] mb-1.5">
            <span className="font-semibold text-[#1684C4] dark:text-[#2498D1] text-[11px] uppercase tracking-wider">
              {product.categoryLabel[language]}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#17202A] dark:text-[#F5F7F9] text-xs">{product.rating}</span>
              <span className="text-[10px] text-[#59636D] dark:text-[#AEB7C0]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#17202A] dark:text-[#F5F7F9] group-hover:text-[#C71925] dark:group-hover:text-[#E32935] transition-colors line-clamp-1 leading-snug">
            {product.name[language]}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-[#59636D] dark:text-[#AEB7C0] line-clamp-2 leading-relaxed">
            {product.shortDescription[language]}
          </p>
        </div>

        {/* Volume Selection Pills */}
        <div className="mt-3.5 pt-3 border-t border-[#DCE3E8]/80 dark:border-[#29323C]">
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {product.volumeOptions.map((opt) => (
              <button
                key={opt.volume}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVolume(opt.volume);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedVolume === opt.volume
                    ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                    : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#F5F7F9] hover:bg-[#E5F3FA] dark:hover:bg-[#163B50]'
                }`}
              >
                {opt.volume}
              </button>
            ))}
          </div>

          {/* Price & Action Button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#59636D] dark:text-[#AEB7C0] uppercase tracking-wider block">
                {t.common.price}
              </span>
              <span className="text-base sm:text-lg font-bold text-[#C71925] dark:text-[#E32935] font-sans">
                {currentPrice.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#59636D] dark:text-[#AEB7C0]">{t.common.sum}</span>
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer ${
                isAddedRecently
                  ? 'bg-[#73B832] dark:bg-[#82C744] text-white'
                  : 'bg-[#C71925] hover:bg-[#A80F19] dark:bg-[#E32935] dark:hover:bg-[#FF4652] text-white hover:shadow-md active:scale-95'
              }`}
              aria-label="Add to cart"
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.common.inCart}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.common.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
