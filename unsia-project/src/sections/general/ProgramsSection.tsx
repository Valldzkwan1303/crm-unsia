import { Laptop, BookOpen, Briefcase, BarChart3, MessageSquare } from 'lucide-react';
import Card from '../../components/Card';

export default function ProgramsSection() {
  const prodis = [
    { name: "Informatika", icon: Laptop, desc: "Fokus pada Software Engineering & AI" },
    { name: "Sistem Informasi", icon: BookOpen, desc: "Integrasi Bisnis dan Teknologi Informasi" },
    { name: "Manajemen", icon: Briefcase, desc: "Bisnis Digital & Manajemen Strategis" },
    { name: "Akuntansi", icon: BarChart3, desc: "Akuntansi Berbasis Sistem Informasi" },
    { name: "PJJ Komunikasi", icon: MessageSquare, desc: "Digital PR & Media Komunikasi" }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black text-xs tracking-[0.3em] uppercase mb-4 block">Pilihan Masa Depan</span>
          <h2 className="text-[#001A33] text-4xl md:text-5xl font-black mb-6">Program Studi Unggulan</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm">Kurikulum yang dirancang khusus untuk kebutuhan industri digital masa kini dan masa depan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {prodis.map((prodi, i) => (
            <Card key={i} className="p-6 text-center hover:-translate-y-2 transition-all border-none bg-white group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-[#002855] group-hover:text-white transition-all duration-500"><prodi.icon size={28} /></div>
              <h4 className="font-black text-[#002855] mb-2 text-sm uppercase tracking-tighter">{prodi.name}</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">{prodi.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}