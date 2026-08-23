import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { apiClient } from '../../api/client';
import type { Order, OrderStatus } from '../../types';

const initialOrders: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'ORD-2026-8941',
    customerName: 'Jasurbek Omonqulov',
    customerPhone: '+998 90 123 45 67',
    deliveryAddress: 'Toshkent sh., Yunusobod tumani, 12-mavze, 45-uy',
    items: [
      { id: 'item_1', productName: 'SABO Sut 3.2%', variant: '1L', quantity: 2, priceMinor: 12000, totalMinor: 24000 },
      { id: 'item_2', productName: 'SABO Kefir 2.5%', variant: '1L', quantity: 1, priceMinor: 12000, totalMinor: 12000 },
    ],
    totalMinor: 36000,
    currency: 'UZS',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    paymentMethod: 'CLICK',
    createdAt: '2026-08-22 10:24',
  },
  {
    id: 'ord_2',
    orderNumber: 'ORD-2026-8940',
    customerName: 'Dilshod Rahimov',
    customerPhone: '+998 93 987 65 43',
    deliveryAddress: 'Toshkent sh., Chilonzor tumani, 9-mavze, 18-uy',
    items: [
      { id: 'item_3', productName: 'SABO Qaymoq 200g', variant: '200g', quantity: 3, priceMinor: 15000, totalMinor: 45000 },
    ],
    totalMinor: 45000,
    currency: 'UZS',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'PAYME',
    createdAt: '2026-08-22 09:45',
  },
];

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    apiClient
      .get('/admin/orders')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setOrders(
            data.map((o: any) => ({
              id: o.id,
              orderNumber: o.orderNumber,
              customerName: o.customerName,
              customerPhone: o.customerPhone,
              deliveryAddress: o.address ? `${o.address.city || ''} ${o.address.street || ''}`.trim() : 'Yetkazib berish manzili',
              items: (o.items || []).map((it: any) => ({
                id: it.id,
                productName: it.productName,
                variant: it.variantName || '1L',
                quantity: it.quantity,
                priceMinor: it.unitPriceMinor,
                totalMinor: it.subtotalMinor,
              })),
              totalMinor: o.totalMinor,
              currency: o.currency || 'UZS',
              status: o.status,
              paymentStatus: o.paymentStatus,
              paymentMethod: o.payments?.[0]?.provider || 'CASH',
              createdAt: new Date(o.createdAt).toLocaleString(),
            }))
          );
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status });
    } catch {}
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status });
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0E3B2E] tracking-tight">Buyurtmalar</h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            Sayt orqali tushgan barcha xaridlar va yetkazib berish holatlari.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === st
                ? 'bg-[#0E3B2E] text-white shadow-sm'
                : 'bg-white border border-[#EBE3DA] text-[#52796F] hover:bg-[#F5EFEB]'
            }`}
          >
            {st === 'ALL' && 'Barchasi'}
            {st === 'PENDING' && 'Kutilayotgan (Pending)'}
            {st === 'CONFIRMED' && 'Tasdiqlangan'}
            {st === 'DELIVERED' && 'Yetkazilgan (Delivered)'}
            {st === 'CANCELLED' && 'Bekor qilingan'}
          </button>
        ))}
      </div>

      {/* Search and Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs overflow-x-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buyurtma raqami yoki mijoz ismi/telefoni bo‘yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-xl border border-[#EBE3DA] bg-[#FDFBF7] text-xs font-semibold focus:outline-none focus:border-[#0E3B2E]"
          />
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
              <th className="py-3 px-4">Buyurtma</th>
              <th className="py-3 px-4">Mijoz</th>
              <th className="py-3 px-4">Yetkazish manzili</th>
              <th className="py-3 px-4">Summa</th>
              <th className="py-3 px-4">To‘lov</th>
              <th className="py-3 px-4">Holat</th>
              <th className="py-3 px-4 text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE3DA]/60">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#F8F6F0] transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0E3B2E]">
                  <div>{ord.orderNumber}</div>
                  <div className="text-[11px] text-[#52796F] font-normal">{ord.createdAt}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1A2E26]">{ord.customerName}</div>
                  <div className="text-[11px] text-[#52796F] font-mono">{ord.customerPhone}</div>
                </td>
                <td className="py-3.5 px-4 text-[#52796F] max-w-xs truncate font-medium">
                  {ord.deliveryAddress}
                </td>
                <td className="py-3.5 px-4 font-black text-[#0E3B2E]">
                  {ord.totalMinor.toLocaleString()} UZS
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#0E3B2E] uppercase">
                    {ord.paymentMethod} • {ord.paymentStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={ord.status}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1 rounded-lg border border-[#EBE3DA] bg-[#FDFBF7] text-[11px] font-bold text-[#0E3B2E] cursor-pointer"
                  >
                    <option value="PENDING">Kutilmoqda</option>
                    <option value="CONFIRMED">Tasdiqlandi</option>
                    <option value="PROCESSING">Tayyorlanmoqda</option>
                    <option value="DELIVERED">Bajarildi</option>
                    <option value="CANCELLED">Bekor qilindi</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setActiveOrder(ord)}
                    className="p-1.5 rounded-lg border border-[#EBE3DA] bg-[#F8F6F0] text-[#0E3B2E] hover:bg-[#EBF7EE] font-bold"
                  >
                    <Eye className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-[#EBE3DA] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE3DA]">
              <div>
                <h2 className="text-xl font-black text-[#0E3B2E]">Buyurtma Tafsiloti</h2>
                <span className="text-xs font-mono font-bold text-[#52796F]">
                  {activeOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-[#52796F] hover:text-[#1A2E26] font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F6F0] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#52796F]">Mijoz:</span>
                  <span className="font-bold text-[#1A2E26]">{activeOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52796F]">Telefon:</span>
                  <span className="font-bold text-[#1A2E26]">{activeOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#52796F]">Manzil:</span>
                  <span className="font-bold text-[#1A2E26] text-right">{activeOrder.deliveryAddress}</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#52796F] mb-2 uppercase tracking-wider text-[10px]">
                  Tarkib:
                </div>
                <div className="divide-y divide-[#EBE3DA] border border-[#EBE3DA] rounded-2xl overflow-hidden">
                  {activeOrder.items.map((it) => (
                    <div key={it.id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <div className="font-bold text-[#1A2E26]">{it.productName}</div>
                        <div className="text-[11px] text-[#52796F]">{it.quantity} dona x {it.priceMinor.toLocaleString()} UZS</div>
                      </div>
                      <div className="font-black text-[#0E3B2E]">{it.totalMinor.toLocaleString()} UZS</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 text-sm font-black text-[#0E3B2E]">
                <span>Jami to‘lov:</span>
                <span className="text-base">{activeOrder.totalMinor.toLocaleString()} UZS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
