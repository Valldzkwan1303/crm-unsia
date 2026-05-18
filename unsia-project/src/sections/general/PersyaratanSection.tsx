import { CheckCircle2, FileText, CreditCard, Camera, BookOpen, FileCheck, Award } from 'lucide-react';

const requirements = [
  {
    icon: BookOpen,
    title: "Scan Ijazah",
    desc: "Ijazah terakhir (SMA/SMK/MA/Sederajat untuk S1, atau S1 untuk S2). Format PDF/JPG, maks 2 MB.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CreditCard,
    title: "Scan KTP / Identitas",
    desc: "Kartu Tanda Penduduk (KTP) yang masih berlaku, atau paspor bagi WNA. Format PDF/JPG.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Camera,
    title: "Foto Terbaru",
    desc: "Pas foto formal ukuran 3×4 cm, background merah atau biru. Berpakaian rapi & sopan.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: FileText,
    title: "SKHU / Transkrip",
    desc: "Surat Keterangan Hasil Ujian (SKHU) atau transkrip nilai dari institusi asal.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: FileCheck,
    title: "Surat Keterangan Kerja",
    desc: "Opsional bagi pendaftar yang sudah bekerja. Digunakan untuk verifikasi RPL (Rekognisi Pembelajaran Lampau).",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Award,
    title: "Sertifikat RPL",
    desc: "Opsional sertifikat kompetensi, pelatihan, atau pengalaman kerja relevan yang dapat diakui sebagai kredit akademik.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

export default function PersyaratanSection() {
  return (
    <section id="persyaratan" className="relative overflow-hidden py-24 bg-white border-t border-slate-100">
      {/* ── Dekorasi Latar ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-50"></div>
        {/* Mesh orb kanan atas — dominan */}
        <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        {/* Mesh orb kiri bawah */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-40"></div>
        {/* Floating concentric rings kanan tengah */}
        <div className="absolute top-1/3 -right-6 w-44 h-44 rounded-full border border-blue-100/40"></div>
        <div className="absolute top-1/3 -right-2 w-28 h-28 rounded-full border border-blue-200/25"></div>
        {/* Accent horizontal line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-100/25 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black text-xs tracking-[0.3em] uppercase mb-4 block">
            Dokumen Pendaftaran
          </span>
          <h2 className="text-[#002855] text-4xl md:text-5xl font-black mb-6 leading-tight">
            Persyaratan Pendaftaran
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm leading-relaxed">
            Siapkan dokumen berikut dalam format digital sebelum memulai proses pendaftaran.
            Semua berkas diunggah secara online melalui portal PMB UNSIA.
          </p>
        </div>

        {/* Grid Persyaratan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {requirements.map((item, i) => (
            <div
              key={i}
              className="group flex gap-5 p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-black text-[#002855] text-sm">{item.title}</h4>
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                </div>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 bg-[#002855] rounded-2xl flex items-center justify-center shrink-0">
            <FileText size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-[#002855] mb-1">Catatan Penting</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Semua dokumen diunggah dalam format <strong>PDF atau JPG</strong> dengan ukuran maksimal <strong>2 MB per file</strong>.
              Pastikan scan dokumen jelas dan dapat terbaca. Dokumen yang tidak lengkap atau buram akan menghambat proses verifikasi.
            </p>
          </div>
          <a
            href="https://pmb.unsia.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-8 py-3 bg-[#002855] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Daftar Sekarang
          </a>
        </div>

      </div>
    </section>
  );
}
