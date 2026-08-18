import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../../context/LanguageContext';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  id?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onSelectProduct,
  onQuickView,
  id,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div id={id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#151B22] rounded-3xl p-5 border border-[#DCE3E8] dark:border-[#29323C] animate-pulse space-y-4"
          >
            <div className="w-full aspect-square bg-[#EFF7FB] dark:bg-white/5 rounded-2xl" />
            <div className="h-4 bg-[#EFF7FB] dark:bg-white/5 rounded-md w-2/3" />
            <div className="h-3 bg-[#EFF7FB] dark:bg-white/5 rounded-md w-full" />
            <div className="h-8 bg-[#EFF7FB] dark:bg-white/5 rounded-xl w-full pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div id={id} className="text-center py-16 bg-white dark:bg-[#151B22] rounded-3xl border border-dashed border-[#DCE3E8] dark:border-[#29323C] p-8">
        <div className="w-16 h-16 bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[#17202A] dark:text-[#F5F7F9] font-serif">
          {t.catalog.noProductsFound}
        </h3>
        <p className="mt-1 text-sm text-[#59636D] dark:text-[#AEB7C0] max-w-md mx-auto">
          Filtrlarni o'zgartirib ko'ring yoki barcha mahsulotlar ro'yxatiga qayting.
        </p>
      </div>
    );
  }

  return (
    <div id={id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
