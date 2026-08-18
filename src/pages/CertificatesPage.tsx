import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { CERTIFICATES } from '../constants/data';
import { Certificate } from '../types';
import { CertificateModal } from '../components/certificate/CertificateModal';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Download,
  Search,
  Eye,
  FileCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { showToast } from '../components/ui/Toast';

export const CertificatesPage: React.FC = () => {
  const { language, t } = useTranslation();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    cert?: Certificate;
  }>({ status: 'idle' });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const found = CERTIFICATES.find(
      (c) => c.code.toLowerCase() === verifyCode.trim().toLowerCase()
    );

    if (found) {
      setVerificationResult({ status: 'valid', cert: found });
      showToast({
        type: 'success',
        title: 'Sertifikat tasdiqlandi!',
        message: `${found.title} — Haqiqiy va amalda`,
      });
    } else {
      setVerificationResult({ status: 'invalid' });
      showToast({
        type: 'error',
        title: 'Sertifikat topilmadi',
        message: 'Iltimos, kiritilgan registratsiya kodini qayta tekshiring.',
      });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Header */}
      <section className="bg-gradient-to-b from-[#EFF7FB] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0D1117] dark:via-[#151B22] dark:to-[#0D1117] py-16 border-b border-[#DCE3E8] dark:border-[#29323C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] text-xs font-bold border border-[#1684C4]/20 dark:border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#C71925] dark:text-[#E32935]" />
            <span>Xalqaro Sifat va Xavfsizlik Kafolatlari</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#17202A] dark:text-[#F5F7F9] leading-tight">
            Sertifikatlar va Sifat Nazorati
          </h1>

          <p className="text-base text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
            SABO mahsulotlari O'zbekiston Respublikasi va xalqaro oziq-ovqat xavfsizligi standartlariga 100% javob beradi. Barcha sertifikatlar amaldagi akkreditatsiyadan o'tgan.
          </p>
        </div>
      </section>

      {/* 2. Certificate Verification Widget */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D1117] dark:bg-[#151B22] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#29323C] relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2498D1]">
              Onlayn Verifikatsiya
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Sertifikat haqiqiyligini tekshiring
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Qadoqda yoki hujjatda ko'rsatilgan registratsiya kodini kiriting (Masalan: <code>ISO-22000-PM-UZ</code> yoki <code>HALAL-UZ-8821</code>):
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(e.target.value);
                    setVerificationResult({ status: 'idle' });
                  }}
                  placeholder="Registratsiya kodi (masalan: HALAL-UZ-8821)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C71925]"
                />
              </div>
              <Button type="submit" variant="primary" rightIcon={<Search className="w-4 h-4" />}>
                Tekshirish
              </Button>
            </form>

            {/* Verification Result Output */}
            {verificationResult.status === 'valid' && verificationResult.cert && (
              <div className="mt-4 p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#17202A] dark:text-[#F5F7F9] text-xs flex items-center justify-between border border-[#1684C4]/30">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#73B832] dark:text-[#82C744] shrink-0" />
                  <div>
                    <span className="font-bold">{verificationResult.cert.title}</span>
                    <div className="text-[11px] text-[#59636D] dark:text-[#AEB7C0]">
                      Berilgan: {verificationResult.cert.issuer} · Holati: Faol
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(verificationResult.cert!)}
                  className="text-xs font-bold text-[#1684C4] dark:text-[#2498D1] underline cursor-pointer"
                >
                  Ko'rish
                </button>
              </div>
            )}

            {verificationResult.status === 'invalid' && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                Ushbu kod bilan sertifikat topilmadi. Iltimos, kodni to'g'ri kiritganingizga ishonch hosil qiling.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Certificates Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-[#151B22] rounded-3xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Certificate Preview Image */}
                <div
                  onClick={() => setSelectedCert(cert)}
                  className="relative aspect-[16/11] bg-[#EFF7FB] dark:bg-black/20 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                    <Eye className="w-5 h-5" />
                    <span>Kattalashtirib ko'rish</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 dark:bg-[#151B22]/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#1684C4] dark:text-[#2498D1] shadow-xs border border-[#DCE3E8] dark:border-white/10">
                      {cert.badge[language]}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-white">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-[#59636D] dark:text-[#AEB7C0] space-y-1">
                    <div>
                      Tashkilot: <strong className="text-[#17202A] dark:text-gray-200">{cert.issuer}</strong>
                    </div>
                    <div>
                      Registratsiya: <strong className="font-mono text-[#C71925] dark:text-[#E32935]">{cert.code}</strong>
                    </div>
                  </div>
                  <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] leading-relaxed font-sans">
                    {cert.description[language]}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#DCE3E8] dark:border-[#29323C]">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="text-xs font-bold text-[#1684C4] dark:text-[#2498D1] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ko'rish</span>
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    showToast({
                      type: 'success',
                      title: 'Sertifikat yuklanmoqda',
                      message: `${cert.code} (PDF nusxasi)`,
                    });
                  }}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  PDF yuklab olish
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
