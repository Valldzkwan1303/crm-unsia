import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backTo?: string;
}

const AuthLayout = ({ children, title, subtitle, backTo = "/" }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3.5rem] shadow-2xl overflow-hidden relative z-10 border border-white">
        {/* Sisi Kiri: Visual */}
        <div className="hidden lg:block bg-[#002855] p-16 text-white relative">
            <button 
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-20 text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
            <h2 className="text-5xl font-black leading-tight tracking-tighter mb-6">
                Pendidikan Siber <br/> Terbaik di <span className="text-blue-400">Asia.</span>
            </h2>
            <p className="text-blue-200/60 font-medium leading-relaxed italic">
                "Bergabunglah dengan ribuan mahasiswa lainnya dan raih gelar sarjana dengan fleksibilitas penuh."
            </p>
            <div className="absolute bottom-16 left-16 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black">U</div>
                <span className="font-bold text-sm tracking-widest uppercase">UNSIA Marketing</span>
            </div>
        </div>

        {/* Sisi Kanan: Form */}
        <div className="p-10 lg:p-20 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight mb-2">{title}</h1>
                <p className="text-slate-400 font-medium text-sm italic">{subtitle}</p>
            </div>
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;