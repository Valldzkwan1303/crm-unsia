import { reasons } from '../../data/dummyData';

export default function UnsiaSectionAgent() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002855] uppercase tracking-tight">Kenapa Memilih UNSIA?</h2>
          <p className="text-slate-400 mt-4 font-medium italic">Kampus siber pertama yang fleksibel dan terakreditasi.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div key={reason.id} className="p-8 rounded-[2rem] bg-white shadow-sm border border-slate-100">
              <div className="mb-6">{reason.icon}</div>
              <h4 className="font-black text-[#002855] text-lg mb-2">{reason.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}