import React from 'react';
import { Bell, Check, ShoppingCart, MessageSquare, ShieldAlert } from 'lucide-react';

export const NotificationsAdminPage: React.FC = () => {
  const notifications = [
    { id: '1', title: 'Yangi buyurtma qabul qilindi', desc: 'Jasurbek Omonqulov — 36,000 UZS (Click to‘lovi amalga oshirildi)', time: '10 daqiqa oldin', type: 'order' },
    { id: '2', title: 'Yangi hamkorlik xabari', desc: 'Akmal Karimov — Ulgurji yetkazib berish bo‘yicha murojaat', time: '1 soat oldin', type: 'message' },
    { id: '3', title: 'Laboratoriya partiyasi tasdiqlandi', desc: 'BATCH-2026-0822-A muvaffaqiyatli qadoqlashga ruxsat etildi', time: '2 soat oldin', type: 'production' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Bildirishnomalar</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Yangi buyurtmalar, murojaatlar va tizim hodisalari to‘g‘risidagi ogohlantirishlar.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-5 rounded-2xl bg-white border border-[#EBE3DA] shadow-xs flex items-start gap-4 hover:shadow-md transition-all">
            <div className="p-2.5 rounded-xl bg-[#EBF7EE] text-[#0E3B2E] shrink-0">
              <Bell className="size-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1A2E26]">{n.title}</h3>
                <span className="text-[11px] text-[#52796F] font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-[#52796F] mt-1 font-medium">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
