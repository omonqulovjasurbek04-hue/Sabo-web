import React from 'react';
import { Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

export const MediaAdminPage: React.FC = () => {
  const mediaItems = [
    { id: '1', name: 'Sabo_Milk.jpg', size: '245 KB', dimensions: '800x800', type: 'image/jpeg' },
    { id: '2', name: 'Sabo_Kefir.jpg', size: '210 KB', dimensions: '800x800', type: 'image/jpeg' },
    { id: '3', name: 'Sabo_Smetana.jpg', size: '310 KB', dimensions: '800x800', type: 'image/jpeg' },
    { id: '4', name: 'Sabo_Yogurt.jpg', size: '280 KB', dimensions: '800x800', type: 'image/jpeg' },
    { id: '5', name: 'Sabo_Butter.jpg', size: '195 KB', dimensions: '800x800', type: 'image/jpeg' },
    { id: '6', name: 'logo.png', size: '64 KB', dimensions: '1230x678', type: 'image/png' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Media Kutubxona</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Sayt va mahsulotlar uchun yuklangan barcha grafik rasmlar va fayllar.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] flex items-center gap-2">
          <Upload className="size-4" />
          <span>Fayl yuklash</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {mediaItems.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="h-28 rounded-xl bg-[#F8F6F0] flex items-center justify-center mb-3">
              <ImageIcon className="size-10 text-[#2D6A4F]/60" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#1A2E26] truncate">{m.name}</div>
              <div className="text-[10px] text-[#52796F] mt-0.5">{m.size} • {m.dimensions}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
