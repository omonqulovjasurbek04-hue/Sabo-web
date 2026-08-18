import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  Star,
  Award,
  ChevronRight,
  Calculator,
  Play,
  Heart,
  Droplets,
  Milk,
  Plus,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { PRODUCTS, ARTICLES, TESTIMONIALS, FAQS } from '../constants/data';
import { ProductCard } from '../components/product/ProductCard';
import { Product, ProductCategory } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { showToast } from '../components/ui/Toast';
import { MilkGlass3D } from '../components/ui/MilkGlass3D';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { language, t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Nutrition Calculator State
  const [familyMembers, setFamilyMembers] = useState(3);
  const [focusGoal, setFocusGoal] = useState<'bone_growth' | 'immunity' | 'fitness'>('bone_growth');

  const [heroViewMode, setHeroViewMode] = useState<'3d' | 'photo'>('3d');

  const bestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  const categoriesList: Array<{ key: ProductCategory; title: string; desc: string; icon: string; count: number }> = [
    {
      key: 'milk',
      title: language === 'uz' ? 'Sutlar' : language === 'ru' ? 'Молоко' : 'Fresh Milk',
      desc: language === 'uz' ? '2.5% dan 3.2% gacha toza pasterizatsiya' : language === 'ru' ? '2.5% - 3.2% пастеризованное' : '2.5% to 3.2% pasteurized milk',
      icon: '🥛',
      count: PRODUCTS.filter((p) => p.category === 'milk').length,
    },
    {
      key: 'kefir_yogurt',
      title: language === 'uz' ? 'Qatiq va Yogurt' : language === 'ru' ? 'Кефир и Био-йогурт' : 'Kefir & Yogurt',
      desc: language === 'uz' ? 'Tirik probiotiklar va bifidobakteriyalar' : language === 'ru' ? 'Живые бифидобактерии' : 'Living probiotics & digestion aid',
      icon: '🥣',
      count: PRODUCTS.filter((p) => p.category === 'kefir_yogurt').length,
    },
    {
      key: 'cheese',
      title: language === 'uz' ? 'Pishloqlar' : language === 'ru' ? 'Сыры' : 'Natural Cheeses',
      desc: language === 'uz' ? 'Gauda, Suluguni, Motsarella, Brinza' : language === 'ru' ? 'Гауда, Сулугуни, Моцарелла' : 'Gouda, Suluguni, Mozzarella',
      icon: '🧀',
      count: PRODUCTS.filter((p) => p.category === 'cheese').length,
    },
    {
      key: 'sourcream_butter',
      title: language === 'uz' ? 'Sariyog\' & Qaymoq' : language === 'ru' ? 'Сливочное масло и Сметана' : 'Butter & Cream',
      desc: language === 'uz' ? '82.5% sariyog\' va 20% quyuq smetana' : language === 'ru' ? '82.5% натуральное масло и сметана' : '82.5% sweet cream butter',
      icon: '🧈',
      count: PRODUCTS.filter((p) => p.category === 'sourcream_butter').length,
    },
    {
      key: 'desserts',
      title: language === 'uz' ? 'Tvorog & Desertlar' : language === 'ru' ? 'Творог и Десерты' : 'Cottage Cheese',
      desc: language === 'uz' ? 'Donador, oqsilga boy tabiiy tvorog' : language === 'ru' ? 'Рассыпчатый свежий творог' : 'Granular protein-rich curd',
      icon: '🍨',
      count: PRODUCTS.filter((p) => p.category === 'desserts').length,
    },
  ];

  const calculateIntake = () => {
    const dailyLiters = (familyMembers * 0.45).toFixed(1);
    const weeklyCalcium = familyMembers * 1000 * 7;
    return { dailyLiters, weeklyCalcium };
  };

  const { dailyLiters, weeklyCalcium } = calculateIntake();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF7FB] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0D1117] dark:via-[#151B22] dark:to-[#0D1117] pt-6 sm:pt-12 pb-16 lg:pb-24 border-b border-[#DCE3E8] dark:border-[#29323C] transition-colors">
        {/* Soft Decorative Ambient Background */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1684C4]/10 dark:bg-[#C71925]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#1684C4]/20 dark:border-white/10 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
                <span>SABO — Tabiiylik sari intilamiz · 100% Tabiiy · Halol Sertifikatlangan</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-[1.12] tracking-tight">
                Tabiatning toza in'omi — <br className="hidden sm:inline" />
                <span className="text-[#C71925] dark:text-[#E32935] underline decoration-[#1684C4]/40 dark:decoration-[#2498D1]/40 decoration-4 underline-offset-4">
                  har kuni dasturxoningizda
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans max-w-xl">
                O'zbekistonning eng ekologik toza hududlaridagi o'z yaylovlarimizdan sog'ib olingan yangi va foydali sut mahsulotlari. Sovutgichli avtotransportda to'g'ridan-to'g'ri xonadoningizga yetkazamiz.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => onNavigate('products')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {t.hero?.ctaCatalog || t.home?.exploreCatalog || 'Katalogni ko\'rish'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('production')}
                  leftIcon={<Play className="w-4 h-4 fill-[#C71925] text-[#C71925]" />}
                >
                  {t.hero?.ctaLearnMore || 'Ishlab chiqarish'}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#DCE3E8] dark:border-[#29323C] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">28 yil</div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Bozorda barqaror sifat</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C71925] dark:text-[#E32935]">100%</div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Toza Sigir Suti</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1684C4] dark:text-[#2498D1]">60,000 L</div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Kunlik quvvat</div>
                </div>
              </div>
            </div>

            {/* Right Media Spotlight Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Spotlight Card */}
                <div className="relative bg-white dark:bg-[#151B22] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#DCE3E8] dark:border-[#29323C]">
                  {/* Mode Selector Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 p-1 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-xl">
                      <button
                        onClick={() => setHeroViewMode('3d')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          heroViewMode === '3d'
                            ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                            : 'text-[#17202A] dark:text-[#AEB7C0] hover:text-[#C71925]'
                        }`}
                      >
                        ✨ 3D Model
                      </button>
                      <button
                        onClick={() => setHeroViewMode('photo')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          heroViewMode === 'photo'
                            ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                            : 'text-[#17202A] dark:text-[#AEB7C0] hover:text-[#C71925]'
                        }`}
                      >
                        📷 Foto
                      </button>
                    </div>

                    <span className="px-3 py-1 bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold rounded-full border border-[#1684C4]/15">
                      Kunning tavsiyasi
                    </span>
                  </div>

                  <div className="relative aspect-[4/4] rounded-2xl overflow-hidden bg-[#EFF7FB] dark:bg-[#102C3C] mb-6 flex items-center justify-center">
                    {heroViewMode === '3d' ? (
                      <MilkGlass3D className="w-full h-full" milkFill={0.82} />
                    ) : (
                      <img
                        src="/image/Sabo_Kefir.jpg"
                        alt="SABO Kefir Premium Bottle"
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
                        100% Tabiiy Kefir
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
                        SABO Kefir 3.2%
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#17202A] dark:text-white">4.95</span>
                        <span className="text-[#59636D] dark:text-[#AEB7C0]">(500+ sharhlar)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-[#C71925] dark:text-[#E32935]">11 000 so'm</div>
                      <button
                        onClick={() => {
                          const p = PRODUCTS.find((x) => x.id === 'sabo-kefir-32' || x.id === 'sabo-milk-32');
                          if (p) onSelectProduct(p);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#1684C4] dark:text-[#2498D1] hover:underline"
                      >
                        Batafsil <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Feature Badges */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#151B22] p-3.5 rounded-2xl shadow-xl border border-[#DCE3E8] dark:border-[#29323C] hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17202A] dark:text-white">HACCP & ISO 22000</div>
                    <div className="text-[10px] text-[#59636D] dark:text-[#AEB7C0]">Xalqaro sifat kafolati</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-[#0D1117] text-white p-3.5 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border border-[#29323C]">
                  <div className="w-10 h-10 rounded-xl bg-[#C71925] text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Ekspress Yetkazish</div>
                    <div className="text-[10px] text-[#2498D1]">2 soat ichida sovutilgan holda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK ACCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
              <Droplets className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
              <span>Mahsulotlar toifasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
              Har bir did va ehtiyoj uchun toza sut mahsulotlari
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#C71925] dark:text-[#E32935] hover:underline transition-colors"
          >
            <span>Barcha toifalarni ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesList.map((cat) => (
            <div
              key={cat.key}
              onClick={() => onNavigate('products', { category: cat.key })}
              className="bg-white dark:bg-[#151B22] rounded-3xl p-5 border border-[#DCE3E8] dark:border-[#29323C] hover:border-[#1684C4] dark:hover:border-[#2498D1] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] group-hover:bg-[#E5F3FA] dark:group-hover:bg-[#163B50] flex items-center justify-center text-2xl transition-colors mb-3">
                  {cat.icon}
                </div>
                <h3 className="font-serif font-bold text-sm text-[#17202A] dark:text-[#F5F7F9] group-hover:text-[#C71925] dark:group-hover:text-[#E32935] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-[#59636D] dark:text-[#AEB7C0] mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#DCE3E8]/80 dark:border-[#29323C] flex items-center justify-between text-[11px] text-[#1684C4] dark:text-[#2498D1] font-bold">
                <span>{cat.count} xil tur</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BESTSELLERS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C71925] dark:text-[#E32935]">
              <Award className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
              <span>Ommabop tanlov</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
              Eng ko'p xarid qilinayotgan mahsulotlar
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#C71925] dark:text-[#E32935] hover:underline"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. WHY SABO / 4 QUALITY PILLARS */}
      <section className="bg-[#0D1117] dark:bg-[#070A0E] text-white py-16 sm:py-20 relative overflow-hidden border-y border-[#29323C]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1684C4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2498D1]">
              Sifat Tamoyillari
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              Nima uchun minglab oilalar SABO ni tanlaydi?
            </h2>
            <p className="text-sm text-gray-300 mt-3 font-sans">
              Biz sutni shunchaki ishlab chiqarmaymiz, tabiat bergan eng sof foydani toza holda saqlaymiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-[#1684C4]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#C71925] text-white flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                100% Organik Oziqa
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Sigirlarimiz sun'iy antibiotik yoki gormonlarsiz, faqat o'zimiz yetishtirgan toza beda va organik don bilan oziqlanadi.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-[#1684C4]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#1684C4] text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Yevropa Standartlari
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Shvetsiyaning DeLaval avtomatik sog'ish va Tetra Pak aseptik qadoqlash uskunalari orqali inson qo'li tegilmaydi.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-[#1684C4]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#73B832] text-white flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Qo'shimchalarsiz Sof
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Quruq kukun, kraxmal yoki palma yog'i yo'q. Faqat 100% yangi sog'ilgan haqiqiy sigir suti va tirik achitqilar.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-[#1684C4]/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#C71925] text-white flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">
                Uzluksiz Sovuq Zanjir
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Fermadan do'kongacha va xonadoningizgacha harorat doimo +2°C dan +4°C oralig'ida qat'iy nazorat qilinadi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE NUTRITION & CALCIUM CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-[#EFF7FB] dark:from-[#151B22] dark:to-[#102C3C] rounded-3xl p-6 sm:p-10 border border-[#DCE3E8] dark:border-[#29323C] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/10 text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#DCE3E8] dark:border-white/10">
                <Calculator className="w-4 h-4" />
                <span>Interaktiv Salomatlik Kalkulyatori</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
                Oilangiz uchun kunlik sut me'yori qancha?
              </h2>
              <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] leading-relaxed">
                JSST (Jahon Sog'liqni Saqlash Tashkiloti) ma'lumotlariga ko'ra, inson sog'lom suyaklar va immunitet uchun har kuni kamida 350-500ml sut mahsulotlarini iste'mol qilishi kerak.
              </p>

              {/* Family Size Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#17202A] dark:text-[#F5F7F9] block">
                  Oila a'zolari soni: <strong className="text-[#C71925] dark:text-[#E32935] text-sm">{familyMembers} kishi</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Number(e.target.value))}
                  className="w-full accent-[#C71925] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#59636D] dark:text-[#AEB7C0]">
                  <span>1 kishi</span>
                  <span>4 kishi</span>
                  <span>8 kishi</span>
                </div>
              </div>

              {/* Focus Goal */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#17202A] dark:text-[#F5F7F9] block">
                  Asosiy salomatlik maqsadi:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'bone_growth', label: 'Suyak va Bo\'y o\'sishi (Bolalar)' },
                    { id: 'immunity', label: 'Hazm va Immunitet (Qatiq/Kefir)' },
                    { id: 'fitness', label: 'Sport va Mushak (Tvorog/Protein)' },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFocusGoal(goal.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        focusGoal === goal.id
                          ? 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs'
                          : 'bg-white dark:bg-white/10 text-[#17202A] dark:text-[#AEB7C0] hover:bg-[#EFF7FB] dark:hover:bg-white/20 border border-[#DCE3E8] dark:border-white/10'
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculator Result Box */}
            <div className="lg:col-span-6 bg-white dark:bg-[#1C242D] rounded-2xl p-6 sm:p-8 shadow-md border border-[#DCE3E8] dark:border-[#29323C] space-y-6">
              <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-[#F5F7F9] pb-3 border-b border-[#DCE3E8]/80 dark:border-[#29323C]">
                Tavsiya etiladigan kunlik me'yor:
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-xl text-center">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C71925] dark:text-[#E32935]">
                    {dailyLiters} litr
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium mt-1">Kunlik sut mahsulotlari</div>
                </div>
                <div className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-xl text-center">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1684C4] dark:text-[#2498D1]">
                    {weeklyCalcium.toLocaleString()} mg
                  </div>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium mt-1">Haftalik sof Kalsiy</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EFF7FB] dark:bg-[#102C3C] text-xs text-[#1684C4] dark:text-[#2498D1] space-y-1 border border-[#1684C4]/15">
                <div className="font-bold">Mutaxassis tavsiyasi:</div>
                <p>
                  {focusGoal === 'bone_growth' && 'Bolalar uchun SABO 3.2% sut va donador tvorog kalsiy o\'zlashtirilishida eng yuqori natijani beradi.'}
                  {focusGoal === 'immunity' && 'Har kuni kechqurun 200ml SABO Qatiq yoki Kefir ichish oshqozon-ichak mikroflorasini 100% tiklaydi.'}
                  {focusGoal === 'fitness' && 'SABO 9% Tvorog har 100 grammida 16g toza kazein oqsiliga ega bo\'lib, mushaklarni oziqlantiradi.'}
                </p>
              </div>

              <Button
                fullWidth
                onClick={() => onNavigate('products')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Tavsiya etilgan to'plamni xarid qilish
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTION PROCESS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1117] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#29323C]">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2498D1]">
              Fermadan Dasturxongacha
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Sut qanday yo'l bosib o'tishini bilasizmi?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              Avtomatik sog'ishdan to shisha idishlarga qadoqlanguncha bo'lgan 6 bosqichli sifat nazorati jarayoni bilan tanishing.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => onNavigate('production')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Ishlab chiqarish jarayonini ko'rish
              </Button>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-40 pointer-events-none hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80"
              alt="Farm dairy cows"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. HEALTH ARTICLES & RECIPES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
              <Sparkles className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
              <span>Foydali bilimlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
              Retseptlar va Sog'lom Hayot Maqolalari
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#C71925] dark:text-[#E32935] hover:underline"
          >
            <span>Barcha maqolalar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate('blog', { articleId: art.id })}
              className="bg-white dark:bg-[#151B22] rounded-3xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] hover:border-[#1684C4] dark:hover:border-[#2498D1] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={art.image}
                    alt={art.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#1684C4] dark:text-[#2498D1]">
                      {art.category === 'recipes' ? 'Oshpazlik Retsepti' : 'Salomatlik'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] text-[#59636D] dark:text-[#AEB7C0] mb-2">
                    {art.date} · {art.readTime} mutolaa
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-[#F5F7F9] group-hover:text-[#C71925] dark:group-hover:text-[#E32935] transition-colors line-clamp-2">
                    {art.title[language]}
                  </h3>
                  <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt[language]}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-[#1684C4] dark:text-[#2498D1]">
                <span>O'qish</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-[#EFF7FB]/60 dark:bg-[#0D1117] py-16 border-y border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1684C4] dark:text-[#2498D1]">
              Xaridorlar fikri
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
              Doimiy mijozlarimiz nima deydi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tItem) => (
              <div
                key={tItem.id}
                className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(tItem.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#17202A] dark:text-gray-300 italic leading-relaxed">
                    "{tItem.comment[language]}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DCE3E8]/80 dark:border-[#29323C] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] flex items-center justify-center font-bold text-xs">
                    {(tItem.authorName || 'M').charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17202A] dark:text-[#F5F7F9] flex items-center gap-1.5">
                      <span>{tItem.authorName || 'Mijoz'}</span>
                      {tItem.verifiedBuyer && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#73B832] dark:text-[#82C744]" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#59636D] dark:text-[#AEB7C0]">
                      {tItem.authorRole} · {tItem.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1684C4] dark:text-[#2498D1]">
            Tez-tez beriladigan savollar
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
            Sizni qiziqtirgan savollarga javoblar
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-[#151B22] rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif font-bold text-sm text-[#17202A] dark:text-[#F5F7F9]">
                    {faq.question[language]}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-[#59636D] transition-transform ${
                      isOpen ? 'rotate-90 text-[#C71925] dark:text-[#E32935]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans border-t border-[#DCE3E8]/80 dark:border-[#29323C] pt-3">
                    {faq.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
