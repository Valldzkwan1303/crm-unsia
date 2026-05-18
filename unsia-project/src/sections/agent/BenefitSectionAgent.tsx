import { Clock, DollarSign, Wifi, BookOpen, Award, Users } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Fleksibel 100%',
    desc: 'Kuliah kapan saja dan di mana saja tanpa terikat jadwal kelas. Cocok untuk Anda yang bekerja penuh waktu.',
  },
  {
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Biaya Terjangkau',
    desc: 'SPP kompetitif dengan cicilan ringan. Tersedia beasiswa dan keringanan bagi mahasiswa berprestasi.',
  },
  {
    icon: Wifi,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    title: 'Teknologi Modern',
    desc: 'Platform belajar digital terkini dengan video HD, forum diskusi, dan ujian online yang mudah diakses.',
  },
  {
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Kurikulum Industri',
    desc: 'Materi disusun bersama praktisi industri terkemuka agar lulusan siap bersaing di dunia kerja global.',
  },
  {
    icon: Award,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    title: 'Akreditasi A BAN-PT',
    desc: 'Ijazah diakui resmi oleh pemerintah dan disetarakan dengan perguruan tinggi konvensional.',
  },
  {
    icon: Users,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    title: 'Komunitas Alumni',
    desc: 'Bergabung dengan jaringan 15.000+ alumni aktif yang saling mendukung karir dan bisnis.',
  },
];

export default function BenefitSectionAgent() {
  return (
    <section className="py-24 bg-[#F8FAFC]" id="fitur">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-5">
            Mengapa UNSIA?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002855] tracking-tight mb-4">
            Keunggulan Kuliah di UNSIA
          </h2>
          <p className="text-slate-500 text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Kami hadir untuk memastikan setiap orang Indonesia berhak mendapatkan pendidikan tinggi berkualitas tanpa batas.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${b.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={b.color} />
                </div>
                <h3 className="font-black text-[#002855] text-lg mb-3 tracking-tight">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}