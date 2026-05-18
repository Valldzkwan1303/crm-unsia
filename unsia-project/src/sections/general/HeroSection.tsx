import { useState } from 'react';
import { ArrowRight, Play, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

export default function HeroSection() {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <section id="beranda" className="relative pt-48 pb-36 overflow-hidden bg-gradient-to-b from-[#EEF4FF] to-white">
        {/* Dekoratif latar — light & subtle */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Mesh gradient orbs */}
          <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-100/60 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-slate-100/80 blur-[100px] rounded-full"></div>
          <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] bg-blue-50/70 blur-[80px] rounded-full"></div>
          {/* Cyber dot pattern overlay */}
          <div className="absolute inset-0 dot-pattern opacity-40"></div>
          {/* Floating geometric rings */}
          <div className="absolute top-16 right-[8%] w-40 h-40 rounded-full border border-blue-200/30"></div>
          <div className="absolute top-24 right-[9%] w-24 h-24 rounded-full border border-blue-300/20"></div>
          <div className="absolute bottom-20 left-[5%] w-28 h-28 rounded-full border border-blue-200/20"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center animate-in fade-in duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-blue-100 text-blue-700 mb-10">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Cyber University No. 1 Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter text-[#002855]">
            Kuliah <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#002855] via-blue-600 to-blue-400 italic">Full Online</span><br />Hanya di UNSIA
          </h1>

          {/* Tagline */}
          <p className="max-w-3xl mx-auto text-slate-500 text-base md:text-xl leading-relaxed mb-12 font-normal italic">"Menghadirkan pendidikan tinggi siber berkualitas dunia yang fleksibel, terjangkau, dan diakui secara global."</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10">
            <Button className="rounded-full px-12 py-5 uppercase tracking-[0.2em] text-[11px] transition-all duration-500" onClick={() => navigate('/join')}>Daftar Sekarang <ArrowRight size={16} /></Button>
            <Button variant="outline" className="rounded-full px-12 py-5 border border-[#002855]/20 text-[#002855] hover:bg-blue-50 backdrop-blur-md uppercase tracking-[0.2em] text-[11px] transition-all duration-500" onClick={() => scrollTo('konsultasi')}>Konsultasi Admin</Button>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-6 mb-24 opacity-80 scale-90 md:scale-100">
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Logo_BAN-PT.png" alt="BAN-PT" className="h-8 object-contain" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#002855]">Terakreditasi</p>
                <p className="text-[11px] font-bold text-slate-500">BAN-PT</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center bg-blue-50">
                <span className="text-[10px] font-black text-blue-600">ISO</span>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#002855]">Sertifikasi</p>
                <p className="text-[11px] font-bold text-slate-500">ISO 9001:2015</p>
              </div>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 text-left">
            {/* Video Box — klik untuk buka modal */}
            <div
              className="lg:col-span-8 group relative aspect-video bg-[#002855] rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-200/50 cursor-pointer"
              onClick={() => setIsVideoOpen(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white text-[#002855] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all border border-blue-100">
                  <Play fill="#002855" size={32} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-8 left-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-2 block">Video Profil</span>
                <h4 className="font-black text-2xl tracking-tight text-white uppercase">Masa Depan Digital</h4>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="lg:col-span-4 flex flex-col gap-6 text-center">
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 flex flex-col justify-center items-center">
                <h3 className="text-5xl font-black text-[#002855] mb-2 tracking-tighter">95%</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Lulusan Langsung Kerja</p>
              </div>
              <div className="flex-1 bg-[#002855] rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-xl shadow-blue-900/20">
                <h3 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Akreditasi A</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 italic">BAN-PT Indonesia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-300"><ChevronDown size={32} /></div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-all"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Tutup video"
            >
              <X size={20} />
            </button>
            {/* iframe placeholder — ganti src dengan URL video resmi UNSIA */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <iframe
                src="https://www.youtube.com/embed/sEexOWf8iGo?autoplay=1&rel=0"
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Video Profil UNSIA — Masa Depan Digital"
              />
            </div>
            <p className="text-white/40 text-center text-xs mt-3 font-medium">Klik di luar video untuk menutup</p>
          </div>
        </div>
      )}
    </>
  );
}
