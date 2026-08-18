import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { BRANCHES } from '../constants/data';
import { BranchOffice } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  Briefcase,
  CheckCircle2,
  Navigation,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';
import { apiClient } from '../services/api';

export const ContactBranchesPage: React.FC = () => {
  const { language, t } = useTranslation();

  const [selectedBranch, setSelectedBranch] = useState<BranchOffice>(BRANCHES[0]);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Contact / B2B form state
  const [formType, setFormType] = useState<'customer' | 'b2b'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    company: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredBranches = BRANCHES.filter((b) => {
    if (selectedCity !== 'all') {
      const isMatch =
        (selectedCity === 'tashkent' && b.id.includes('tashkent')) ||
        (selectedCity === 'samarkand' && b.id.includes('samarkand')) ||
        (selectedCity === 'bukhara' && b.id.includes('bukhara')) ||
        (selectedCity === 'fergana' && b.id.includes('fergana'));
      if (!isMatch) return false;
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.trim().length < 9 || !formData.message.trim()) {
      showToast({
        type: 'error',
        title: 'Iltimos, barcha maydonlarni to\'ldiring',
        message: 'Ism, telefon raqami va xabar matni talab qilinadi.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.submitContactForm({
        ...formData,
        type: formType,
      });
    } catch {
      // handled inside fallback
    }
    setIsSubmitting(false);

    showToast({
      type: 'success',
      title: 'Murojaatingiz qabul qilindi!',
      message: 'Tez orada mutaxassislarimiz siz bilan bog\'lanishadi.',
    });

    setFormData({
      name: '',
      phone: '+998 ',
      company: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#1684C4]/20 dark:border-white/10">
          <MapPin className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
          <span>Filiallar va Bog'lanish</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
          {t.nav.contact}
        </h1>

        <p className="text-base text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
          SABO zavod majmuasi, mintaqaviy tarqatish markazlari yoki biz bilan to'g'ridan-to'g'ri bog'lanish uchun aloqa ma'lumotlari.
        </p>
      </div>

      {/* 2. Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935] flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-white">Mijozlar Qo'llab-quvvatlashi</h3>
          <p className="text-xs text-[#59636D] dark:text-[#AEB7C0]">Telegram & Qo'ng'iroq</p>
          <a
            href="tel:+998993451655"
            className="block text-base font-bold text-[#C71925] dark:text-[#E32935] hover:underline"
          >
            +998 (99) 345-16-55
          </a>
        </div>

        <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-white">Telegram & Email</h3>
          <p className="text-xs text-[#59636D] dark:text-[#AEB7C0]">Takliflar va buyurtma uchun</p>
          <a
            href="https://t.me/SaboMilk"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-bold text-[#1684C4] dark:text-[#2498D1] hover:underline"
          >
            @SaboMilk
          </a>
        </div>

        <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#73B832] dark:text-[#82C744] flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-white">Bosh Ofis & Zavod</h3>
          <p className="text-xs text-[#59636D] dark:text-[#AEB7C0]">Toshkent sh., Yangihayot tumani, Binokor ko'chasi 45</p>
          <span className="inline-block text-xs font-bold text-[#73B832] dark:text-[#82C744]">Dushanba - Shanba</span>
        </div>
      </div>

      {/* 3. Interactive Branches Map / Locator */}
      <div className="bg-white dark:bg-[#151B22] rounded-3xl p-6 sm:p-10 border border-[#DCE3E8] dark:border-[#29323C] shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE3E8] dark:border-[#29323C]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
              Filiallar va Distribyutsiya Markazlari
            </h2>
            <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-1">
              O'zingizga eng yaqin bo'lgan SABO markazini tanlang:
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'tashkent', label: 'Toshkent' },
              { id: 'samarkand', label: 'Samarqand' },
              { id: 'bukhara', label: 'Buxoro' },
            ].map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city.id
                    ? 'bg-[#C71925] text-white shadow-xs'
                    : 'bg-[#EFF7FB] dark:bg-white/10 text-[#59636D] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Branch List */}
          <div className="lg:col-span-5 space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredBranches.map((branch) => {
              const isSelected = selectedBranch.id === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#C71925] dark:border-[#E32935] bg-[#EFF7FB] dark:bg-[#102C3C] shadow-xs'
                      : 'border-[#DCE3E8] dark:border-[#29323C] hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-[#17202A] dark:text-white">{branch.city[language]}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF7FB] dark:bg-white/10 text-[#1684C4] dark:text-[#2498D1]">
                      {branch.isHeadquarter ? 'Bosh ofis' : 'Filial'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#59636D] dark:text-[#AEB7C0] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C71925] dark:text-[#E32935] shrink-0" />
                    <span className="truncate">{branch.address[language]}</span>
                  </p>
                  <div className="text-[11px] text-[#59636D] dark:text-gray-300 mt-2 flex items-center justify-between">
                    <span>{branch.phone}</span>
                    <span className="text-[#1684C4] dark:text-[#2498D1] font-semibold">{branch.workingHours[language]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Visual Map Presentation */}
          <div className="lg:col-span-7 bg-[#EFF7FB] dark:bg-black/20 rounded-3xl p-6 sm:p-8 border border-[#DCE3E8] dark:border-[#29323C] space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1684C4] dark:text-[#2498D1]">
                <Navigation className="w-4 h-4" />
                <span>Tanlangan markaz tafsilotlari</span>
              </div>
              <span className="text-xs font-bold text-[#59636D] dark:text-[#AEB7C0]">{selectedBranch.city[language]}</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17202A] dark:text-white">
                {selectedBranch.city[language]}
              </h3>

              <div className="space-y-2 text-xs text-[#59636D] dark:text-gray-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C71925] dark:text-[#E32935] shrink-0 mt-0.5" />
                  <span><strong>Manzil:</strong> {selectedBranch.address[language]}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1] shrink-0 mt-0.5" />
                  <span><strong>Ish vaqti:</strong> {selectedBranch.workingHours[language]}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#73B832] dark:text-[#82C744] shrink-0 mt-0.5" />
                  <span><strong>Aloqa:</strong> {selectedBranch.phone}</span>
                </div>
              </div>

              {/* Interactive map visualization canvas */}
              <div className="aspect-[16/8] rounded-2xl bg-[#DCE3E8] dark:bg-[#0D1117] border border-[#DCE3E8] dark:border-[#29323C] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1684C4_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 bg-white dark:bg-[#151B22] p-3 rounded-2xl shadow-lg border border-[#DCE3E8] dark:border-[#29323C] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C71925] text-white flex items-center justify-center font-bold">
                    S
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17202A] dark:text-white">{selectedBranch.city[language]}</div>
                    <div className="text-[10px] text-[#59636D] dark:text-[#AEB7C0]">{selectedBranch.address[language]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Feedback & B2B Wholesale Contact Form */}
      <div className="bg-[#EFF7FB]/60 dark:bg-[#151B22] rounded-3xl p-6 sm:p-12 border border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
              Bizga xabar qoldiring
            </h2>
            <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] font-sans">
              Taklif, shikoyat yoki ulgurji B2B hamkorlik (do'kon, kafe, mehmonxonalar uchun).
            </p>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFormType('customer')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  formType === 'customer'
                    ? 'bg-[#C71925] text-white shadow-xs'
                    : 'bg-white dark:bg-white/10 text-[#59636D] dark:text-gray-300 border border-[#DCE3E8] dark:border-white/10'
                }`}
              >
                Jismoniy shaxs (Xaridor)
              </button>
              <button
                type="button"
                onClick={() => setFormType('b2b')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  formType === 'b2b'
                    ? 'bg-[#C71925] text-white shadow-xs'
                    : 'bg-white dark:bg-white/10 text-[#59636D] dark:text-gray-300 border border-[#DCE3E8] dark:border-white/10'
                }`}
              >
                Yuridik shaxs (B2B Hamkorlik)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                  Ismingiz yoki Vakil ismi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black/20 text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                  Telefon raqamingiz *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black/20 text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                />
              </div>
            </div>

            {formType === 'b2b' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                    Kompaniya yoki Do'kon nomi
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Masalan: Korzinka yoki Grand Hotel"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black/20 text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                    Email manzil
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sales@company.uz"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black/20 text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#17202A] dark:text-gray-300 block mb-1">
                Xabar matni yoki buyurtma hajmi *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Savol yoki taklifingizni batafsil yozing..."
                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black/20 text-[#17202A] dark:text-white border border-[#DCE3E8] dark:border-[#29323C] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C71925]"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Xabarni yuborish
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
