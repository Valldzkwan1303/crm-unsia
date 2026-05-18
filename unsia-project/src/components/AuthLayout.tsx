import React from 'react';
import { ArrowLeft, Shield, Award, Users, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoUnsia from '../assets/logounsia.png';
import latarUnsia from '../assets/latarunsia.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backTo?: string;
}

const AuthLayout = ({ children, title, subtitle, backTo = "/" }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Inline keyframe styles ── */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes float-mid {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes shine {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .stat-card-0 { animation: float-slow 5s ease-in-out infinite; }
        .stat-card-1 { animation: float-mid  5s ease-in-out infinite 0.8s; }
        .stat-card-2 { animation: float-fast 5s ease-in-out infinite 1.6s; }

        /* Cyber dot-pattern for right side */
        .cyber-dots {
          background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px);
          background-size: 22px 22px;
        }

        /* Shine sweep on button */
        .btn-shine {
          background-size: 200% auto;
          background-image: linear-gradient(
            135deg,
            #002855 0%,
            #1d4ed8 40%,
            #3b82f6 50%,
            #1d4ed8 60%,
            #002855 100%
          );
          transition: background-position 0.6s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-shine:hover:not(:disabled) {
          background-position: right center;
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 40, 85, 0.35);
        }
        .btn-shine:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>

      <div className="min-h-screen flex font-sans overflow-hidden">

        {/* ══ SISI KIRI — Visual Kampus ══ */}
        <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden">

          {/* Gambar Latar Kampus */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${latarUnsia})` }}
          />

          {/* Overlay gradasi navy dari atas */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#002855]/70 via-[#002855]/40 to-transparent" />

          {/* Vignette / gradasi hitam dari bawah – agar footer teks kontras */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Dot-pattern cyber overlay */}
          <div className="absolute inset-0 dot-pattern opacity-20" />

          {/* Decorative floating rings */}
          <div className="absolute top-16 right-16 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute bottom-24 left-12 w-36 h-36 rounded-full border border-blue-400/20 pointer-events-none" />

          {/* Konten kiri */}
          <div className="relative z-10 p-12 flex flex-col h-full justify-between">

            {/* Logo & Tombol Kembali */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center drop-shadow-xl">
                  <img src={logoUnsia} alt="Logo UNSIA" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-black text-white text-lg tracking-tight leading-none block">UNSIA</span>
                  <span className="font-bold text-blue-300 text-[9px] tracking-[0.2em] uppercase leading-none">Cyber University</span>
                </div>
              </div>
              <button
                onClick={() => navigate(backTo)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali
              </button>
            </div>

            {/* Headline utama */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">No. 1 Cyber University Indonesia</span>
              </div>

              <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg">
                Pendidikan Siber<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">
                  Terbaik di Asia.
                </span>
              </h2>

              <p className="text-blue-100/80 font-medium leading-relaxed italic text-base max-w-sm border-l-2 border-blue-500/50 pl-4">
                "Bergabunglah dengan ribuan mahasiswa dan raih gelar sarjana dengan fleksibilitas penuh dari manapun."
              </p>

              {/* Stats row — Glassmorphism kuat + floating animation */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Users,  value: "5.000+",      label: "Mahasiswa",     cls: "stat-card-0" },
                  { icon: Award,  value: "Akreditasi A", label: "BAN-PT",        cls: "stat-card-1" },
                  { icon: Shield, value: "95%",          label: "Lulusan Kerja", cls: "stat-card-2" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`${stat.cls} bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/30 transition-colors cursor-default`}
                  >
                    <stat.icon size={22} className="text-blue-300 mb-3" />
                    <p className="font-black text-white text-base leading-tight">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer kiri — kontras di atas vignette bawah */}
            <div className="flex items-center justify-between border-t border-white/20 pt-6">
              <p className="text-white text-[10px] font-extrabold tracking-widest uppercase drop-shadow">© 2025 Universitas Siber Asia</p>
              <p className="text-white text-[10px] font-extrabold tracking-widest uppercase drop-shadow">unsia.ac.id</p>
            </div>

          </div>
        </div>

        {/* ══ SISI KANAN — Form Area ══ */}
        {/* Mobile: foto kampus jadi blur background */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: '#F8FAFC' }}
        >
          {/* Mobile background: campus image blur */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 lg:hidden"
            style={{ backgroundImage: `url(${latarUnsia})`, filter: 'blur(12px)', opacity: 0.15 }}
          />

          {/* Cyber Dot Grid — sangat samar, tech-oriented */}
          <div className="absolute inset-0 cyber-dots opacity-[0.05] pointer-events-none" />

          {/* Dekorasi blob Background Kanan */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl opacity-40" />

          {/* Login Card */}
          <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto px-8 py-10 lg:px-12 bg-white/95 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.07)] rounded-3xl border border-slate-100/80">

            {/* Logo UNSIA (mobile only) */}
            <div className="flex items-center gap-3 justify-center mb-10 lg:hidden">
              <img src={logoUnsia} alt="Logo UNSIA" className="w-12 h-12 object-contain" />
              <div>
                <span className="font-black text-[#002855] text-lg tracking-tight leading-none block">UNSIA</span>
                <span className="font-bold text-blue-600 text-[9px] tracking-[0.2em] uppercase leading-none">Cyber University</span>
              </div>
            </div>

            {/* Header Form — warm welcome */}
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">Portal Akademik</span>
              </div>
              {/* Warm welcome tagline */}
              <p className="text-slate-400 font-semibold text-sm mb-1">Selamat Datang Kembali</p>
              <h1 className="text-4xl font-black text-[#002855] tracking-tight mb-2">{title}</h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}

            {/* Hubungi Admin — cantik dengan icon */}
            <div className="mt-10 flex items-center justify-center">
              <a
                href="https://wa.me/0895386693566"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
              >
                <HelpCircle size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                  Butuh bantuan? <span className="underline underline-offset-2">Hubungi Admin</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;