import React from 'react';
import { ProductCategory } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

export interface FilterState {
  category: ProductCategory;
  fatContent: string;
  isOrganicOnly: boolean;
  isLactoseFreeOnly: boolean;
  isBestsellerOnly: boolean;
  minPrice: number;
  maxPrice: number;
}

interface ProductFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  categories: Array<{ key: ProductCategory; label: string; count?: number }>;
  isMobileDrawer?: boolean;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onChange,
  onReset,
  categories,
  isMobileDrawer = false,
}) => {
  const { t } = useTranslation();

  const fatOptions = [
    { label: 'Barchasi', value: 'all' },
    { label: '2.5%', value: '2.5%' },
    { label: '3.2%', value: '3.2%' },
    { label: '9.0%', value: '9%' },
    { label: '20%', value: '20%' },
    { label: '40%', value: '40%' },
    { label: '45%', value: '45%' },
    { label: '82.5%', value: '82.5%' },
  ];

  const handleCategoryChange = (cat: ProductCategory) => {
    onChange({ ...filters, category: cat });
  };

  const handleFatChange = (fat: string) => {
    onChange({ ...filters, fatContent: fat });
  };

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-0' : 'bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] shadow-xs'}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
          <h3 className="font-bold text-base text-[#17202A] dark:text-[#F5F7F9] font-serif">
            {t.common.filter}
          </h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-[#59636D] dark:text-[#AEB7C0] hover:text-[#C71925] dark:hover:text-[#E32935] transition-colors"
          title="Filtrlarni tozalash"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.common.clearFilters}</span>
        </button>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] mb-3">
          {t.catalog.filterByCategory}
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                    : 'text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#EFF7FB] dark:hover:bg-[#102C3C]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fat Content Pills */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] mb-3">
          {t.catalog.filterByFat}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {fatOptions.map((opt) => {
            const isSelected = filters.fatContent === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleFatChange(opt.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                    : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#E5F3FA] dark:hover:bg-[#163B50]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Attributes checkboxes */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] mb-3">
          {t.catalog.filterByTrait}
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                filters.isOrganicOnly
                  ? 'bg-[#C71925] border-[#C71925] text-white'
                  : 'border-[#DCE3E8] dark:border-[#29323C] bg-white dark:bg-white/5 group-hover:border-[#1684C4]'
              }`}
              onClick={() => onChange({ ...filters, isOrganicOnly: !filters.isOrganicOnly })}
            >
              {filters.isOrganicOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs font-medium text-[#17202A] dark:text-[#AEB7C0]">100% Tabiiy & Organik</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                filters.isLactoseFreeOnly
                  ? 'bg-[#C71925] border-[#C71925] text-white'
                  : 'border-[#DCE3E8] dark:border-[#29323C] bg-white dark:bg-white/5 group-hover:border-[#1684C4]'
              }`}
              onClick={() =>
                onChange({ ...filters, isLactoseFreeOnly: !filters.isLactoseFreeOnly })
              }
            >
              {filters.isLactoseFreeOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs font-medium text-[#17202A] dark:text-[#AEB7C0]">Laktozasiz mahsulotlar</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                filters.isBestsellerOnly
                  ? 'bg-[#C71925] border-[#C71925] text-white'
                  : 'border-[#DCE3E8] dark:border-[#29323C] bg-white dark:bg-white/5 group-hover:border-[#1684C4]'
              }`}
              onClick={() =>
                onChange({ ...filters, isBestsellerOnly: !filters.isBestsellerOnly })
              }
            >
              {filters.isBestsellerOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span className="text-xs font-medium text-[#17202A] dark:text-[#AEB7C0]">Ommabop (Hit mahsulot)</span>
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#59636D] dark:text-[#AEB7C0] mb-3">
          {t.catalog.priceRange}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={200000}
            step={5000}
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
            placeholder="0"
            className="w-1/2 px-3 py-2 text-xs bg-white dark:bg-[#1C242D] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
          />
          <span className="text-xs text-[#59636D]">-</span>
          <input
            type="number"
            min={0}
            max={200000}
            step={5000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) || 200000 })}
            placeholder="150000"
            className="w-1/2 px-3 py-2 text-xs bg-white dark:bg-[#1C242D] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
          />
        </div>
      </div>
    </div>
  );
};
