import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import type { AuditLog } from '../../types';

const auditLogs: AuditLog[] = [
  { id: '1', action: 'ADMIN_LOGIN_SUCCESS', user: 'Bekzodbek', ip: '127.0.0.1', target: 'Admin Dashboard', timestamp: '2026-08-22 10:30:15' },
  { id: '2', action: 'ORDER_STATUS_UPDATED', user: 'Bekzodbek', ip: '127.0.0.1', target: 'ORD-2026-8941 -> CONFIRMED', timestamp: '2026-08-22 10:25:40' },
  { id: '3', action: 'PRODUCT_PRICE_CHANGED', user: 'Bekzodbek', ip: '127.0.0.1', target: 'SABO Sut 3.2% -> 12,000 UZS', timestamp: '2026-08-22 09:12:00' },
  { id: '4', action: 'SYSTEM_SETTINGS_SAVED', user: 'Bekzodbek', ip: '127.0.0.1', target: 'Payment Gateway Click', timestamp: '2026-08-21 17:45:10' },
];

export const AuditLogsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Audit & Xavfsizlik Jurnallari</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Boshqaruv tizimida amalga oshirilgan barcha xavfsizlik va ma’lumot o‘zgarishlari tarixi.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Amal (Action)</th>
              <th className="py-3 px-4">Foydalanuvchi</th>
              <th className="py-3 px-4">Nishon (Target)</th>
              <th className="py-3 px-4">IP Manzil</th>
              <th className="py-3 px-4">Sana va Vaqt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F8F6F0]">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0E3B2E]">{log.action}</td>
                <td className="py-3.5 px-4 font-bold text-[#1A2E26]">{log.user}</td>
                <td className="py-3.5 px-4 text-[#52796F] font-medium">{log.target}</td>
                <td className="py-3.5 px-4 font-mono text-[#52796F]">{log.ip}</td>
                <td className="py-3.5 px-4 text-[#52796F] font-semibold">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
