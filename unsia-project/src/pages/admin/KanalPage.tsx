import { useEffect, useState } from 'react';
import { 
  Share2, ArrowRight, Loader2, Link as LinkIcon, 
  Copy, Check, X, Users, GraduationCap, School, Building2, Briefcase, UserCheck 
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

const KanalPage = () => {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]); 
  const [students, setStudents] = useState([]); 
  const [staff, setStaff] = useState([]);
  
  const [isAgentPicker, setIsAgentPicker] = useState(false);
  const [isSgsPicker, setIsSgsPicker] = useState(false);
  const [isEgsPicker, setIsEgsPicker] = useState(false);
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentRes, sgsRes, egsRes] = await Promise.all([
        api.get('/admin/agents'),
        api.get('/admin/sgs'),
        api.get('/admin/egs')
      ]);
      // Hanya tampilkan yang aktif
      setAgents(agentRes.data.filter((a: any) => a.status === 'Aktif'));
      setStudents(sgsRes.data);
      setStaff(egsRes.data);
    } catch (e) { 
      toast.error("Gagal sinkronisasi data kanal"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Link berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const kanalList = [
    { id: 1, name: 'Umum', desc: 'Website & Iklan Utama', icon: <Share2 /> },
    { id: 2, name: 'Mitra Umum', desc: 'Referral Agen Luar', icon: <Users /> },
    { id: 3, name: 'Back to School', desc: 'Event Sekolah / Expo', icon: <School /> },
    { id: 4, name: 'Ambassador SGS', desc: 'Mahasiswa Aktif (NIM)', icon: <GraduationCap /> },
    { id: 5, name: 'Employee EGS', desc: 'Dosen & Staff (NIP)', icon: <Briefcase /> },
    { id: 6, name: 'Kerjasama B2B', desc: 'Instansi & Perusahaan', icon: <Building2 /> },
  ];

  // LOGIKA PEMISAHAN LINK
  const handleAction = (kanal: string) => {
    if (kanal === 'Mitra Umum') setIsAgentPicker(true);
    else if (kanal === 'Ambassador SGS') setIsSgsPicker(true);
    else if (kanal === 'Employee EGS') setIsEgsPicker(true);
    else {
      // Jalur Umum / Kerjasama langsung ke formulir pendaftaran
      const slug = kanal.toLowerCase().replace(/\s+/g, '-');
      const link = `${window.location.origin}/join?source=${slug}`;
      setGeneratedLink(link);
    }
  };

  const closeAllPickers = () => {
    setIsAgentPicker(false);
    setIsSgsPicker(false);
    setIsEgsPicker(false);
    setGeneratedLink('');
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">Kanal Pendaftaran</h1>
          <p className="text-slate-400 text-sm font-medium italic">Manajemen jalur pendaftaran eksklusif partner.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kanalList.map((k) => (
          <div key={k.id} className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-80 border-b-4 border-b-transparent hover:border-b-blue-600">
            <div>
              <div className="p-4 bg-slate-50 text-[#002855] rounded-2xl w-fit group-hover:bg-[#002855] group-hover:text-white transition-all duration-500">{k.icon}</div>
              <h3 className="text-xl font-black text-[#002855] mt-6 mb-2">{k.name}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed italic">{k.desc}</p>
            </div>
            <button 
              type="button"
              onClick={() => handleAction(k.name)} 
              className="w-full py-3.5 bg-slate-50 text-[#002855] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#002855] hover:text-white transition-all shadow-sm border border-slate-100"
            >
              <LinkIcon size={14} /> Buat Link Jalur
            </button>
          </div>
        ))}
      </div>

      {/* MODAL PICKER & GENERATOR */}
      {(isAgentPicker || isSgsPicker || isEgsPicker || generatedLink) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight">Kustom Link Jalur</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                        {isAgentPicker ? 'Daftar Mitra Aktif' : isSgsPicker ? 'Daftar Ambassador' : isEgsPicker ? 'Daftar Karyawan' : 'Link Tergenerate'}
                    </p>
                </div>
                <button type="button" onClick={closeAllPickers} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all" title="Tutup Modal">
                  <X size={24}/>
                </button>
            </div>

            {generatedLink ? (
                <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 text-center space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-sm border-8 border-blue-100"><UserCheck size={32}/></div>
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Link Siap Disebarkan</p>
                        <p className="text-sm font-bold text-[#002855] break-all bg-white p-5 rounded-2xl border border-blue-100 shadow-inner">{generatedLink}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => copyToClipboard(generatedLink)} 
                      className="w-full py-5 bg-[#002855] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                      {copied ? <Check size={18}/> : <Copy size={18}/>} 
                      {copied ? 'Tersalin ke Clipboard' : 'Salin Link Landing Page'}
                    </button>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto no-scrollbar pr-2">
                    {/* LIST UNTUK MITRA UMUM -> KE LANDING PAGE AGENT */}
                    {isAgentPicker && (agents.length === 0 ? <p className="text-center p-10 text-slate-400 italic">Tidak ada agen aktif.</p> : agents.map((a: any) => (
                        <button key={a.id} onClick={() => setGeneratedLink(`${window.location.origin}/p/${a.referralCode}`)} className="w-full p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-blue-200 rounded-[1.5rem] flex justify-between items-center group transition-all font-bold">
                            <div className="text-left flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 text-xs font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">{a.name.charAt(0)}</div>
                              <div>
                                <p className="text-[#002855] leading-none mb-1">{a.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">{a.referralCode}</p>
                              </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"/>
                        </button>
                    )))}
                    
                    {/* LIST UNTUK AMBASSADOR SGS -> KE LANDING PAGE AGENT */}
                    {isSgsPicker && (students.length === 0 ? <p className="text-center p-10 text-slate-400 italic">Tidak ada ambassador aktif.</p> : students.map((s: any) => (
                        <button key={s.id} onClick={() => setGeneratedLink(`${window.location.origin}/p/${s.nim}`)} className="w-full p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-200 rounded-[1.5rem] flex justify-between items-center group transition-all font-bold">
                            <div className="text-left flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 text-xs font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">{s.name.charAt(0)}</div>
                              <div>
                                <p className="text-[#002855] leading-none mb-1">{s.name}</p>
                                <p className="text-[9px] text-indigo-400 uppercase tracking-widest">NIM: {s.nim}</p>
                              </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"/>
                        </button>
                    )))}

                    {/* LIST UNTUK EMPLOYEE EGS -> KE LANDING PAGE AGENT */}
                    {isEgsPicker && (staff.length === 0 ? <p className="text-center p-10 text-slate-400 italic">Tidak ada staf aktif.</p> : staff.map((st: any) => (
                        <button key={st.id} onClick={() => setGeneratedLink(`${window.location.origin}/p/${st.nip}`)} className="w-full p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-emerald-200 rounded-[1.5rem] flex justify-between items-center group transition-all font-bold">
                            <div className="text-left flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 text-xs font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">{st.name.charAt(0)}</div>
                              <div>
                                <p className="text-[#002855] leading-none mb-1">{st.name}</p>
                                <p className="text-[9px] text-emerald-600 uppercase tracking-widest">NIP: {st.nip}</p>
                              </div>
                            </div>
                            <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"/>
                        </button>
                    )))}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanalPage;