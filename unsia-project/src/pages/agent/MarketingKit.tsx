import { useState, useEffect } from 'react';
import { Download, Copy, Image as ImageIcon, FileText, Loader2, MessageCircle, Share2, Search, X, CheckCircle, Maximize2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import logounsia from '../../assets/logounsia.png';

interface MarketingAsset {
  id: number;
  title: string;
  category: 'Flyer' | 'Video' | 'Copywriting' | 'Logo';
  type: 'file' | 'text';
  file_url: string | null;
  content: string | null;
  thumbnail: string | null;
}

const MarketingKit = () => {
  const [kits, setKits] = useState<MarketingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');
  
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewKit, setPreviewKit] = useState<MarketingAsset | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['Semua', 'Flyer Digital', 'Copywriting', 'Logo Resmi'];

  const fetchKits = async () => {
    setLoading(true);
    try {
      const [kitRes, agentRes] = await Promise.all([
        api.get('/agent/marketing-assets'),
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

  const handleCopyText = (kit: MarketingAsset) => {
    const textToCopy = kit.content || '';
    navigator.clipboard.writeText(textToCopy + "\n\nLink Daftar: " + referralLink);
    setCopiedId(kit.id);
    toast.success('Teks promosi disalin!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleShareToStudent = (kitTitle: string) => {
    const message = `Halo! Saya partner resmi UNSIA. Khusus buat kamu, ada informasi menarik tentang ${kitTitle}. \n\nDaftar sekarang melalui jalur rekomendasi saya untuk mendapatkan pendampingan pendaftaran:\nLink: ${referralLink}\n\nYuk, jadi bagian dari Universitas Siber Asia!`;
    navigator.clipboard.writeText(message);
    toast.success('Pesan promosi khusus mahasiswa disalin!');
  };

  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'Semua' 
        || (activeTab === 'Flyer Digital' && kit.category === 'Flyer')
        || (activeTab === 'Video Profil' && kit.category === 'Video')
        || (activeTab === 'Copywriting' && kit.category === 'Copywriting');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white border-b border-slate-100 px-8 py-10 rounded-b-[3rem] shadow-sm">
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Marketing Kit</h1>
        <p className="text-slate-400 text-sm font-medium mt-2">Pusat aset promosi eksklusif. Unduh atau bagikan materi siap pakai ini untuk kemudahan promosi Anda.</p>
        
        {/* Search & Tabs */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeTab === cat ? 'bg-[#002855] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-[#002855]'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="relative w-full lg:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                    type="text" 
                    placeholder="Cari materi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-full pl-12 pr-4 py-3 text-sm font-bold text-[#002855] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm placeholder-slate-300"
                />
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="px-8">
            {activeTab === 'Logo Resmi' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Logo Card 1 */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center gap-6 group hover:shadow-xl transition-all duration-500">
                        <div className="h-40 flex items-center justify-center p-6 bg-slate-50/50 rounded-[2rem] w-full border border-slate-50 group-hover:bg-slate-50 transition-colors">
                            <img src={logounsia} alt="Logo UNSIA PNG" className="max-h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-black text-[#002855] text-lg uppercase tracking-tight">Logo Utama (PNG)</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Latar Transparan • Standar</p>
                        </div>
                        <a href={logounsia} download="UNSIA-Logo-Utama.png" className="w-full py-4 bg-[#002855] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl shadow-[#002855]/20 transition-all duration-300">
                            <Download size={16} /> Unduh Materi
                        </a>
                    </div>
                </div>
            ) : filteredKits.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Search size={40} />
                    </div>
                    <h4 className="text-[#002855] font-black text-xl mb-2 tracking-tight">Materi Tidak Ditemukan</h4>
                    <p className="text-slate-400 text-sm font-medium">Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredKits.map((kit, index) => (
                        <div key={kit.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full relative">
                            {/* Label Terbaru */}
                            {index === 0 && (
                                <div className="absolute top-4 right-4 z-20 bg-amber-400 text-[#002855] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30">
                                    Terbaru
                                </div>
                            )}

                            {/* Bagian Visual */}
                            {kit.type === 'file' ? (
                                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden cursor-pointer" onClick={() => setPreviewKit(kit)}>
                                    <img src={kit.thumbnail || kit.file_url || ''} alt={kit.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-[#002855]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                        <div className="bg-white/20 text-white p-4 rounded-full backdrop-blur-md transform hover:scale-110 transition-transform">
                                            <Maximize2 size={24} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 bg-gradient-to-br from-blue-50 to-slate-50 flex flex-col items-center justify-center aspect-[4/3] border-b border-slate-50 relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 text-blue-500/5 rotate-12"><MessageCircle size={140} /></div>
                                    <div className="p-5 bg-white rounded-3xl shadow-lg shadow-blue-900/5 mb-4 relative z-10">
                                        <FileText size={40} className="text-blue-600" />
                                    </div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] relative z-10">Copywriting Promo</p>
                                </div>
                            )}
                            
                            <div className="p-8 flex-1 flex flex-col bg-white">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${kit.type === 'file' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {kit.category === 'Flyer' ? 'Flyer Digital' : kit.category === 'Video' ? 'Video Profil' : 'Teks Promo'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-[#002855] leading-snug line-clamp-2">{kit.title}</h3>
                                    {kit.type === 'file' && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Format Media</p>}
                                </div>
                                
                                {/* Bagian Tombol Aksi */}
                                <div className="mt-auto flex flex-col gap-3">
                                    {kit.type === 'text' ? (
                                        <>
                                            <button 
                                                onClick={() => handleCopyText(kit)} 
                                                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${copiedId === kit.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-[#002855] text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20'}`}
                                            >
                                                {copiedId === kit.id ? <><CheckCircle size={16}/> Berhasil Disalin</> : <><Copy size={16}/> Salin Teks</>}
                                            </button>
                                            <button 
                                                onClick={() => handleShareWA(kit.content || '')} 
                                                className="w-full bg-slate-50 hover:bg-slate-100 text-[#002855] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100"
                                            >
                                                <MessageCircle size={16}/> Share WA
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <a 
                                                href={kit.file_url || '#'} 
                                                download 
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Download size={16}/> Unduh Materi
                                            </a>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => handleShareToStudent(kit.title)}
                                                    className="bg-blue-50 text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Share2 size={14}/> Student
                                                </button>
                                                <button 
                                                    onClick={() => setPreviewKit(kit)} 
                                                    className="bg-slate-50 text-slate-500 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 hover:text-[#002855] transition-all flex items-center justify-center gap-2 border border-slate-100"
                                                >
                                                    <Maximize2 size={14}/> Preview
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewKit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-10 bg-[#002855]/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setPreviewKit(null)}>
            <div className="relative max-w-5xl w-full flex justify-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <button onClick={() => setPreviewKit(null)} className="absolute -top-12 right-0 sm:-right-12 p-3 bg-white/10 text-white hover:bg-white/30 rounded-full transition-colors backdrop-blur-md">
                    <X size={24} />
                </button>
                {previewKit.type === 'file' ? (
                    previewKit.category === 'Video' ? (
                        <video src={previewKit.file_url || ''} controls autoPlay className="max-h-[85vh] w-auto max-w-full rounded-[2rem] shadow-2xl object-contain border-4 border-white/10" />
                    ) : (
                        <img src={previewKit.file_url || previewKit.thumbnail || ''} alt={previewKit.title} className="max-h-[85vh] w-auto max-w-full rounded-[2rem] shadow-2xl object-contain border-4 border-white/10" />
                    )
                ) : (
                    <div className="bg-white p-10 rounded-[3rem] w-full max-w-2xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={24}/></div>
                            <h3 className="text-2xl font-black text-[#002855] leading-tight">{previewKit.title}</h3>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-h-[50vh] overflow-y-auto">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{previewKit.content}</p>
                        </div>
                        <button 
                            onClick={() => { handleCopyText(previewKit); setPreviewKit(null); }} 
                            className="w-full mt-6 bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-xl"
                        >
                            <Copy size={18}/> Salin & Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default MarketingKit;