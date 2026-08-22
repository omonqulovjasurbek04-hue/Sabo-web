import React, { useState } from 'react';
import { FolderTree, Plus, Check } from 'lucide-react';
import type { Category } from '../../types';

const initialCategories: Category[] = [
  { id: 'cat_1', slug: 'milk', nameUz: 'Sut', nameRu: 'Молоко', nameEn: 'Milk', description: 'Tabiiy sigir suti', productCount: 4, isActive: true },
  { id: 'cat_2', slug: 'kefir', nameUz: 'Kefir', nameRu: 'Кефир', nameEn: 'Kefir', description: 'Toza va foydali kefir', productCount: 3, isActive: true },
  { id: 'cat_3', slug: 'smetana', nameUz: 'Qaymoq & Smetana', nameRu: 'Сметана', nameEn: 'Sour cream', description: 'Qaymoq mahsulotlari', productCount: 3, isActive: true },
  { id: 'cat_4', slug: 'yogurt', nameUz: 'Yogurt', nameRu: 'Йогурт', nameEn: 'Yogurt', description: 'Yumshoq va mazali mevali yogurtlar', productCount: 4, isActive: true },
  { id: 'cat_5', slug: 'butter', nameUz: 'Sariyog‘', nameRu: 'Сливочное масло', nameEn: 'Butter', description: 'Tabiiy 82.5% sariyog‘', productCount: 2, isActive: true },
  { id: 'cat_6', slug: 'cheese', nameUz: 'Pishloq', nameRu: 'Сыр', nameEn: 'Cheese', description: 'Tabiiy sutli pishloqlar', productCount: 2, isActive: true },
];

export const CategoriesPage: React.FC = () => {
  const [categories] = useState<Category[]>(initialCategories);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Kategoriyalar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Mahsulot toifalari va ulardagi tovarlar soni.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 rounded-2xl bg-[#EBF7EE] text-[#0E3B2E] flex items-center justify-center font-black text-lg">
                  {c.nameUz.charAt(0)}
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  <Check className="size-3" />
                  Faol
                </span>
              </div>
              <h2 className="text-xl font-black text-[#0E3B2E]">{c.nameUz}</h2>
              <p className="text-xs text-[#52796F] font-mono mt-0.5">slug: {c.slug}</p>
              <p className="text-xs text-[#52796F] mt-2 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EBE3DA] flex items-center justify-between text-xs">
              <span className="text-[#52796F] font-semibold">Mahsulotlar soni:</span>
              <span className="font-black text-[#0E3B2E]">{c.productCount} ta</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
