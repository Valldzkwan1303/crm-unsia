import { useState, useEffect } from 'react';
import { 
  HelpCircle, Mail, ChevronDown, ArrowLeft, MessageCircle, Search, User, Wallet, BookOpen, AlertCircle, FileText, CheckCircle, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'sonner';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_popular: boolean;
}

const AgentHelp = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<number, boolean>>({});

  const fetchFaqs = async () => {
    try {
      const response = await api.get('/agent/faqs', {
        params: { search: searchQuery, category: activeCategory }
      });
      setFaqs(response.data);
    } catch (error: any) {
      console.error(error);
      if (!error.response || error.code === 'ERR_NETWORK') {
         toast.error('Gagal memuat pusat bantuan. Periksa koneksi atau server.');
      }
    }
  };

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchFaqs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategory]);

  const handleFeedback = async (id: number, isHelpful: boolean) => {
    if (feedbackSent[id]) return;
    try {
      await api.post(`/agent/faqs/${id}/feedback`, { is_helpful: isHelpful });
      setFeedbackSent(prev => ({ ...prev, [id]: true }));
      toast.success('Terima kasih atas tanggapan Anda!');
    } catch (error) {
      toast.error('Gagal mengirim tanggapan.');
    }
  };

  const handleWhatsAppChat = () => {
    const phoneNumber = "6281234567890"; 
    const message = encodeURIComponent("Halo Admin UNSIA, saya partner agen ingin bertanya mengenai...");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const categories = [
    { name: 'Semua', label: 'Semua', icon: HelpCircle },
    { name: 'Akun', label: 'Akun & Profil', icon: User },
    { name: 'Keuangan', label: 'Keuangan', icon: Wallet },
    { name: 'Panduan', label: 'Panduan', icon: BookOpen },
    { name: 'Teknis', label: 'Kendala Teknis', icon: AlertCircle },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 bg-[#F8FAFC] min-h-screen">
      
      {/* HERO SECTION */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8 py-12 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10 mb-8">
            <button 
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-[#002855] hover:bg-white shadow-sm transition-all"
            title="Kembali"
            >
            <ArrowLeft size={20}/>
            </button>
            <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Pusat Bantuan</h1>
        </div>

        <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black text-[#002855] tracking-tight mb-4">Bagaimana kami bisa membantu Anda?</h2>
            <div className="relative mt-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={24} />
                <input 
                    type="text" 
                    placeholder="Ketik pertanyaan atau kata kunci..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-full pl-16 pr-6 py-5 text-base sm:text-lg font-bold text-[#002855] focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-xl focus:shadow-blue-900/10 transition-all placeholder-slate-400"
                />
            </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          {/* CATEGORIES */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.name;
                  return (
                      <button
                          key={cat.name}
                          onClick={() => setActiveCategory(cat.name)}
                          className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-300 ${
                              isActive 
                              ? 'bg-[#002855] border-[#002855] text-white shadow-xl shadow-blue-900/20 scale-105 z-10' 
                              : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:shadow-md'
                          }`}
                      >
                          <Icon size={32} className={`mb-3 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-center">{cat.label || cat.name}</span>
                      </button>
                  );
              })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">
                          {searchQuery ? 'Hasil Pencarian' : (activeCategory === 'Semua' ? 'Pertanyaan Populer' : `Kategori: ${activeCategory}`)}
                      </h3>
                  </div>

                  {faqs.length === 0 ? (
                      <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                          <HelpCircle className="mx-auto text-slate-300 mb-4" size={48} />
                          <h4 className="text-[#002855] font-black text-xl mb-2 tracking-tight">Tidak Ditemukan</h4>
                          <p className="text-slate-400 font-medium">Maaf, kami tidak dapat menemukan jawaban untuk pencarian Anda.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {faqs.map((faq, index) => (
                              <div 
                                  key={faq.id} 
                                  className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                                      openIndex === index ? 'border-blue-200 shadow-xl shadow-blue-900/5' : 'border-slate-100 shadow-sm hover:border-blue-100'
                                  }`}
                              >
                                  <button 
                                      type="button"
                                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                      className="w-full flex justify-between items-center p-6 sm:p-8 text-left outline-none border-none cursor-pointer group"
                                  >
                                      <div className="flex flex-col md:flex-row md:items-center gap-3 pr-4">
                                          <span className={`text-sm sm:text-base font-bold transition-colors ${openIndex === index ? 'text-blue-600' : 'text-[#002855] group-hover:text-blue-600'}`}>
                                              {faq.question}
                                          </span>
                                          <div className="flex gap-2">
                                            {faq.is_popular && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-md w-fit whitespace-nowrap">Populer</span>}
                                            {activeCategory === 'Semua' && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md w-fit whitespace-nowrap">{faq.category}</span>}
                                          </div>
                                      </div>
                                      <div className={`p-2 rounded-xl transition-all shrink-0 ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                          <ChevronDown size={18} />
                                      </div>
                                  </button>
                                  {openIndex === index && (
                                      <div className="px-6 sm:px-8 pb-8 animate-in fade-in slide-in-from-top-2">
                                          <p className="text-slate-600 font-medium leading-relaxed border-t border-slate-50 pt-6">
                                              {faq.answer}
                                          </p>
                                          
                                          {/* FEEDBACK SECTION */}
                                          <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                              <span className="text-xs sm:text-sm font-bold text-slate-400">Apakah informasi ini membantu?</span>
                                              {feedbackSent[faq.id] ? (
                                                  <span className="text-xs sm:text-sm font-bold text-emerald-500 flex items-center gap-2"><CheckCircle size={16}/> Terima kasih atas tanggapan Anda.</span>
                                              ) : (
                                                  <div className="flex gap-2">
                                                      <button onClick={() => handleFeedback(faq.id, true)} className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"><CheckCircle size={14}/> Ya</button>
                                                      <button onClick={() => handleFeedback(faq.id, false)} className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors"><XCircle size={14}/> Tidak</button>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}
              </div>

              {/* SUPPORT CARDS & QUICK GUIDES */}
              <div className="space-y-6">
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl hover:border-emerald-200 transition-all duration-500">
                      <div className="flex items-start gap-4 mb-6">
                          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                              <MessageCircle size={28} />
                          </div>
                          <div>
                              <h3 className="text-lg font-black text-[#002855]">Live Support</h3>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Chat via WhatsApp</p>
                          </div>
                      </div>
                      <button 
                          type="button"
                          onClick={handleWhatsAppChat}
                          className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 hover:bg-emerald-500 hover:shadow-emerald-500/30"
                      >
                          Mulai Percakapan
                      </button>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl hover:border-blue-200 transition-all duration-500">
                      <div className="flex items-start gap-4 mb-6">
                          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                              <Mail size={28} />
                          </div>
                          <div>
                              <h3 className="text-lg font-black text-[#002855]">Email Support</h3>
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">support@unsia.ac.id</p>
                          </div>
                      </div>
                      <button 
                          type="button"
                          onClick={() => { window.location.href='mailto:support@unsia.ac.id'; }}
                          className="w-full bg-slate-50 text-[#002855] hover:bg-blue-600 hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-100 group-hover:border-blue-600"
                      >
                          Kirim Pesan
                      </button>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                      <h3 className="text-sm font-black text-[#002855] uppercase tracking-widest mb-6 flex items-center gap-2"><BookOpen size={16}/> Panduan Cepat</h3>
                      <div className="space-y-3">
                          <a href="http://localhost:8000/downloads/panduan_partner.pdf" download="Panduan_Partner_UNSIA.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-colors group">
                              <div className="flex items-center gap-3">
                                  <FileText size={20} className="text-rose-500" />
                                  <span className="text-sm font-bold text-[#002855] group-hover:text-blue-600">Buku Panduan Partner</span>
                              </div>
                              <span className="text-[10px] font-black uppercase text-slate-400">PDF</span>
                          </a>
                          <a href="http://localhost:8000/downloads/sop_pencairan.pdf" download="SOP_Pencairan_Dana.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-colors group">
                              <div className="flex items-center gap-3">
                                  <FileText size={20} className="text-emerald-500" />
                                  <span className="text-sm font-bold text-[#002855] group-hover:text-blue-600">SOP Pencairan Dana</span>
                              </div>
                              <span className="text-[10px] font-black uppercase text-slate-400">PDF</span>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AgentHelp;