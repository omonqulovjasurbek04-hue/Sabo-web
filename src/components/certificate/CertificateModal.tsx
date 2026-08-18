import React from 'react';
import { Modal } from '../ui/Modal';
import { Certificate } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import { ShieldCheck, Download, Calendar, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  const { language, t } = useTranslation();

  if (!certificate) return null;

  const handleDownload = () => {
    showToast({
      type: 'success',
      title: 'Sertifikat yuklanmoqda',
      message: `${certificate.code} (PDF)`,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#DCE3E8] dark:border-[#29323C] pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] text-[#C71925] dark:text-[#E32935] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1684C4] dark:text-[#2498D1] bg-[#EFF7FB] dark:bg-[#102C3C] px-2.5 py-0.5 rounded-full inline-block mb-1">
              {certificate.badge[language]}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#17202A] dark:text-white">
              {certificate.title}
            </h3>
          </div>
        </div>

        {/* Certificate Preview Image */}
        <div className="relative aspect-[16/10] bg-[#EFF7FB] dark:bg-black/20 rounded-2xl overflow-hidden border border-[#DCE3E8] dark:border-[#29323C] shadow-inner group">
          <img
            src={certificate.image}
            alt={certificate.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 text-white">
            <div className="text-xs font-medium">
              Registratsiya raqami: <span className="font-mono font-bold text-[#73B832] dark:text-[#82C744]">{certificate.code}</span>
            </div>
          </div>
        </div>

        {/* Detailed Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#EFF7FB] dark:bg-[#151B22] p-4 rounded-2xl border border-[#DCE3E8] dark:border-[#29323C]">
          <div className="flex items-center gap-2 text-[#59636D] dark:text-gray-300">
            <Building2 className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1] shrink-0" />
            <span>Berilgan tashkilot: <strong className="text-[#17202A] dark:text-white">{certificate.issuer}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#59636D] dark:text-gray-300">
            <Calendar className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1] shrink-0" />
            <span>Berilgan sana: <strong className="text-[#17202A] dark:text-white">{certificate.issueDate}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#59636D] dark:text-gray-300 col-span-2">
            <CheckCircle2 className="w-4 h-4 text-[#73B832] dark:text-[#82C744] shrink-0" />
            <span>Holati: <strong className="text-[#73B832] dark:text-[#82C744]">Faol va tasdiqlangan</strong></span>
          </div>
        </div>

        <p className="text-xs text-[#59636D] dark:text-gray-300 leading-relaxed font-sans">
          {certificate.description[language]}
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t.common.close}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            {t.common.downloadCert}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
