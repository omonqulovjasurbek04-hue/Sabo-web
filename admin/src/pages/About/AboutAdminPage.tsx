import React, { useState } from 'react';
import { Info, Save } from 'lucide-react';

export const AboutAdminPage: React.FC = () => {
  const [content, setContent] = useState({
    titleUz: 'SABO — Tabiiy sut va sut mahsulotlari yetakchisi',
    descriptionUz: 'Bizning maqsadimiz — har bir xonadonga eng toza, sifatli va foydali sut mahsulotlarini yetkazishdir.',
    experienceYears: '15+',
    farmsCount: '24+',
    dailyLiters: '50,000+',
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Biz Haqimizda Sahifasi Tahriri</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Saytdagi kompaniya missiyasi, tarixi va asosiy ko‘rsatkichlarini boshqarish.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-5 text-xs">
        <div>
          <label className="block font-bold text-[#52796F] mb-1.5 uppercase tracking-wider text-[11px]">
            Bosh sarlavha (UZ)
          </label>
          <input
            type="text"
            value={content.titleUz}
            onChange={(e) => setContent({ ...content, titleUz: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold text-sm focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#52796F] mb-1.5 uppercase tracking-wider text-[11px]">
            Kompaniya missiyasi & tavsifi
          </label>
          <textarea
            rows={4}
            value={content.descriptionUz}
            onChange={(e) => setContent({ ...content, descriptionUz: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-semibold leading-relaxed focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block font-bold text-[#52796F] mb-1">Tajriba yillari</label>
            <input
              type="text"
              value={content.experienceYears}
              onChange={(e) => setContent({ ...content, experienceYears: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-[#52796F] mb-1">Hamkor fermalar</label>
            <input
              type="text"
              value={content.farmsCount}
              onChange={(e) => setContent({ ...content, farmsCount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-[#52796F] mb-1">Kunlik hajm</label>
            <input
              type="text"
              value={content.dailyLiters}
              onChange={(e) => setContent({ ...content, dailyLiters: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] font-bold"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => alert('O‘zgarishlar muvaffaqiyatli saqlandi!')}
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
