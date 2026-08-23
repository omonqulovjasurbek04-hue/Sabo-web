import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Certificate } from '../../types';

const initialCertificates: Certificate[] = [
  { id: 'cert_1', titleUz: 'ISO 22000:2018 Oziq-ovqat Xavfsizligi', issuer: 'International Standards Organization', standard: 'ISO 22000', year: 2024, isValid: true },
  { id: 'cert_2', titleUz: 'Halol Sifat Standarti Sertifikati', issuer: 'Muslims Board of Uzbekistan Halol Center', standard: 'Halal-UZ', year: 2024, isValid: true },
  { id: 'cert_3', titleUz: 'GOST Standart Muvofiqlik Sertifikati', issuer: 'UzStandard Agentligi', standard: 'GOST 31449-2013', year: 2025, isValid: true },
];

export const CertificatesAdminPage: React.FC = () => {
  const [certs] = useState<Certificate[]>(initialCertificates);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Sertifikatlar Boshqaruvi</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          ISO, Halol va GOST xalqaro sifat sertifikatlarini joylashtirish va yangilash.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {certs.map((c) => (
          <div key={c.id} className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="size-12 rounded-2xl bg-[#EBF7EE] text-[#0E3B2E] flex items-center justify-center mb-4">
                <ShieldCheck className="size-6 text-[#2D6A4F]" />
              </div>
              <h2 className="text-base font-black text-[#0E3B2E]">{c.titleUz}</h2>
              <div className="text-xs text-[#52796F] mt-1 font-medium">{c.issuer}</div>
              <div className="text-xs font-mono font-bold text-[#0E3B2E] mt-2">Standart: {c.standard}</div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EBE3DA] flex items-center justify-between text-xs">
              <span className="text-[#52796F] font-semibold">Amal qilish muddati:</span>
              <span className="font-extrabold text-emerald-600">Faol ({c.year})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
