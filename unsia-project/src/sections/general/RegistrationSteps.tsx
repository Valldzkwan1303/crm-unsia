import { FileText, UserCheck, ClipboardCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    num: '01', icon: FileText, title: 'Isi Formulir Online',
    desc: 'Lengkapi data diri di portal pendaftaran UNSIA. Proses cepat dan bisa dilakukan kapan saja.',
    color: 'bg-blue-500', border: 'border-blue-100',
  },
  {
    num: '02', icon: ClipboardCheck, title: 'Unggah Dokumen',
    desc: 'Upload berkas secara digital — foto, KTP, ijazah, dan transkrip. Tanpa perlu datang ke kampus.',
    color: 'bg-indigo-500', border: 'border-indigo-100',
  },
  {
    num: '03', icon: UserCheck, title: 'Verifikasi & Seleksi',
    desc: 'Tim UNSIA memverifikasi data Anda. Notifikasi hasil dikirim via email dan WhatsApp.',
    color: 'bg-amber-500', border: 'border-amber-100',
  },
  {
    num: '04', icon: GraduationCap, title: 'Mulai Kuliah!',
    desc: 'Selamat bergabung! Akses LMS dan mulailah perjalanan akademik bersama UNSIA.',
    color: 'bg-emerald-500', border: 'border-emerald-100',
  },
];

export default function RegistrationSteps() {
  const navigate = useNavigate();
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-30" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-[10px] font-black tracking-[0.25em] uppercase px-4 py-2 rounded-full border border-amber-100 mb-6">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Proses Mudah &amp; Cepat
          </span>
          <h2 className="text-[#002855] text-4xl md:text-5xl font-black mb-5 tracking-tight">Alur Pendaftaran Mahasiswa Baru</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-base">Dari pendaftaran hingga kuliah, prosesnya transparan, digital, dan tidak memakan waktu.</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-emerald-100 z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[80px] font-black text-slate-50 leading-none select-none pointer-events-none z-0">{step.num}</div>
                <div className={`relative z-10 w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500`}>
                  <step.icon size={28} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 shadow-sm">{i+1}</div>
                </div>
                <div className={`relative z-10 bg-white rounded-3xl p-6 border ${step.border} shadow-sm hover:shadow-xl transition-all duration-500 w-full group-hover:-translate-y-1`}>
                  <h4 className="font-black text-[#002855] text-base mb-3 leading-tight">{step.title}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-4 text-slate-200"><ArrowRight size={20} className="rotate-90 mx-auto" /></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#002855] to-blue-700 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black mb-4 tracking-tight">Siap Menjadi Bagian dari UNSIA?</h3>
            <p className="text-blue-200 font-medium mb-8 max-w-lg mx-auto text-sm md:text-base">Bergabunglah dengan ribuan mahasiswa aktif dari seluruh Indonesia.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/join')} className="px-10 py-4 bg-white text-[#002855] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all duration-300 shadow-lg">Daftar Sekarang</button>
              <button onClick={() => document.getElementById('persyaratan')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 border border-white/30 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300">Lihat Persyaratan</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}