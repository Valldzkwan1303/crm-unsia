import { useState, useEffect } from 'react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoUnsia from '../assets/logounsia.png';

export default function NavbarAgent({
  agentName,
  agentCode,
  source,
}: {
  agentName?: string;
  agentCode?: string;
  source?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md shadow-slate-100 py-3 border-b border-slate-100'
          : 'bg-white/70 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex justify-between items-center">

        {/* LEFT — Logo + brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={LogoUnsia} alt="UNSIA" className="h-9 w-auto object-contain" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-base tracking-tighter text-[#002855]">
              UNSIA
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-500 mt-0.5">
              Partner Portal
            </span>
          </div>
        </div>

        {/* CENTER — partner badge (hidden mobile) */}
        {agentName && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
              {agentName}
            </span>
          </div>
        )}

        {/* RIGHT — actions (referral params preserved) */}
        <div className="flex items-center gap-2">
          {/* LOGIN — membawa ref agar redirect kembali ke landing agent */}
          <button
            type="button"
            onClick={() => navigate(agentCode ? `/login?ref=${agentCode}` : '/login')}
            className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-slate-600 hover:text-[#002855] hover:bg-slate-100"
          >
            <LogIn size={13} className="inline mr-1.5" />
            Login
          </button>

          {/* DAFTAR — membawa ref + src untuk tracking */}
          <button
            type="button"
            onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#002855] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <UserPlus size={13} />
            Daftar Kuliah
          </button>
        </div>
      </div>
    </nav>
  );
}