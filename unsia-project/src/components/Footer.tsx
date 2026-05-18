import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center">
              <img src="/src/assets/logounsia.png" alt="Logo UNSIA" className="h-12 object-contain" />
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm italic">
              "Menghadirkan pendidikan tinggi siber berkualitas dunia yang fleksibel, terjangkau, dan diakui secara global untuk masa depan digital Anda."
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002855] text-xs uppercase tracking-[0.3em]">Halaman Pintar</h4>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate('/login')} className="text-slate-400 text-xs font-bold hover:text-blue-600 text-left transition-colors uppercase">Portal Mahasiswa</button>
              <button onClick={() => navigate('/login')} className="text-slate-400 text-xs font-bold hover:text-blue-600 text-left transition-colors uppercase">Portal Partner</button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-[#002855] text-xs uppercase tracking-[0.3em]">Kontak Kami</h4>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">
              Jl. RM. Harsono No.1, Jakarta Selatan<br/>
              info@unsia.ac.id<br/>
              (021) 27806189
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2024 UNIVERSITAS SIBER ASIA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-blue-600">Privacy Policy</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-blue-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}