import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  Clock,
  Thermometer,
  ArrowLeft,
  Share2,
  Sparkles,
  ChevronRight,
  Send,
  MessageSquare,
  Leaf,
  Info,
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, ARTICLES } from '../constants/data';
import { useTranslation } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProductCard } from '../components/product/ProductCard';
import { showToast } from '../components/ui/Toast';
import { SEO } from '../components/ui/SEO';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onNavigate,
}) => {
  const { language, t } = useTranslation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const defaultOption = product.volumeOptions.find((v) => v.isDefault) || product.volumeOptions[0];
  const [selectedVolume, setSelectedVolume] = useState<string>(defaultOption.volume);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'benefits' | 'reviews'>('details');
  const [isAdded, setIsAdded] = useState(false);

  // Review Form state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<Array<{ name: string; rating: number; date: string; comment: string }>>([
    {
      name: 'Gulnoza Karimova',
      rating: 5,
      date: '14-fevral, 2026',
      comment: 'Bolalarim juda yaxshi ko\'radi. Ta\'mi xuddi qishloqdagi buvimning yangi sog\'ilgan sutidek tabiiy!',
    },
    {
      name: 'Jasurbek O.',
      rating: 5,
      date: '02-fevral, 2026',
      comment: 'Kofe bilan ajoyib ko\'pik bo\'ladi. Yetkazib berish ham juda tez va muzdek keldi.',
    },
    {
      name: 'Nodira Rahimova',
      rating: 4,
      date: '28-yanvar, 2026',
      comment: 'Sifati juda a\'lo, har kuni buyurtma beramiz. Tavsiya qilaman!',
    },
  ]);

  const currentOption = product.volumeOptions.find((v) => v.volume === selectedVolume) || defaultOption;
  const currentPrice = currentOption.price;
  const isFav = isFavorite(product.id);

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isBestseller)
  ).slice(0, 4);

  // Related recipes from articles
  const relatedRecipes = ARTICLES.filter((a) => a.category === 'recipes').slice(0, 2);

  const handleAddToCart = () => {
    addToCart(product, selectedVolume, quantity);
    setIsAdded(true);
    showToast({
      type: 'success',
      title: t.common.addedToCart,
      message: `${quantity}x ${product.name[language]} (${selectedVolume})`,
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'info',
        title: 'Havola nusxalandi',
        message: 'Mahsulot havolasi buferga nusxalandi.',
      });
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast({ type: 'error', title: 'Iltimos, ismingiz va fikringizni yozing' });
      return;
    }
    setLocalReviews([
      {
        name: newReviewAuthor,
        rating: newReviewRating,
        date: 'Bugun',
        comment: newReviewComment,
      },
      ...localReviews,
    ]);
    setIsReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast({
      type: 'success',
      title: 'Sharhingiz qabul qilindi!',
      message: 'Fikringiz uchun tashakkur.',
    });
  };

  // Schema.org Structured Data (Strict data integrity: only include fields with real source data)
  const productSchema: Record<string, any> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name[language],
    image: product.images && product.images.length > 0 ? product.images : [product.image],
    description: product.description[language],
    sku: `SABO-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'SABO',
    },
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'UZS',
      price: currentPrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'SABO',
      },
    },
  };

  if (product.rating && product.reviewsCount && product.reviewsCount > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO
        title={product.name[language]}
        description={`${product.name[language]} — ${product.description[language]}. 100% tabiiy, yangi va foydali sut mahsuloti.`}
        ogType="product"
        schemaData={productSchema}
      />

      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between text-xs text-[#59636D] dark:text-[#AEB7C0] pb-4 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-bold text-[#C71925] dark:text-[#E32935] hover:text-[#A80F19] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
          <button onClick={() => onNavigate('home')} className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            {t.nav.home}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => onNavigate('products')} className="hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
            {product.categoryLabel[language]}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#17202A] dark:text-[#F5F7F9] font-semibold truncate max-w-xs">
            {product.name[language]}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-[#59636D] dark:text-[#AEB7C0] hover:text-[#C71925] dark:hover:text-white transition-colors cursor-pointer"
          title="Ulashish"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Ulashish</span>
        </button>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] shadow-sm">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name[language]}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.isOrganic && <Badge variant="primary">{t.common.organic}</Badge>}
              {product.isBestseller && <Badge variant="secondary">{t.common.bestseller}</Badge>}
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
                isFav
                  ? 'bg-[#C71925] text-white shadow-md'
                  : 'bg-white/80 dark:bg-black/50 text-gray-400 hover:text-[#C71925] hover:bg-white'
              }`}
              aria-label="Sevimlilarga qo'shish"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-[#C71925] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying Info & Quick Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
                {product.categoryLabel[language]}
              </span>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-[#17202A] dark:text-white">{product.rating}</span>
                <span className="text-[#59636D] dark:text-[#AEB7C0]">({product.reviewsCount} sharh)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
              {product.name[language]}
            </h1>

            <p className="mt-3 text-sm text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
              {product.fullDescription[language] || product.shortDescription[language]}
            </p>
          </div>

          {/* Volume Options Selection */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] block">
              {t.common.selectVolume}:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {product.volumeOptions.map((opt) => (
                <button
                  key={opt.volume}
                  onClick={() => setSelectedVolume(opt.volume)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    selectedVolume === opt.volume
                      ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-md scale-105'
                      : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#E5F3FA]'
                  }`}
                >
                  <span>{opt.volume}</span>
                  <span className="text-[10px] ml-2 opacity-80">
                    ({opt.price.toLocaleString()} {t.common.sum})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Quantity & Add to cart */}
          <div className="p-6 bg-white dark:bg-[#151B22] rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#59636D] dark:text-[#AEB7C0] block">
                  {t.common.price} ({selectedVolume})
                </span>
                <div className="text-3xl font-serif font-bold text-[#C71925] dark:text-[#E32935]">
                  {(currentPrice * quantity).toLocaleString()}{' '}
                  <span className="text-sm font-normal text-[#59636D] dark:text-[#AEB7C0] font-sans">{t.common.sum}</span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center bg-[#EFF7FB] dark:bg-[#102C3C] rounded-2xl p-1 shadow-xs border border-[#DCE3E8] dark:border-[#29323C]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold hover:bg-white dark:hover:bg-white/10 text-[#17202A] dark:text-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#17202A] dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold hover:bg-white dark:hover:bg-white/10 text-[#17202A] dark:text-white transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              variant={isAdded ? 'secondary' : 'primary'}
              onClick={handleAddToCart}
              leftIcon={isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            >
              {isAdded ? t.common.inCart : t.common.addToCart}
            </Button>
          </div>

          {/* Quick Quality Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-[#1684C4] dark:text-[#2498D1] shrink-0" />
              <div>
                <div className="text-[#59636D] dark:text-[#AEB7C0] text-[10px]">Yog'lilik darajasi</div>
                <div className="font-bold text-[#17202A] dark:text-white">{product.fatContent}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#1684C4] dark:text-[#2498D1] shrink-0" />
              <div>
                <div className="text-[#59636D] dark:text-[#AEB7C0] text-[10px]">Yaroqlilik muddati</div>
                <div className="font-bold text-[#17202A] dark:text-white truncate">{product.shelfLife[language]}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] flex items-center gap-3 col-span-2">
              <ShieldCheck className="w-5 h-5 text-[#73B832] dark:text-[#82C744] shrink-0" />
              <div>
                <div className="text-[#59636D] dark:text-[#AEB7C0] text-[10px]">Sertifikatlar va Kafolat</div>
                <div className="font-bold text-[#17202A] dark:text-white">{product.certifications.join(', ')} (100% Halol)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Nutrition, Health Benefits, Reviews */}
      <div className="bg-white dark:bg-[#151B22] rounded-3xl p-6 sm:p-8 border border-[#DCE3E8] dark:border-[#29323C] shadow-xs space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-3 border-b border-[#DCE3E8] dark:border-[#29323C] overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'details', label: 'Tarkibi va Saqlash' },
            { id: 'nutrition', label: 'Ozuqaviy Qiymati (100g)' },
            { id: 'benefits', label: 'Foydali Xususiyatlari' },
            { id: 'reviews', label: `Sharhlar (${localReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#C71925] dark:border-[#E32935] text-[#C71925] dark:text-[#E32935]'
                  : 'border-transparent text-[#59636D] dark:text-[#AEB7C0] hover:text-[#17202A] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {/* 1. Details & Ingredients */}
          {activeTab === 'details' && (
            <div className="space-y-5 text-xs sm:text-sm text-[#17202A] dark:text-[#AEB7C0]">
              <div className="space-y-1.5">
                <h4 className="font-bold text-[#17202A] dark:text-[#F5F7F9] uppercase tracking-wider text-xs">
                  Tarkibi:
                </h4>
                <p className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] leading-relaxed font-sans">
                  {product.ingredients[language]}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-[#17202A] dark:text-[#F5F7F9] uppercase tracking-wider text-xs">
                  Saqlash sharoiti:
                </h4>
                <p className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] leading-relaxed font-sans">
                  {product.storageConditions[language]}
                </p>
              </div>
            </div>
          )}

          {/* 2. Nutrition facts table */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <p className="text-xs text-[#59636D] dark:text-[#AEB7C0]">
                100 gramm mahsulot tarkibidagi ozuqaviy moddalar miqdori:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] text-center">
                  <div className="text-2xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
                    {product.nutrition.calories}
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-0.5">Kaloriya (kkal)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] text-center">
                  <div className="text-2xl font-serif font-bold text-[#C71925] dark:text-[#E32935]">
                    {product.nutrition.proteins}g
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-0.5">Oqsillar (Protein)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] text-center">
                  <div className="text-2xl font-serif font-bold text-[#1684C4] dark:text-[#2498D1]">
                    {product.nutrition.fats}g
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-0.5">Yog'lar (Fats)</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] text-center">
                  <div className="text-2xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
                    {product.nutrition.carbs}g
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-0.5">Uglevodlar</div>
                </div>
              </div>

              {product.nutrition.calcium && (
                <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-xs text-[#1684C4] dark:text-[#2498D1] flex items-center justify-between border border-[#1684C4]/20">
                  <span className="font-semibold">Kalsiy miqdori:</span>
                  <span className="font-bold text-sm">{product.nutrition.calcium} mg / 100g</span>
                </div>
              )}
            </div>
          )}

          {/* 3. Health Benefits */}
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#73B832] dark:text-[#82C744] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#17202A] dark:text-[#F5F7F9]">Suyak va tishlar mustahkamligi</h5>
                  <p className="text-[#59636D] dark:text-[#AEB7C0] text-xs mt-1 leading-relaxed">
                    Tarkibidagi oson hazm bo'luvchi kalsiy va fosfor suyak to'qimalarini baquvvat qiladi.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1684C4] dark:text-[#2498D1] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#17202A] dark:text-[#F5F7F9]">Tabiiy immunitetni kuchaytirish</h5>
                  <p className="text-[#59636D] dark:text-[#AEB7C0] text-xs mt-1 leading-relaxed">
                    A, D, B2, B12 vitaminlari majmuasi organizmning viruslarga qarshi kurashuvchanligini oshiradi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. Customer Reviews List */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE3E8] dark:border-[#29323C]">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold font-serif text-[#17202A] dark:text-[#F5F7F9]">{product.rating}</div>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span className="text-xs text-[#59636D] dark:text-[#AEB7C0]">({localReviews.length} ta sharh)</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsReviewModalOpen(true)}
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Sharh qoldirish
                </Button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {localReviews.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-[#17202A] dark:text-white">{rev.name}</div>
                      <div className="text-[#59636D] dark:text-[#AEB7C0]">{rev.date}</div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linked Recipes */}
      {relatedRecipes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
            Ushbu mahsulot bilan tayyorlash mumkin:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedRecipes.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onNavigate('blog', { articleId: rec.id })}
                className="bg-white dark:bg-[#151B22] rounded-3xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] flex flex-col sm:flex-row hover:border-[#1684C4] dark:hover:border-[#2498D1] transition-all cursor-pointer group"
              >
                <img
                  src={rec.image}
                  alt={rec.title[language]}
                  className="w-full sm:w-40 h-36 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#1684C4] dark:text-[#2498D1]">
                      Retsept · {rec.readTime}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#17202A] dark:text-white group-hover:text-[#C71925] dark:group-hover:text-[#E32935] line-clamp-1 mt-1">
                      {rec.title[language]}
                    </h4>
                    <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] line-clamp-2 mt-1">
                      {rec.excerpt[language]}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1684C4] dark:text-[#2498D1] mt-2 inline-flex items-center gap-1">
                    Retseptni ko'rish →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
          O'xshash mahsulotlar:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      </div>

      {/* Review Modal Form */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsReviewModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#151B22] rounded-3xl shadow-2xl p-6 z-10 space-y-4 border border-[#DCE3E8] dark:border-[#29323C]">
            <h3 className="text-lg font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
              Mahsulot haqida fikringiz
            </h3>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#17202A] dark:text-[#AEB7C0] block mb-1">Ismingiz *</label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Masalan: Nodirbek"
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C242D] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17202A] dark:text-[#AEB7C0] block mb-1">Bahoyingiz:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17202A] dark:text-[#AEB7C0] block mb-1">Sharhingiz *</label>
                <textarea
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Mahsulot ta'mi, sifati va yetkazib berilishi haqida yozing..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-[#1C242D] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Yuborish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
