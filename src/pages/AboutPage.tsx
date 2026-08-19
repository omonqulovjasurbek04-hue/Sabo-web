import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { TEAM_MEMBERS } from '../constants/data';
import {
  ShieldCheck,
  Leaf,
  Heart,
  Award,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Building,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language, t } = useTranslation();

  const timelineEvents = [
    {
      year: '1998',
      title: 'Tashkil topish',
      desc: 'Toshkent viloyatida 50 bosh zotdor sigir bilan ilk kichik oilaviy ferma ish boshladi.',
    },
    {
      year: '2008',
      title: 'Yevropa texnologiyalari',
      desc: 'Shvetsiyaning DeLaval avtomatlashtirilgan sog\'ish majmuasi va zamonaviy sovutish tanklari o\'rnatildi.',
    },
    {
      year: '2016',
      title: 'ISO & HACCP sertifikatlari',
      desc: 'Xalqaro oziq-ovqat xavfsizligi standartlari joriy etilib, laboratoriya quvvati 5 barobarga oshirildi.',
    },
    {
      year: '2021',
      title: 'Ekologik yaylovlar kengayishi',
      desc: 'Bo\'stonliq tumanidagi 500 gektardan ziyod tog\'oldi toza yaylovlar fermamiz tarkibiga qo\'shildi.',
    },
    {
      year: '2026',
      title: 'Raqamli ekspress xizmat',
      desc: 'Bugungi kunda kuniga 60,000 litr sut qayta ishlanib, poytaxt va viloyatlarga to\'g\'ridan-to\'g\'ri yetkazilmoqda.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero / Introduction */}
      <section className="relative bg-gradient-to-b from-[#EFF7FB] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0D1117] dark:via-[#151B22] dark:to-[#0D1117] py-16 sm:py-24 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#1684C4]/20 dark:border-white/10">
              <Sparkles className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
              <span>Bizning Hikoyamiz va Missiyamiz</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
              Tabiatning eng sof ne'matini <br />
              <span className="text-[#C71925] dark:text-[#E32935]">mehr bilan yetkazamiz</span>
            </h1>

            <p className="text-base sm:text-lg text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
              SABO — bu tabiiylik sari intiluvchi, sog'lom turmush tarzi va tabiiy oziq-ovqat madaniyatini rivojlantirib kelayotgan yetakchi sut ishlab chiqaruvchi milliy brend.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Key Numbers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#C71925] dark:text-[#E32935]">28 yil</div>
            <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Bozorda barqaror sifat</div>
          </div>

          <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-white">2,500+</div>
            <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Golshtin-Friz zotli sigirlar</div>
          </div>

          <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1684C4] dark:text-[#2498D1]">60,000 L</div>
            <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Kunlik ishlab chiqarish quvvati</div>
          </div>

          <div className="bg-white dark:bg-[#151B22] p-6 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#73B832] dark:text-[#82C744]">100%</div>
            <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] font-medium">Konservant va kukunlarsiz</div>
          </div>
        </div>
      </section>

      {/* 3. Farm & Animal Welfare Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1]">
              <Leaf className="w-4 h-4 text-[#73B832] dark:text-[#82C744]" />
              <span>Ekologik Fermamiz</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
              Sifatli sutning siri — baxtli va sog'lom jonivorlarda
            </h2>

            <p className="text-sm text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
              Bizning fermamiz tog' etaklaridagi toza havo va tabiiy buloq suvlari bo'lgan mintaqada joylashgan. Golshtin-Friz zotli sigirlarimiz maxsus muvozanatlashgan organik ratsion bilan oziqlantiriladi va kuniga 2 mahal erkin yaylovga chiqariladi.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-[#17202A] dark:text-gray-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#73B832] dark:text-[#82C744] shrink-0" />
                <span>Hech qanday gormonal stimulyatorlar va kimyoviy qo'shimchalar ishlatilmaydi</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1684C4] dark:text-[#2498D1] shrink-0" />
                <span>Shvetsiya texnologiyasi asosida avtomatlashtirilgan qulay sog'ish zallari</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C71925] dark:text-[#E32935] shrink-0" />
                <span>Har bir partiya suti 18 xil xalqaro sifat ko'rsatkichi bo'yicha tahlil qilinadi</span>
              </div>
            </div>

            <Button onClick={() => onNavigate('production')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ishlab chiqarish quvvatini ko'rish
            </Button>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80"
                alt="Ferma sigiri"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-md border border-[#DCE3E8] dark:border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80"
                alt="Yashil yaylov"
                className="w-full h-40 sm:h-52 object-cover rounded-3xl shadow-md border border-[#DCE3E8] dark:border-white/10"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
                alt="Toza sut zavodi"
                className="w-full h-40 sm:h-52 object-cover rounded-3xl shadow-md border border-[#DCE3E8] dark:border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"
                alt="Yangi sut butilkalari"
                className="w-full h-48 sm:h-64 object-cover rounded-3xl shadow-md border border-[#DCE3E8] dark:border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Company History Timeline */}
      <section className="bg-[#EFF7FB]/60 dark:bg-[#0D1117] py-16 sm:py-20 border-y border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1684C4] dark:text-[#2498D1]">
              Taraqqiyot Yo'li
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
              1998-yildan to hozirgi kungacha
            </h2>
          </div>

          <div className="relative border-l-2 border-[#1684C4]/30 dark:border-[#2498D1]/30 ml-4 sm:ml-32 space-y-10">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-10 group">
                {/* Year tag for desktop */}
                <div className="sm:absolute sm:-left-32 sm:top-0 text-lg font-serif font-bold text-[#C71925] dark:text-[#E32935]">
                  {item.year}
                </div>

                {/* Node icon */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-[#0D1117] border-4 border-[#C71925] group-hover:scale-125 transition-transform" />

                <div className="bg-white dark:bg-[#151B22] p-5 rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] shadow-xs">
                  <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-1.5 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Leadership & Specialists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1684C4] dark:text-[#2498D1]">
            Professional Jamoa
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] mt-1">
            Sifat ortida turgan insonlar
          </h2>
          <p className="text-xs sm:text-sm text-[#59636D] dark:text-[#AEB7C0] mt-2 font-sans">
            Bizning jamoamiz xalqaro darajadagi tajribali texnologlar, veterinarlar va sifat nazorati bo'yicha ekspertlardan iborat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#151B22] rounded-3xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] shadow-xs hover:shadow-md transition-all text-center p-5 space-y-4"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#1684C4]/20 dark:border-white/20 shadow-inner">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#17202A] dark:text-white">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-[#1684C4] dark:text-[#2498D1] mt-0.5">
                  {member.role[language]}
                </div>
              </div>

              <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans line-clamp-3">
                {member.bio[language]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
