import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCircle, Mail, Database,
  LogOut, Menu, User, Bell, ChevronRight, GraduationCap, Briefcase
} from 'lucide-react';
import api from '../api/axios';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({ name: 'Admin', avatar: '' });

  
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);

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
        avatar: meRes.data.avatar ? `http://127.0.0.1:8000/storage/${meRes.data.avatar}` : ''
      });

      setNotifCount(notifRes.data.unread_count);
      setNotifs(notifRes.data.list || []);
    } catch (e) {
      console.error("Gagal sinkronisasi data");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000); // Polling notif tiap 20 detik
    return () => clearInterval(interval);
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Kanal Pendaftaran', icon: <Database size={20} />, path: '/admin/kanal' },
    { name: 'CRM Leads', icon: <Users size={20} />, path: '/admin/crm' },
    { name: 'Mitra Umum', icon: <UserCircle size={20} />, path: '/admin/agen' },
    { name: 'Ambassador SGS', icon: <GraduationCap size={20} />, path: '/admin/sgs' },
    { name: 'Ambassador EGS', icon: <Briefcase size={20} />, path: '/admin/egs' },
    { name: 'Email Marketing', icon: <Mail size={20} />, path: '/admin/email' },
    // { name: 'Data Master', icon: <ShieldCheck size={20} />, path: '/admin/referensi' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-100 transition-all duration-500 flex flex-col z-50 shadow-sm`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-50 gap-4">
          <div className="w-10 h-10 bg-[#002855] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/10">
            <span className="text-white font-black text-lg italic">U</span>
          </div>
          {sidebarOpen && (
            <div className="animate-in fade-in">
              <p className="text-base font-black tracking-tighter text-[#002855]">UNSIA MARK</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Management</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 group ${isActive ? 'bg-[#002855] text-white shadow-2xl shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-50 hover:text-[#002855]'}`}>
                {item.icon}
                {sidebarOpen && <span className="text-sm font-bold flex-1 text-left">{item.name}</span>}
                {isActive && sidebarOpen && <ChevronRight size={14} className="opacity-40" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-4 w-full px-6 py-4 rounded-[2rem] text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest"><LogOut size={18} /> {sidebarOpen && 'Sign Out'}</button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b border-slate-50 sticky top-0 z-40 shadow-sm">
          {/* Cari bagian header di dalam AdminLayout.tsx dan pastikan tombol menu seperti ini: */}

          <button
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#002855] transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-8">
            {/* DROPDOWN NOTIFIKASI */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all relative">
                <Bell size={20} />
                {notifCount > 0 && <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-bounce">{notifCount}</span>}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95">
                  <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                    <h4 className="font-black text-[#002855] text-xs uppercase tracking-widest">Pemberitahuan</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar">
                    {notifs.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-400 italic font-medium">Tidak ada notifikasi baru.</p>
                    ) : notifs.map((n, i) => (
                      <div key={i} className="p-5 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-blue-600 mb-1">{n.title}</p>
                        <p className="text-xs text-[#002855] font-medium">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div onClick={() => navigate('/admin/settings')} className="flex items-center gap-4 cursor-pointer group pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#002855] group-hover:text-blue-600 transition-colors">{userData.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center group-hover:border-blue-500 transition-all">
                {userData.avatar ? <img src={userData.avatar} alt="P" className="w-full h-full object-cover" /> : <User size={20} className="text-slate-300" />}
              </div>
            </div>
          </div>
        </header>
        <main className="p-10 overflow-y-auto no-scrollbar"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;