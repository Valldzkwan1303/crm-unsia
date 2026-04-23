import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSectionAgent({ agentCode, source }: { agentCode?: string; source?: string; }) {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-[#002855] rounded-[3rem] p-16 text-center text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full -mr-20 -mt-20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Sparkles className="mx-auto mb-6 text-blue-400" size={48} />
          <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tighter">Wujudkan Karir Impian <br/> Bersama UNSIA</h2>
          <p className="text-blue-100 mb-12 max-w-lg mx-auto text-lg font-medium opacity-80 italic">"Pendidikan berkualitas kini hanya berjarak satu klik dari genggaman Anda."</p>
          <button 
            onClick={() => navigate(`/join?ref=${agentCode}&src=${source}`)}
            className="px-12 py-5 bg-white text-[#002855] rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-3 mx-auto"
          >
            Mulai Perjalanan Anda <ArrowRight size={18}/>
          </button>
        </div>
      </div>
    </section>
  );
}