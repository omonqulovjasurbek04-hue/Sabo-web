import React from 'react';
import { Factory, CheckCircle2, AlertTriangle, Droplet, ShieldCheck, Thermometer } from 'lucide-react';

export const ProductionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Ishlab Chiqarish & Sifat Nazorati</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          SABO fermalaridan sut qabul qilish, pasterizatsiya va laboratoriya tekshiruv ko‘rsatkichlari.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700"><Droplet className="size-5" /></div>
            <span className="text-xs font-bold text-[#52796F]">Kunlik Sut Qabuli</span>
          </div>
          <div className="text-2xl font-black text-[#0E3B2E]">18,500 <span className="text-xs font-bold text-[#52796F]">Litr</span></div>
          <span className="text-xs text-emerald-600 font-bold block mt-1">Sifat ko‘rsatkichi: 99.8% (Astra-Class)</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700"><Thermometer className="size-5" /></div>
            <span className="text-xs font-bold text-[#52796F]">Pasterizatsiya Harorati</span>
          </div>
          <div className="text-2xl font-black text-[#0E3B2E]">76.5°C <span className="text-xs font-bold text-[#52796F]">(15 soniya)</span></div>
          <span className="text-xs text-emerald-600 font-bold block mt-1">Norma doirasida barqaror</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck className="size-5" /></div>
            <span className="text-xs font-bold text-[#52796F]">Laboratoriya Xulosasi</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">Tasdiqlangan</div>
          <span className="text-xs text-[#52796F] font-bold block mt-1">Barcha mikrobiologik talablarga mos</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <h2 className="text-lg font-black text-[#0E3B2E] mb-4">Kunlik Ishlab Chiqarish Partiyalari (Batches)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-4">Partiya ID</th>
                <th className="py-3 px-4">Mahsulot</th>
                <th className="py-3 px-4">Hajmi</th>
                <th className="py-3 px-4">Yog‘lilik</th>
                <th className="py-3 px-4">Mas’ul texnolog</th>
                <th className="py-3 px-4">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3DA]/60">
              <tr className="hover:bg-[#F8F6F0]">
                <td className="py-3 px-4 font-mono font-bold text-[#0E3B2E]">BATCH-2026-0822-A</td>
                <td className="py-3 px-4 font-bold text-[#1A2E26]">SABO Sut 3.2% (1L Tetrapak)</td>
                <td className="py-3 px-4 font-bold text-[#0E3B2E]">5,000 dona</td>
                <td className="py-3 px-4">3.22%</td>
                <td className="py-3 px-4 text-[#52796F] font-medium">B. Rahimov</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">Qadoqlandi</span></td>
              </tr>
              <tr className="hover:bg-[#F8F6F0]">
                <td className="py-3 px-4 font-mono font-bold text-[#0E3B2E]">BATCH-2026-0822-B</td>
                <td className="py-3 px-4 font-bold text-[#1A2E26]">SABO Kefir 2.5% (1L)</td>
                <td className="py-3 px-4 font-bold text-[#0E3B2E]">3,200 dona</td>
                <td className="py-3 px-4">2.51%</td>
                <td className="py-3 px-4 text-[#52796F] font-medium">M. Karimova</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700">Fermentatsiya</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
