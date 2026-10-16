import React from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Yuklanmoqda...' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-xs font-bold text-[#52796F]" role="status">
    <Loader2 className="size-4 animate-spin" />
    <span>{label}</span>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center" role="alert">
    <div className="size-12 rounded-2xl bg-red-50 text-[#E63946] flex items-center justify-center">
      <AlertTriangle className="size-6" />
    </div>
    <div className="text-sm font-bold text-[#1A2E26]">Ma’lumotni yuklab bo‘lmadi</div>
    <p className="text-xs text-[#52796F] max-w-md">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-1 px-4 py-2 rounded-xl border border-[#EBE3DA] bg-white text-xs font-bold text-[#0E3B2E] hover:bg-[#F8F6F0] flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className="size-3.5" />
        Qayta urinish
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
    <div className="size-12 rounded-2xl bg-[#F8F6F0] text-[#52796F] flex items-center justify-center">
      <Inbox className="size-6" />
    </div>
    <div className="text-sm font-bold text-[#1A2E26]">{title}</div>
    {hint && <p className="text-xs text-[#52796F] max-w-md">{hint}</p>}
  </div>
);

/** Inline banner for mutation (save/delete) errors and notices. */
export const InlineAlert: React.FC<{ tone: 'error' | 'info' | 'success'; message: string; onClose?: () => void }> = ({
  tone,
  message,
  onClose,
}) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-[#B42318]',
    info: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  }[tone];
  return (
    <div className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl border text-xs font-semibold ${styles}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="font-black opacity-60 hover:opacity-100 cursor-pointer" aria-label="Yopish">
          ×
        </button>
      )}
    </div>
  );
};
