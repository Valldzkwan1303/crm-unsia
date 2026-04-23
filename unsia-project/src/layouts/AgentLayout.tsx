import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, HelpCircle, LogOut, Menu, User, Bell, AlertCircle, FileText 
} from 'lucide-react';
import api from '../api/axios';
import ChatWidget from '../components/ChatWidget';

const AgentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({ name: 'Partner', avatar: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // State Notifikasi
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

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
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Sinkronisasi notif tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const handleLogoutAction = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/agent/dashboard' },
    { name: 'Keuangan', icon: <Wallet size={20} />, path: '/agent/finance' },
    { name: 'Materi Promo', icon: <FileText size={20} />, path: '/agent/tools' },
    { name: 'Pusat Bantuan', icon: <HelpCircle size={20} />, path: '/agent/help' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className={`fixed h-full bg-white border-r border-slate-100 transition-all duration-500 z-50 flex flex-col ${sidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-50 gap-4 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <span className="text-white font-black italic text-xl">U</span>
          </div>
          {sidebarOpen && (
            <div className="animate-in fade-in">
              <p className="text-base font-black text-[#002855]">UNSIA PARTNER</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Portal Agen</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar flex flex-col">
          <div className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button 
                  key={item.path} 
                  onClick={() => navigate(item.path)} 
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 group ${
                    isActive ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="text-sm font-bold flex-1 text-left">{item.name}</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-50 mt-auto">
            <button 
                onClick={() => setShowLogoutModal(true)} 
                className="flex items-center gap-4 w-full px-6 py-4 rounded-[2rem] text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest"
            >
                <LogOut size={18} /> 
                {sidebarOpen && 'Keluar'}
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${sidebarOpen ? 'pl-72' : 'pl-24'}`}>
        <header className="h-24 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50">
          <button title="Menu" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-8">
            {/* NOTIFIKASI DROPDOWN */}
            <div className="relative">
                <button 
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all relative" 
                  title="Notifikasi"
                >
                    <Bell size={20} />
                    {notifCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
                </button>
                {showNotifDropdown && (
                    <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                            <h4 className="font-black text-[#002855] text-xs uppercase tracking-widest">Kabar Terbaru</h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto no-scrollbar">
                            {notifs.length === 0 ? (
                                <p className="p-8 text-center text-xs text-slate-400 italic font-medium">Tidak ada notifikasi baru.</p>
                            ) : notifs.map((n, i) => (
                                <div key={i} className="p-5 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                    <p className="text-xs font-bold text-blue-600 mb-1">{n.title}</p>
                                    <p className="text-xs text-[#002855] font-medium leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{n.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div onClick={() => navigate('/agent/settings')} className="flex items-center gap-4 cursor-pointer group pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#002855] group-hover:text-blue-600 transition-colors">{userData.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Partner Resmi</p>
              </div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center transition-all group-hover:border-blue-500">
                {userData.avatar ? <img src={userData.avatar} alt="P" className="w-full h-full object-cover" /> : <User size={20} className="text-slate-300"/>}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </main>
      </div>

      {/* POPUP MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={44} />
            </div>
            <h3 className="text-2xl font-black text-[#002855] mb-2 tracking-tight">Keluar Sistem?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">Apakah Anda yakin ingin mengakhiri sesi ini? Anda perlu login kembali untuk mengakses panel agen.</p>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="w-full bg-slate-100 py-4 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Batal</button>
                <button onClick={handleLogoutAction} className="w-full bg-red-600 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all">Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      <ChatWidget mode="agent" userName={userData.name} />
    </div>
  );
};

export default AgentLayout;