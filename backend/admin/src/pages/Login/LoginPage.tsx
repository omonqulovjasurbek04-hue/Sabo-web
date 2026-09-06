import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from || '/';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const ok = await login(identifier.trim(), password);
    setSubmitting(false);
    if (!ok) {
      setError("Login yoki parol noto'g'ri, yoki sizda admin panelga kirish huquqi yo'q.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="size-14 rounded-2xl bg-[#0E3B2E] text-[#D8F3DC] flex items-center justify-center font-extrabold text-2xl shadow-lg">
            S
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-[#0E3B2E]">SABO Dairy</div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#52796F]">
              Admin Dashboard
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#EBE3DA] shadow-xl p-7 flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-bold text-[#1A2E26] mb-1.5 block" htmlFor="identifier">
              Email yoki telefon
            </label>
            <div className="relative">
              <User className="size-4 text-[#52796F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#F8F6F0] text-sm text-[#1A2E26] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                placeholder="admin@sabo.uz"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1A2E26] mb-1.5 block" htmlFor="password">
              Parol
            </label>
            <div className="relative">
              <Lock className="size-4 text-[#52796F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE3DA] bg-[#F8F6F0] text-sm text-[#1A2E26] outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC] transition-all"
                placeholder="********"
              />
            </div>
          </div>

          {error ? (
            <div className="text-xs font-semibold text-[#E63946] bg-[#E63946]/10 border border-[#E63946]/20 rounded-xl px-3 py-2.5">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0E3B2E] hover:bg-[#164739] text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            <span>{submitting ? 'Tekshirilmoqda...' : 'Kirish'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
