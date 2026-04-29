import { useEffect, useState } from 'react';
import { 
  GraduationCap, ShieldCheck, Loader2, TrendingUp, 
  X, Share2, Users, Eye, CheckCircle, ChevronRight,
  Download, DollarSign, MessageCircle, Instagram, Facebook, Music2, ArrowRight,
  PieChart as PieIcon // FIX: Import ditambahkan
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { toast } from 'sonner';

interface Referral {
    id: number;
    name: string;
    phone: string;
    prodi: string;
    status: string;
    registration_fee_proof?: string;
}

const SgsDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [selectedProof, setSelectedProof] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const COLORS = ['#002855', '#3B82F6', '#25D366', '#E1306C', '#8B5CF6'];

    const shareOptions = [
        { name: 'WhatsApp', icon: <MessageCircle size={20}/>, color: 'bg-[#25D366]', slug: 'whatsapp' },
        { name: 'Instagram', icon: <Instagram size={20}/>, color: 'bg-[#E1306C]', slug: 'instagram' },
        { name: 'TikTok', icon: <Music2 size={20}/>, color: 'bg-[#000000]', slug: 'tiktok' },
        { name: 'Facebook', icon: <Facebook size={20}/>, color: 'bg-[#1877F2]', slug: 'facebook' },
    ];

    const fetchData = async () => {
        try {
            const response = await api.get('/agent/dashboard');
            setData(response.data);
        } catch (error) {
            toast.error("Gagal sinkronisasi data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleActivate = async (id: number) => {
        if (!confirm("Aktifkan akun temanmu?")) return;
        try {
            await api.put(`/admin/leads/${id}/activate`);
            toast.success("Akun berhasil diaktifkan!");
            fetchData();
        } catch (e) { toast.error("Gagal aktivasi"); }
    };

    const handleChatWA = (phone: string, name: string) => {
        const message = `Halo ${name}, yuk segera selesaikan daftar ulangnya agar kita bisa kuliah bareng di UNSIA!`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleAutoShare = (platform: string, slug: string) => {
        const code = data?.stats?.agent_code;
        const link = `${window.location.origin}/join?ref=${code}&src=${slug}`;
        
        navigator.clipboard.writeText(link);
        setGeneratedLink(link);
        toast.success(`Link pendaftaran ${platform} disalin!`);
        
        if (slug === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent("Yuk kuliah bareng aku di UNSIA! Daftar di sini: " + link)}`, '_blank');
        }
    };

    const downloadQRCode = () => {
        const svg = document.getElementById('sgs-qr');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);
            }
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-SGS-${data.stats.agent_code}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
    if (!data) return null;

    const { stats, referrals, source_stats, referral_link, chart_data } = data;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            
            {/* 1. BANNER UTAMA */}
            <div className="bg-gradient-to-br from-[#002855] to-indigo-700 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md"><GraduationCap size={24}/></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Student Ambassador</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Halo, {stats.agent_name}!</h1>
                        <p className="text-blue-100 font-medium max-w-md italic">"Bantu temanmu kuliah, kumpulkan poin beasiswamu."</p>
                        <button type="button" onClick={() => setShowLinkModal(true)} className="bg-white text-[#002855] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-yellow-400 transition-all flex items-center gap-2 mt-4 mx-auto md:mx-0">
                            <Share2 size={16} /> Ajak Teman Sekarang
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 group">
                        <QRCodeSVG id="sgs-qr" value={referral_link} size={120} />
                        <button type="button" onClick={downloadQRCode} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 hover:text-blue-800 transition-colors" title="Unduh QR">
                            <Download size={12} /> Unduh QR
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
                        <div>
                            <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight leading-none">Tren Ajak Teman</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aktivitas 7 Hari Terakhir</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chart_data}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><PieIcon size={24} /></div>
                        <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Sumber Sosmed</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={source_stats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {source_stats.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. FINANCE & ID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-xl transition-all group">
                    <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tabungan Beasiswa</span>
                        <h3 className="text-3xl font-black text-emerald-600 mt-1">{formatRupiah(stats.commission_balance)}</h3>
                        <button type="button" onClick={() => navigate('/sgs/scholarship')} className="text-[10px] text-blue-600 mt-4 font-black flex items-center gap-1 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            KLAIM BEASISWA <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner"><DollarSign size={32} /></div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                    <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID Ambassador (NIM)</span>
                        <div className="mt-2 flex items-center gap-3">
                            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-blue-100 tracking-widest">AKTIF</span>
                            <p className="text-sm font-black text-[#002855]">{stats.agent_code}</p>
                        </div>
                    </div>
                    <div className="p-5 bg-slate-50 text-slate-400 rounded-[2rem]"><ShieldCheck size={32} /></div>
                </div>
            </div>

            {/* 4. MONITORING TABLE */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight leading-none">Monitoring Lead</h3>
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Users size={20}/></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                            <tr><th className="p-6">Teman</th><th className="p-6 text-center">Bukti Bayar</th><th className="p-6 text-center">Status</th><th className="p-6 text-center">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-bold">
                            {referrals.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center text-slate-300 italic">Belum ada teman yang kamu ajak.</td></tr>
                            ) : referrals.map((item: Referral, i: number) => (
                                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-6"><div className="text-[#002855] capitalize">{item.name}</div><div className="text-[10px] text-slate-400 font-mono italic">{item.phone}</div></td>
                                    <td className="p-6 text-center">
                                        {item.registration_fee_proof ? (
                                            <button type="button" onClick={() => { setSelectedProof(item.registration_fee_proof!); setShowProofModal(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Lihat Bukti"><Eye size={18}/></button>
                                        ) : <span className="text-[10px] text-slate-300 italic">Belum Upload</span>}
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {item.status === 'active' ? 'Sah' : item.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            {item.status === 'lead' && item.registration_fee_proof ? (
                                                <button type="button" onClick={() => handleActivate(item.id)} className="bg-[#002855] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-blue-800 transition-all">Aktifkan Akun</button>
                                            ) : (['test_passed', 'calon_mahasiswa', 'awaiting_payment'].includes(item.status)) ? (
                                                <button type="button" title="Hubungi WA" onClick={() => handleChatWA(item.phone, item.name)} className="bg-[#25D366] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-[#128C7E] transition-all"><MessageCircle size={14}/> WA</button>
                                            ) : item.status === 'active' ? (
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" title="Sudah Closing"><CheckCircle size={16}/></div>
                                            ) : <span className="text-slate-300 text-[9px] uppercase italic">Menunggu Bayar</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: PREVIEW BUKTI */}
            {showProofModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-4 shadow-2xl relative animate-in zoom-in-95">
                        <button type="button" onClick={() => setShowProofModal(false)} className="absolute -top-4 -right-4 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all" title="Tutup"><X size={20}/></button>
                        <div className="p-2 text-center">
                             <img src={`http://127.0.0.1:8000/storage/${selectedProof}`} alt="Bukti" className="w-full h-auto rounded-[2rem] shadow-inner max-h-[70vh] object-contain" />
                             <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest pb-4">Bukti Bayar Pendaftaran</p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SHARE */}
            {showLinkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight">Ajak Teman</h3>
                            <button type="button" onClick={() => { setShowLinkModal(false); setGeneratedLink(''); }} title="Tutup Modal" className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {shareOptions.map((opt) => (
                                    <button key={opt.name} type="button" onClick={() => handleAutoShare(opt.name, opt.slug)} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                                        <div className={`p-3 ${opt.color} text-white rounded-xl shadow-lg`}>{opt.icon}</div>
                                        <div className="flex-1"><p className="font-black text-[#002855] text-sm leading-none">{opt.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Salin Link Pelacak</p></div>
                                        <ChevronRight size={16} className="text-slate-300" />
                                    </button>
                                ))}
                            </div>
                            {generatedLink && (
                                <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Link Tersalin:</p>
                                    <p className="text-[10px] font-bold text-[#002855] break-all bg-white p-3 rounded-lg border border-blue-50">{generatedLink}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SgsDashboard;