import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { OrderCustomerInfo, Order } from '../../types';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';
import { apiClient } from '../../services/api';
import {
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  ChevronLeft,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { language, t } = useTranslation();
  const {
    items,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    clearCart,
  } = useCart();
  const { user, addOrder } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: user.fullName || '',
    phone: user.phone || '+998 ',
    email: user.email || '',
    region: 'Toshkent shahri',
    address: user.addresses[0]?.address || '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTimeSlot: '09:00 - 12:00 (Ertalab)',
    notes: '',
    paymentMethod: 'click',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleNextStep = () => {
    if (step === 1) {
      if (items.length === 0) {
        showToast({ type: 'error', title: 'Savatchangiz bo\'sh' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.fullName.trim() || formData.phone.trim().length < 9 || !formData.address.trim()) {
        showToast({
          type: 'error',
          title: 'Iltimos, barcha majburiy maydonlarni to\'ldiring',
          message: 'Ism, telefon raqami va manzil talab qilinadi.',
        });
        return;
      }
      setStep(3);
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);

    try {
      await apiClient.createOrder({
        customer: { ...formData },
        items: [...items],
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total: totalAmount,
      });
    } catch {
      // handled inside apiClient fallback
    }

    const newOrder = addOrder({
      items: [...items],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total: totalAmount,
      customer: { ...formData },
    });

    setConfirmedOrder(newOrder);
    setStep(4);
    clearCart();
    setIsSubmitting(false);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C71925', '#1684C4', '#73B832', '#0D1117'],
      });
    } catch {
      // ignore
    }

    showToast({
      type: 'success',
      title: t.checkout.orderSuccessTitle,
      message: `${t.checkout.orderNumber}: #${newOrder.id}`,
    });
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      maxWidth="2xl"
      title={
        step === 4 ? (
          <span className="text-[#73B832] font-serif">
            {t.checkout.orderSuccessTitle}
          </span>
        ) : (
          t.checkout.title
        )
      }
    >
      {/* Stepper Header (steps 1 - 3) */}
      {step < 4 && (
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#DCE3E8] dark:border-[#29323C] text-xs font-semibold">
          <div
            className={`flex items-center gap-1.5 ${
              step >= 1 ? 'text-[#C71925] dark:text-[#E32935]' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? 'bg-[#C71925] dark:bg-[#E32935] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Mahsulotlar</span>
          </div>

          <div className="w-8 h-0.5 bg-gray-200 dark:bg-white/10" />

          <div
            className={`flex items-center gap-1.5 ${
              step >= 2 ? 'text-[#C71925] dark:text-[#E32935]' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? 'bg-[#C71925] dark:bg-[#E32935] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">Manzil</span>
          </div>

          <div className="w-8 h-0.5 bg-gray-200 dark:bg-white/10" />

          <div
            className={`flex items-center gap-1.5 ${
              step >= 3 ? 'text-[#C71925] dark:text-[#E32935]' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 3 ? 'bg-[#C71925] dark:bg-[#E32935] text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">To'lov</span>
          </div>
        </div>
      )}

      {/* Step 1: Review Items */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#1C1C19] dark:text-white">
            Buyurtma tarkibini tasdiqlang ({items.length} xil mahsulot):
          </h4>

          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-white/10 border border-gray-100 dark:border-white/10 rounded-2xl p-3 bg-[#FCF9F4]/50 dark:bg-white/5">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVolume}`}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-10 h-10 object-cover rounded-xl bg-white dark:bg-gray-800"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white line-clamp-1">
                      {item.product.name[language]}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {item.selectedVolume} × {item.quantity} dona
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#052417] dark:text-[#83DCA0]">
                  {(item.price * item.quantity).toLocaleString()} {t.common.sum}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{t.cart.subtotal}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{subtotal.toLocaleString()} {t.common.sum}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>Chegirma:</span>
                <span className="font-semibold">-{discountAmount.toLocaleString()} {t.common.sum}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{t.cart.deliveryFee}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {deliveryFee === 0 ? t.cart.freeDelivery : `${deliveryFee.toLocaleString()} ${t.common.sum}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#052417] dark:text-[#E8F5EC] pt-2 border-t border-gray-200 dark:border-white/10">
              <span>{t.cart.total}:</span>
              <span className="text-base text-[#25683C] dark:text-[#83DCA0]">{totalAmount.toLocaleString()} {t.common.sum}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleNextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Yetkazib berish manziliga o'tish
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Shipping & Schedule */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {t.checkout.fullName} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={t.checkout.fullNamePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {t.checkout.phone} *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t.checkout.phonePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              {t.checkout.region} *
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-[#12271C] dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
            >
              <option value="Toshkent shahri">Toshkent shahri (Markaziy ekspress)</option>
              <option value="Toshkent viloyati">Toshkent viloyati</option>
              <option value="Samarqand shahri">Samarqand shahri</option>
              <option value="Farg'ona shahri">Farg'ona shahri</option>
              <option value="Buxoro shahri">Buxoro shahri</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              {t.checkout.address} *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t.checkout.addressPlaceholder}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {t.checkout.deliveryDate}
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-[#12271C] dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                {t.checkout.deliveryTime}
              </label>
              <select
                value={formData.deliveryTimeSlot}
                onChange={(e) => setFormData({ ...formData, deliveryTimeSlot: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-[#12271C] dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
              >
                <option value="09:00 - 12:00 (Ertalab)">{t.checkout.timeSlot1}</option>
                <option value="13:00 - 16:00 (Kunduzi)">{t.checkout.timeSlot2}</option>
                <option value="18:00 - 21:00 (Kechki payt)">{t.checkout.timeSlot3}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              {t.checkout.notes}
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Masalan: Domofon 45, eshik oldiga qoldirilsin"
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#25683C]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Orqaga</span>
            </button>
            <Button onClick={handleNextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
              To'lov usuliga o'tish
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Method & Final Submit */}
      {step === 3 && (
        <div className="space-y-5">
          <h4 className="text-sm font-bold text-[#1C1C19] dark:text-white">
            {t.checkout.paymentMethodTitle}:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'click',
                title: 'Click',
                desc: 'Click ilovasi yoki veb orqali',
                icon: Smartphone,
                color: 'text-sky-600',
              },
              {
                id: 'payme',
                title: 'Payme',
                desc: 'Payme orqali 1 daqiqada',
                icon: Smartphone,
                color: 'text-cyan-600',
              },
              {
                id: 'cash',
                title: 'Naqd pulda',
                desc: 'Kuryer yetkazganda to\'lash',
                icon: Banknote,
                color: 'text-emerald-600',
              },
              {
                id: 'card',
                title: 'Terminal orqali',
                desc: 'Uzcard / Humo / Visa',
                icon: CreditCard,
                color: 'text-indigo-600',
              },
            ].map((pm) => {
              const Icon = pm.icon;
              const isSelected = formData.paymentMethod === pm.id;
              return (
                <div
                  key={pm.id}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: pm.id as any })
                  }
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#C71925] dark:border-[#E32935] bg-[#EFF7FB] dark:bg-[#102C3C] shadow-xs'
                      : 'border-[#DCE3E8] dark:border-[#29323C] hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-white/5'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#C71925] text-white' : 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-[#17202A] dark:text-white">{pm.title}</div>
                    <div className="text-[11px] text-[#59636D] dark:text-[#AEB7C0] mt-0.5">{pm.desc}</div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#C71925] dark:text-[#E32935] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#1684C4] dark:text-[#2498D1]">
              <ShieldCheck className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
              <span>Xavfsiz va kafolatlangan yetkazib berish</span>
            </div>
            <p className="text-[#59636D] dark:text-[#AEB7C0] text-[11px] leading-relaxed">
              Buyurtmangiz tasdiqlangandan so'ng, kuryer siz bilan bog'lanadi va belgilangan vaqt oralig'ida muzlatgichli transportda olib keladi.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-xs font-semibold text-[#59636D] dark:text-[#AEB7C0] hover:text-[#17202A] dark:hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Manzilga qaytish</span>
            </button>
            <Button
              isLoading={isSubmitting}
              onClick={handleConfirmOrder}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {totalAmount.toLocaleString()} {t.common.sum} to'lash & Buyurtma berish
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success Receipt */}
      {step === 4 && confirmedOrder && (
        <div className="space-y-6 text-center py-2">
          <div className="w-16 h-16 bg-[#EFF7FB] dark:bg-[#102C3C] text-[#73B832] dark:text-[#82C744] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <PackageCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17202A] dark:text-white">
              {t.checkout.orderSuccessTitle}
            </h3>
            <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-1 max-w-md mx-auto">
              {t.checkout.orderSuccessSubtitle}
            </p>
          </div>

          {/* Receipt Box */}
          <div className="bg-[#EFF7FB] dark:bg-[#102C3C] p-5 rounded-3xl border border-[#DCE3E8] dark:border-[#29323C] text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#DCE3E8] dark:border-[#29323C]">
              <span className="font-semibold text-[#59636D] dark:text-[#AEB7C0]">Buyurtma ID:</span>
              <span className="font-mono font-bold text-[#C71925] dark:text-[#E32935] text-sm">
                #{confirmedOrder.id}
              </span>
            </div>

            <div className="flex justify-between text-[#59636D] dark:text-gray-300">
              <span>Qabul qiluvchi:</span>
              <span className="font-bold text-[#17202A] dark:text-white">{confirmedOrder.customer.fullName}</span>
            </div>

            <div className="flex justify-between text-[#59636D] dark:text-gray-300">
              <span>Telefon:</span>
              <span className="font-bold text-[#17202A] dark:text-white">{confirmedOrder.customer.phone}</span>
            </div>

            <div className="flex justify-between text-[#59636D] dark:text-gray-300">
              <span>Manzil:</span>
              <span className="font-bold text-[#17202A] dark:text-white text-right max-w-xs truncate">
                {confirmedOrder.customer.address}
              </span>
            </div>

            <div className="flex justify-between text-[#59636D] dark:text-gray-300">
              <span>Vaqti:</span>
              <span className="font-bold text-[#17202A] dark:text-white">
                {confirmedOrder.customer.deliveryDate} ({confirmedOrder.customer.deliveryTimeSlot})
              </span>
            </div>

            <div className="flex justify-between text-[#59636D] dark:text-gray-300">
              <span>To'lov usuli:</span>
              <span className="font-bold text-[#17202A] dark:text-white uppercase">
                {confirmedOrder.customer.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-[#17202A] dark:text-[#F5F7F9] pt-2 border-t border-[#DCE3E8] dark:border-[#29323C]">
              <span>Jami summa:</span>
              <span className="text-base text-[#C71925] dark:text-[#E32935]">
                {confirmedOrder.total.toLocaleString()} {t.common.sum}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                resetAndClose();
                onOrderSuccess(confirmedOrder);
              }}
            >
              {t.checkout.trackOrder}
            </Button>
            <Button variant="outline" onClick={resetAndClose}>
              {t.checkout.backToHome}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
