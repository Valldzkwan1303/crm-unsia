import { UserPlus, FileText, GraduationCap, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Registrasi Online',
    desc: 'Isi formulir pendaftaran digital dengan data diri dan program studi pilihan. Proses cepat, tidak lebih dari 10 menit.',
    detail: 'Formulir online · KTP · Ijazah scan',
  },
  {
    number: '02',
    icon: FileText,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Lengkapi Berkas',
    desc: 'Unggah dokumen pendukung secara digital. Tim admisi kami siap membantu via WhatsApp 24 jam.',
    detail: 'Upload dokumen · Verifikasi · Persetujuan',
  },
  {
    number: '03',
    icon: GraduationCap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Mulai Kuliah',
    desc: 'Akses platform belajar, bergabung dengan komunitas mahasiswa, dan mulai perjalanan akademik Anda.',
    detail: 'Akses platform · Orientasi · Belajar',
  },
];

export default function StepSectionAgent() {
  return (
    <section className="py-24 bg-white" id="cara-daftar">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-[10px] font-black text-violet-600 uppercase tracking-widest mb-5">
            Cara Mendaftar
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002855] tracking-tight mb-4">
            3 Langkah Mudah Menuju Kampus Digital
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Pendaftaran sederhana dan terdigitalisasi penuh. Tidak perlu datang ke kampus!
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-[56px] left-[calc(16.66%+28px)] right-[calc(16.66%+28px)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center group">
                  {/* Number + Icon */}
                  <div className="relative mb-8">
                    {/* Big transparent number behind */}
                    <span className="absolute -top-4 -left-4 text-[96px] font-black text-slate-50 leading-none select-none pointer-events-none z-0">
                      {step.number}
                    </span>
                    {/* Icon circle */}
                    <div className={`relative z-10 w-16 h-16 ${step.bg} border-2 ${step.border} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className={step.color} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`w-full bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${step.color} mb-3`}>
                      Langkah {step.number}
                    </p>
                    <h3 className="text-xl font-black text-[#002855] tracking-tight mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">{step.desc}</p>
                    <div className={`flex items-center gap-2 px-4 py-2.5 ${step.bg} rounded-xl`}>
                      <CheckCircle size={13} className={step.color} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${step.color}`}>{step.detail}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}