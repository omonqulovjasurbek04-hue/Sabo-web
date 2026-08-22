import React from 'react';
import { Shield, UserPlus, Check } from 'lucide-react';

export const UsersRolesPage: React.FC = () => {
  const users = [
    { id: 'u_1', name: 'Bekzodbek', username: 'Bekzodbek', role: 'SUPER_ADMIN', status: 'Active', email: 'admin@sabo.uz' },
    { id: 'u_2', name: 'Jasur Rahmonov', username: 'jasur_mgr', role: 'MANAGER', status: 'Active', email: 'jasur@sabo.uz' },
    { id: 'u_3', name: 'Nodira Salimova', username: 'nodira_editor', role: 'EDITOR', status: 'Active', email: 'nodira@sabo.uz' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Foydalanuvchilar & Rollar (RBAC)</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Adminlar, menejerlar va muharrirlar huquqlarini boshqarish.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Foydalanuvchi</th>
              <th className="py-3 px-4">Login</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#F8F6F0]">
                <td className="py-3.5 px-4 font-bold text-[#1A2E26] text-sm">{u.name}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#0E3B2E]">{u.username}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0E3B2E] text-white uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#52796F] font-medium">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    <Check className="size-3" />
                    Faol
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
