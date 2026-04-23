import { ArrowRight, Calendar } from "lucide-react";

export default function NewsSection() {
  const news = [
    { title: "UNSIA Raih Rekognisi Internasional EAHEA Excellence in Education", date: "05 Feb 2024", image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=400", cat: "Akademik" },
    { title: "Kerjasama Strategis UNSIA dengan Perusahaan Teknologi Global", date: "02 Feb 2024", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400", cat: "Berita" },
    { title: "Talkshow: Meniti Karir di Era Digital bersama Alumni UNSIA", date: "30 Jan 2024", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400", cat: "Acara" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left"><h2 className="text-[#002855] text-sm font-black tracking-widest uppercase mb-4">Latest Updates</h2><h3 className="text-3xl md:text-5xl font-black text-[#002855]">Berita & Acara Terkini</h3></div>
          <button className="flex items-center gap-2 font-black text-[#002855] hover:gap-4 transition-all">LIHAT SEMUA BERITA <ArrowRight size={20} className="text-yellow-500" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {news.map((item, i) => (
            <article key={i} className="group cursor-pointer">
              <div className="relative h-64 overflow-hidden rounded-3xl mb-6">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-[#002855] shadow-lg">{item.cat}</div>
              </div>
              <div className="flex items-center gap-4 mb-4"><div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider"><Calendar size={14} /> {item.date}</div><div className="h-0.5 flex-grow bg-gray-100"></div></div>
              <h4 className="text-xl font-black text-[#002855] group-hover:text-blue-600 transition-colors leading-snug">{item.title}</h4>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}