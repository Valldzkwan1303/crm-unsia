import { GraduationCap } from 'lucide-react';
import Button from '../../components/Button'; // FIX: Default import

export default function RegistrationSteps() {
  const steps = [
    { step: "01", title: "Registrasi Online", desc: "Buat akun di portal pendaftaran UNSIA secara cepat." },
    { step: "02", title: "Lengkapi Berkas", desc: "Unggah dokumen pendukung secara digital." },
    { step: "03", title: "Verifikasi", desc: "Tim kami akan memverifikasi data pendaftaran Anda." },
    { step: "04", title: "Mulai Kuliah", desc: "Selamat! Anda resmi menjadi bagian dari Siber Asia." }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-black text-xs tracking-[0.3em] uppercase mb-4 block">Proses Cepat</span>
              <h2 className="text-[#001A33] text-4xl md:text-5xl font-black mb-8 leading-tight">Alur Pendaftaran <br/>Mahasiswa Baru</h2>
              <div className="space-y-8">
                {steps.map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="text-4xl font-black text-slate-100 group-hover:text-blue-100 transition-colors leading-none">{item.step}</div>
                    <div><h4 className="font-bold text-[#002855] text-lg mb-1">{item.title}</h4><p className="text-slate-500 text-sm italic font-medium">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="w-full aspect-square bg-[#002855] rounded-[3rem] p-4 rotate-3">
                  <div className="w-full h-full bg-blue-600 rounded-[2.5rem] flex items-center justify-center p-8 -rotate-3 transition-transform hover:rotate-0 duration-500 overflow-hidden relative">
                     <div className="text-center text-white relative z-10">
                        <GraduationCap size={100} className="mx-auto mb-6 opacity-20" />
                        <p className="text-2xl font-black mb-2 italic">Siap Menjadi Digital Leader?</p>
                        <p className="text-blue-100 text-sm mb-8 opacity-80">Bergabunglah dengan 5000+ mahasiswa aktif lainnya.</p>
                        <Button variant="outline" className="mx-auto rounded-full px-10 uppercase tracking-widest text-[10px] bg-white text-blue-600 border-none">Cek Persyaratan</Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
}