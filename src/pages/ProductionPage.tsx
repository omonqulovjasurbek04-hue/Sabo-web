import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import {
  Thermometer,
  ShieldCheck,
  Truck,
  Droplets,
  Microscope,
  Box,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Flame,
  Snowflake,
  Timer,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ProductionPageProps {
  onNavigate: (page: string) => void;
}

export const ProductionPage: React.FC<ProductionPageProps> = ({ onNavigate }) => {
  const { language, t } = useTranslation();
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const steps = [
    {
      id: 1,
      title: '1. Avtomatlashtirilgan Sog\'ish',
      subtitle: 'Inson qo\'li tegilmagan DeLaval robot-sog\'ish tizimi',
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=1000&q=80',
      temperature: '+37°C',
      duration: '5-7 daqiqa',
      standard: 'DeLaval VMS™ ISO 5707',
      description:
        'Sog\'ish jarayoni to\'liq germetik yopiq vakuum tizimida amalga oshiriladi. Har bir sigirning holati, sog\'ilgan sut miqdori va sifati kompyuterlashtirilgan datchiklar orqali real vaqt rejimida qayd etiladi.',
      points: [
        'Har bir sog\'ishdan oldin yelin avtomatik dezinfeksiya qilinadi',
        'Yopiq zanglamaydigan po\'lat quvurlar orqali harakatlanadi',
        'Atrof-muhit changi va bakteriyalardan 100% himoyalangan',
      ],
    },
    {
      id: 2,
      title: '2. Tezkor Sovutish Zanjiri',
      subtitle: 'Sog\'ilgandan so\'ng 4 daqiqa ichida +4°C gacha sovutiladi',
      icon: Snowflake,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      temperature: '+4°C',
      duration: '4 daqiqa',
      standard: 'Instant Plate Chiller',
      description:
        'Sutning tabiiy foydali xususiyatlari va vitaminlarini saqlab qolish uchun u maxsus plastinkali tezkor sovutgichlar orqali +4°C haroratga tushiriladi va izolyatsiyalangan sisternalarda saqlanadi.',
      points: [
        'Bakteriyalar ko\'payishiga mutlaqo yo\'l qo\'yilmaydi',
        'Sutning tabiiy yangiligi va nozik qaymoq hidi saqlanadi',
        'Doimiy aylanma aralashtirgichlar yog\'ning bir xil taqsimlanishini ta\'minlaydi',
      ],
    },
    {
      id: 3,
      title: '3. Laboratoriya Ekspertizasi',
      subtitle: 'Foss Milkoscan orqali 18 xil parametr tekshiriladi',
      icon: Microscope,
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
      temperature: '+20°C (test)',
      duration: '15 daqiqa',
      standard: 'ISO 17025 Accredited',
      description:
        'Har bir partiya qat\'iy laboratoriya nazoratidan o\'tkaziladi: yog\'lilik, oqsil, zichlik, kislotalilik va antibiotiklar mavjud emasligi aniqlanadi. Minimal chetlanish bo\'lsa ham partiya qabul qilinmaydi.',
      points: [
        'Antibiotiklar va gormonlar 100% yo\'qligiga kafolat',
        'Zichlik va tabiiy kalsiy miqdori aniqlanadi',
        'Har bir sinov natijasi davlat reestrida qayd etiladi',
      ],
    },
    {
      id: 4,
      title: '4. Yumshoq Pasterizatsiya',
      subtitle: 'Past haroratli pasterizatsiya (74-76°C) — vitaminlar saqlanadi',
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80',
      temperature: '+74°C ... +76°C',
      duration: '15-20 soniya',
      standard: 'Tetra Therm Lactenso',
      description:
        'Biz o\'ta yuqori qaynatish usulidan foydalanmaymiz! Yumshoq pasterizatsiya orqali xavfli mikroorganizmlar yo\'qotiladi, ammo sut tarkibidagi barcha A, D, B vitaminlari va foydali fermentlar tirik saqlanib qoladi.',
      points: [
        'Tabiiy oqsil strukturasiga zarar yetmaydi',
        'Sutning shirin va nozik tabiiy ta\'mi o\'zgarmaydi',
        'Quruq sut yoki stabilizatorlar mutlaqo qo\'shilmaydi',
      ],
    },
    {
      id: 5,
      title: '5. Aseptik Qadoqlash',
      subtitle: 'Steril muhitda ekologik shisha va Tetra Pak idishlariga quyish',
      icon: Box,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=1000&q=80',
      temperature: '+4°C',
      duration: 'Uzluksiz avtomat',
      standard: 'Tetra Top® Aseptic',
      description:
        'Mahsulotlar steril havo zonasida ekologik toza shisha idishlarga va ko\'p qatlamli Tetra Pak qutilariga quyiladi. Bu sutni yorug\'lik va kislorod ta\'siridan himoyalaydi.',
      points: [
        'BPA-free va 100% qayta ishlanadigan xavfsiz materiallar',
        'Maxsus germetik qopqoq ochilmaganligini kafolatlaydi',
        'Har bir qadoqda ishlab chiqarilgan vaqt va partiya raqami bosiladi',
      ],
    },
    {
      id: 6,
      title: '6. Termo-Ekspress Yetkazib Berish',
      subtitle: 'Maxsus sovutgichli furgonlarda 2 soat ichida yetkazish',
      icon: Truck,
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80',
      temperature: '+2°C ... +4°C',
      duration: '2-4 soat',
      standard: 'ThermoKing Cold Chain',
      description:
        'Zavod omboridan do\'konlarga va mijozlar xonadoniga qadar avtomobillarimizdagi ThermoKing sovutish agregatlari bir tekis haroratni ushlab turadi.',
      points: [
        'GPS orqali harorat va marshrut onlayn monitoring qilinadi',
        'Toshkent shahri va viloyatlar bo\'ylab tezkor logistika',
        'Dasturxoningizga eng yangi va sovitilgan holatda yetib boradi',
      ],
    },
  ];

  const currentStep = steps[activeStepIdx];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Header */}
      <section className="bg-gradient-to-b from-[#EFF7FB] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0D1117] dark:via-[#151B22] dark:to-[#0D1117] py-16 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#1684C4]/20 dark:border-white/10">
            <Sparkles className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
            <span>Xalqaro Standartlar va Texnologiya</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
            Sutning tozalik va xavfsizlik yo'li
          </h1>

          <p className="text-base text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
            Fermamizdan to dasturxoningizga qadar bosib o'tiladigan har bir bosqichda inson qo'li tegilmaydigan avtomatika va qat'iy sifat nazorati o'rnatilgan.
          </p>
        </div>
      </section>

      {/* 2. Interactive Step-by-Step Viewer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1684C4] dark:text-[#2498D1]">
            Bosqichma-bosqich jarayon
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
            6 bosqichli sifat zanjiri
          </h2>
        </div>

        {/* Step Selector Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStepIdx === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStepIdx(idx)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#C71925] dark:bg-[#E32935] text-white border-[#C71925] dark:border-[#E32935] shadow-lg scale-105'
                    : 'bg-white dark:bg-[#151B22] text-[#17202A] dark:text-[#AEB7C0] border-[#DCE3E8] dark:border-[#29323C] hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? 'text-white' : 'text-[#1684C4] dark:text-[#2498D1]'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-white' : 'text-[#59636D] dark:text-[#AEB7C0]'
                    }`}
                  >
                    0{s.id}
                  </span>
                </div>
                <div className="text-xs font-bold line-clamp-1">{s.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details Showcase Card */}
        <div className="bg-white dark:bg-[#151B22] rounded-3xl p-6 sm:p-10 border border-[#DCE3E8] dark:border-[#29323C] shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Media */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-black/20 shadow-inner">
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 bg-white/90 dark:bg-[#151B22]/90 backdrop-blur-md rounded-full text-xs font-bold text-[#17202A] dark:text-[#2498D1] shadow-xs border border-[#DCE3E8] dark:border-white/10">
                    {currentStep.standard}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
                  {currentStep.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
                  {currentStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] mt-3 leading-relaxed font-sans">
                  {currentStep.description}
                </p>
              </div>

              {/* Technical Indicators */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#EFF7FB] dark:bg-[#102C3C] rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] text-xs">
                <div className="flex items-center gap-2 text-[#17202A] dark:text-[#F5F7F9]">
                  <Thermometer className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                  <span>Harorat: <strong>{currentStep.temperature}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#17202A] dark:text-[#F5F7F9]">
                  <Timer className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                  <span>Davomiyligi: <strong>{currentStep.duration}</strong></span>
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-2 text-xs sm:text-sm text-[#17202A] dark:text-gray-300">
                {currentStep.points.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#73B832] dark:text-[#82C744] shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Navigation stepper buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DCE3E8] dark:border-[#29323C]">
                <button
                  disabled={activeStepIdx === 0}
                  onClick={() => setActiveStepIdx(activeStepIdx - 1)}
                  className="text-xs font-bold text-[#59636D] hover:text-[#17202A] dark:hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  ← Oldingi bosqich
                </button>
                <button
                  disabled={activeStepIdx === steps.length - 1}
                  onClick={() => setActiveStepIdx(activeStepIdx + 1)}
                  className="text-xs font-bold text-[#C71925] dark:text-[#E32935] hover:underline disabled:opacity-40 cursor-pointer"
                >
                  Keyingi bosqich →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High-Tech Equipment Partners */}
      <section className="bg-[#0D1117] text-white py-16 sm:py-20 border-y border-[#29323C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2498D1]">
              Dunyo Sanoati Yetakchilari
            </span>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">
              Foydalaniladigan Texnologiyalar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
              <div className="text-xl font-bold font-serif text-[#2498D1]">DeLaval (Shvetsiya)</div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Avtomatlashtirilgan sog'ish zallari va sigirlar salomatligini 24/7 rejimida monitoring qiluvchi skanerlar.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
              <div className="text-xl font-bold font-serif text-[#2498D1]">Tetra Pak (Shvetsiya)</div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Aseptik qadoqlash liniyalari orqali sutga havo va bakteriyalar kirmasdan, uzoq muddat toza saqlanadi.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
              <div className="text-xl font-bold font-serif text-[#2498D1]">FOSS (Daniya)</div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                MilkoScan spektrometrik laboratoriya analizatorlari — 1 daqiqada yog', oqsil va zichlikni aniqlab beradi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA to Catalog */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9]">
          Tozaligiga ishonch hosil qildingizmi?
        </h2>
        <p className="text-sm text-[#59636D] dark:text-[#AEB7C0] max-w-lg mx-auto">
          Bugunoq buyurtma bering va xonadoningizda yangi sog'ilgan sutning haqiqiy tabiiy ta'midan bahramand bo'ling.
        </p>
        <Button size="lg" onClick={() => onNavigate('products')} rightIcon={<ArrowRight className="w-5 h-5" />}>
          Mahsulotlar katalogiga o'tish
        </Button>
      </section>
    </div>
  );
};
