import { useState, useEffect } from 'react';
import { Download, Copy, Image as ImageIcon, FileText, Loader2, MessageCircle, Share2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

interface Kit {
  id: number;
  title: string;
  type: 'Image' | 'Text';
  content: string;
}

const MarketingKit = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');

  const fetchKits = async () => {
    setLoading(true);
    try {
      const [kitRes, agentRes] = await Promise.all([
        api.get('/agent/marketing-kits'),
        api.get('/agent/dashboard')
      ]);
      setKits(kitRes.data);
      setReferralLink(agentRes.data.referral_link);
    } catch (e) {
      console.error(e);
      toast.error('Gagal memuat materi promosi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleShareWA = (text: string) => {
    const msg = encodeURIComponent(text + "\n\nDaftar di sini: " + referralLink);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text + "\n\nLink Daftar: " + referralLink);
    toast.success('Teks promosi disalin!');
  };

  const handleShareToStudent = (kitTitle: string) => {
    const message = `Halo! Saya partner resmi UNSIA. Khusus buat kamu, ada informasi menarik tentang ${kitTitle}. 

Daftar sekarang melalui jalur rekomendasi saya untuk mendapatkan pendampingan pendaftaran:
Link: ${referralLink}

Yuk, jadi bagian dari Universitas Siber Asia!`;

    navigator.clipboard.writeText(message);
    toast.success('Pesan promosi khusus mahasiswa disalin!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Marketing Kit</h1>
        <p className="text-slate-400 text-sm font-medium italic">Gunakan materi siap pakai ini untuk menjaring lebih banyak mahasiswa baru.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit) => (
            <div key={kit.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 group flex flex-col h-full">
              {/* Bagian Visual (Gambar atau Icon) */}
              {kit.type === 'Image' ? (
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img src={kit.content} alt={kit.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#002855]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a href={kit.content} download className="bg-white text-[#002855] p-4 rounded-2xl shadow-xl transform hover:scale-110 transition-all" title="Unduh Gambar">
                      <Download size={24} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-blue-50/50 flex flex-col items-center justify-center aspect-video border-b border-slate-50">
                   <div className="p-5 bg-white rounded-[1.5rem] shadow-sm mb-4"><FileText size={40} className="text-blue-600" /></div>
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Copywriting Ready</p>
                </div>
              )}
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        {kit.type === 'Image' ? <ImageIcon size={14} className="text-blue-500"/> : <FileText size={14} className="text-emerald-500"/>}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{kit.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#002855] leading-tight line-clamp-2">{kit.title}</h3>
                </div>
                
                {/* Bagian Tombol Aksi */}
                <div className="mt-auto space-y-3">
                  <button 
                    onClick={() => handleShareWA(kit.content)} 
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16}/> Share WhatsApp
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleShareToStudent(kit.title)}
                        className="bg-blue-50 text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 size={14}/> Student Promo
                    </button>

                    {kit.type === 'Text' ? (
                        <button 
                            onClick={() => handleCopyText(kit.content)} 
                            className="bg-slate-50 text-[#002855] py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100"
                        >
                            <Copy size={14}/> Salin Teks
                        </button>
                    ) : (
                        <a 
                            href={kit.content} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-slate-50 text-[#002855] py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100 text-center"
                        >
                            <ImageIcon size={14}/> Lihat HD
                        </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingKit;