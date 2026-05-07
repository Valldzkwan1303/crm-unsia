import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react'; // MapPin dihapus karena tidak dipakai

const BtsLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#002855] text-white transition-all duration-500 flex flex-col shadow-2xl z-50`}>
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl">U</div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter uppercase">BTS <span className="text-blue-400">Portal</span></span>}
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="/bts/dashboard" className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${location.pathname === '/bts/dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:bg-white/5'}`}>
            <LayoutDashboard size={20}/>
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest text-left">Dashboard</span>}
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button type="button" title="Keluar dari sistem" onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-red-400 transition-colors">
            <LogOut size={20}/>
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col max-h-screen overflow-hidden text-left">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8">
          {/* FIX: Tambahkan title agar tidak error merah */}
          <button type="button" title="Toggle Sidebar" onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <Menu size={20}/>
          </button>
          <div className="flex items-center gap-3">
             <div className="text-right"><p className="text-[10px] font-black uppercase text-[#002855]">{localStorage.getItem('userName')}</p><p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Petugas Lapangan</p></div>
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200"><User size={20}/></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default BtsLayout;