import { Zap, Clock, ShieldCheck, Smartphone } from "lucide-react";

export default function AdvantageSection() {
  const items = [
    { icon: <Zap className="text-yellow-500" />, title: "LMS Berstandar Dunia", text: "Sistem manajemen pembelajaran (LMS) yang intuitif dan dapat diakses kapan saja." },
    { icon: <Clock className="text-blue-500" />, title: "Fleksibilitas Penuh", text: "Atur jadwal kuliah Anda sendiri, sangat cocok untuk profesional dan karyawan." },
    { icon: <ShieldCheck className="text-green-500" />, title: "Terakreditasi BAN-PT", text: "Lulusan UNSIA memiliki legalitas yang kuat dan diakui di dunia kerja." },
    { icon: <Smartphone className="text-purple-500" />, title: "Mobile Learning", text: "Akses materi kuliah, diskusi, dan tugas cukup melalui smartphone Anda." },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 text-sm font-black tracking-widest uppercase mb-4">Keunggulan</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[#002855] mb-6">Masa Depan Pendidikan Adalah Online</h3>
          <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-3xl hover:bg-blue-900 group transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-xl font-black text-[#002855] mb-4 group-hover:text-white transition-colors">{item.title}</h4>
              <p className="text-gray-500 font-medium group-hover:text-blue-100/70 transition-colors leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}