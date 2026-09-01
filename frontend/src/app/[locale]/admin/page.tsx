"use client";

import { useCallback, useEffect, useState } from "react";
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
  Sparkles,
  ArrowRight,
  Clock,
  Sliders,
  Server,
  UploadCloud,
  Download,
  Copy,
  FileText,
  Image as ImageIcon,
  Palette,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProductEditModal } from "@/components/admin/product-edit-modal";
import { ThemeDesignPanel } from "@/components/admin/theme-design-panel";
import { categories } from "@/data/categories";
import { apiClient, type AdminMessageApi, type AdminOrderApi } from "@/lib/api-client";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";
import type { MediaFileItem, Product } from "@/lib/types";
import { mapApiProduct } from "@/lib/product-mapper";

const ORDER_STATUS_TO_UI: Record<string, string> = {
  PENDING: "new", CONFIRMED: "confirmed", PROCESSING: "preparing",
  OUT_FOR_DELIVERY: "delivering", DELIVERED: "completed", CANCELLED: "cancelled",
};
const ORDER_STATUS_TO_API: Record<string, string> = {
  new: "PENDING", confirmed: "CONFIRMED", preparing: "PROCESSING",
  delivering: "OUT_FOR_DELIVERY", completed: "DELIVERED", cancelled: "CANCELLED",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUserName, setCurrentUserName] = useState("Admin");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "messages" | "categories" | "media" | "design" | "settings"
  >("dashboard");
  const [locale] = useState<Locale>("uz");
  const dict = getDictionary(locale);

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaFileItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFolder, setMediaFolder] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async (folder = "all") => {
    setMediaLoading(true);
    try {
      const res = await apiClient.listMedia(folder, 1, 50);
      if (res.success && res.data) {
        setMediaList(res.data);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia(mediaFolder);
    }
  }, [isAuthenticated, mediaFolder]);

  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await apiClient.uploadMedia(file, mediaFolder === "all" ? "general" : mediaFolder, file.name);
      }
      setUploadMessage(`${files.length} ta fayl muvaffaqiyatli yuklandi!`);
      await fetchMedia(mediaFolder);
    } catch {
      setUploadMessage("Fayl yuklashda xatolik yuz berdi");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadMessage(""), 4000);
      e.target.value = "";
    }
  };

  const handleCopyUrl = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Check auth against the real backend on mount
  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      setIsAuthenticated(false);
      return;
    }
    apiClient
      .getMe()
      .then((res) => {
        setIsAuthenticated(Boolean(res.success && res.data));
        if (res.data?.user?.name) setCurrentUserName(res.data.user.name);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    const trimmedUser = usernameInput.trim();
    const res = await apiClient.login({
      identifier: trimmedUser,
      password: passwordInput,
    });

    if (res.success && res.data) {
      setIsAuthenticated(true);
      setLoginError("");
      if (res.data.user?.name) setCurrentUserName(res.data.user.name);
    } else {
      setLoginError(res.error?.message || "Login yoki parol noto'g'ri!");
    }

    setIsSubmitting(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
    apiClient.logout().catch(() => {});
  };

  // Products state & CRUD
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productActionMsg, setProductActionMsg] = useState("");

  const loadProducts = async () => {
    try {
      const res = await apiClient.getProducts({ limit: 100 });
      if (res.success && res.data) {
        setProductList(res.data.map(mapApiProduct));
      }
    } catch (err) {
      console.error("Failed to load products from API:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" mahsulotini rostdan ham o'chirmoqchimisiz?`)) return;
    try {
      const res = await apiClient.deleteProduct(id);
      if (res.success) {
        setProductList((prev) => prev.filter((p) => p.id !== id));
        setProductActionMsg(`"${name}" muvaffaqiyatli o'chirildi!`);
        setTimeout(() => setProductActionMsg(""), 4000);
      }
    } catch {
      setProductActionMsg("Mahsulotni o'chirishda xatolik yuz berdi");
    }
  };

  const handleProductSaved = () => {
    loadProducts();
    setProductActionMsg("Mahsulot muvaffaqiyatli saqlandi!");
    setTimeout(() => setProductActionMsg(""), 4000);
  };

  type AdminOrderView = {
    id: string; apiId: string; customerName: string; customerPhone: string;
    address: string; items: string; totalAmount: number; paymentMethod: string;
    paymentStatus: string; orderStatus: string; date: string;
  };
  type AdminMessageView = {
    id: string; name: string; phone: string; subject: string; message: string; date: string; status: string;
  };
  const [orders, setOrders] = useState<AdminOrderView[]>([]);
  const [messages, setMessages] = useState<AdminMessageView[]>([]);
  const loadAdminData = useCallback(async () => {
    const [ordersRes, messagesRes] = await Promise.all([apiClient.getAdminOrders(), apiClient.getAdminMessages()]);
    if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data.map((order: AdminOrderApi) => ({
      id: order.orderNumber || order.id,
      apiId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: [order.address?.city, order.address?.district, order.address?.street, order.address?.apartment].filter(Boolean).join(", "),
      items: (order.items || []).map((item) => `${item.productName} (${item.quantity} dona)`).join(", "),
      totalAmount: (order.totalMinor || 0) / 100,
      paymentMethod: order.payments?.[0]?.provider || "CASH",
      paymentStatus: (order.paymentStatus || "PENDING").toLowerCase(),
      orderStatus: ORDER_STATUS_TO_UI[order.status] || "new",
      date: new Date(order.createdAt).toLocaleString(),
    })));
    if (messagesRes.success && messagesRes.data) setMessages(messagesRes.data.map((message: AdminMessageApi) => ({
      id: message.id, name: message.name, phone: message.phone || "—", subject: "Murojaat",
      message: message.message, date: new Date(message.createdAt).toLocaleString(), status: (message.status || "NEW").toLowerCase(),
    })));
  }, []);
  useEffect(() => { if (isAuthenticated) loadAdminData(); }, [isAuthenticated, loadAdminData]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    const res = await apiClient.updateAdminOrderStatus(order.apiId, ORDER_STATUS_TO_API[newStatus] || "PENDING");
    if (res.success) setOrders((prev) => prev.map((item) => item.id === orderId ? { ...item, orderStatus: newStatus } : item));
  };

  const handleToggleMessageStatus = async (msgId: string) => {
    const message = messages.find((item) => item.id === msgId);
    if (!message) return;
    const nextStatus = message.status === "new" ? "READ" : "NEW";
    const res = await apiClient.updateAdminMessageStatus(msgId, nextStatus);
    if (res.success) setMessages((prev) => prev.map((item) => item.id === msgId ? { ...item, status: nextStatus.toLowerCase() } : item));
  };

  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN (ELEGANT TYPOGRAPHY & DESIGN)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-primary selection:text-white">
        {/* Subtle Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Login Card */}
        <div className="max-w-md w-full my-auto relative z-10">
          <div className="p-8 sm:p-10 rounded-3xl bg-surface/90 backdrop-blur-xl border border-border/80 shadow-2xl shadow-black/5 dark:shadow-black/40">
            {/* Brand Logo & Lock Icon */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/logo.png"
                  alt="SABO"
                  width={1230}
                  height={678}
                  className="h-10 w-auto object-contain drop-shadow-xs"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="size-3.5" />
                <span>Boshqaruv Tizimi</span>
              </div>

              <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground tracking-tight">
                Administrator Kirish
              </h1>
              <p className="text-muted text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
                Tizimga xavfsiz kirish uchun hisob ma&apos;lumotlaringizni kiriting.
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 rounded-2xl bg-action-red/10 border border-action-red/20 text-action-red text-xs font-bold flex items-start gap-3 animate-shake">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4.5">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">
                  Login (Foydalanuvchi nomi)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted/80" />
                  <input
                    type="text"
                    required
                    placeholder="Foydalanuvchi nomi"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/70 text-sm font-semibold text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">
                  Maxfiy parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted/80" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background/70 text-sm font-semibold text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Tizimga kirish</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/80 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>256-bit xavfsiz shifrlangan boshqaruv tizimi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="max-w-md w-full mx-auto text-center text-xs font-semibold text-muted/70 pb-4 relative z-10">
          &copy; 2026 SABO Dairy. Barcha huquqlar himoyalangan.
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD (PREMIUM TYPOGRAPHY & SLEEK UI)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row selection:bg-primary selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-surface/95 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-border shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Admin Header / Brand */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="SABO"
                width={1230}
                height={678}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-secondary-soft text-secondary uppercase tracking-widest">
                Admin
              </span>
            </Link>
            <ThemeToggle dict={dict} />
          </div>

          {/* Logged in Administrator Profile Badge */}
          <div className="mb-6 p-4 rounded-2xl bg-background/80 border border-border flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center font-black font-display text-sm shadow-xs">
                {currentUserName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-extrabold text-foreground tracking-tight">{currentUserName}</div>
                <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Bosh Administrator
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-2 rounded-xl text-muted hover:text-action-red hover:bg-action-red/10 transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="size-4.5" />
              <span>Boshqaruv paneli</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "products"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Package className="size-4.5" />
                <span>Mahsulotlar</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === "products"
                    ? "bg-white/20 text-white"
                    : "bg-surface-elevated text-foreground"
                }`}
              >
                {productList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "orders"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShoppingCart className="size-4.5" />
                <span>Buyurtmalar</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-action-red text-white font-bold shadow-xs">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "messages"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare className="size-4.5" />
                <span>Xabarlar</span>
              </div>
              {messages.filter((m) => m.status === "new").length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-action-red text-white font-bold animate-pulse shadow-xs">
                  {messages.filter((m) => m.status === "new").length} ta yangi
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "categories"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <FolderTree className="size-4.5" />
              <span>Kategoriyalar</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "media"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ImageIcon className="size-4.5" />
                <span>Media Kutubxonasi</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  activeTab === "media"
                    ? "bg-white/20 text-white"
                    : "bg-surface-elevated text-foreground"
                }`}
              >
                {mediaList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("design")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "design"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <Palette className="size-4.5" />
              <span>Dizayn &amp; Ranglar</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
                activeTab === "settings"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <Settings className="size-4.5" />
              <span>Sozlamalar &amp; API</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 mt-6 border-t border-border flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background/50 hover:bg-background text-xs font-bold text-foreground transition-all hover:shadow-2xs"
          >
            <span>Veb-saytga o&apos;tish</span>
            <ExternalLink className="size-3.5 text-muted" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-action-red/30 text-action-red hover:bg-action-red/10 text-xs font-extrabold transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-extrabold uppercase tracking-wider mb-2">
                  <Sparkles className="size-3.5" />
                  <span>SABO Analytics</span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight">
                  Boshqaruv paneli
                </h1>
                <p className="text-muted text-sm sm:text-base mt-1 font-medium">
                  SABO sut mahsulotlari platformasining real vaqtdagi ko&apos;rsatkichlari.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-border text-xs font-bold text-muted self-start sm:self-auto">
                <Clock className="size-4 text-primary" />
                <span>Jonli sinxronizatsiya faol</span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Jami tushum</span>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <TrendingUp className="size-5" />
                  </div>
                </div>
                <div className="mt-5">
                  <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-muted uppercase">UZS</span>
                  </span>
                  <span className="text-xs text-emerald-600 font-bold block mt-1.5 flex items-center gap-1">
                    <span>+18.4%</span>
                    <span className="text-muted font-medium">oxirgi 7 kunda</span>
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Buyurtmalar</span>
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600">
                    <ShoppingCart className="size-5" />
                  </div>
                </div>
                <div className="mt-5">
                  <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    {orders.length} <span className="text-sm font-bold text-muted">ta</span>
                  </span>
                  <span className="text-xs text-blue-600 font-bold block mt-1.5">
                    {orders.filter((o) => o.orderStatus === "new").length} ta yangi buyurtma
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Mahsulotlar</span>
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <Package className="size-5" />
                  </div>
                </div>
                <div className="mt-5">
                  <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    {productList.length} <span className="text-sm font-bold text-muted">xil</span>
                  </span>
                  <span className="text-xs text-primary font-bold block mt-1.5">
                    7 ta asosiy toifada
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted">Xabarlar</span>
                  <div className="p-2.5 rounded-2xl bg-action-red/10 text-action-red">
                    <MessageSquare className="size-5" />
                  </div>
                </div>
                <div className="mt-5">
                  <span className="text-2xl sm:text-3xl font-black font-display text-foreground tracking-tight">
                    {messages.length} <span className="text-sm font-bold text-muted">ta</span>
                  </span>
                  <span className="text-xs text-action-red font-bold block mt-1.5">
                    {messages.filter((m) => m.status === "new").length} ta o&apos;qilmagan murojaat
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/70">
                <div>
                  <h3 className="font-display font-black text-xl text-foreground tracking-tight">
                    So&apos;nggi buyurtmalar
                  </h3>
                  <p className="text-xs text-muted font-medium mt-0.5">
                    Real vaqtda qabul qilingan onlayn buyurtmalar va to&apos;lov holatlari
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Barchasi</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted text-[11px] uppercase font-extrabold tracking-wider">
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
                      <tr key={order.id} className="hover:bg-surface-elevated/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-foreground">
                          {order.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-foreground text-sm">{order.customerName}</div>
                          <div className="text-xs text-muted font-medium">{order.customerPhone}</div>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-muted max-w-xs truncate">
                          {order.items}
                        </td>
                        <td className="py-4 px-4 font-black font-display text-foreground text-sm">
                          {order.totalAmount.toLocaleString()} UZS
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
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
                <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                  Mahsulotlar katalogi
                </h1>
                <p className="text-muted text-sm mt-1 font-medium">
                  SABO tabiiy sut mahsulotlari, narxlari va parametrlari.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer shrink-0"
              >
                <Plus className="size-4" />
                <span>Yangi mahsulot qo&apos;shish</span>
              </button>
            </div>

            {/* Notification message */}
            {productActionMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{productActionMsg}</span>
              </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted/70" />
                <input
                  type="text"
                  placeholder="Mahsulot nomi yoki toifasi bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
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
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-[11px] uppercase font-extrabold tracking-wider">
                    <th className="py-3 px-4">Rasm</th>
                    <th className="py-3 px-4">Mahsulot nomi</th>
                    <th className="py-3 px-4">Kategoriya</th>
                    <th className="py-3 px-4">Narxi</th>
                    <th className="py-3 px-4">Yog&apos;lilik</th>
                    <th className="py-3 px-4">Hajmlar</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-elevated/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="size-12 rounded-2xl bg-background border border-border overflow-hidden relative flex items-center justify-center shadow-2xs">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="size-6 text-muted" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground text-sm">{p.name}</div>
                        <div className="text-xs text-muted font-mono">{p.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-soft text-secondary uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black font-display text-action-red">
                        {p.price ? `${p.price.toLocaleString()} UZS` : "—"}
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {p.fat || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted font-medium text-xs">
                        {p.volumes?.join(", ") || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                            p.availability === "in-stock"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          <Check className="size-3" />
                          {p.availability === "in-stock" ? "Mavjud" : "Tugagan"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-all shadow-2xs cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Pencil className="size-3.5" />
                            <span>Tahrirlash</span>
                          </button>

                          <Link
                            href={`/products/${p.slug}`}
                            className="p-1.5 rounded-xl border border-border bg-background text-muted hover:text-primary hover:border-primary transition-all shadow-2xs"
                            title="Saytda ko'rish"
                          >
                            <Eye className="size-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-xl border border-action-red/30 bg-action-red/10 text-action-red hover:bg-action-red hover:text-white transition-all shadow-2xs cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
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
              <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                Buyurtmalar boshqaruvi
              </h1>
              <p className="text-muted text-sm mt-1 font-medium">
                Mijozlar buyurtmalari, manzillar va yetkazib berish jarayoni.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-muted text-[11px] uppercase font-extrabold tracking-wider">
                    <th className="py-3 px-4">Buyurtma</th>
                    <th className="py-3 px-4">Mijoz</th>
                    <th className="py-3 px-4">Manzil</th>
                    <th className="py-3 px-4">Tarkibi</th>
                    <th className="py-3 px-4">Summa</th>
                    <th className="py-3 px-4">To&apos;lov</th>
                    <th className="py-3 px-4">Holatni yangilash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-surface-elevated/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-xs text-foreground">
                        <div>{o.id}</div>
                        <div className="text-[11px] text-muted font-normal mt-0.5">{o.date}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-foreground text-sm">{o.customerName}</div>
                        <div className="text-xs text-muted font-mono font-medium">{o.customerPhone}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-muted font-medium max-w-xs leading-relaxed">
                        {o.address}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-foreground max-w-xs">
                        {o.items}
                      </td>
                      <td className="py-4 px-4 font-black font-display text-foreground text-sm">
                        {o.totalAmount.toLocaleString()} UZS
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold uppercase text-foreground">
                            {o.paymentMethod}
                          </span>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
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
                          className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
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
              <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                Murojaatlar qutisi
              </h1>
              <p className="text-muted text-sm mt-1 font-medium">
                Veb-sayt aloqa formasidan yuborilgan takliflar va xabarlar.
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
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-secondary-soft text-secondary font-bold">
                        {m.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted font-medium">
                      <span>{m.date}</span>
                      <button
                        onClick={() => handleToggleMessageStatus(m.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          m.status === "new"
                            ? "bg-action-red text-white hover:bg-action-red-dark shadow-xs"
                            : "bg-surface-elevated text-muted hover:text-foreground"
                        }`}
                      >
                        {m.status === "new" ? "O'qilgan deb belgilash" : "O'qilgan"}
                      </button>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-foreground mb-1">{m.subject}</div>
                  <p className="text-sm text-muted font-medium leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                Mahsulot toifalari
              </h1>
              <p className="text-muted text-sm mt-1 font-medium">
                SABO sut mahsulotlarining barcha toifalari va ulardagi mahsulotlar soni.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => {
                const count = productList.filter((p) => p.category === c.slug).length;
                return (
                  <div
                    key={c.slug}
                    className="p-6 rounded-3xl bg-surface border border-border shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="size-12 rounded-2xl bg-secondary-soft text-secondary flex items-center justify-center font-black font-display text-lg shadow-2xs">
                          {c.name.uz.charAt(0)}
                        </span>
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                          Faol toifa
                        </span>
                      </div>
                      <h3 className="font-display font-black text-xl text-foreground tracking-tight">
                        {c.name.uz}
                      </h3>
                      <p className="text-xs text-muted font-mono mt-1">slug: {c.slug}</p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-sm">
                      <span className="text-muted font-medium">Mahsulotlar soni:</span>
                      <span className="font-black text-foreground font-display">{count} ta</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. MEDIA & ASSET LIBRARY TAB */}
        {activeTab === "media" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                  Media va Fayllar Kutubxonasi
                </h1>
                <p className="text-muted text-sm mt-1 font-medium">
                  Mahsulot rasmlari, sertifikatlar, bannerlar va 3D modellarni boshqarish.
                </p>
              </div>

              {/* Upload Action */}
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer shrink-0">
                <UploadCloud className="size-4" />
                <span>{isUploading ? "Yuklanmoqda..." : "Fayl yuklash"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.glb,.gltf"
                  onChange={handleUploadFiles}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Notification Message */}
            {uploadMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div className="p-8 rounded-3xl bg-surface border-2 border-dashed border-border hover:border-primary/50 text-center flex flex-col items-center justify-center gap-3 transition-colors relative group">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.glb,.gltf"
                onChange={handleUploadFiles}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="size-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <UploadCloud className="size-7" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  Fayllarni bu yerga sudrab tashlang yoki tanlang
                </h3>
                <p className="text-xs text-muted mt-1">
                  Formatlar: JPG, PNG, WEBP, SVG, PDF, GLB 3D (Maksimal hajm: 25 MB)
                </p>
              </div>
            </div>

            {/* Folder Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: "Barcha fayllar" },
                { id: "products", label: "Mahsulotlar" },
                { id: "nature", label: "Zavod va Tabiat" },
                { id: "gallery", label: "Galereya" },
                { id: "general", label: "Yuklanganlar" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMediaFolder(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    mediaFolder === tab.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            {mediaLoading ? (
              <div className="py-16 text-center text-muted text-sm font-medium">
                Media kutubxonasi yuklanmoqda...
              </div>
            ) : mediaList.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-surface border border-border text-muted">
                Ushbu toifada hozircha fayllar mavjud emas.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaList.map((item) => {
                  const isImage = item.mimeType.startsWith("image/");
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/40 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Thumbnail View */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-background border border-border mb-2.5 flex items-center justify-center">
                          {isImage ? (
                            <Image
                              src={item.url}
                              alt={item.fileName}
                              fill
                              className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <FileText className="size-10 text-muted" />
                          )}
                        </div>

                        <div className="text-xs font-bold text-foreground truncate" title={item.fileName}>
                          {item.fileName}
                        </div>
                        <div className="text-[10px] text-muted font-mono mt-0.5 flex items-center justify-between">
                          <span>{Math.round(item.size / 1024)} KB</span>
                          <span className="uppercase">{item.folder}</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item.url)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-background border border-border hover:border-primary text-[11px] font-bold text-foreground transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="URL manzilidan nusxa olish"
                        >
                          {copiedUrl === item.url ? (
                            <>
                              <Check className="size-3 text-emerald-600" />
                              <span className="text-emerald-600">Nusxalandi</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3 text-muted" />
                              <span>Havola</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/api/v1/media/download/${item.id}?file=${encodeURIComponent(item.url.replace(/^\//, ""))}`}
                          download
                          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Kompyuterga yuklab olish"
                        >
                          <Download className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 7. DESIGN, COLORS & TYPOGRAPHY TAB */}
        {activeTab === "design" && <ThemeDesignPanel />}

        {/* 8. SETTINGS & API HEALTH TAB */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                Tizim sozlamalari va API Holati
              </h1>
              <p className="text-muted text-sm mt-1 font-medium">
                Backend infratuzilmasi, API v1 va xavfsizlik parametrlari.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
                <h3 className="font-display font-black text-lg text-foreground mb-4 tracking-tight flex items-center gap-2">
                  <Sliders className="size-5 text-primary" />
                  <span>Feature Flags (Imkoniyatlar)</span>
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <span className="font-bold text-foreground">E-Commerce Savat &amp; Checkout</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                      ON
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <span className="font-bold text-foreground">Click &amp; Payme To&apos;lov shlyuzlari</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                      ON
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <span className="font-bold text-foreground">Three.js 3D &amp; Animatsiyalar</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                      ON
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <span className="font-bold text-foreground">Ko&apos;p tillilik (UZ, RU, EN)</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                      ON
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
                <h3 className="font-display font-black text-lg text-foreground mb-4 tracking-tight flex items-center gap-2">
                  <Server className="size-5 text-primary" />
                  <span>API &amp; Infratuzilma Holati</span>
                </h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <div>
                      <div className="font-bold text-foreground">Next.js Frontend &amp; API Server</div>
                      <div className="text-xs text-muted font-mono font-medium">http://localhost:3000</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <div>
                      <div className="font-bold text-foreground">API v1 Marshrutlari</div>
                      <div className="text-xs text-muted font-mono font-medium">/api/v1/*</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">200 OK</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <div>
                      <div className="font-bold text-foreground">NestJS Standalone API</div>
                      <div className="text-xs text-muted font-mono font-medium">http://localhost:4000/api/v1</div>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-full">Tayyor</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-border">
                    <div>
                      <div className="font-bold text-foreground">Prisma PostgreSQL Sxemasi</div>
                      <div className="text-xs text-muted font-mono font-medium">schema.prisma</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">Sinxron</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Edit / Create Modal */}
      <ProductEditModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={handleProductSaved}
      />
    </div>
  );
}
