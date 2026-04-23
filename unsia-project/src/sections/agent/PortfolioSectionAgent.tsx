import { portfolioItems } from '../../data/dummyData';
import Card from '../../components/Card';

export default function PortfolioSectionAgent() {
  return (
    <section className="py-24 bg-white" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002855] uppercase tracking-tight">Portofolio & Kegiatan</h2>
          <p className="text-slate-400 mt-4 font-medium italic">Dokumentasi kesuksesan para partner dan mahasiswa kami.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden group border-none shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.category}</p>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-black text-[#002855] text-sm uppercase leading-tight">{item.title}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}