import { useState } from 'react';
import { MessageCircle, Phone, Mail, Send, ChevronDown, CheckCircle2 } from 'lucide-react';

const departments = [
  "Pilih Program Studi...",
  "PJJ Informatika",
  "PJJ Sistem Informasi",
  "PJJ Manajemen",
  "PJJ Akuntansi",
  "PJJ Komunikasi",
  "PJJ Teknologi Informasi",
  "Program Magister",
];

const contacts = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 895-3866-93566",
    href: "https://wa.me/0895386693566",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "(021) 27806189",
    href: "tel:02127806189",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@unsia.ac.id",
    href: "mailto:info@unsia.ac.id",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

export default function KonsultasiSection() {
  const [form, setForm] = useState({ nama: '', hp: '', prodi: '', pesan: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.hp) return;
    const msg = encodeURIComponent(
      `Halo Admin UNSIA 👋\n\nSaya ingin berkonsultasi:\n\n*Nama:* ${form.nama}\n*No. HP:* ${form.hp}\n*Program Studi:* ${form.prodi || '-'}\n*Pesan:* ${form.pesan || '-'}`
    );
    window.open(`https://wa.me/0895386693566?text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="konsultasi" className="relative overflow-hidden py-24 bg-[#F0F6FF] border-t border-blue-100">
      {/* ── Dekorasi Latar ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mesh orb kanan atas — biru hangat */}
        <div className="absolute -top-28 -right-28 w-[30rem] h-[30rem] bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        {/* Mesh orb kiri bawah */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-25"></div>
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern opacity-40"></div>
        {/* Floating rings kiri tengah */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-8 w-52 h-52 rounded-full border border-blue-200/30"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-36 h-36 rounded-full border border-blue-300/20"></div>
        {/* Vertical accent line */}
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black text-xs tracking-[0.3em] uppercase mb-4 block">
            Siap Membantu Anda
          </span>
          <h2 className="text-[#002855] text-4xl md:text-5xl font-black mb-6 leading-tight">
            Konsultasi dengan Admin
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm leading-relaxed">
            Tim konsultan pendidikan kami siap menjawab pertanyaan Anda seputar program studi, biaya, dan proses pendaftaran.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Kiri — Info Kontak */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-[#002855]">Hubungi Kami Langsung</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Tersedia Senin–Jumat pukul 08.00–17.00 WIB. Diluar jam kerja, tim kami akan membalas pesan Anda secepatnya.
            </p>

            <div className="space-y-4">
              {contacts.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-5 bg-white rounded-2xl border ${c.border} hover:shadow-md transition-all duration-300 group`}
                >
                  <div className={`${c.bg} ${c.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <c.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.label}</p>
                    <p className="font-black text-[#002855] text-sm">{c.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Jam Operasional */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-2">
              <h4 className="font-black text-[#002855] text-xs uppercase tracking-widest mb-3">Jam Operasional</h4>
              {[
                { day: "Senin – Jumat", hours: "08.00 – 17.00 WIB" },
                { day: "Sabtu", hours: "08.00 – 12.00 WIB" },
                { day: "Minggu & Hari Libur", hours: "Tutup" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-500">{row.day}</span>
                  <span className={`font-black ${row.hours === 'Tutup' ? 'text-red-400' : 'text-[#002855]'}`}>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kanan — Form Konsultasi */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-10">
            <h3 className="text-xl font-black text-[#002855] mb-2">Kirim Pesan via WhatsApp</h3>
            <p className="text-slate-400 text-xs font-medium mb-8">
              Isi form di bawah, klik kirim, dan Anda akan langsung terhubung dengan admin kami melalui WhatsApp.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <CheckCircle2 size={48} className="text-green-500" />
                <p className="font-black text-[#002855] text-lg text-center">Pesan Terkirim!</p>
                <p className="text-slate-400 text-sm text-center font-medium">Anda akan diarahkan ke WhatsApp. Tim kami segera membalas.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nama Lengkap *</label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-500 shadow-sm hover:shadow-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nomor HP / WhatsApp *</label>
                  <input
                    name="hp"
                    value={form.hp}
                    onChange={handleChange}
                    required
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-500 shadow-sm hover:shadow-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Program Studi yang Diminati</label>
                  <div className="relative">
                    <select
                      name="prodi"
                      value={form.prodi}
                      onChange={handleChange}
                      className="w-full appearance-none px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-500 bg-white shadow-sm hover:shadow-md"
                    >
                      {departments.map((d, i) => <option key={i} value={i === 0 ? '' : d}>{d}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Pesan / Pertanyaan</label>
                  <textarea
                    name="pesan"
                    value={form.pesan}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tulis pertanyaan atau kebutuhan Anda di sini..."
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-500 resize-none shadow-sm hover:shadow-md"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-[#002855] hover:bg-blue-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 shadow-lg shadow-[#002855]/20 hover:shadow-2xl hover:-translate-y-1"
                >
                  <Send size={16} /> Kirim via WhatsApp
                </button>
                <p className="text-center text-[10px] text-slate-300 font-medium">
                  Dengan mengirim form ini, Anda setuju untuk dihubungi oleh tim UNSIA.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
