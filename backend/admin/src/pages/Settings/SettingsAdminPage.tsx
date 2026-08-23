import React from 'react';
import { Settings, Server } from 'lucide-react';

export const SettingsAdminPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Tizim Sozlamalari & API Infratuzilma</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Backend API integratsiyasi, server muhiti va xususiyatlar bayroqlari (Feature Flags).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-black text-[#0E3B2E] text-base">
            <Server className="size-5 text-[#2D6A4F]" />
            <span>Backend API Holati</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">Backend API Endpoint:</span>
              <span className="font-mono font-bold text-[#0E3B2E]">/api/v1/*</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">NestJS Server:</span>
              <span className="font-bold text-emerald-600">Online (Port 4000)</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">PostgreSQL DB (Prisma):</span>
              <span className="font-bold text-emerald-600">Sinxron</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">Redis Cache:</span>
              <span className="font-bold text-emerald-600">Faol</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-black text-[#0E3B2E] text-base">
            <Settings className="size-5 text-[#2D6A4F]" />
            <span>Xususiyatlar (Feature Flags)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">E-Commerce Savat & Checkout:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">YOQILGAN</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">Click & Payme to‘lovlari:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">YOQILGAN</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">Ko‘p tillilik (UZ, RU, EN):</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">YOQILGAN</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F6F0]">
              <span className="font-semibold text-[#1A2E26]">SMS Xabarnomalar:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">YOQILGAN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
