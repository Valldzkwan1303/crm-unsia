import { useState } from 'react';
import { 
  HelpCircle, Mail, ChevronDown, ArrowLeft, MessageCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentHelp = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Bagaimana cara kerja sistem referral?",
      answer: "Anda cukup membagikan link referral unik yang ada di dashboard. Ketika calon mahasiswa mendaftar melalui link tersebut, data mereka akan otomatis tercatat sebagai referral Anda."
    },
    {
      question: "Kapan komisi saya dibayarkan?",
      answer: "Komisi akan masuk ke saldo Anda setelah status calon mahasiswa berubah menjadi 'Registered'. Anda dapat melakukan penarikan dana kapan saja dengan minimal penarikan Rp 50.000."
    },
    {
      question: "Mengapa status referral saya masih 'New'?",
      answer: "Status 'New' berarti calon mahasiswa baru saja mendaftar dan belum diproses oleh Admin. Tim kami akan segera menghubungi mereka untuk proses verifikasi."
    },
    {
        question: "Bagaimana cara mengganti nomor rekening?",
        answer: "Anda dapat memperbarui informasi bank melalui menu Pengaturan Profil yang dapat diakses dengan mengklik foto profil Anda di pojok kanan atas dashboard."
    }
  ];

  const handleWhatsAppChat = () => {
    const phoneNumber = "6281234567890"; 
    const message = encodeURIComponent("Halo Admin UNSIA, saya partner agen ingin bertanya mengenai...");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#002855] shadow-sm transition-all"
          title="Kembali"
        >
          <ArrowLeft size={20}/>
        </button>
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Pusat Bantuan</h1>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-2xl shadow-blue-900/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>
        
        <div className="relative z-10 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black text-[#002855] tracking-tight">Ada yang bisa kami bantu?</h2>
            <p className="text-slate-500 max-w-lg font-medium leading-relaxed">
                Temukan solusi cepat melalui daftar pertanyaan umum atau hubungi tim dukungan kami untuk bantuan teknis lebih lanjut.
            </p>
        </div>
        
        <div className="relative z-10 mt-8 md:mt-0">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner">
                <HelpCircle size={48} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg group hover:border-emerald-200 transition-all">
            <div className="flex items-start gap-5 mb-8">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                    <MessageCircle size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#002855]">Dukungan Langsung</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Chat via WhatsApp (Respons Cepat)</p>
                </div>
            </div>
            <button 
                type="button"
                onClick={handleWhatsAppChat}
                className="w-full bg-slate-50 hover:bg-emerald-600 hover:text-white text-[#002855] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm group-hover:shadow-emerald-200"
            >
                Mulai Percakapan
            </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg group hover:border-blue-200 transition-all">
            <div className="flex items-start gap-5 mb-8">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-[#002855] group-hover:text-white transition-colors duration-500">
                    <Mail size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#002855]">Layanan Email</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Untuk kendala akun & administrasi</p>
                </div>
            </div>
            <button 
                type="button"
                onClick={() => { window.location.href='mailto:support@unsia.ac.id'; }}
                className="w-full bg-slate-50 hover:bg-[#002855] hover:text-white text-[#002855] py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm group-hover:shadow-blue-200"
            >
                Kirim Pesan Email
            </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Pertanyaan Populer (FAQ)</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq, index) => (
                <div 
                    key={index} 
                    className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'border-blue-200 shadow-xl shadow-blue-900/5' : 'border-slate-100 shadow-sm'
                    }`}
                >
                    <button 
                        type="button"
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex justify-between items-center p-8 text-left outline-none border-none cursor-pointer"
                        title={faq.question}
                    >
                        <span className={`text-base font-bold transition-colors ${openIndex === index ? 'text-blue-600' : 'text-[#002855]'}`}>
                            {faq.question}
                        </span>
                        <div className={`p-2 rounded-xl transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                            <ChevronDown size={18} />
                        </div>
                    </button>
                    {openIndex === index && (
                        <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2">
                            <p className="text-slate-500 font-medium leading-relaxed italic border-t border-slate-50 pt-6">
                                {faq.answer}
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgentHelp;