import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Trash2 } from 'lucide-react';
import type { ContactMessage } from '../../types';

const initialMessages: ContactMessage[] = [
  {
    id: 'msg_1',
    name: 'Akmal Karimov',
    phone: '+998 91 234 56 78',
    subject: 'Ulgurji hamkorlik shartnomasi',
    message: 'Do‘konlar tarmog‘imizga SABO sut va kefir mahsulotlarini har kuni ulgurji hajmda yetkazib berish bo‘yicha tijoriy taklif olmoqchimiz.',
    status: 'NEW',
    createdAt: 'Bugun, 08:15',
  },
  {
    id: 'msg_2',
    name: 'Sardor Yusupov',
    phone: '+998 94 321 00 11',
    subject: 'Sertifikatlar bo‘yicha savol',
    message: 'SABO Yogurt mahsulotlarining Halol va ISO sifat sertifikatlari bilan qanday tanishsa bo‘ladi?',
    status: 'READ',
    createdAt: 'Kecha, 14:20',
  },
];

export const MessagesAdminPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  const toggleStatus = (id: string) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, status: m.status === 'NEW' ? 'READ' : 'NEW' } : m
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Qayta Aloqa Xabarlari</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Sayt aloqa formasidan kelib tushgan barcha savollar va tijoriy takliflar.
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-6 rounded-3xl bg-white border transition-all ${
              m.status === 'NEW' ? 'border-[#E63946]/40 shadow-xs' : 'border-[#EBE3DA]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-base text-[#1A2E26]">{m.name}</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EBF7EE] text-[#0E3B2E]">
                  {m.phone}
                </span>
                {m.status === 'NEW' && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E63946] text-white animate-pulse">
                    YANGI
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#52796F]">
                <span>{m.createdAt}</span>
                <button
                  onClick={() => toggleStatus(m.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    m.status === 'NEW'
                      ? 'bg-[#0E3B2E] text-white hover:bg-[#08281F]'
                      : 'bg-[#F8F6F0] text-[#52796F]'
                  }`}
                >
                  {m.status === 'NEW' ? 'O‘qilgan deb belgilash' : 'O‘qilgan'}
                </button>
              </div>
            </div>
            <div className="font-bold text-sm text-[#0E3B2E] mb-1">{m.subject}</div>
            <p className="text-xs text-[#52796F] font-medium leading-relaxed">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
