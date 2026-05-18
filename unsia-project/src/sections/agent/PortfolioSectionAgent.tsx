import { Monitor, BarChart2, Building2, Heart, Scale, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const programs = [
  {
    icon: Monitor,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    title: 'Teknik Informatika',
    degree: 'S1 — 144 SKS',
    desc: 'Kuasai rekayasa perangkat lunak, kecerdasan buatan, keamanan siber, dan komputasi awan bersama praktisi industri.',
    tags: ['AI & Machine Learning', 'Cybersecurity', 'Cloud Computing'],
  },
  {
    icon: BarChart2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    title: 'Manajemen',
    degree: 'S1 — 144 SKS',
    desc: 'Pelajari strategi bisnis digital, kepemimpinan, kewirausahaan, dan manajemen sumber daya manusia era modern.',
    tags: ['Digital Business', 'Leadership', 'Entrepreneurship'],
  },
  {
    icon: Scale,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    badge: 'bg-violet-100 text-violet-700',
    title: 'Hukum',
    degree: 'S1 — 144 SKS',
    desc: 'Pahami hukum perdata, pidana, bisnis, dan hukum siber yang relevan dengan dunia digital dan regulasi terkini.',
    tags: ['Hukum Siber', 'Hukum Bisnis', 'Advokasi Digital'],
  },
  {
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    title: 'Psikologi',
    degree: 'S1 — 144 SKS',
    desc: 'Eksplorasi perilaku manusia, psikologi industri, konseling, dan riset psikologi dengan pendekatan berbasis data.',
    tags: ['Psikologi Industri', 'Konseling', 'Riset Perilaku'],
  },
  {
    icon: Building2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    title: 'Administrasi Bisnis',
    degree: 'S1 — 144 SKS',
    desc: 'Kuasai manajemen operasional, tata kelola organisasi, dan strategi pengembangan bisnis di era digital.',
    tags: ['Tata Kelola', 'Operasional', 'Strategi Bisnis'],
  },
  {
    icon: BookOpen,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    badge: 'bg-sky-100 text-sky-700',
    title: 'Ilmu Komunikasi',
    degree: 'S1 — 144 SKS',
    desc: 'Pelajari jurnalisme digital, public relations, media sosial, dan komunikasi korporat yang dibutuhkan industri.',
    tags: ['Media Digital', 'PR & Branding', 'Jurnalisme'],
  },
];

export default function PortfolioSectionAgent() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#F8FAFC]" id="program">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-widest mb-5">
            Program Studi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002855] tracking-tight mb-4">
            Pilih Program Studi Unggulan
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            40+ program studi terakreditasi. Temukan bidang yang paling sesuai dengan passion dan karir impian Anda.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${prog.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={prog.color} />
                </div>

                {/* Title + degree */}
                <div className="mb-3">
                  <h3 className="font-black text-[#002855] text-lg tracking-tight leading-tight">{prog.title}</h3>
                  <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${prog.badge}`}>
                    {prog.degree}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 flex-1">{prog.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {prog.tags.map((tag, ti) => (
                    <span key={ti} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* More programs CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm font-medium mb-4">Masih banyak lagi program studi tersedia</p>
          <a
            href="#cara-daftar"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#002855] text-[#002855] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#002855] hover:text-white transition-all"
          >
            Lihat Semua Prodi <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}