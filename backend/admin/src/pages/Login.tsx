import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Login yoki parol noto‘g‘ri! Qayta tekshirib kiring.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0E3B2E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full my-auto relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#EBE3DA] shadow-2xl">
          <div className="text-center mb-8">
            <div className="size-14 rounded-2xl bg-[#0E3B2E] text-[#D8F3DC] flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-md">
              S
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#0E3B2E] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="size-3.5" />
              <span>SABO Boshqaruv Tizimi</span>
            </div>
            <h1 className="text-2xl font-black text-[#0E3B2E] tracking-tight">
              Administrator Kirish
            </h1>
            <p className="text-xs text-[#52796F] mt-1 font-medium">
              Boshqaruv paneliga kirish uchun ma&apos;lumotlarni kiriting.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#52796F] mb-1.5">
                Login (Foydalanuvchi nomi)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#52796F]" />
                <input
                  type="text"
                  required
                  placeholder="Foydalanuvchi nomi"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-sm font-semibold text-[#1A2E26] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/20 focus:border-[#0E3B2E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#52796F] mb-1.5">
                Maxfiy parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#52796F]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-sm font-semibold text-[#1A2E26] focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/20 focus:border-[#0E3B2E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#52796F] hover:text-[#0E3B2E]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 px-6 rounded-xl bg-[#0E3B2E] text-white font-bold text-sm shadow-md hover:bg-[#08281F] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Tizimga kirish</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#EBE3DA] text-center text-xs text-[#52796F] font-semibold">
            256-bit SSL shifrlangan xavfsiz tizim
          </div>
        </div>
      </div>
    </div>
  );
};
