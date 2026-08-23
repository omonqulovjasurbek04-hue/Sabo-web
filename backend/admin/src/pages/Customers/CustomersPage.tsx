import React, { useState } from 'react';
import type { Customer } from '../../types';

const initialCustomers: Customer[] = [
  { id: 'c_1', name: 'Jasurbek Omonqulov', phone: '+998 90 123 45 67', email: 'jasur@sabo.uz', totalOrders: 14, totalSpent: 380000, lastOrderDate: '2026-08-22', status: 'active' },
  { id: 'c_2', name: 'Dilshod Rahimov', phone: '+998 93 987 65 43', email: 'dilshod@gmail.com', totalOrders: 8, totalSpent: 210000, lastOrderDate: '2026-08-20', status: 'active' },
  { id: 'c_3', name: 'Madina Alimova', phone: '+998 97 555 11 22', email: 'madina@mail.ru', totalOrders: 21, totalSpent: 640000, lastOrderDate: '2026-08-21', status: 'active' },
  { id: 'c_4', name: 'Anvar Qodirov', phone: '+998 99 888 77 66', email: 'anvar@yahoo.com', totalOrders: 5, totalSpent: 125000, lastOrderDate: '2026-08-18', status: 'active' },
];

export const CustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Mijozlar</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Ro‘yxatdan o‘tgan barcha doimiy xaridorlar va ularning faoliyati.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Mijoz ismi yoki telefoni bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Mijoz</th>
              <th className="py-3 px-4">Aloqa</th>
              <th className="py-3 px-4">Buyurtmalar</th>
              <th className="py-3 px-4">Jami xarid</th>
              <th className="py-3 px-4">So‘nggi faollik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F6F0] transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#1A2E26] text-sm">{c.name}</td>
                <td className="py-3.5 px-4">
                  <div className="font-mono text-[#52796F]">{c.phone}</div>
                  {c.email && <div className="text-[11px] text-[#52796F]/70">{c.email}</div>}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0E3B2E]">{c.totalOrders} ta</td>
                <td className="py-3.5 px-4 font-black text-[#0E3B2E]">
                  {c.totalSpent.toLocaleString()} UZS
                </td>
                <td className="py-3.5 px-4 text-[#52796F] font-semibold">{c.lastOrderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
