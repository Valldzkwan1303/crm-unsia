import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, HelpCircle, LogOut, Menu, User, Bell, FileText 
} from 'lucide-react';
import api from '../api/axios';

const SgsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({ name: 'Ambassador', avatar: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    const fetchUser = async () => {
        try {
            const res = await api.get('/me');
            setUserData({ name: res.data.name, avatar: res.data.avatar ? `http://127.0.0.1:8000/storage/${res.data.avatar}` : '' });
        } catch (e) { console.error(e); }
    };
    fetchUser();
  }, [navigate]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/sgs/dashboard' },
    { name: 'Materi Promo', icon: <FileText size={20} />, path: '/sgs/tools' },
    { name: 'Bantuan', icon: <HelpCircle size={20} />, path: '/sgs/help' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-100 transition-all duration-500 flex flex-col z-50`}>
        <div className="h-24 flex items-center px-8 border-b border-slate-50 gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <GraduationCap className="text-white" size={24} />
          </div>
          {sidebarOpen && <div className="animate-in fade-in"><p className="text-base font-black text-[#002855]">SGS PORTAL</p><p className="text-[9px] text-slate-400 font-bold uppercase">Ambassador</p></div>}
        </div>
        <nav className="flex-1 px-4 py-8 space-y-1.5 flex flex-col">
          <div className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}>
                {item.icon}
                {sidebarOpen && <span className="text-sm font-bold">{item.name}</span>}
              </button>
            ))}
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-4 w-full px-6 py-4 rounded-[2rem] text-slate-400 hover:text-red-500 transition-all font-bold text-xs uppercase"><LogOut size={18} /> {sidebarOpen && 'Keluar'}</button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 flex items-center justify-between px-10 bg-white border-b border-slate-50">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all" title="Menu"><Menu size={20} /></button>
          <div className="flex items-center gap-6">
            <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 relative" title="Notif"><Bell size={20} /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span></button>
            <div onClick={() => navigate('/sgs/settings')} className="flex items-center gap-4 cursor-pointer border-l pl-6">
              <div className="text-right hidden sm:block"><p className="text-sm font-black text-[#002855]">{userData.name}</p><p className="text-[10px] text-indigo-600 font-bold uppercase">Mahasiswa Aktif</p></div>
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                {userData.avatar ? <img src={userData.avatar} alt="P" className="w-full h-full object-cover" /> : <User size={20} className="text-slate-300"/>}
              </div>
            </div>
          </div>
        </header>
        <main className="p-10 overflow-y-auto no-scrollbar"><Outlet /></main>
      </div>
    </div>
  );
};

export default SgsLayout;