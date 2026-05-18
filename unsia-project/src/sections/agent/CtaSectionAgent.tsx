import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Clock, Star } from 'lucide-react';

export default function CtaSectionAgent({
  agentCode,
  source,
}: {
  agentCode?: string;
  source?: string;
}) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F8FAFC]" id="daftar">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="relative bg-[#002855] rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl shadow-blue-900/30 overflow-hidden">

          {/* Background decor */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full -ml-24 -mt-24 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400/15 rounded-full -mr-20 -mb-20 blur-3xl" />
            {/* Subtle grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-dots)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Sparkle icon */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Pendaftaran Terbuka</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 tracking-tight leading-tight">
              Wujudkan Karir Impian <br className="hidden sm:block" />
              <span className="text-blue-300">Bersama UNSIA</span>
            </h2>

            <p className="text-blue-200 mb-4 max-w-lg mx-auto text-base font-medium leading-relaxed">
              "Pendidikan berkualitas kini hanya berjarak satu klik dari genggaman Anda."
            </p>

            {/* Social proof strip */}
            <div className="flex items-center justify-center gap-1 mb-10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-[11px] text-blue-300 font-bold ml-2">4.9/5 dari 2.300+ mahasiswa</span>
            </div>

            {/* MAIN CTA — Pulse animation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative">
                {/* Pulse rings */}
                <span className="absolute inset-0 rounded-2xl bg-white/30 animate-ping opacity-60 pointer-events-none" />
                <span className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
                <button
                  onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
                  className="relative px-10 py-5 bg-white text-[#002855] rounded-2xl font-black uppercase text-xs tracking-[0.15em] shadow-2xl hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-3"
                >
                  Daftar Sekarang — GRATIS
                  <ArrowRight size={18} />
                </button>
              </div>

              <button
                onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
                className="px-8 py-5 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
              >
                Konsultasi Dulu
              </button>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap items-center justify-center gap-5 mt-10 pt-8 border-t border-white/10">
              {[
                { icon: ShieldCheck, text: 'Akreditasi A BAN-PT' },
                { icon: Clock, text: 'Proses Cepat ≤ 24 jam' },
                { icon: Sparkles, text: 'Tanpa Tes Masuk' },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon size={14} className="text-blue-300 shrink-0" />
                    <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}