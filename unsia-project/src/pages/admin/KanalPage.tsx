import { useEffect, useState } from 'react';
import { 
  Share2, Loader2, Link as LinkIcon, 
  Copy, Check, X, Users, GraduationCap, School, Building2, Briefcase, Download, QrCode, Clock, Plus, Search, ChevronRight
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const KanalPage = () => {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]); 
  const [students, setStudents] = useState([]); 
  const [staff, setStaff] = useState([]);
  const [btsStaff, setBtsStaff] = useState([]); 
  const [b2bStaff, setB2bStaff] = useState([]); 
  
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [partnerHistory, setPartnerHistory] = useState([]); 
  const [isAddingNew, setIsAddingNew] = useState(false); 
  const [textInput, setTextInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentRes, sgsRes, egsRes, btsRes, b2bRes] = await Promise.all([
        api.get('/admin/agents'),
        api.get('/admin/sgs'),
        api.get('/admin/egs'),
        api.get('/admin/bts'),
        api.get('/admin/b2b')
      ]);
      setAgents(agentRes.data.filter((a: any) => a.status === 'Aktif'));
      setStudents(sgsRes.data);
      setStaff(egsRes.data);
      setBtsStaff(btsRes.data);
      setB2bStaff(b2bRes.data);
    } catch (e) { 
      toast.error("Gagal sinkronisasi data kanal"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- FITUR BARU: AMBIL HISTORY SAAT PARTNER DIKLIK ---
  const handleSelectPartner = async (p: any) => {
    setSelectedPartner(p);
    setIsAddingNew(false);
    setGeneratedLink('');
    // Jika jalurnya lapangan (BTS/B2B), tarik data sekolah/perusahaan yang pernah dibuat
    if (activeMode === 'Back to School' || activeMode === 'Kerjasama B2B') {
        try {
            const res = await api.get(`/admin/campaign-history/${p.id}`);
            setPartnerHistory(res.data);
        } catch (e) {
            setPartnerHistory([]);
        }
    }
  };

  const handleGenerateAction = (locSlug?: string, locName?: string) => {
    let link = "";
    const origin = window.location.origin;
    const code = selectedPartner?.referralCode || selectedPartner?.nim || selectedPartner?.nip || selectedPartner?.bts_id || selectedPartner?.b2b_id;

    if (locSlug) {
        // JALUR 1: MENGGUNAKAN HISTORY (Link Lama)
        link = `${origin}/join?loc=${locSlug}&src=${activeMode === 'Back to School' ? 'bts' : 'b2b'}`;
        setTextInput(locName || '');
    } else {
        // JALUR 2: MEMBUAT LINK BARU
        if (activeMode === 'Mitra Umum' && selectedPartner) {
            link = `${origin}/p/${code}`;
        } else if (activeMode === 'Ambassador SGS' && selectedPartner) {
            link = `${origin}/join?ref=${code}`;
        } else if (activeMode === 'Employee EGS' && selectedPartner) {
            link = `${origin}/join?ref=${code}`;
        } else if (activeMode === 'Back to School' && selectedPartner && textInput) {
            link = `${origin}/join?ref=${code}&school=${encodeURIComponent(textInput)}&src=bts`;
        } else if (activeMode === 'Kerjasama B2B' && selectedPartner && textInput) {
            link = `${origin}/join?ref=${code}&partner=${encodeURIComponent(textInput)}&src=b2b`;
        } else if (activeMode === 'Umum') {
            link = `${origin}/join?source=website-utama`;
        }
    }

    if (!link) {
        toast.error("Mohon pilih petugas dan lengkapi data lokasi!");
        return;
    }
    
    setGeneratedLink(link);
    toast.success(locSlug ? "History link dimuat!" : "Tautan baru berhasil dibuat!");
  };

  const downloadQR = () => {
    const svg = document.getElementById('main-qr') as HTMLElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1000; canvas.height = 1000;
      if (ctx) { 
        ctx.fillStyle = "white"; ctx.fillRect(0, 0, 1000, 1000); 
        ctx.drawImage(img, 50, 50, 900, 900); 
      }
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${activeMode}-${textInput || selectedPartner?.name}.png`;
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const closeAll = () => {
    setActiveMode(null); setSelectedPartner(null); setPartnerHistory([]);
    setIsAddingNew(false); setTextInput(''); setGeneratedLink('');
  };

  const channels = [
    { name: 'Umum', desc: 'Website & Iklan Utama', icon: <Share2 size={24} />, color: 'blue', count: null, label: 'Default' },
    { name: 'Mitra Umum', desc: 'Agen Representative', icon: <Users size={24} />, color: 'emerald', count: agents.length, label: 'Agen' },
    { name: 'Back to School', desc: 'Event Sekolah / Expo', icon: <School size={24} />, color: 'amber', count: btsStaff.length, label: 'Tim BTS' },
    { name: 'Ambassador SGS', desc: 'Mahasiswa Aktif (NIM)', icon: <GraduationCap size={24} />, color: 'indigo', count: students.length, label: 'Ambasador' },
    { name: 'Employee EGS', desc: 'Dosen & Staff (NIP)', icon: <Briefcase size={24} />, color: 'rose', count: staff.length, label: 'Staff' },
    { name: 'Kerjasama B2B', desc: 'Instansi & Perusahaan', icon: <Building2 size={24} />, color: 'cyan', count: b2bStaff.length, label: 'Mitra' },
  ];

  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'indigo': return 'bg-indigo-50 text-indigo-600';
      case 'rose': return 'bg-rose-50 text-rose-600';
      case 'cyan': return 'bg-cyan-50 text-cyan-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };


  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-700 text-left -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin</p>
            <ChevronRight size={14} className="text-slate-300" />
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kanal Pendaftaran</p>
          </div>
          <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">Kanal Pendaftaran</h1>
          <p className="text-slate-500 text-sm font-medium">Manajemen jalur & pembuatan link khusus beserta QR Code.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10 transition-all shadow-sm" 
            placeholder="Cari kanal..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-slate-200 to-transparent"></div>

      {/* CHANNEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.length === 0 ? (
          <div className="col-span-full py-10 text-center">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search size={24} className="text-slate-300" />
             </div>
             <p className="text-[#002855] font-bold text-lg">Kanal Tidak Ditemukan</p>
          </div>
        ) : (
          filteredChannels.map((k, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-2 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${getColorClasses(k.color)} transition-colors`}>
                    {k.icon}
                  </div>
                  {k.count !== null && (
                    <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5" title="Total Petugas">
                      <span className="text-xs font-black text-[#002855]">{k.count}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{k.label}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <h3 className="text-xl font-black text-[#002855] tracking-tight">{k.name}</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-8">{k.desc}</p>
              </div>
              
              <button 
                type="button"
                onClick={() => setActiveMode(k.name)} 
                className="w-full py-3.5 bg-blue-50/50 text-[#002855] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#002855] hover:text-white transition-all border border-blue-100/50"
              >
                <QrCode size={16} /> Buat Link & QR
              </button>
            </div>
          ))
        )}
      </div>

      {/* GENERATOR MODAL */}
      {activeMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in text-left">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight">{activeMode}</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Konfigurasi Jalur & History Tautan</p>
                </div>
                <button type="button" title="Tutup" onClick={closeAll} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><X size={20}/></button>
            </div>

            {!generatedLink ? (
                <div className="space-y-6">
                    {activeMode !== 'Umum' ? (
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pilih Petugas / Tim</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-2">
                                {(activeMode === 'Mitra Umum' ? agents : 
                                  activeMode === 'Ambassador SGS' ? students : 
                                  activeMode === 'Employee EGS' ? staff : 
                                  activeMode === 'Back to School' ? btsStaff : b2bStaff).map((p: any) => (
                                    <button key={p.id} onClick={() => handleSelectPartner(p)} className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all border ${selectedPartner?.id === p.id ? 'bg-[#002855] text-white border-[#002855] shadow-lg' : 'bg-white border-slate-100 hover:border-blue-300 text-[#002855]'}`}>
                                        <div className="text-left">
                                            <span className="text-sm font-bold block leading-tight">{p.name}</span>
                                            <span className={`text-[10px] font-semibold uppercase mt-0.5 block ${selectedPartner?.id === p.id ? 'text-blue-200' : 'text-slate-400'}`}>ID: {p.referralCode || p.nim || p.nip || p.bts_id || p.b2b_id}</span>
                                        </div>
                                        {selectedPartner?.id === p.id && <Check size={18} className="text-white"/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center"><p className="text-sm text-blue-700 font-semibold">Kanal Umum mengarah langsung ke halaman formulir pendaftaran utama tanpa afiliasi.</p></div>}

                    {/* --- BAGIAN HISTORY LOKASI --- */}
                    {selectedPartner && (activeMode === 'Back to School' || activeMode === 'Kerjasama B2B') && (
                        <div className="space-y-3 animate-in slide-in-from-top-4 pt-4 border-t border-slate-100">
                             <label className="flex items-center gap-2 text-xs font-black text-[#002855] uppercase tracking-widest">
                                <Clock size={16}/> History Lokasi
                             </label>
                             <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto no-scrollbar pr-2">
                                {partnerHistory.length > 0 ? partnerHistory.map((h: any) => (
                                    <button key={h.id} onClick={() => handleGenerateAction(h.location_slug, h.location_name)} className="w-full px-4 py-3 bg-slate-50 hover:bg-[#002855] hover:text-white rounded-xl text-left flex justify-between items-center group transition-all border border-slate-100 hover:border-[#002855]">
                                        <span className="text-sm font-bold capitalize">{h.location_name}</span>
                                        <QrCode size={16} className="text-slate-400 group-hover:text-white transition-all"/>
                                    </button>
                                )) : (
                                    <p className="text-xs text-slate-400 italic text-center py-2 bg-slate-50 rounded-xl">Belum ada history lokasi.</p>
                                )}
                                {!isAddingNew && (
                                    <button onClick={() => setIsAddingNew(true)} className="w-full px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-bold">
                                        <Plus size={16}/> Tambah Lokasi Baru
                                    </button>
                                )}
                             </div>
                        </div>
                    )}

                    {/* --- INPUT BARU --- */}
                    {(activeMode === 'Umum' || isAddingNew) && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 pt-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{activeMode === 'Back to School' ? 'Nama Sekolah Baru' : activeMode === 'Kerjasama B2B' ? 'Nama Instansi Baru' : ''}</label>
                            {activeMode !== 'Umum' && (
                                <input placeholder="Ketik nama lokasi..." className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-xl font-semibold outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
                            )}
                        </div>
                    )}

                    { (activeMode === 'Umum' || isAddingNew || (selectedPartner && !['Back to School', 'Kerjasama B2B'].includes(activeMode))) && (
                        <button onClick={() => handleGenerateAction()} className="w-full py-4 mt-2 bg-[#002855] text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                            <QrCode size={18}/> Generate QR Sekarang
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl inline-block mx-auto border border-blue-100 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#002855]"></div>
                      <QRCodeSVG id="main-qr" value={generatedLink} size={220} className="mx-auto" />
                    </div>
                    
                    <div className="text-left">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tautan Pendaftaran</p>
                        <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                           <div className="flex-1 truncate px-3 text-sm font-semibold text-[#002855]">{generatedLink}</div>
                           <button title="Salin" onClick={() => { navigator.clipboard.writeText(generatedLink); toast.success("Disalin!"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-5 py-2.5 bg-white border border-slate-200 text-[#002855] rounded-xl font-bold text-xs uppercase flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm shrink-0">
                               {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>} {copied ? 'Tersalin' : 'Copy'}
                           </button>
                        </div>
                    </div>
                    
                    <button title="Download" onClick={downloadQR} className="w-full py-4 bg-[#002855] text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:bg-blue-800 transition-all"><Download size={18}/> Download QR Code</button>
                    
                    <button onClick={() => { setGeneratedLink(''); setIsAddingNew(false); }} className="text-xs font-bold text-slate-400 hover:text-[#002855] transition-colors mt-2 uppercase tracking-widest">Kembali / Buat Lagi</button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanalPage;