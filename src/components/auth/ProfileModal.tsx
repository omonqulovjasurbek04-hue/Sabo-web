import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  User,
  Phone,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Sparkles,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { showToast } from '../ui/Toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { user, logout, orders } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders');

  if (!user) return null;

  const userName = user.fullName || user.name || 'Bobur Abdullaev';
  const userPhone = user.phone || '+998 (90) 123-45-67';
  const userInitial = userName.charAt(0) || 'P';
  const bonusPoints = user.bonusPoints ?? 35000;

  const handleLogout = () => {
    logout();
    onClose();
    showToast({ type: 'info', title: 'Tizimdan chiqildi' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Yetkazildi
          </span>
        );
      case 'on_the_way':
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EBF3ED] dark:bg-[#1A3A27] text-[#25683C] dark:text-[#ACF3BA] border border-[#25683C]/20 dark:border-white/10">
            <Truck className="w-3 h-3" /> Yo'lda (Kuryer)
          </span>
        );
      case 'processing':
      case 'confirmed':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3" /> Tayyorlanmoqda
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE3E8] dark:border-[#29323C]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C71925] text-white flex items-center justify-center font-bold text-lg font-serif">
              {userInitial}
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#17202A] dark:text-white">{userName}</h3>
              <p className="text-xs text-[#59636D] dark:text-[#AEB7C0]">{userPhone}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C71925] hover:text-[#A80F19] p-2 hover:bg-[#EFF7FB] dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>

        {/* Loyalty Points Banner */}
        <div className="p-4 bg-[#0D1117] text-white rounded-2xl flex items-center justify-between border border-[#29323C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C71925]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#1684C4] font-bold uppercase tracking-wider">
                SABO Club Ballari
              </div>
              <div className="text-xl font-bold font-serif">{bonusPoints.toLocaleString()} ball</div>
            </div>
          </div>
          <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full text-gray-200">
            1 ball = 1 so'm
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 border-b border-[#DCE3E8] dark:border-[#29323C] pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#C71925] text-white'
                : 'bg-[#EFF7FB] dark:bg-white/10 text-[#59636D] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            Buyurtmalar tarixi ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#C71925] text-white'
                : 'bg-[#EFF7FB] dark:bg-white/10 text-[#59636D] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            Shaxsiy ma'lumotlar
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-[#59636D] dark:text-gray-400 text-xs">
                Sizda hali buyurtmalar mavjud emas.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-[#EFF7FB] dark:bg-white/5 rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] space-y-2 hover:border-[#C71925]/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#17202A] dark:text-white">#{order.id}</span>
                    <span className="text-[#59636D] dark:text-gray-400">{order.createdAt}</span>
                  </div>

                  <div className="text-xs text-[#59636D] dark:text-gray-300 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.product.name.uz} ({item.selectedVolume}) x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString()} so'm
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#DCE3E8] dark:border-[#29323C] flex items-center justify-between text-xs font-bold">
                    <span className="text-[#17202A] dark:text-white">Jami:</span>
                    <span className="text-[#C71925] dark:text-[#E32935]">
                      {order.total.toLocaleString()} so'm
                    </span>
                  </div>

                  <div className="text-[11px] text-[#59636D] dark:text-gray-400">
                    Holati:{' '}
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-semibold uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#EFF7FB] dark:bg-white/5 rounded-2xl border border-[#DCE3E8] dark:border-[#29323C] space-y-3">
              <div>
                <span className="text-[#59636D] dark:text-gray-400 text-[10px] block">To'liq ism:</span>
                <span className="font-bold text-[#17202A] dark:text-white text-sm">{userName}</span>
              </div>
              <div>
                <span className="text-[#59636D] dark:text-gray-400 text-[10px] block">Telefon raqam:</span>
                <span className="font-bold text-[#17202A] dark:text-white text-sm">{userPhone}</span>
              </div>
              <div>
                <span className="text-[#59636D] dark:text-gray-400 text-[10px] block">A'zolik darajasi:</span>
                <span className="font-bold text-[#C71925] dark:text-[#E32935]">SABO Gold Member (1998 dan beri)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
