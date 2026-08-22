import React, { useState } from 'react';
import { BookOpen, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import type { BlogPost } from '../../types';

const initialPosts: BlogPost[] = [
  {
    id: 'post_1',
    titleUz: 'Ertalab sut ichishning inson organizmiga 5 ta asosiy foydasi',
    titleRu: '5 главных преимуществ питья молока по утрам',
    titleEn: '5 Key Benefits of Drinking Milk in the Morning',
    slug: 'ertalab-sut-ichishning-foydasi',
    category: 'Salomatlik',
    readTime: '3 daqiqa',
    status: 'PUBLISHED',
    publishedAt: '2026-08-20',
  },
  {
    id: 'post_2',
    titleUz: 'Kefir va uning hazm qilish tizimiga ta’siri',
    titleRu: 'Кефир и его влияние на пищеварительную систему',
    titleEn: 'Kefir and its Impact on Digestive Health',
    slug: 'kefir-va-hazm-qilish',
    category: 'Parhez',
    readTime: '4 daqiqa',
    status: 'PUBLISHED',
    publishedAt: '2026-08-15',
  },
];

export const BlogAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Blog & Yangiliklar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Foydali maqolalar, sut mahsulotlari bo‘yicha maslahatlar va yangiliklar.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] flex items-center gap-2">
          <Plus className="size-4" />
          <span>Yangi maqola qo‘shish</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Maqola Sarlavhasi</th>
              <th className="py-3 px-4">Toifa</th>
              <th className="py-3 px-4">O‘qish vaqti</th>
              <th className="py-3 px-4">Sana</th>
              <th className="py-3 px-4">Holat</th>
              <th className="py-3 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-[#F8F6F0]">
                <td className="py-3.5 px-4 font-bold text-[#1A2E26] text-sm max-w-md">
                  <div>{p.titleUz}</div>
                  <div className="text-[11px] text-[#52796F] font-mono">{p.slug}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#0E3B2E] uppercase">
                    {p.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#52796F] font-semibold">{p.readTime}</td>
                <td className="py-3.5 px-4 text-[#52796F] font-medium">{p.publishedAt}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    Chop etilgan
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button className="p-1.5 rounded-lg text-[#52796F] hover:text-[#0E3B2E]">
                    <Edit2 className="size-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-[#52796F] hover:text-[#E63946]">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
