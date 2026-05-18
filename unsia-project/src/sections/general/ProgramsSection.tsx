import { Laptop, BookOpen, Briefcase, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';

const prodis = [
  {
    name: 'S1 Informatika',
    icon: Laptop,
    accred: 'Baik Sekali',
    color: 'from-blue-500 to-blue-700',
    iconBg: 'bg-blue-50 text-blue-600',
    desc: 'Cetak ahli teknologi yang unggul di bidang rekayasa perangkat lunak, kecerdasan buatan, dan keamanan siber yang diakui industri global.',
    tags: ['AI & Machine Learning', 'Cybersecurity', 'Software Engineering'],
  },
  {
    name: 'S1 Sistem Informasi',
    icon: BookOpen,
    accred: 'Baik Sekali',
    color: 'from-indigo-500 to-indigo-700',
    iconBg: 'bg-indigo-50 text-indigo-600',
    desc: 'Jembatan strategis antara bisnis dan teknologi. Hasilkan sistem informasi terintegrasi yang mendorong efisiensi dan inovasi perusahaan.',
    tags: ['Enterprise Systems', 'Data Analytics', 'Digital Strategy'],
  },
  {
    name: 'S1 Manajemen',
    icon: Briefcase,
    accred: 'Baik',
    color: 'from-emerald-500 to-emerald-700',
    iconBg: 'bg-emerald-50 text-emerald-600',
    desc: 'Lahirkan pemimpin masa depan yang tangguh, berjiwa entrepreneur, dan siap memimpin transformasi organisasi di era disrupsi digital.',
    tags: ['Leadership', 'Digital Marketing', 'Entrepreneurship'],
  },
  {
    name: 'S1 Akuntansi',
    icon: BarChart3,
    accred: 'Baik Sekali',
    color: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-50 text-amber-600',
    desc: 'Kuasai ilmu akuntansi modern berbasis teknologi. Siap menempati posisi keuangan strategis di perusahaan nasional dan multinasional.',
    tags: ['Financial Technology', 'Digital Auditing', 'Tax Planning'],
  },
  {
    name: 'PJJ Komunikasi',
    icon: MessageSquare,
    accred: 'Baik',
    color: 'from-rose-500 to-rose-700',
    iconBg: 'bg-rose-50 text-rose-600',
    desc: 'Kuasai seni komunikasi digital era modern. Dari media sosial hingga public relations, jadilah kreator konten profesional bertaraf internasional.',
    tags: ['Digital Media', 'Public Relations', 'Content Strategy'],
  },
];

export default function ProgramsSection() {
  return (
    <section id="program" className="relative overflow-hidden py-28 bg-[#F8FAFC]">
      {/* Dekorasi */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-[10px] font-black tracking-[0.25em] uppercase px-4 py-2 rounded-full border border-blue-100 mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Pilihan Masa Depan
          </span>
          <h2 className="text-[#002855] text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight">
            Program Studi Unggulan
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-base leading-relaxed">
            Kurikulum yang dirancang bersama industri terkemuka, memastikan setiap lulusan siap menghadapi tantangan nyata dunia kerja digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {prodis.map((prodi, i) => (
            <div
              key={i}
              className="relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col"
            >
              {/* Accreditation Badge */}
              <div className={`absolute top-4 right-4 bg-gradient-to-r ${prodi.color} text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md`}>
                {prodi.accred}
              </div>

              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${prodi.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

              {/* Icon */}
              <div className={`w-14 h-14 ${prodi.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <prodi.icon size={26} />
              </div>

              {/* Content */}
              <h4 className="font-black text-[#002855] mb-3 text-sm leading-tight">{prodi.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4 flex-1">{prodi.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {prodi.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-1 rounded-full border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a href="#konsultasi" className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-wider group-hover:gap-2.5 transition-all duration-300">
                Pelajari <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm font-medium mb-4">Tidak yakin memilih program studi yang tepat?</p>
          <a
            href="#konsultasi"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#002855] text-[#002855] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#002855] hover:text-white transition-all duration-300"
          >
            Konsultasi Gratis <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}