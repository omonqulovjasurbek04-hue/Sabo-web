import React from 'react';
import { Save } from 'lucide-react';

export const SeoAdminPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">SEO & Qidiruv Tizimlari</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Google va Yandex qidiruv tizimlari uchun Meta teglar, OpenGraph va Sitemap parametrlari.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#52796F] mb-1">Global Meta Title</label>
          <input
            type="text"
            defaultValue="SABO — Tabiiy Sut va Sut Mahsulotlari | Rasmiy Veb-Sayt"
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-[#52796F] mb-1">Meta Description</label>
          <textarea
            rows={3}
            defaultValue="SABO — toza va sifatli tabiiy sut, qatiq, qaymoq, yogurt va sariyog‘ mahsulotlari. Toshkent va butun O‘zbekiston bo‘ylab eng yuqori sifat kafolati."
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-bold text-[#52796F] mb-1">Qidiruv kalit so‘zlari (Keywords)</label>
          <input
            type="text"
            defaultValue="sabo sut, tabiiy sut, toza qatiq, qaymoq, yogurt toshkent, sut mahsulotlari uzbekistan"
            className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => alert('SEO sozlamalari saqlandi!')}
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
