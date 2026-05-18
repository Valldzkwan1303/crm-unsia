import { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, GraduationCap, Layers,
  UserCheck, School, Building2, ChevronRight, LogOut, Menu, Bell, User, X, Search
} from 'lucide-react';
import api from '../api/axios';
import LogoUnsia from '../assets/logounsia.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin', avatar: '' });

  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) navigate('/login');

      const [meRes, notifRes] = await Promise.all([
        api.get('/me'),
        api.get('/notifications/counts')
      ]);

      setUserData({
        name: meRes.data.name,
        avatar: meRes.data.avatar_url || ''
      });

      setNotifCount(notifRes.data.unread_count);
      setNotifs(notifRes.data.list || []);
    } catch (e) {
      console.error("Gagal sinkronisasi data");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'CRM Leads', icon: <Users size={20} />, path: '/admin/crm' },
    { name: 'Kanal', icon: <Layers size={20} />, path: '/admin/kanal' },
    { name: 'Agent', icon: <Briefcase size={20} />, path: '/admin/agen' },
    { name: 'SGS', icon: <GraduationCap size={20} />, path: '/admin/sgs' },
    { name: 'EGS', icon: <UserCheck size={20} />, path: '/admin/egs' },
    { name: 'BTS', icon: <School size={20} />, path: '/admin/bts' },
    { name: 'Kerjasama', icon: <Building2 size={20} />, path: '/admin/b2b' },
  ];

  const currentPage = menuItems.find(m => location.pathname.startsWith(m.path))?.name ?? 'Dashboard';

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Logo Header */}
      <div className={`h-20 flex items-center ${sidebarOpen ? 'px-6 justify-start' : 'px-0 justify-center'} border-b border-slate-100/80 gap-3 shrink-0 transition-all duration-300`}>
        <img src={LogoUnsia} alt="UNSIA Logo" className={`${sidebarOpen ? 'h-10' : 'h-8'} w-auto object-contain transition-all duration-300`} />
        {sidebarOpen && (
          <div className="animate-in fade-in flex flex-col justify-center">
            <p className="text-sm font-black tracking-tighter text-[#002855] leading-none mb-1">UNSIA</p>
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] leading-none">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); onNavigate?.(); }}
              title={!sidebarOpen ? item.name : undefined}
              className={`
                w-full flex items-center gap-4 py-3.5 rounded-full transition-all duration-200 group relative mb-2
                ${isActive
                  ? 'bg-[#002855] text-white shadow-lg shadow-blue-900/20'
                  : 'text-slate-500 hover:bg-blue-50 hover:text-[#002855]'
                }
                ${sidebarOpen ? 'px-5' : 'px-0 justify-center'}
              `}
            >
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="text-sm font-bold flex-1 text-left truncate">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-slate-100/80">
        <button
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          title={!sidebarOpen ? "Sign Out" : undefined}
          className={`flex items-center gap-4 w-full py-3.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold text-xs uppercase tracking-widest ${sidebarOpen ? 'px-5' : 'px-0 justify-center'}`}
        >
          <LogOut size={20} />
          {sidebarOpen && 'Sign Out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">

      {/* ── SIDEBAR DESKTOP ── */}
      <aside
        className={`
          hidden md:flex flex-col bg-white border-r border-slate-100 transition-all duration-300 z-50 shrink-0
          ${sidebarOpen ? 'w-[280px]' : 'w-24'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE DRAWER BACKDROP ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-[70] flex flex-col
          transition-transform duration-300 md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* TOPBAR — Glassmorphism */}
        <header className="h-20 flex items-center justify-between px-6 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-40 shrink-0 transition-all">

          <div className="flex items-center gap-4">
            {/* Hamburger (mobile) / Toggle sidebar (desktop) */}
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

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-xs font-black text-[#002855] uppercase tracking-widest">{currentPage}</span>
            </div>


          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm relative"
              >
                <Bell size={20} />
                {notifCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10"></span>
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></span>
                  </>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/80 flex items-center justify-between">
                    <h4 className="font-black text-[#002855] text-xs uppercase tracking-widest">Notifikasi</h4>
                    {notifCount > 0 && (
                      <span className="text-[9px] font-black bg-red-100 text-red-600 px-2.5 py-1 rounded-full">{notifCount} Baru</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar">
                    {notifs.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-400 italic font-medium">Tidak ada notifikasi baru saat ini.</p>
                    ) : notifs.map((n, i) => (
                      <div key={i} className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-blue-600 mb-1">{n.title}</p>
                        <p className="text-xs text-slate-600 font-medium">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wide">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div
              onClick={() => navigate('/admin/settings')}
              className="flex items-center gap-3 cursor-pointer group pl-4 border-l border-slate-200/60"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#002855] group-hover:text-blue-600 transition-colors leading-none">{userData.name}</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1">Administrator</p>
              </div>
              <div className="w-11 h-11 rounded-full border-2 border-blue-100 shadow-sm overflow-hidden bg-blue-50 flex items-center justify-center group-hover:border-blue-400 transition-all p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {userData.avatar
                      ? <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      : <User size={20} className="text-blue-400" />
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
    </div>
  );
};

export default AdminLayout;
