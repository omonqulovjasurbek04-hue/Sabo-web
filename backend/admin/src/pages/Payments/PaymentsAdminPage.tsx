import React from 'react';

export const PaymentsAdminPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">To‘lov Shlyuzlari & Tranzaksiyalar</h1>
        <p className="text-sm text-[#52796F] font-medium mt-1">
          Click va Payme to‘lov tizimlari integratsiyasi hamda so‘nggi to‘lov holatlari.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-black text-[#0E3B2E]">Click Merchant API</div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">FAOL</span>
          </div>
          <div className="text-xs text-[#52796F] space-y-1">
            <div>Service ID: <span className="font-mono font-bold text-[#1A2E26]">38491</span></div>
            <div>Merchant ID: <span className="font-mono font-bold text-[#1A2E26]">29402</span></div>
            <div>Status: <span className="font-bold text-emerald-600">Jonli rejim (Production)</span></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-black text-[#0E3B2E]">Payme Merchant API</div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">FAOL</span>
          </div>
          <div className="text-xs text-[#52796F] space-y-1">
            <div>Merchant ID: <span className="font-mono font-bold text-[#1A2E26]">649201</span></div>
            <div>Webhook URL: <span className="font-mono font-bold text-[#1A2E26]">/api/v1/payments/payme</span></div>
            <div>Status: <span className="font-bold text-emerald-600">Jonli rejim (Production)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
