import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { PRODUCTS } from '../constants/data';
import { useTranslation } from '../context/LanguageContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilter, FilterState } from '../components/product/ProductFilter';
import { QuickViewModal } from '../components/product/QuickViewModal';
import {
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  X,
  Filter,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ProductsPageProps {
  initialCategory?: ProductCategory | 'all';
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onNavigate,
}) => {
  const { language, t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const initialFilters: FilterState = {
    category: (initialCategory as ProductCategory) || 'all',
    fatContent: 'all',
    isOrganicOnly: false,
    isLactoseFreeOnly: false,
    isBestsellerOnly: false,
    minPrice: 0,
    maxPrice: 200000,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const categories = [
    { key: 'all' as ProductCategory, label: 'Barchasi', count: PRODUCTS.length },
    {
      key: 'milk' as ProductCategory,
      label: language === 'uz' ? 'Sut' : language === 'ru' ? 'Молоко' : 'Milk',
      count: PRODUCTS.filter((p) => p.category === 'milk').length,
    },
    {
      key: 'kefir_yogurt' as ProductCategory,
      label: language === 'uz' ? 'Qatiq & Yogurt' : language === 'ru' ? 'Кефир и Йогурты' : 'Kefir & Yogurt',
      count: PRODUCTS.filter((p) => p.category === 'kefir_yogurt').length,
    },
    {
      key: 'cheese' as ProductCategory,
      label: language === 'uz' ? 'Pishloqlar' : language === 'ru' ? 'Сыры' : 'Cheeses',
      count: PRODUCTS.filter((p) => p.category === 'cheese').length,
    },
    {
      key: 'sourcream_butter' as ProductCategory,
      label: language === 'uz' ? 'Sariyog\' & Qaymoq' : language === 'ru' ? 'Масло и Сметана' : 'Butter & Cream',
      count: PRODUCTS.filter((p) => p.category === 'sourcream_butter').length,
    },
    {
      key: 'desserts' as ProductCategory,
      label: language === 'uz' ? 'Tvorog & Desertlar' : language === 'ru' ? 'Творог и Десерты' : 'Cottage Cheese',
      count: PRODUCTS.filter((p) => p.category === 'desserts').length,
    },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          product.name.uz.toLowerCase().includes(q) ||
          product.name.ru.toLowerCase().includes(q) ||
          product.name.en.toLowerCase().includes(q);
        const matchesDesc =
          product.shortDescription.uz.toLowerCase().includes(q) ||
          product.shortDescription.ru.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // 2. Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // 3. Fat Content
      if (filters.fatContent !== 'all') {
        if (!product.fatContent.includes(filters.fatContent)) return false;
      }

      // 4. Traits
      if (filters.isOrganicOnly && !product.isOrganic) return false;
      if (filters.isLactoseFreeOnly && !product.isLactoseFree) return false;
      if (filters.isBestsellerOnly && !product.isBestseller) return false;

      // 5. Price Range
      const defaultPrice =
        product.volumeOptions.find((v) => v.isDefault)?.price || product.volumeOptions[0].price;
      if (defaultPrice < filters.minPrice || defaultPrice > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.volumeOptions.find((v) => v.isDefault)?.price || a.volumeOptions[0].price;
      const priceB = b.volumeOptions.find((v) => v.isDefault)?.price || b.volumeOptions[0].price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [filters, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      fatContent: 'all',
      isOrganicOnly: false,
      isLactoseFreeOnly: false,
      isBestsellerOnly: false,
      minPrice: 0,
      maxPrice: 200000,
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.fatContent !== 'all' ||
    filters.isOrganicOnly ||
    filters.isLactoseFreeOnly ||
    filters.isBestsellerOnly ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200000 ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1] mb-1">
            <Sparkles className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
            <span>Mahsulotlar katalogi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
            {t.nav.products}
          </h1>
          <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] mt-1 max-w-xl">
            Tabiiy yaylovlarda yetishtirilgan zotdor sigirlardan sog'ib olingan, 100% toza sut mahsulotlarimiz bilan tanishing.
          </p>
        </div>

        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mahsulot nomi bo'yicha qidiruv..."
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C71925] placeholder:text-[#59636D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none px-4 py-2.5 pr-8 text-xs font-semibold bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C71925] text-[#17202A] dark:text-gray-200 cursor-pointer"
              >
                <option value="popular">Ommabopligi bo'yicha</option>
                <option value="rating">Reytingi yuqori</option>
                <option value="price_asc">Narxi: Arzondan qimmatga</option>
                <option value="price_desc">Narxi: Qimmatdan arzonga</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden p-2.5 bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] rounded-2xl flex items-center justify-center border border-[#DCE3E8] dark:border-[#29323C] cursor-pointer"
              title="Filtrlar"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = filters.category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setFilters({ ...filters, category: cat.key })}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                  : 'bg-white dark:bg-[#151B22] text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#EFF7FB] dark:hover:bg-white/10 border border-[#DCE3E8] dark:border-[#29323C]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <ProductFilter
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            categories={categories}
          />
        </div>

        {/* Right Main Products Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filters Summary Pill row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-[#EFF7FB] dark:bg-[#102C3C] p-3 rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] text-xs">
              <span className="text-[#59636D] dark:text-[#AEB7C0] font-medium">Faol filtrlar:</span>

              {filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-lg text-[#17202A] dark:text-white">
                  Toifa: {categories.find((c) => c.key === filters.category)?.label}
                  <button onClick={() => setFilters({ ...filters, category: 'all' })}>
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>
                </span>
              )}

              {filters.fatContent !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-lg text-[#17202A] dark:text-white">
                  Yog': {filters.fatContent}
                  <button onClick={() => setFilters({ ...filters, fatContent: 'all' })}>
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>
                </span>
              )}

              {filters.isOrganicOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-lg text-[#17202A] dark:text-white">
                  100% Organik
                  <button onClick={() => setFilters({ ...filters, isOrganicOnly: false })}>
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>
                </span>
              )}

              {filters.isLactoseFreeOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#151B22] border border-[#DCE3E8] dark:border-[#29323C] rounded-lg text-[#17202A] dark:text-white">
                  Laktozasiz
                  <button onClick={() => setFilters({ ...filters, isLactoseFreeOnly: false })}>
                    <X className="w-3 h-3 text-gray-400 hover:text-gray-700" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs text-[#C71925] dark:text-[#E32935] font-bold hover:underline ml-auto cursor-pointer"
              >
                Barchasini tozalash
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-[#59636D] dark:text-[#AEB7C0]">
            <span>
              Jami topildi: <strong className="text-[#17202A] dark:text-[#F5F7F9]">{filteredProducts.length}</strong> xil mahsulot
            </span>
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={filteredProducts}
            onSelectProduct={onSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullPage={(p) => {
          setQuickViewProduct(null);
          onSelectProduct(p);
        }}
      />

      {/* Mobile Filter Drawer / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#151B22] h-full shadow-2xl z-10 p-6 overflow-y-auto ml-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE3E8] dark:border-[#29323C] mb-4">
                <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-[#F5F7F9]">Filtrlar</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilter
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                categories={categories}
                isMobileDrawer={true}
              />
            </div>
            <div className="pt-6 border-t border-[#DCE3E8] dark:border-[#29323C]">
              <Button fullWidth onClick={() => setIsMobileFilterOpen(false)}>
                Natijalarni ko'rsatish ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
