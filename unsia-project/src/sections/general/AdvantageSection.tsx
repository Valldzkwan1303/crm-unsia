import { Zap, Clock, ShieldCheck, Smartphone } from "lucide-react";

export default function AdvantageSection() {
  const items = [
    { icon: <Zap className="text-yellow-500" />, title: "LMS Berstandar Dunia", text: "Nikmati pengalaman belajar dengan Sistem Manajemen Pembelajaran (LMS) mutakhir kami yang sangat intuitif, responsif, dan dapat diakses dengan mudah kapan saja dan di mana saja." },
    { icon: <Clock className="text-blue-500" />, title: "Fleksibilitas Tanpa Batas", text: "Rancang jadwal kuliah Anda secara mandiri. Sangat ideal bagi para profesional, pekerja, atau siapa saja yang ingin menyeimbangkan karir dan pendidikan tanpa hambatan." },
    { icon: <ShieldCheck className="text-green-500" />, title: "Akreditasi Resmi BAN-PT", text: "Gelar dan ijazah lulusan UNSIA memiliki legalitas yang kuat, diakui secara penuh oleh negara, dan memiliki daya saing tinggi di kancah dunia kerja maupun institusi global." },
    { icon: <Smartphone className="text-purple-500" />, title: "Mobile Learning", text: "Kemudahan berada di genggaman Anda. Akses materi perkuliahan eksklusif, forum diskusi interaktif, dan kumpulkan tugas hanya dengan bermodalkan smartphone." },
  ];

  return (
    <section id="keunggulan" className="relative overflow-hidden py-24 bg-white border-t border-slate-100">
      {/* ── Dekorasi Latar ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dot pattern — identitas cyber */}
        <div className="absolute inset-0 dot-pattern opacity-60"></div>
        {/* Mesh orb kanan atas */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        {/* Mesh orb kiri bawah */}
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        {/* Floating rings */}
        <div className="absolute top-8 right-10 w-36 h-36 rounded-full border border-blue-100/50"></div>
        <div className="absolute top-14 right-16 w-20 h-20 rounded-full border border-blue-200/30"></div>
        <div className="absolute bottom-10 left-6 w-24 h-24 rounded-full border border-slate-200/60"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 text-sm font-black tracking-widest uppercase mb-4">Keunggulan</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[#002855] mb-6">Masa Depan Pendidikan Adalah Online</h3>
          <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-3xl hover:bg-[#002855] hover:shadow-2xl hover:-translate-y-2 group transition-all duration-500 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">{item.icon}</div>
              <h4 className="text-xl font-black text-[#002855] mb-4 group-hover:text-white transition-colors duration-500 relative z-10">{item.title}</h4>
              <p className="text-gray-500 text-sm font-medium group-hover:text-blue-100/80 transition-colors duration-500 leading-relaxed relative z-10">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}