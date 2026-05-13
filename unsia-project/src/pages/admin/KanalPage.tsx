import { useEffect, useState } from 'react';
import { 
  Share2, Loader2, Link as LinkIcon, 
  Copy, Check, X, Users, GraduationCap, School, Building2, Briefcase, Download, QrCode, Clock, Plus 
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

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 text-left">
      <div>
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2 text-left">Kanal Pendaftaran</h1>
        <p className="text-slate-400 text-sm font-medium italic text-left">Manajemen jalur & pembuatan QR Code pendaftaran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name: 'Umum', desc: 'Website & Iklan Utama', icon: <Share2 /> },
          { name: 'Mitra Umum', desc: 'Agen Representative', icon: <Users /> },
          { name: 'Back to School', desc: 'Event Sekolah / Expo', icon: <School /> },
          { name: 'Ambassador SGS', desc: 'Mahasiswa Aktif (NIM)', icon: <GraduationCap /> },
          { name: 'Employee EGS', desc: 'Dosen & Staff (NIP)', icon: <Briefcase /> },
          { name: 'Kerjasama B2B', desc: 'Instansi & Perusahaan', icon: <Building2 /> },
        ].map((k, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-80 border-b-4 border-transparent hover:border-blue-600">
            <div>
              <div className="p-4 bg-slate-50 text-[#002855] rounded-2xl w-fit group-hover:bg-[#002855] group-hover:text-white transition-all duration-500">{k.icon}</div>
              <h3 className="text-xl font-black text-[#002855] mt-6 mb-2">{k.name}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed italic">{k.desc}</p>
            </div>
            <button 
              type="button"
              onClick={() => setActiveMode(k.name)} 
              className="w-full py-3.5 bg-slate-50 text-[#002855] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#002855] hover:text-white transition-all border border-slate-100 shadow-sm"
            >
              <LinkIcon size={14} /> Buat Link & QR
            </button>
          </div>
        ))}
      </div>

      {activeMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                    <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight">{activeMode}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 italic tracking-widest">Konfigurasi Jalur & History</p>
                </div>
                <button type="button" title="Tutup Modal" onClick={closeAll} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all"><X size={24}/></button>
            </div>

            {!generatedLink ? (
                <div className="space-y-6">
                    {activeMode !== 'Umum' ? (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase text-center tracking-widest leading-none">Pilih Petugas Lapangan</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar pr-2">
                                {(activeMode === 'Mitra Umum' ? agents : 
                                  activeMode === 'Ambassador SGS' ? students : 
                                  activeMode === 'Employee EGS' ? staff : 
                                  activeMode === 'Back to School' ? btsStaff : b2bStaff).map((p: any) => (
                                    <button key={p.id} onClick={() => handleSelectPartner(p)} className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all ${selectedPartner?.id === p.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 hover:bg-blue-50 text-[#002855]'}`}>
                                        <div className="text-left text-xs font-bold">{p.name} <span className="block text-[9px] opacity-60 uppercase">{p.referralCode || p.nim || p.nip || p.bts_id || p.b2b_id}</span></div>
                                        {selectedPartner?.id === p.id && <Check size={16}/>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : <p className="text-sm text-slate-500 italic text-center py-6">Link umum langsung ke form pendaftaran utama.</p>}

                    {/* --- BAGIAN HISTORY LOKASI --- */}
                    {selectedPartner && (activeMode === 'Back to School' || activeMode === 'Kerjasama B2B') && (
                        <div className="space-y-4 animate-in slide-in-from-top-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">
                                <Clock size={14}/> History Lokasi {selectedPartner.name}
                             </div>
                             <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto no-scrollbar pr-2">
                                {partnerHistory.length > 0 ? partnerHistory.map((h: any) => (
                                    <button key={h.id} onClick={() => handleGenerateAction(h.location_slug, h.location_name)} className="w-full p-4 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl text-left flex justify-between items-center group transition-all">
                                        <span className="text-xs font-bold uppercase">{h.location_name}</span>
                                        <QrCode size={16} className="text-blue-400 group-hover:text-white transition-all"/>
                                    </button>
                                )) : (
                                    <p className="text-[9px] text-slate-400 italic text-center py-2 uppercase">Belum ada history lokasi.</p>
                                )}
                                {!isAddingNew && (
                                    <button onClick={() => setIsAddingNew(true)} className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                                        <Plus size={16}/> Tambah Lokasi Baru
                                    </button>
                                )}
                             </div>
                        </div>
                    )}

                    {/* --- INPUT BARU --- */}
                    {(activeMode === 'Umum' || isAddingNew) && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{activeMode === 'Back to School' ? 'Nama Sekolah' : 'Nama Instansi'}</label>
                            <input placeholder="Ketik nama lokasi baru..." className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-blue-500/10" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
                        </div>
                    )}

                    { (activeMode === 'Umum' || isAddingNew || (selectedPartner && !['Back to School', 'Kerjasama B2B'].includes(activeMode))) && (
                        <button onClick={() => handleGenerateAction()} className="w-full py-5 bg-[#002855] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <QrCode size={18}/> Generate QR Sekarang
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-xl inline-block mx-auto border-4 border-slate-50"><QRCodeSVG id="main-qr" value={generatedLink} size={220} /></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 leading-none">Tautan Siap Pakai</p>
                        <p className="text-sm font-bold text-[#002855] break-all bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">{generatedLink}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button title="Salin" onClick={() => { navigator.clipboard.writeText(generatedLink); toast.success("Disalin!"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="py-4 bg-slate-100 text-[#002855] rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all">
                            {copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Berhasil' : 'Salin'}
                        </button>
                        <button title="Download" onClick={downloadQR} className="py-4 bg-[#002855] text-white rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-blue-800 transition-all"><Download size={16}/> Download</button>
                    </div>
                    <button onClick={() => { setGeneratedLink(''); setIsAddingNew(false); }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Kembali / Buat Lagi</button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanalPage;