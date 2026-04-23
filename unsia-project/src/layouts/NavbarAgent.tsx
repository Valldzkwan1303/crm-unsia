import { useState, useEffect } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NavbarAgent({ agentName, agentCode, source }: { agentName?: string, agentCode?: string, source?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#002855] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">U</div>
          <div className="flex flex-col leading-none">
            <span className={`font-black text-lg tracking-tighter ${isScrolled ? 'text-[#002855]' : 'text-white'}`}>UNSIA <span className="text-blue-500">MARK</span></span>
            <span className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-1 ${isScrolled ? 'text-blue-600' : 'text-blue-400'}`}>
              Partner: {agentName || 'Official'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* LOGIN: Bawa 'ref' agar jika klik 'Kembali' di login page, tidak nyasar ke pusat */}
          <button
            type="button"
            onClick={() => navigate(agentCode ? `/login?ref=${agentCode}` : '/login')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isScrolled ? 'text-[#002855] hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          >
            <LogIn size={14} className="inline mr-2" /> Login
          </button>

          {/* DAFTAR: Bawa 'ref' dan 'src' (TRACKING MEDSOS AKTIF) */}
          <button
            type="button"
            onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#002855] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <UserPlus size={14} /> Daftar Kuliah
          </button>
        </div>
      </div>
    </nav>
  );
}