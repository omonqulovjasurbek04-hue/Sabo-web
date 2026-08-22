import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

const salesData = [
  { month: 'Yan', daromad: 42000000, buyurtmalar: 320 },
  { month: 'Fev', daromad: 48000000, buyurtmalar: 365 },
  { month: 'Mar', daromad: 55000000, buyurtmalar: 410 },
  { month: 'Apr', daromad: 62000000, buyurtmalar: 480 },
  { month: 'May', daromad: 78000000, buyurtmalar: 590 },
  { month: 'Iyun', daromad: 86000000, buyurtmalar: 640 },
  { month: 'Iyul', daromad: 94000000, buyurtmalar: 710 },
  { month: 'Avg', daromad: 108000000, buyurtmalar: 840 },
];

const categoryData = [
  { name: 'Sut', value: 38, color: '#0E3B2E' },
  { name: 'Kefir', value: 22, color: '#2D6A4F' },
  { name: 'Qaymoq', value: 16, color: '#52B788' },
  { name: 'Yogurt', value: 14, color: '#74C69D' },
  { name: 'Sariyog‘', value: 10, color: '#B7E4C7' },
];

const recentOrders = [
  {
    id: 'ORD-2026-8941',
    customer: 'Jasurbek Omonqulov',
    phone: '+998 90 123 45 67',
    product: 'SABO Sut 3.2% (2 dona), SABO Kefir (1 dona)',
    total: 36000,
    payment: 'Click',
    status: 'CONFIRMED',
    time: '10 daqiqa oldin',
  },
  {
    id: 'ORD-2026-8940',
    customer: 'Dilshod Rahimov',
    phone: '+998 93 987 65 43',
    product: 'SABO Qaymoq 200g (3 dona)',
    total: 45000,
    payment: 'Payme',
    status: 'PENDING',
    time: '25 daqiqa oldin',
  },
  {
    id: 'ORD-2026-8939',
    customer: 'Madina Alimova',
    phone: '+998 97 555 11 22',
    product: 'SABO Yogurt 2.5% (4 dona), SABO Sutim (2 dona)',
    total: 52000,
    payment: 'Naqd',
    status: 'DELIVERED',
    time: '1 soat oldin',
  },
  {
    id: 'ORD-2026-8938',
    customer: 'Anvar Qodirov',
    phone: '+998 99 888 77 66',
    product: 'SABO Smetana 15% (2 dona)',
    total: 28000,
    payment: 'Click',
    status: 'DELIVERED',
    time: '2 soat oldin',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#0E3B2E] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="size-3.5" />
            <span>SABO Boshqaruv Markazi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0E3B2E] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#52796F] font-medium mt-1">
            SABO sut mahsulotlari ishlab chiqarish va savdo tahlili.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="px-4 py-2.5 rounded-xl bg-[#0E3B2E] text-white font-bold text-xs shadow-md hover:bg-[#08281F] transition-all flex items-center gap-1.5"
          >
            <span>Yangi mahsulot</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#52796F]">
              Jami oylik tushum
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#0E3B2E]">
              108,000,000 <span className="text-xs font-bold text-[#52796F]">UZS</span>
            </div>
            <span className="text-xs text-emerald-600 font-bold block mt-1">
              +24.5% o‘tgan oyga nisbatan
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#52796F]">
              Jami buyurtmalar
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700">
              <ShoppingCart className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#0E3B2E]">
              840 <span className="text-sm font-bold text-[#52796F]">ta</span>
            </div>
            <span className="text-xs text-blue-600 font-bold block mt-1">
              42 ta yangi kutilayotgan
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#52796F]">
              Faol mahsulotlar
            </span>
            <div className="p-2.5 rounded-2xl bg-[#EBF7EE] text-[#0E3B2E]">
              <Package className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#0E3B2E]">
              18 <span className="text-sm font-bold text-[#52796F]">xil</span>
            </div>
            <span className="text-xs text-[#2D6A4F] font-bold block mt-1">
              7 ta asosiy toifada
            </span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#52796F]">
              Mijozlar bazasi
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-[#0E3B2E]">
              1,245 <span className="text-sm font-bold text-[#52796F]">nafar</span>
            </div>
            <span className="text-xs text-amber-600 font-bold block mt-1">
              +112 ta yangi ro‘yxatdan o‘tgan
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Orders Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-[#0E3B2E]">Savdo va Tushum Dinamikasi</h2>
              <p className="text-xs text-[#52796F]">Oxirgi 8 oylik oylik ko‘rsatkichlar</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDaromad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E3B2E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0E3B2E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                <XAxis dataKey="month" stroke="#52796F" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#52796F"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: any) => [
                    `${Number(value).toLocaleString()} UZS`,
                    'Tushum',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0E3B2E',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="daromad"
                  stroke="#0E3B2E"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDaromad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0E3B2E]">Toifalar Ulushi</h2>
            <p className="text-xs text-[#52796F]">Mahsulot sotuv nisbati (%)</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Ulush']}
                  contentStyle={{
                    backgroundColor: '#0E3B2E',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#EBE3DA]/80 text-xs">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-[#1A2E26]">{cat.name}:</span>
                <span className="text-[#52796F] font-semibold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EBE3DA] shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE3DA]">
          <div>
            <h2 className="text-lg font-black text-[#0E3B2E]">So‘nggi Buyurtmalar</h2>
            <p className="text-xs text-[#52796F]">Real vaqtda qabul qilingan so‘nggi tranzaksiyalar</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-bold text-[#0E3B2E] hover:underline flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EBE3DA] text-[#52796F] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-4">Buyurtma ID</th>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Mahsulotlar</th>
                <th className="py-3 px-4">Summa</th>
                <th className="py-3 px-4">To‘lov</th>
                <th className="py-3 px-4">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3DA]/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F8F6F0] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0E3B2E]">{ord.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1A2E26]">{ord.customer}</div>
                    <div className="text-[11px] text-[#52796F]">{ord.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#52796F] max-w-xs truncate font-medium">
                    {ord.product}
                  </td>
                  <td className="py-3.5 px-4 font-black text-[#0E3B2E]">
                    {ord.total.toLocaleString()} UZS
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#0E3B2E] uppercase">
                      {ord.payment}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ord.status === 'CONFIRMED'
                          ? 'bg-blue-50 text-blue-700'
                          : ord.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
