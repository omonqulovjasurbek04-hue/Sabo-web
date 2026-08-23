import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const TranslationsAdminPage: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Tarjimalar Boshqaruvi</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Saytning 3 ta tildagi (O‘zbekcha, Ruscha, Inglizcha) barcha matnlari va tugma nomlari.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveLang('uz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLang === 'uz' ? 'bg-[#0E3B2E] text-white shadow-sm' : 'bg-white border border-[#EBE3DA] text-[#52796F]'
          }`}
        >
          🇺🇿 O‘zbekcha (UZ)
        </button>
        <button
          onClick={() => setActiveLang('ru')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLang === 'ru' ? 'bg-[#0E3B2E] text-white shadow-sm' : 'bg-white border border-[#EBE3DA] text-[#52796F]'
          }`}
        >
          🇷🇺 Русский (RU)
        </button>
        <button
          onClick={() => setActiveLang('en')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeLang === 'en' ? 'bg-[#0E3B2E] text-white shadow-sm' : 'bg-white border border-[#EBE3DA] text-[#52796F]'
          }`}
        >
          🇬🇧 English (EN)
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#52796F] mb-1">Bosh sahifa sarlavhasi (Hero Title)</label>
          <input
            type="text"
            defaultValue={
              activeLang === 'uz'
                ? 'Tabiiy va Toza Sut Mahsulotlari'
                : activeLang === 'ru'
                ? 'Натуральная и чистая молочная продукция'
                : 'Natural & Pure Dairy Products'
            }
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-[#52796F] mb-1">Katalog tugmasi (CTA Button)</label>
          <input
            type="text"
            defaultValue={
              activeLang === 'uz' ? 'Katalogni ko‘rish' : activeLang === 'ru' ? 'Смотреть каталог' : 'View Catalog'
            }
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-[#52796F] mb-1">Savat matni (Cart)</label>
          <input
            type="text"
            defaultValue={
              activeLang === 'uz' ? 'Savat' : activeLang === 'ru' ? 'Корзина' : 'Cart'
            }
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => alert('Tarjimalar yangilandi!')}
            className="px-6 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold shadow-md hover:bg-[#08281F] flex items-center gap-2"
          >
            <Save className="size-4" />
            <span>Saqlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
