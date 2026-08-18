import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Product } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Star, Heart, ShoppingBag, Check, ShieldCheck, Clock, Thermometer } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullPage: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onViewFullPage,
}) => {
  const { language, t } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVolume, setSelectedVolume] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentVolume =
    selectedVolume ||
    product.volumeOptions.find((v) => v.isDefault)?.volume ||
    product.volumeOptions[0].volume;

  const currentPrice =
    product.volumeOptions.find((v) => v.volume === currentVolume)?.price ||
    product.volumeOptions[0].price;

  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, currentVolume, quantity);
    setIsAdded(true);
    showToast({
      type: 'success',
      title: t.common.addedToCart,
      message: `${quantity}x ${product.name[language]} (${currentVolume})`,
    });
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F6F3EE] dark:bg-gray-800 border border-gray-100 dark:border-white/10">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name[language]}
              className="w-full h-full object-cover object-center"
            />
            {product.isOrganic && (
              <div className="absolute top-4 left-4">
                <Badge variant="primary" size="sm">
                  {t.common.organic}
                </Badge>
              </div>
            )}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isFav ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-black/60 text-gray-400 dark:text-gray-200 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx ? 'border-[#25683C] scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Add to Cart */}
        <div className="flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
                {product.categoryLabel[language]}
              </span>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[#17202A] dark:text-white">{product.rating}</span>
                <span className="text-[#59636D] dark:text-[#AEB7C0]">({product.reviewsCount} {t.common.reviews})</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
              {product.name[language]}
            </h2>

            <p className="mt-3 text-sm text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
              {product.fullDescription[language] || product.shortDescription[language]}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 my-5 p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] text-xs">
              <div className="flex items-center gap-2 text-[#17202A] dark:text-gray-300">
                <Thermometer className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                <span>Yog'lilik: <strong>{product.fatContent}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#17202A] dark:text-gray-300">
                <Clock className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                <span>Muddati: <strong>{product.shelfLife[language]}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#17202A] dark:text-gray-300 col-span-2">
                <ShieldCheck className="w-4 h-4 text-[#73B832] dark:text-[#82C744]" />
                <span>Sertifikatlar: <strong>{product.certifications.join(', ')}</strong></span>
              </div>
            </div>

            {/* Volume Picker */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0]">
                {t.common.selectVolume}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.volumeOptions.map((opt) => (
                  <button
                    key={opt.volume}
                    onClick={() => setSelectedVolume(opt.volume)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      currentVolume === opt.volume
                        ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                        : 'bg-[#EFF7FB] dark:bg-white/10 text-[#59636D] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                    }`}
                  >
                    {opt.volume} — {opt.price.toLocaleString()} {t.common.sum}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price, Stepper & Add to cart Button */}
          <div className="pt-4 border-t border-[#DCE3E8] dark:border-[#29323C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] block">
                {t.common.price}
              </span>
              <span className="text-2xl font-bold text-[#C71925] dark:text-[#E32935]">
                {(currentPrice * quantity).toLocaleString()}{' '}
                <span className="text-sm font-normal text-[#59636D] dark:text-[#AEB7C0]">{t.common.sum}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Stepper */}
              <div className="flex items-center bg-[#EFF7FB] dark:bg-white/10 rounded-full p-1 border border-[#DCE3E8] dark:border-[#29323C]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:bg-white dark:hover:bg-white/20 text-[#17202A] dark:text-gray-200 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-[#17202A] dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:bg-white dark:hover:bg-white/20 text-[#17202A] dark:text-gray-200 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <Button
                variant={isAdded ? 'secondary' : 'primary'}
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial"
                leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {isAdded ? t.common.inCart : t.common.addToCart}
              </Button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                onClose();
                onViewFullPage(product);
              }}
              className="text-xs font-semibold text-[#1684C4] dark:text-[#2498D1] hover:underline cursor-pointer"
            >
              To'liq mahsulot sahifasini ochish →
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
