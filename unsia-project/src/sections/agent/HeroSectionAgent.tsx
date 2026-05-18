import { ChevronRight, ShieldCheck, Star, Award, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoUnsia from '../../assets/logounsia.png';

/* ── Trust stats shown below hero ── */
const trustStats = [
  { value: '15.000+', label: 'Mahasiswa Aktif' },
  { value: 'Akreditasi A', label: 'BAN-PT Resmi' },
  { value: '40+ Prodi', label: 'Program Studi' },
  { value: '100% Online', label: 'Fleksibel & Digital' },
];

/* ── Testimoni singkat ── */
const quotes = [
  { text: '"Kuliah sambil kerja jadi kenyataan. UNSIA benar-benar fleksibel!"', author: 'Rizky A.', role: 'Alumni Teknik Informatika' },
  { text: '"Biayanya terjangkau, dosennya berkualitas. Rekomended banget!"', author: 'Siti N.', role: 'Mahasiswa Manajemen' },
];

interface HeroSectionAgentProps {
  agentCode?: string;
  agentName?: string;
  source?: string;
}

export default function HeroSectionAgent({ agentCode, agentName, source }: HeroSectionAgentProps) {
  const navigate = useNavigate();

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-white overflow-hidden">

      {/* ── Decorative mesh gradient (very subtle) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right soft blue glow */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[120px]" />
        {/* Bottom-left teal glow */}
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-sky-100/50 blur-[100px]" />
        {/* Subtle dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#002855" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — copy */}
          <div>
            {/* Partner badge — referral info dipertahankan */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-blue-50 border border-blue-100 mb-8 shadow-sm">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Direkomendasikan oleh</p>
                <p className="text-xs font-black text-[#002855] leading-none">{agentName ?? 'Partner Resmi UNSIA'}</p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#002855] leading-[1.05] tracking-tighter mb-6">
              Kuliah Online,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">Masa Depan</span>
                {/* underline accent */}
                <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-100 rounded-full -z-0" />
              </span>{' '}
              Digital.
            </h1>

            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg mb-10">
              Raih gelar sarjana dari universitas siber terakreditasi A. Belajar kapan saja, di mana saja — tanpa meninggalkan pekerjaan Anda.
            </p>

            {/* CTAs — referral params dipertahankan */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
                className="group px-8 py-4 bg-[#002855] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Daftar Kuliah Sekarang
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#program"
                className="px-8 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-600 hover:border-[#002855] hover:text-[#002855] transition-all flex items-center justify-center"
              >
                Lihat Program Studi
              </a>
            </div>

            {/* Testimonial strip */}
            <div className="flex gap-5">
              {quotes.map((q, i) => (
                <div key={i} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 hidden sm:block">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-2">{q.text}</p>
                  <p className="text-[10px] font-black text-[#002855]">{q.author}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{q.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — trust card */}
          <div className="flex flex-col gap-5">
            {/* Main card */}
            <div className="bg-[#002855] rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
              <img src={LogoUnsia} alt="UNSIA" className="h-12 w-auto object-contain mb-6 brightness-0 invert" />
              <h3 className="text-2xl font-black tracking-tight mb-2">Universitas Siber Asia</h3>
              <p className="text-blue-200 text-sm font-medium mb-6 leading-relaxed">
                Perguruan tinggi berbasis teknologi dengan akreditasi resmi BAN-PT, membuka akses pendidikan berkualitas untuk seluruh Indonesia.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {trustStats.map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-xl font-black text-white leading-none mb-1">{s.value}</p>
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges row */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl shrink-0">
                <Award size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-black text-[#002855]">Terakreditasi Nasional BAN-PT</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Diakui Kemendikbudristek Republik Indonesia</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl shrink-0">
                <Users size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-black text-[#002855]">Komunitas Alumni Aktif</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">15.000+ lulusan di seluruh nusantara & mancanegara</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}