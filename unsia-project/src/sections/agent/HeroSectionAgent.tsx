import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSectionAgent({ agentCode, agentName, source }: any) {
  const navigate = useNavigate();

  return (
    <section className="relative pt-48 pb-32 bg-slate-950 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center md:text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">U</div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Konsultan: {agentName}</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter">
            Kuliah Online <br /> <span className="text-blue-500 italic">Masa Depan</span> Digital.
          </h1>

          <div className="flex flex-col sm:flex-row gap-5">
            {/* Tombol DAFTAR UTAMA */}
            <button
              onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-900/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
            >
              Daftar Kuliah Sekarang <ChevronRight size={20} />
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
              Pelajari Program
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}