import { Award, Globe, Cpu, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import LogoUnsia from '../../assets/logounsia.png';

const highlights = [
  {
    icon: Award,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: 'Akreditasi "A" BAN-PT',
    desc: 'Satu-satunya universitas siber di Indonesia dengan akreditasi A penuh dari Badan Akreditasi Nasional.',
  },
  {
    icon: Cpu,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Cyber University #1',
    desc: 'Pelopor pendidikan tinggi berbasis teknologi digital di Indonesia sejak 2020 dengan infrastruktur kelas dunia.',
  },
  {
    icon: Globe,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    title: 'Jangkauan Nasional',
    desc: 'Melayani mahasiswa dari Sabang sampai Merauke, bahkan diaspora Indonesia di luar negeri.',
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Relevansi Industri',
    desc: 'Kurikulum diperbarui setiap semester bersama lebih dari 200 mitra perusahaan teknologi nasional dan global.',
  },
  {
    icon: ShieldCheck,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    title: 'Ijazah Setara Resmi',
    desc: 'Gelar dari UNSIA diakui setara dan sah oleh pemerintah — berlaku untuk pendaftaran CPNS dan kenaikan jabatan.',
  },
  {
    icon: Users,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    title: 'Dosen Berkualifikasi',
    desc: 'Dibimbing lebih dari 300 dosen berpengalaman bergelar S2 dan S3 dari universitas terkemuka dalam dan luar negeri.',
  },
];

const stats = [
  { value: '2020', label: 'Tahun Berdiri' },
  { value: '15K+', label: 'Mahasiswa Aktif' },
  { value: '40+', label: 'Program Studi' },
  { value: '200+', label: 'Mitra Industri' },
];

export default function UnsiaSectionAgent() {
  return (
    <section className="py-24 bg-white" id="tentang">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-black text-rose-500 uppercase tracking-widest mb-5">
            Tentang UNSIA
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002855] tracking-tight mb-4">
            Cyber University Pertama & Terbaik
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Universitas Siber Asia hadir sebagai solusi pendidikan tinggi masa depan: fleksibel, terjangkau, berkualitas, dan diakui negara.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#002855] rounded-2xl p-6 text-center shadow-lg shadow-blue-900/20">
              <p className="text-2xl sm:text-3xl font-black text-white mb-1">{s.value}</p>
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 2-column layout: highlights + branding card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT + CENTER — highlights */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 p-5 bg-[#F8FAFC] border border-slate-100 rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${h.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={22} className={h.color} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#002855] text-sm mb-1">{h.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT — akreditasi & trust card */}
          <div className="flex flex-col gap-5">
            {/* Main branding card */}
            <div className="bg-gradient-to-br from-[#002855] to-blue-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/30 flex-1 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <img src={LogoUnsia} alt="UNSIA" className="h-10 w-auto object-contain mb-6 brightness-0 invert" />
              <h3 className="text-xl font-black tracking-tight mb-2">Universitas Siber Asia</h3>
              <p className="text-blue-200 text-sm font-medium mb-6 leading-relaxed">
                Menjadi universitas siber terdepan yang melahirkan talenta digital berkelas dunia.
              </p>
              <div className="space-y-3">
                {['Akreditasi Nasional BAN-PT', 'Terdaftar Kemendikbudristek', 'ISO 27001 Data Security'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-blue-100 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Akreditasi badge */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <span className="text-3xl font-black text-white leading-none">A</span>
              </div>
              <div>
                <p className="font-black text-amber-700 text-base">Akreditasi "A"</p>
                <p className="text-xs text-amber-600 font-semibold mt-0.5">Badan Akreditasi Nasional</p>
                <p className="text-xs text-amber-500 font-semibold">Perguruan Tinggi (BAN-PT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}