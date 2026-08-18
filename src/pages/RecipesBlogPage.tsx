import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { ARTICLES, PRODUCTS } from '../constants/data';
import { Article, Product } from '../types';
import {
  Sparkles,
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  Share2,
  X,
  ChefHat,
  ShoppingBag,
  Heart,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useCart } from '../context/CartContext';
import { showToast } from '../components/ui/Toast';

interface RecipesBlogPageProps {
  initialArticleId?: string;
  onSelectProduct: (product: Product) => void;
}

export const RecipesBlogPage: React.FC<RecipesBlogPageProps> = ({
  initialArticleId,
  onSelectProduct,
}) => {
  const { language, t } = useTranslation();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<'all' | 'recipes' | 'news'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(
    initialArticleId ? ARTICLES.find((a) => a.id === initialArticleId) || null : null
  );

  const filteredArticles = ARTICLES.filter((art) => {
    if (activeCategory !== 'all' && art.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle =
        art.title.uz.toLowerCase().includes(q) || art.title.ru.toLowerCase().includes(q);
      const matchesExcerpt =
        art.excerpt.uz.toLowerCase().includes(q) || art.excerpt.ru.toLowerCase().includes(q);
      if (!matchesTitle && !matchesExcerpt) return false;
    }
    return true;
  });

  const handleAddIngredientProduct = (product: Product) => {
    const defaultVol = product.volumeOptions.find((v) => v.isDefault)?.volume || product.volumeOptions[0].volume;
    addToCart(product, defaultVol, 1);
    showToast({
      type: 'success',
      title: 'Masalliq savatga qo\'shildi',
      message: product.name[language],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1] mb-1">
            <Sparkles className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
            <span>Foydali Retseptlar va Maqolalar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
            {t.nav.blog}
          </h1>
          <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] mt-1 max-w-xl">
            Sut mahsulotlari bilan tayyorlanadigan eng mazali taomlar, pishiriqlar hamda sog'lom turmush tarzi bo'yicha maslahatlar.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#59636D] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mavzu yoki retsept qidirish..."
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C71925]"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'recipe', label: 'Retseptlar' },
              { id: 'article', label: 'Salomatlik' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#C71925] text-white shadow-xs'
                    : 'bg-white dark:bg-[#151B22] text-[#59636D] dark:text-gray-300 hover:bg-[#EFF7FB] dark:hover:bg-white/10 border border-[#DCE3E8] dark:border-[#29323C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="bg-white dark:bg-[#151B22] rounded-3xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] hover:border-[#C71925] dark:hover:border-[#E32935] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EFF7FB] dark:bg-black/20">
                <img
                  src={article.image}
                  alt={article.title[language]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/95 dark:bg-[#151B22]/95 backdrop-blur-md rounded-full text-[10px] font-bold text-[#1684C4] dark:text-[#2498D1] shadow-xs border border-transparent dark:border-white/10">
                    {article.category === 'recipes' ? 'Oshpazlik Retsepti' : 'Salomatlik'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-[#59636D] dark:text-[#AEB7C0]">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime} mutolaa
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-white group-hover:text-[#C71925] dark:group-hover:text-[#E32935] transition-colors line-clamp-2">
                  {article.title[language]}
                </h3>

                <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans line-clamp-3">
                  {article.excerpt[language]}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#C71925] dark:text-[#E32935] border-t border-[#DCE3E8] dark:border-[#29323C]">
              <span>Batafsil o'qish</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal Reader */}
      {selectedArticle && (
        <Modal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Header / Media */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#EFF7FB] dark:bg-black/20">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title[language]}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 dark:bg-[#151B22]/90 backdrop-blur-md rounded-full text-xs font-bold text-[#1684C4] dark:text-[#2498D1]">
                  {selectedArticle.category === 'recipe' ? 'Oshpazlik Retsepti' : 'Foydali Maqola'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#59636D] dark:text-[#AEB7C0] mb-2">
                <span>{selectedArticle.publishedDate}</span>
                <span>·</span>
                <span>{selectedArticle.readTimeMinutes} daqiqa o'qish</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-white leading-tight">
                {selectedArticle.title[language]}
              </h2>
            </div>

            {/* Article Content / Recipe Steps */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
              <p className="font-semibold text-base text-[#17202A] dark:text-white p-4 bg-[#EFF7FB] dark:bg-[#151B22] rounded-2xl border border-[#DCE3E8] dark:border-[#29323C]">
                {selectedArticle.summary[language]}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-lg text-[#17202A] dark:text-[#F5F7F9]">
                  Kerakli masalliqlar va tayyorlanishi:
                </h4>
                <ul className="space-y-2 list-disc list-inside text-[#59636D] dark:text-gray-300">
                  <li>SABO tabiiy suti yoki qaymoq/smetana mahsulotlari (200-300g)</li>
                  <li>Tuxum, tabiiy sariyog' (82.5%) va yangi ko'katlar</li>
                  <li>Ta'bga ko'ra tuz, zira va tabiiy ziravorlar</li>
                </ul>
              </div>

              <div className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-2xl border border-[#1684C4]/20 dark:border-white/10 text-xs text-[#1684C4] dark:text-[#2498D1] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-[#C71925]" />
                  <span>Oshpaz maslahati:</span>
                </div>
                <p className="text-[#59636D] dark:text-gray-300">
                  Sut mahsulotlarini xona haroratida biroz ilitib ishlatish pishiriqning yanada mayin va yumshoq chiqishini ta'minlaydi.
                </p>
              </div>
            </div>

            {/* Related SABO Product Widget */}
            <div className="p-4 bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EFF7FB] dark:bg-[#102C3C] flex items-center justify-center text-2xl">
                  🥛
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17202A] dark:text-white">SABO Tabiiy Mahsulotlari</div>
                  <div className="text-[11px] text-[#59636D] dark:text-[#AEB7C0]">Ushbu retsept uchun ideal ingredient</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  const p = PRODUCTS[0];
                  handleAddIngredientProduct(p);
                }}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Savatga qo'shish
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
