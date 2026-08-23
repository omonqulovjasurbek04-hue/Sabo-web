import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Factory,
  Info,
  Award,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Languages,
  Search,
  CreditCard,
  Bell,
  Shield,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  submenu?: { title: string; path: string }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    title: 'Mahsulotlar',
    path: '/products',
    icon: Package,
    badge: '18',
    submenu: [
      { title: 'Barcha mahsulotlar', path: '/products' },
      { title: 'Kategoriyalar', path: '/products/categories' },
    ],
  },
  {
    title: 'Buyurtmalar',
    path: '/orders',
    icon: ShoppingCart,
    badge: '42',
    badgeColor: 'bg-[#E63946]',
  },
  { title: 'Mijozlar', path: '/customers', icon: Users },
  { title: 'Ishlab chiqarish', path: '/production', icon: Factory },
  { title: 'Biz haqimizda', path: '/about', icon: Info },
  { title: 'Sertifikatlar', path: '/certificates', icon: Award },
  { title: 'Blog & Yangiliklar', path: '/blog', icon: BookOpen },
  {
    title: 'Xabarlar',
    path: '/messages',
    icon: MessageSquare,
    badge: '3',
    badgeColor: 'bg-[#E63946]',
  },
  { title: 'Media kutubxona', path: '/media', icon: ImageIcon },
  { title: 'Tarjimalar (UZ/RU/EN)', path: '/translations', icon: Languages },
  { title: 'SEO Sozlamalari', path: '/seo', icon: Search },
  { title: 'To‘lovlar (Click/Payme)', path: '/payments', icon: CreditCard },
  { title: 'Bildirishnomalar', path: '/notifications', icon: Bell },
  { title: 'Foydalanuvchilar & Rollar', path: '/users', icon: Shield },
  { title: 'Audit jurnallari', path: '/audit-logs', icon: FileText },
  { title: 'Tizim sozlamalari', path: '/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:3000';
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0E3B2E] text-white flex flex-col justify-between z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-[#1B4D3E] shadow-2xl overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header / Brand */}
          <div className="p-6 border-b border-[#1B4D3E]/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-[#D8F3DC] text-[#0E3B2E] flex items-center justify-center font-extrabold text-xl shadow-md">
                S
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block">
                  SABO Dairy
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#88D49E]">
                  Admin Dashboard
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuExpanded = openSubmenu === item.title || isActive;

              return (
                <div key={item.title}>
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2D6A4F] text-white shadow-sm'
                          : 'text-[#C7DFD7] hover:bg-[#164739] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4 shrink-0 text-[#88D49E]" />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.badgeColor || 'bg-white/20 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={`size-3.5 transition-transform ${
                            isSubmenuExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                        isActive
                          ? 'bg-[#2D6A4F] text-white shadow-sm'
                          : 'text-[#C7DFD7] hover:bg-[#164739] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4 shrink-0 text-[#88D49E]" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-white/20 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Submenu rendering */}
                  {hasSubmenu && isSubmenuExpanded && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      {item.submenu?.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.title}
                            to={sub.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                              isSubActive
                                ? 'bg-white/15 text-white font-bold'
                                : 'text-[#A3C9BD] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Profile Card & Logout */}
          <div className="p-4 border-t border-[#1B4D3E]/80 bg-[#0A2E24]/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  {user?.name.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">
                    {user?.name || 'Bekzodbek'}
                  </div>
                  <div className="text-[10px] font-semibold text-[#88D49E]">
                    Bosh Administrator
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Tizimdan chiqish"
                className="p-1.5 rounded-lg text-red-300 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </div>

            {/* Logout / Exit Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white text-xs font-bold transition-all cursor-pointer mb-2"
            >
              <LogOut className="size-3.5" />
              <span>Admindan chiqish</span>
            </button>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-[#D8F3DC] transition-colors"
            >
              <span>Asosiy do'kon sayti</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <header className="h-18 bg-white/80 backdrop-blur-md border-b border-[#EBE3DA] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#EBE3DA] bg-white text-[#1A2E26] hover:bg-[#F5EFEB]"
            >
              <Menu className="size-5" />
            </button>

            {/* Breadcrumb / Status */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#52796F]">
              <span>SABO</span>
              <ChevronRight className="size-3.5 text-muted" />
              <span className="text-[#0E3B2E] font-bold">Admin Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF7EE] text-[#0E3B2E] text-xs font-bold border border-[#D8F3DC]">
              <span className="size-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              <span>Backend API: Online</span>
            </div>

            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl border border-[#EBE3DA] bg-white text-[#1A2E26] hover:bg-[#F5EFEB] transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-[#E63946] rounded-full ring-2 ring-white" />
            </Link>

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#EBE3DA]">
              <div className="size-8 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center font-bold text-xs">
                B
              </div>
              <span className="text-xs font-bold text-[#1A2E26]">Bekzodbek</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors cursor-pointer ml-1"
              title="Admindan chiqish va asosiy saytga o'tish"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Admindan chiqish</span>
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
