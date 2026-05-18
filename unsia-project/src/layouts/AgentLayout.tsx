import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Wallet, HelpCircle, LogOut, Menu, Bell,
  X, ChevronRight, FileText, AlertCircle, ShieldCheck
} from 'lucide-react';
import api from '../api/axios';
import ChatWidget from '../components/ChatWidget';
import LogoUnsia from '../assets/logounsia.png';

/* ─────────────────────────────────────────────
   MENU ITEMS — path dipertahankan 100%
───────────────────────────────────────────── */
const menuItems = [
  { name: 'Dashboard',     icon: LayoutDashboard, path: '/agent/dashboard' },
  { name: 'Keuangan',      icon: Wallet,           path: '/agent/finance'   },
  { name: 'Materi Promo',  icon: FileText,         path: '/agent/tools'     },
  { name: 'Pusat Bantuan', icon: HelpCircle,       path: '/agent/help'      },
];

/* ─────────────────────────────────────────────
   HELPER – Inisial nama untuk avatar fallback
───────────────────────────────────────────── */
const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const AgentLayout = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const notifRef  = useRef<HTMLDivElement>(null);

  /* UI State */
  const [sidebarOpen,       setSidebarOpen]       = useState(true);
  const [mobileOpen,        setMobileOpen]        = useState(false);
  const [showLogoutModal,   setShowLogoutModal]   = useState(false);
  const [showNotif,         setShowNotif]         = useState(false);

  /* Data State */
  const [userData,  setUserData]  = useState({ name: 'Partner', avatar: '' });
  const [notifCount, setNotifCount] = useState(0);
  const [notifs,    setNotifs]    = useState<any[]>([]);

  /* ── Fetch user + notif ── */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const [meRes, notifRes] = await Promise.all([
        api.get('/me'),
        api.get('/notifications/counts'),
      ]);

      setUserData({
        name:   meRes.data.name ?? 'Partner',
        avatar: meRes.data.avatar_url ?? '',
      });
      setNotifCount(notifRes.data.unread_count ?? 0);
      setNotifs(notifRes.data.list ?? []);
    } catch {
      /* silent — user tetap bisa browse */
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, []);

  /* ── Tutup notif jika klik di luar ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Logout ── */
  const handleLogoutAction = () => {
    localStorage.clear();
    navigate('/login');
  };

  /* ── Current page label untuk breadcrumb ── */
  const currentPage = menuItems.find(m =>
    location.pathname === m.path || location.pathname.startsWith(m.path + '/')
  )?.name ?? 'Dashboard';

  /* ════════════════════════════════════════
     SIDEBAR CONTENT (shared desktop & mobile)
  ════════════════════════════════════════ */
  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">

      {/* ── Logo Header ── */}
      <div
        className={`
          h-[72px] flex items-center gap-3 shrink-0 border-b border-slate-100/80
          transition-all duration-300
          ${sidebarOpen ? 'px-6 justify-start' : 'px-0 justify-center'}
        `}
      >
        <img
          src={LogoUnsia}
          alt="UNSIA Logo"
          className={`object-contain transition-all duration-300 ${sidebarOpen ? 'h-9' : 'h-8'} w-auto`}
        />
        {sidebarOpen && (
          <div className="animate-in fade-in flex flex-col justify-center leading-none">
            <p className="text-sm font-black tracking-tighter text-[#002855]">UNSIA</p>
            <p className="text-[8.5px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-0.5">
              Partner Portal
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon     = item.icon;
          const isActive = location.pathname === item.path
            || location.pathname.startsWith(item.path + '/');

          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onNavigate?.(); }}
              title={!sidebarOpen ? item.name : undefined}
              className={`
                w-full flex items-center gap-3.5 py-3 rounded-full transition-all duration-200 group
                ${isActive
                  ? 'bg-[#002855] text-white shadow-lg shadow-blue-900/25'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-[#002855]'
                }
                ${sidebarOpen ? 'px-5' : 'px-0 justify-center'}
              `}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'
                }`}
              />
              {sidebarOpen && (
                <span className="text-sm font-bold flex-1 text-left truncate">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Sign Out ── */}
      <div className="p-3 border-t border-slate-100/80 shrink-0">
        <button
          onClick={() => setShowLogoutModal(true)}
          title={!sidebarOpen ? 'Keluar' : undefined}
          className={`
            flex items-center gap-3.5 w-full py-3 rounded-full
            text-slate-400 hover:text-rose-500 hover:bg-rose-50
            transition-all font-bold text-xs uppercase tracking-widest
            ${sidebarOpen ? 'px-5' : 'px-0 justify-center'}
          `}
        >
          <LogOut size={20} className="shrink-0" />
          {sidebarOpen && 'Keluar'}
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">

      {/* ── SIDEBAR — DESKTOP ── */}
      <aside
        className={`
          hidden md:flex flex-col bg-white border-r border-slate-100 shadow-sm
          transition-all duration-300 z-50 shrink-0
          ${sidebarOpen ? 'w-[264px]' : 'w-[76px]'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER BACKDROP ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR — MOBILE DRAWER ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[264px] bg-white shadow-2xl z-[70] flex flex-col
          transition-transform duration-300 md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors z-10"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ════════════════
            TOPBAR / NAVBAR
        ════════════════ */}
        <header className="h-[72px] flex items-center justify-between px-5 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-40 shrink-0">

          {/* LEFT: toggle + breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Toggle: hamburger on mobile, collapse icon on desktop */}
            <button
              title="Toggle Sidebar"
              onClick={() => {
                if (window.innerWidth < 768) setMobileOpen(!mobileOpen);
                else setSidebarOpen(!sidebarOpen);
              }}
              className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-xl text-slate-400 hover:text-[#002855] transition-all shadow-sm"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Agent
              </span>
              <ChevronRight size={13} className="text-slate-300" />
              <span className="text-[10px] font-black text-[#002855] uppercase tracking-widest">
                {currentPage}
              </span>
            </div>
          </div>

          {/* RIGHT: bell + profile */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* ── NOTIFICATION BELL ── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                title="Notifikasi"
                className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm relative"
              >
                <Bell size={20} />
                {notifCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-70" />
                  </>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                    <h4 className="font-black text-[#002855] text-xs uppercase tracking-widest">
                      Notifikasi
                    </h4>
                    {notifCount > 0 && (
                      <span className="text-[9px] font-black bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                        {notifCount} Baru
                      </span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar">
                    {notifs.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-400 italic font-medium">
                        Tidak ada notifikasi baru.
                      </p>
                    ) : notifs.map((n, i) => (
                      <div
                        key={i}
                        className="px-5 py-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                      >
                        <p className="text-xs font-bold text-blue-600 mb-0.5">{n.title}</p>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wide">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── PROFILE AREA ── */}
            <div
              onClick={() => navigate('/agent/settings')}
              className="flex items-center gap-3 cursor-pointer group pl-3 md:pl-4 border-l border-slate-200/60"
            >
              {/* Name + badge */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#002855] group-hover:text-blue-600 transition-colors leading-none">
                  {userData.name}
                </p>
                {/* Verified Partner badge */}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <ShieldCheck size={10} className="text-emerald-500 shrink-0" />
                  <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-wider">
                    Partner Resmi
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full border-2 border-blue-100 shadow-sm overflow-hidden bg-blue-50 flex items-center justify-center group-hover:border-blue-400 transition-all shrink-0 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#002855] flex items-center justify-center">
                  {userData.avatar
                    ? <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    : <span className="text-[11px] font-black text-white select-none">
                        {getInitials(userData.name)}
                      </span>
                  }
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-10 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={44} />
            </div>
            <h3 className="text-2xl font-black text-[#002855] mb-2 tracking-tight">Keluar Sistem?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              Apakah Anda yakin ingin mengakhiri sesi ini? Anda perlu login kembali untuk mengakses panel mitra.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-slate-100 py-4 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogoutAction}
                className="w-full bg-red-600 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <ChatWidget mode="agent" userName={userData.name} />
    </div>
  );
};

export default AgentLayout;