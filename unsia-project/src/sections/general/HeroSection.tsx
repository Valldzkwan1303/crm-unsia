import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button'; 

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative pt-48 pb-36 overflow-hidden bg-[#001A33] text-white">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03] hero-grid-pattern"></div>
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center animate-in fade-in duration-1000">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-white/10 mb-10">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Cyber University No. 1 Indonesia
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter">
          Kuliah <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white italic">Full Online</span><br/>Hanya di UNSIA
        </h1>
        <p className="max-w-3xl mx-auto text-blue-100/70 text-base md:text-xl leading-relaxed mb-12 font-medium italic">"Menghadirkan pendidikan tinggi siber berkualitas dunia yang fleksibel, terjangkau, dan diakui secara global."</p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
          <Button className="rounded-full px-12 py-5 uppercase tracking-[0.2em] text-[11px]" onClick={() => navigate('/join')}>Daftar Sekarang <ArrowRight size={16} /></Button>
          <Button variant="outline" className="rounded-full px-12 py-5 bg-white/5 border border-white/20 text-white backdrop-blur-md uppercase tracking-[0.2em] text-[11px]">Konsultasi Admin</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 text-left">
          <div className="lg:col-span-8 group relative aspect-video bg-[#001A33] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all cursor-pointer"><Play fill="white" size={32} className="ml-1" /></div>
            </div>
            <div className="absolute bottom-8 left-10"><span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">Video Profil</span><h4 className="font-black text-2xl tracking-tight text-white uppercase">Masa Depan Digital</h4></div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6 text-center">
            <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 flex flex-col justify-center items-center"><h3 className="text-5xl font-black text-blue-400 mb-2 tracking-tighter">95%</h3><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Lulusan Langsung Kerja</p></div>
            <div className="flex-1 bg-blue-600 rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-xl"><h3 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Akreditasi A</h3><p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 italic">BAN-PT Indonesia</p></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30"><ChevronDown size={32} /></div>
    </section>
  );
}