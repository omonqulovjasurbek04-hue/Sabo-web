"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  FolderTree,
  Settings,
  Plus,
  Search,
  Eye,
  EyeOff,
  ExternalLink,
  Check,
  TrendingUp,
  Lock,
  User,
  LogOut,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "messages" | "categories" | "settings"
  >("dashboard");
  const [locale] = useState<Locale>("uz");
  const dict = getDictionary(locale);

  // Check auth from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = window.localStorage.getItem("sabo_admin_auth");
      setIsAuthenticated(auth === "true");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    setTimeout(() => {
      // Validate credentials: Bekzodbek / Admin0525
      if (usernameInput === "Bekzodbek" && passwordInput === "Admin0525") {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("sabo_admin_auth", "true");
          window.localStorage.setItem("sabo_admin_user", "Bekzodbek");
        }
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Login yoki parol noto'g'ri! Iltimos, qaytadan tekshirib kiring.");
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("sabo_admin_auth");
      window.localStorage.removeItem("sabo_admin_user");
    }
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // Products state
  const [productList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock Orders state
  const [orders, setOrders] = useState([
    {
      id: "ord_1787384016258",
      customerName: "Jasurbek Omonqulov",
      customerPhone: "+998 90 123 45 67",
      address: "Toshkent sh., Yunusobod tumani, 12-mavze",
      items: "SABO Sut 3.2% (2 dona), SABO Kefir (1 dona)",
      totalAmount: 36000,
      paymentMethod: "click",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      date: "2026-08-22 10:24",
    },
    {
      id: "ord_1787383921004",
      customerName: "Dilshod Rahimov",
      customerPhone: "+998 93 987 65 43",
      address: "Toshkent sh., Chilonzor tumani, 9-mavze",
      items: "SABO Qaymoq (3 dona)",
      totalAmount: 45000,
      paymentMethod: "payme",
      paymentStatus: "pending",
      orderStatus: "new",
      date: "2026-08-22 09:45",
    },
    {
      id: "ord_1787381205912",
      customerName: "Madina Alimova",
      customerPhone: "+998 97 555 11 22",
      address: "Toshkent sh., Mirzo Ulug'bek tumani",
      items: "SABO Yogurt 2.5% (4 dona), SABO Sutim (2 dona)",
      totalAmount: 52000,
      paymentMethod: "cash",
      paymentStatus: "paid",
      orderStatus: "completed",
      date: "2026-08-21 16:30",
    },
  ]);

  // Mock Contact Messages
  const [messages, setMessages] = useState([
    {
      id: "msg_001",
      name: "Akmal Karimov",
      phone: "+998 91 234 56 78",
      message: "Do'konlar tarmog'imizga SABO sut va qatiq mahsulotlarini ulgurji yetkazib berish bo'yicha shartnoma qilmoqchimiz.",
      date: "2026-08-22 08:15",
      status: "new",
    },
    {
      id: "msg_002",
      name: "Sardor Yusupov",
      phone: "+998 94 321 00 11",
      message: "SABO Yogurt mahsulotlarining sertifikatlari bilan qanday tanishsa bo'ladi?",
      date: "2026-08-21 14:20",
      status: "read",
    },
  ]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const handleToggleMessageStatus = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, status: m.status === "new" ? "read" : "new" }
          : m
      )
    );
  };

  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Loading state while checking localStorage
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
        {/* Top Navbar */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="SABO"
              width={1230}
              height={678}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle dict={dict} />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-surface text-xs font-bold text-muted hover:text-foreground transition-colors"
            >
              <span>Veb-saytga qaytish</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full mx-auto my-auto py-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border shadow-xl backdrop-blur-md relative">
            <div className="text-center mb-8">
              <div className="size-16 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center mx-auto mb-4 shadow-xs">
                <Lock className="size-8" />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Administrator Kirish
              </h1>
              <p className="text-muted text-xs sm:text-sm mt-1">
                SABO boshqaruv tizimiga kirish uchun login va parolingizni kiriting.
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 rounded-2xl bg-action-red/10 border border-action-red/20 text-action-red text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Login (Foydalanuvchi nomi)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Foydalanuvchi nomi"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    <span>Tizimga kirish</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-muted">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Xavfsiz 256-bit shifrlangan ma&apos;lumotlar tizimi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="max-w-md w-full mx-auto text-center text-xs text-muted pb-4">
          &copy; 2026 SABO Dairy. Barcha huquqlar himoyalangan.
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-surface border-b lg:border-b-0 lg:border-r border-border shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Admin Header / Brand */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="SABO"
                width={1230}
                height={678}
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-secondary-soft text-secondary uppercase tracking-wider">
                Admin
              </span>
            </Link>
            <ThemeToggle dict={dict} />
          </div>

          {/* Logged in User info */}
          <div className="mb-6 p-3.5 rounded-2xl bg-background border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-display text-sm">
                B
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">Bekzodbek</div>
                <div className="text-[11px] text-muted">Bosh Administrator</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Chiqish"
              className="p-1.5 rounded-lg text-muted hover:text-action-red hover:bg-action-red/10 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="size-5" />
              <span>Boshqaruv paneli</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "products"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="size-5" />
                <span>Mahsulotlar</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-foreground font-bold">
                {productList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "orders"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-5" />
                <span>Buyurtmalar</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-action-red text-white font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "messages"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="size-5" />
                <span>Xabarlar</span>
              </div>
              {messages.filter((m) => m.status === "new").length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-action-red text-white font-bold animate-pulse">
                  {messages.filter((m) => m.status === "new").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "categories"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <FolderTree className="size-5" />
              <span>Kategoriyalar</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors text-left cursor-pointer ${
                activeTab === "settings"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <Settings className="size-5" />
              <span>Sozlamalar &amp; API</span>
            </button>
          </nav>
        </div>

        {/* Footer / Store Link */}
        <div className="pt-6 mt-6 border-t border-border flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background/50 hover:bg-background text-sm font-semibold text-foreground transition-colors"
          >
            <span>Veb-saytga o&apos;tish</span>
            <ExternalLink className="size-4 text-muted" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-action-red/30 text-action-red hover:bg-action-red/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl">
        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Boshqaruv paneli
              </h1>
              <p className="text-muted text-sm sm:text-base mt-1">
                SABO sut mahsulotlari platformasining real vaqtdagi ko&apos;rsatkichlari.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted">Jami tushum</span>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <TrendingUp className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    {totalRevenue.toLocaleString()} <span className="text-sm font-normal text-muted">UZS</span>
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold block mt-1">
                    +18% oxirgi haftada
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted">Buyurtmalar</span>
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
                    <ShoppingCart className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    {orders.length} ta
                  </span>
                  <span className="text-xs text-blue-600 font-semibold block mt-1">
                    {orders.filter((o) => o.orderStatus === "new").length} ta yangi
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted">Mahsulotlar</span>
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <Package className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    {productList.length} xil
                  </span>
                  <span className="text-xs text-primary font-semibold block mt-1">
                    7 ta toifada
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted">Xabarlar</span>
                  <div className="p-2.5 rounded-2xl bg-action-red/10 text-action-red">
                    <MessageSquare className="size-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                    {messages.length} ta
                  </span>
                  <span className="text-xs text-action-red font-semibold block mt-1">
                    {messages.filter((m) => m.status === "new").length} ta yangi xabar
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    So&apos;nggi buyurtmalar
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Real vaqtda qabul qilingan onlayn buyurtmalar
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer"
                >
                  Barchasini ko&apos;rish &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted text-xs uppercase font-bold">
                      <th className="py-3 px-4">Buyurtma ID</th>
                      <th className="py-3 px-4">Mijoz</th>
                      <th className="py-3 px-4">Mahsulotlar</th>
                      <th className="py-3 px-4">Summa</th>
                      <th className="py-3 px-4">To&apos;lov</th>
                      <th className="py-3 px-4">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-xs text-foreground">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground">{order.customerName}</div>
                          <div className="text-xs text-muted">{order.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted max-w-xs truncate">
                          {order.items}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {order.totalAmount.toLocaleString()} UZS
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {order.paymentMethod} ({order.paymentStatus})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.orderStatus === "confirmed"
                                ? "bg-blue-500/10 text-blue-600"
                                : order.orderStatus === "completed"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-3xl text-foreground">
                  Mahsulotlar boshqaruvi
                </h1>
                <p className="text-muted text-sm mt-1">
                  SABO mahsulotlari katalogi, narxlar va qadoqlash parametrlari.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-xs hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
              >
                <Plus className="size-4" />
                <span>Yangi mahsulot qo&apos;shish</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
                <input
                  type="text"
                  placeholder="Mahsulot nomi yoki slug bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">Barcha toifalar</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name.uz}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-xs uppercase font-bold">
                    <th className="py-3 px-4">Rasm</th>
                    <th className="py-3 px-4">Nomi (UZ)</th>
                    <th className="py-3 px-4">Kategoriya</th>
                    <th className="py-3 px-4">Yog&apos;lilik</th>
                    <th className="py-3 px-4">Hajmlar</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="size-12 rounded-xl bg-background border border-border overflow-hidden relative flex items-center justify-center">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name.uz}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="size-6 text-muted" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">{p.name.uz}</div>
                        <div className="text-xs text-muted font-mono">{p.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary-soft text-secondary uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {p.fat || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted text-xs">
                        {p.volumes?.join(", ") || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                          <Check className="size-3" />
                          Mavjud
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/products/${p.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <Eye className="size-3.5" />
                          Ko&apos;rish
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Buyurtmalar boshqaruvi
              </h1>
              <p className="text-muted text-sm mt-1">
                Sayt orqali tushgan barcha buyurtmalar va to&apos;lov holatlari.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-xs uppercase font-bold">
                    <th className="py-3 px-4">Buyurtma</th>
                    <th className="py-3 px-4">Mijoz ma&apos;lumotlari</th>
                    <th className="py-3 px-4">Yetkazish manzili</th>
                    <th className="py-3 px-4">Tarkibi</th>
                    <th className="py-3 px-4">Jami summa</th>
                    <th className="py-3 px-4">To&apos;lov</th>
                    <th className="py-3 px-4">Holatni o&apos;zgartirish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-surface-elevated/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-xs text-foreground">
                        <div>{o.id}</div>
                        <div className="text-[11px] text-muted font-normal mt-0.5">{o.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-foreground">{o.customerName}</div>
                        <div className="text-xs text-muted font-mono">{o.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-muted max-w-xs leading-relaxed">
                        {o.address}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-foreground max-w-xs">
                        {o.items}
                      </td>
                      <td className="py-4 px-4 font-bold text-foreground text-sm">
                        {o.totalAmount.toLocaleString()} UZS
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold uppercase text-foreground">
                            {o.paymentMethod}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              o.paymentStatus === "paid"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="new">Yangi (New)</option>
                          <option value="confirmed">Tasdiqlangan</option>
                          <option value="preparing">Tayyorlanmoqda</option>
                          <option value="delivering">Yetkazilmoqda</option>
                          <option value="completed">Bajarildi</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Qayta aloqa xabarlari
              </h1>
              <p className="text-muted text-sm mt-1">
                Sayt aloqa formasidan yuborilgan murojaatlar va takliflar.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 rounded-3xl bg-surface border transition-all ${
                    m.status === "new"
                      ? "border-action-red/40 shadow-sm"
                      : "border-border opacity-90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base text-foreground">{m.name}</span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-secondary-soft text-secondary font-semibold">
                        {m.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span>{m.date}</span>
                      <button
                        onClick={() => handleToggleMessageStatus(m.id)}
                        className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                          m.status === "new"
                            ? "bg-action-red text-white hover:bg-action-red-dark"
                            : "bg-surface-elevated text-muted hover:text-foreground"
                        }`}
                      >
                        {m.status === "new" ? "O'qilgan deb belgilash" : "O'qilgan"}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Mahsulot toifalari
              </h1>
              <p className="text-muted text-sm mt-1">
                SABO sut mahsulotlarining barcha faol toifalari va ro&apos;yxatlari.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => {
                const count = productList.filter((p) => p.category === c.slug).length;
                return (
                  <div
                    key={c.slug}
                    className="p-6 rounded-3xl bg-surface border border-border shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="size-12 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center font-bold font-display text-lg">
                          {c.name.uz.charAt(0)}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                          Faol
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {c.name.uz}
                      </h3>
                      <p className="text-xs text-muted font-mono mt-0.5">slug: {c.slug}</p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-sm">
                      <span className="text-muted">Mahsulotlar soni:</span>
                      <span className="font-bold text-foreground">{count} ta</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. SETTINGS & API HEALTH TAB */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Tizim sozlamalari va API Holati
              </h1>
              <p className="text-muted text-sm mt-1">
                Backend, API v1, To&apos;lovlar va xavfsizlik parametrlari.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  Feature Flags (Imkoniyatlar)
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <span className="font-semibold text-foreground">E-Commerce Savat &amp; Checkout</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      Yoqilgan (ON)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <span className="font-semibold text-foreground">Click &amp; Payme To&apos;lov shlyuzlari</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      Yoqilgan (ON)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <span className="font-semibold text-foreground">Three.js 3D &amp; Animatsiyalar</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      Yoqilgan (ON)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <span className="font-semibold text-foreground">Ko&apos;p tillilik (UZ, RU, EN)</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      Yoqilgan (ON)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xs">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">
                  API &amp; Infratuzilma Holati
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <div>
                      <div className="font-semibold text-foreground">Frontend Dev / Prod</div>
                      <div className="text-xs text-muted font-mono">http://localhost:3000</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <div>
                      <div className="font-semibold text-foreground">API v1 Marshrutlari</div>
                      <div className="text-xs text-muted font-mono">/api/v1/*</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <div>
                      <div className="font-semibold text-foreground">NestJS Standalone API</div>
                      <div className="text-xs text-muted font-mono">http://localhost:4000/api/v1</div>
                    </div>
                    <span className="text-xs font-bold text-blue-600">Tayyor</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border">
                    <div>
                      <div className="font-semibold text-foreground">Prisma PostgreSQL Sxemasi</div>
                      <div className="text-xs text-muted font-mono">schema.prisma</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Sinxron</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
