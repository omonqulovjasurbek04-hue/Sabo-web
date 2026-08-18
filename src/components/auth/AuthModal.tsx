import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';
import { User, Phone, Lock, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { language, t } = useTranslation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 9 || password.trim().length < 4) {
      showToast({
        type: 'error',
        title: 'Ma\'lumotlarni to\'liq kiriting',
        message: 'Telefon raqam va kamida 4 xonali parol talab qilinadi.',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(phone, password);
        if (ok) {
          showToast({ type: 'success', title: 'Xush kelibsiz!' });
          onClose();
        } else {
          showToast({ type: 'error', title: 'Telefon raqam yoki parol noto\'g\'ri' });
        }
      } else {
        if (!name.trim()) {
          showToast({ type: 'error', title: 'Iltimos, ismingizni kiriting' });
          setIsLoading(false);
          return;
        }
        const ok = await register(name, phone, password);
        if (ok) {
          showToast({ type: 'success', title: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!' });
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935] flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
            {mode === 'login' ? 'Tizimga kirish' : 'Yangi hisob yaratish'}
          </h3>
          <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-sans">
            SABO do'konida buyurtmalaringizni kuzatish va bonuslarga ega bo'lish uchun tizimga kiring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                Ism va Familiyangiz *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#59636D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
              Telefon raqamingiz *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#59636D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
              Parol *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#59636D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
              />
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            size="lg"
            rightIcon={mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          >
            {mode === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-[#DCE3E8] dark:border-[#29323C] text-xs text-[#59636D] dark:text-[#AEB7C0]">
          {mode === 'login' ? (
            <div>
              Hisobingiz yo'qmi?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#C71925] dark:text-[#E32935] hover:underline cursor-pointer"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          ) : (
            <div>
              Profilingiz bormi?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#C71925] dark:text-[#E32935] hover:underline cursor-pointer"
              >
                Tizimga kirish
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
