import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Truck, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { showToast } from '../ui/Toast';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { language, t } = useTranslation();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    totalItemCount,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    promoCode,
    applyPromoCode,
    discountPercent,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoError(false);
      setPromoInput('');
      showToast({
        type: 'success',
        title: 'Promokod qabul qilindi!',
        message: t.cart.promoApplied,
      });
    } else {
      setPromoError(true);
      showToast({
        type: 'error',
        title: 'Xato promokod',
        message: t.cart.invalidPromo,
      });
    }
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-[#151B22] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-l border-[#DCE3E8] dark:border-[#29323C]"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-[#DCE3E8] dark:border-[#29323C] bg-[#EFF7FB] dark:bg-[#102C3C] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C71925] dark:text-[#E32935]" />
                <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-[#F5F7F9]">
                  {t.cart.title} ({totalItemCount})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#59636D] hover:text-[#C71925] dark:hover:text-[#E32935] transition-colors p-1 cursor-pointer"
                    title={t.cart.clearCart}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-[#59636D] hover:text-[#17202A] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Free Delivery Bar */}
            <div className="p-4 bg-[#EFF7FB] dark:bg-[#102C3C] border-b border-[#DCE3E8] dark:border-[#29323C] text-xs">
              <div className="flex items-center justify-between font-semibold text-[#1684C4] dark:text-[#2498D1] mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#1684C4] dark:text-[#2498D1]" />
                  <span>
                    {amountNeededForFreeDelivery === 0
                      ? t.cart.freeDeliveryReached
                      : t.cart.freeDeliveryProgress(amountNeededForFreeDelivery)}
                  </span>
                </div>
                <span>{deliveryProgress}%</span>
              </div>
              <div className="w-full bg-[#DCE3E8] dark:bg-[#29323C] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#C71925] dark:bg-[#E32935] h-full rounded-full transition-all duration-300"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-[#DCE3E8] dark:divide-[#29323C]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#EFF7FB] dark:bg-[#102C3C] flex items-center justify-center text-[#1684C4] dark:text-[#2498D1] mb-4">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#17202A] dark:text-[#F5F7F9]">
                    {t.cart.emptyTitle}
                  </h4>
                  <p className="text-xs text-[#59636D] dark:text-[#AEB7C0] mt-1 max-w-xs leading-relaxed">
                    {t.cart.emptySubtitle}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => setIsCartOpen(false)}
                  >
                    {t.cart.continueShopping}
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVolume}`}
                    className="py-4 flex gap-3.5 items-center first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name[language]}
                      className="w-16 h-16 object-cover rounded-2xl bg-[#EFF7FB] dark:bg-[#102C3C] border border-[#DCE3E8] dark:border-[#29323C] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#17202A] dark:text-[#F5F7F9] line-clamp-1">
                          {item.product.name[language]}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVolume)}
                          className="text-gray-300 dark:text-gray-500 hover:text-[#C71925] transition-colors p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#59636D] dark:text-[#AEB7C0] mt-0.5">
                        Hajmi: <span className="font-semibold text-[#17202A] dark:text-gray-300">{item.selectedVolume}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Stepper */}
                        <div className="flex items-center bg-[#EFF7FB] dark:bg-[#102C3C] rounded-full p-0.5 border border-[#DCE3E8] dark:border-[#29323C]">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedVolume,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-white dark:hover:bg-white/20 text-[#17202A] dark:text-gray-200 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#17202A] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedVolume,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-white dark:hover:bg-white/20 text-[#17202A] dark:text-gray-200 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-xs font-bold text-[#C71925] dark:text-[#E32935]">
                          {(item.price * item.quantity).toLocaleString()} {t.common.sum}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-[#DCE3E8] dark:border-[#29323C] bg-[#EFF7FB] dark:bg-[#102C3C] space-y-4">
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(false);
                    }}
                    placeholder="Promokod (masalan: SABO10)"
                    className={`flex-1 px-3 py-2 text-xs uppercase bg-white dark:bg-[#151B22] text-[#17202A] dark:text-white border rounded-xl focus:outline-none focus:ring-1 ${
                      promoError
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-[#DCE3E8] dark:border-[#29323C] focus:ring-[#C71925]'
                    }`}
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    {t.cart.applyPromo}
                  </Button>
                </form>

                {promoCode && (
                  <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="font-semibold">
                      Promokod: {promoCode} ({discountPercent}%)
                    </span>
                    <span>-{discountAmount.toLocaleString()} {t.common.sum}</span>
                  </div>
                )}

                {/* Calculation Rows */}
                <div className="space-y-1.5 text-xs text-[#59636D] dark:text-[#AEB7C0]">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-semibold text-[#17202A] dark:text-white">
                      {subtotal.toLocaleString()} {t.common.sum}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#73B832] dark:text-[#82C744]">
                      <span>Chegirma ({discountPercent}%)</span>
                      <span className="font-semibold">
                        -{discountAmount.toLocaleString()} {t.common.sum}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t.cart.deliveryFee}</span>
                    <span className="font-semibold text-[#17202A] dark:text-white">
                      {deliveryFee === 0 ? (
                        <span className="text-[#73B832] dark:text-[#82C744] font-bold">{t.cart.freeDelivery}</span>
                      ) : (
                        `${deliveryFee.toLocaleString()} ${t.common.sum}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#17202A] dark:text-[#F5F7F9] pt-2 border-t border-[#DCE3E8] dark:border-[#29323C]">
                    <span>{t.cart.total}</span>
                    <span className="text-base text-[#C71925] dark:text-[#E32935]">
                      {totalAmount.toLocaleString()} {t.common.sum}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <Button
                  fullWidth
                  size="md"
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.cart.checkoutBtn}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
