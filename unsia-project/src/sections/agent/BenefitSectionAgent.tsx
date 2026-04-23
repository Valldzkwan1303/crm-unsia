import { features } from '../../data/dummyData';

// TAMBAHKAN KATA 'default' DI SINI PAL
export default function BenefitSectionAgent() {
  return (
    <section className="py-24 bg-white" id="fitur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002855] uppercase tracking-tight">Keuntungan Bergabung</h2>
          <p className="text-slate-400 mt-4 font-medium italic">Benefit eksklusif bagi para partner resmi Universitas Siber Asia.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all duration-500">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="font-black text-[#002855] text-lg mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}