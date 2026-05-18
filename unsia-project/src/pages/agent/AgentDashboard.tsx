import { useEffect, useState } from 'react';
import {
    DollarSign, ShieldCheck, Loader2, ArrowRight, TrendingUp,
    X, Share2, Users, GraduationCap, Briefcase,
    MessageCircle, Instagram, Facebook, Music2, ChevronRight, PieChart as PieIcon, Eye, CheckCircle, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { toast } from 'sonner';

// --- KOMPONEN SKELETON (UX saat internet lemot) ---
const SkeletonTable = () => (
    <div className="p-8 space-y-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-50 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="w-24 h-8 bg-slate-100 rounded-full"></div>
            </div>
        ))}
    </div>
);

interface Referral {
    id: number;
    name: string;
    phone: string;
    prodi: string;
    date: string;
    status: string;
    source: string;
    commission_potential: number;
    registration_fee_proof?: string;
}

const AgentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [selectedProof, setSelectedProof] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [data, setData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'semua' | 'berhasil' | 'proses' | 'gagal'>('semua');

    const [stats, setStats] = useState({
        total_referrals: 0,
        commission_balance: 0,
        agent_status: 'Active',
        agent_code: 'REF-...',
        agent_name: 'Partner',
        agent_type: 'umum'
    });

    const COLORS = ['#002855', '#3B82F6', '#0EA5E9', '#8B5CF6', '#25D366'];

    const shareOptions = [
        { name: 'WhatsApp', icon: <MessageCircle size={20} />, color: 'bg-[#25D366]', slug: 'whatsapp' },
        { name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-[#E1306C]', slug: 'instagram' },
        { name: 'TikTok', icon: <Music2 size={20} />, color: 'bg-[#000000]', slug: 'tiktok' },
        { name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-[#1877F2]', slug: 'facebook' },
    ];

    const fetchData = async () => {
        try {
            const response = await api.get('/agent/dashboard');
            setData(response.data);
            setStats(response.data.stats);
        } catch (error) {
            toast.error("Gagal sinkronisasi data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const counts = {
        total: data?.referrals?.length || 0,
        berhasil: data?.referrals?.filter((r: any) => r.status === 'active').length || 0,
        gagal: data?.referrals?.filter((r: any) => r.status === 'test_failed').length || 0,
        proses: data?.referrals?.filter((r: any) => ['lead', 'calon_mahasiswa', 'test_passed', 'awaiting_payment'].includes(r.status)).length || 0
    };

    const getFilteredData = () => {
        if (!data?.referrals) return [];
        const refs = data.referrals;
        if (activeTab === 'berhasil') return refs.filter((r: any) => r.status === 'active');
        if (activeTab === 'gagal') return refs.filter((r: any) => r.status === 'test_failed');
        if (activeTab === 'proses') return refs.filter((r: any) => ['lead', 'calon_mahasiswa', 'test_passed', 'awaiting_payment'].includes(r.status));
        return refs;
    };

    const handleActivate = async (id: number) => {
        if (!confirm("Aktifkan akun mahasiswa ini untuk akses ujian?")) return;
        try {
            await api.put(`/admin/leads/${id}/activate`);
            toast.success("Akun diaktifkan!");
            fetchData();
        } catch { toast.error("Gagal mengaktifkan akun"); }
    };

    const handleChatWA = (phone: string, name: string) => {
        const message = `Halo ${name}, saya Partner resmi UNSIA. Saya lihat kamu sudah terdaftar. Ada yang bisa saya bantu?`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleAutoShare = (platform: string, slug: string) => {
        const code = stats.agent_code;
        const type = stats.agent_type;
        if (!code || code === 'N/A') { toast.error("Data pendaftaran belum siap."); return; }

        const link = type === 'umum'
            ? `${window.location.origin}/p/${code}?src=${slug}`
            : `${window.location.origin}/join?ref=${code}&src=${slug}`;

        navigator.clipboard.writeText(link);
        setGeneratedLink(link);

        if (slug === 'whatsapp') {
            const msg = encodeURIComponent(`Halo! Yuk daftar kuliah online di UNSIA melalui link resmi saya di sini: ${link}`);
            window.open(`https://wa.me/?text=${msg}`, '_blank');
        } else {
            toast.success(`Link untuk ${platform} berhasil disalin!`);
        }
    };

    const downloadQRCode = () => {
        const svg = document.getElementById('agent-qr');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = 1000; canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 50, 50, 900, 900);
            }
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-UNSIA-${stats.agent_code}.png`;
            downloadLink.href = pngFile; downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    if (loading || !data) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const { source_stats, referral_link, chart_data } = data;
    const isSGS = stats.agent_type === 'sgs';
    const isEGS = stats.agent_type === 'egs';

    return (
        <div className="space-y-8 pb-10">

            {/* 1. WELCOME BANNER */}
            <div className="bg-gradient-to-br from-[#002855] via-blue-800 to-blue-600 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                {isSGS ? <GraduationCap size={24} /> : isEGS ? <Users size={24} /> : <Briefcase size={24} />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                                {isSGS ? 'Student Ambassador' : isEGS ? 'Employee Ambassador' : 'Official Partner'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">Halo, {stats.agent_name}!</h1>
                        <p className="text-blue-100 font-medium max-w-md italic text-sm md:text-base">
                            {isEGS ? '"Kontribusi Anda sebagai karyawan membangun masa depan digital UNSIA."' : isSGS ? '"Bantu temanmu kuliah, kumpulkan poin beasiswamu."' : '"Pantau performa referral dan buat link pelacak otomatis Anda."' }
                        </p>
                        <button type="button" onClick={() => setShowLinkModal(true)} className="bg-white text-[#002855] px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-yellow-400 hover:text-[#002855] transition-all duration-500 flex items-center justify-center md:justify-start gap-3 mt-4 mx-auto md:mx-0 w-full md:w-auto">
                            <Share2 size={18} /> Bagikan Link Pendaftaran
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 group w-full md:w-auto transform hover:scale-105 transition-all duration-500 border border-slate-100">
                        <div className="p-2 border-2 border-slate-50 rounded-2xl">
                            <QRCodeSVG id="agent-qr" value={referral_link} size={140} />
                        </div>
                        <button type="button" onClick={downloadQRCode} className="w-full py-2.5 bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase flex justify-center items-center gap-2 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm" title="Download Kode QR">
                            <Download size={14} /> Unduh QR
                        </button>
                    </div>
                </div>
            </div>

            {/* STATISTICS CARDS (NEW) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Saldo Tersedia</p>
                        <h3 className="text-2xl font-black text-emerald-600 mt-1">{formatRupiah(stats.commission_balance)}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Referral</p>
                        <h3 className="text-2xl font-black text-[#002855] mt-1">{counts.total} Orang</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Loader2 size={24} /></div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pending Comm.</p>
                        <h3 className="text-2xl font-black text-amber-600 mt-1">{formatRupiah(data?.referrals?.filter((r: any) => ['lead', 'calon_mahasiswa', 'test_passed', 'awaiting_payment'].includes(r.status)).reduce((acc: number, curr: any) => acc + (curr.commission_potential || 0), 0) || 0)}</h3>
                    </div>
                </div>
            </div>

            {/* 2. CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={24} /></div>
                        <div>
                            <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight leading-none">Tren Referral</h3>
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
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
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

            {/* 3. FINANCE & STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-xl transition-all group">
                    <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isSGS ? 'Tabungan Beasiswa' : isEGS ? 'Bonus Kinerja' : 'Saldo Komisi'}</span>
                        <h3 className="text-3xl font-black text-emerald-600 mt-1">{formatRupiah(stats.commission_balance)}</h3>
                        <button type="button" onClick={() => navigate('/agent/finance')} className="text-[10px] text-blue-600 mt-4 font-black flex items-center gap-1 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            {isSGS ? 'KLAIM BEASISWA' : 'TARIK DANA'} <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner"><DollarSign size={32} /></div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                    <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Identitas Partner</span>
                        <div className="mt-2 flex items-center gap-3">
                            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-blue-100 tracking-widest">{stats.agent_status}</span>
                            <p className="text-sm font-black text-[#002855]">{stats.agent_code}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase italic">Link Referral Sinkron</p>
                    </div>
                    <div className="p-5 bg-slate-50 text-slate-400 rounded-[2rem]"><ShieldCheck size={32} /></div>
                </div>
            </div>

            {/* RECENT ACTIVITY & PROMO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Aktivitas Terbaru</h3>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Live</span>
                    </div>
                    <div className="space-y-4">
                        {data?.referrals?.slice(0, 5).map((r: any, i: number) => {
                            const maskedName = r.name.substring(0, r.name.indexOf(' ') > -1 ? r.name.indexOf(' ') + 2 : 4) + '***';
                            return (
                                <div key={i} className="flex justify-between items-center p-4 border border-slate-50 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black uppercase">{r.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-bold text-[#002855] text-sm">{maskedName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{r.prodi || 'Program Studi'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] px-3 py-1 rounded-full inline-block font-black uppercase ${r.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{r.status === 'active' ? 'Berhasil' : 'Proses'}</p>
                                        <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">{r.date}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {(!data?.referrals || data.referrals.length === 0) && (
                            <p className="text-center text-slate-400 text-xs italic py-8">Belum ada aktivitas.</p>
                        )}
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="lg:col-span-4 relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/20 flex flex-col justify-between overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    <div className="relative z-10">
                        <span className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Promo Spesial</span>
                        <h3 className="text-2xl font-black mt-6 mb-3 leading-tight tracking-tight">Bonus Reward<br/>Bulan Ini!</h3>
                        <p className="text-xs font-medium text-white/90 leading-relaxed">Tier komisi naik otomatis: <strong className="text-white">Rp 500.000</strong> per maba (aktif &lt;25), naik menjadi <strong className="text-white">Rp 700.000</strong> setelah 25 maba aktif.</p>
                    </div>
                    <button onClick={() => navigate('/agent/tools')} className="relative z-10 mt-8 w-full py-4 bg-white text-orange-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-50 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                        Cek Detail Promo <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* 4. MONITORING TABLE DENGAN TAB FILTERING */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                    <div>
                        <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight leading-none">Monitoring Lead</h3>
                        <p className="text-slate-400 text-xs font-medium mt-1 italic uppercase tracking-widest">Data pendaftaran Real-time</p>
                    </div>
                    
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {[
                            { id: 'semua', label: 'Semua', count: counts.total, color: 'text-slate-600' },
                            { id: 'berhasil', label: 'Berhasil', count: counts.berhasil, color: 'text-emerald-600' },
                            { id: 'proses', label: 'Proses', count: counts.proses, color: 'text-blue-600' },
                            { id: 'gagal', label: 'Gagal', count: counts.gagal, color: 'text-rose-600' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTab(t.id as 'semua' | 'berhasil' | 'proses' | 'gagal')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white shadow-sm ring-1 ring-black/5 text-[#002855]' : 'text-slate-400 hover:text-slate-600'}`}
                                title={`Filter ${t.label}`}
                            >
                                {t.label} <span className={`px-1.5 py-0.5 rounded-md bg-slate-100 ${t.color}`}>{t.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? <SkeletonTable /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                                <tr>
                                    <th className="p-6">Mahasiswa</th>
                                    <th className="p-6 text-center">Bukti Bayar</th>
                                    <th className="p-6 text-center">Status</th>
                                    <th className="p-6 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold">
                                {getFilteredData().length === 0 ? (
                                    <tr><td colSpan={4} className="p-20 text-center text-slate-300 italic font-medium">Tidak ada data di kategori ini.</td></tr>
                                ) : getFilteredData().map((item: Referral, i: number) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-6"><div className="text-[#002855] capitalize">{item.name}</div><div className="text-[10px] text-slate-400 font-mono italic">{item.phone}</div></td>
                                        <td className="p-6 text-center">
                                            {item.registration_fee_proof ? (
                                                <button type="button" title="Lihat Bukti" onClick={() => { setSelectedProof(item.registration_fee_proof!); setShowProofModal(true); }} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Eye size={18} /></button>
                                            ) : <span className="text-[10px] text-slate-300 italic">Belum Upload</span>}
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : item.status === 'test_failed' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {item.status === 'active' ? 'Mahasiswa Aktif' : item.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center gap-2">
                                                {item.status === 'lead' && item.registration_fee_proof ? (
                                                    <button type="button" onClick={() => handleActivate(item.id)} className="bg-[#002855] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-blue-800 transition-all">Aktifkan Akun</button>
                                                ) : (['test_passed', 'calon_mahasiswa', 'awaiting_payment'].includes(item.status)) ? (
                                                    <button type="button" title="Kirim WA" onClick={() => handleChatWA(item.phone, item.name)} className="bg-[#25D366] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-[#128C7E] transition-all"><MessageCircle size={14} /> WA</button>
                                                ) : item.status === 'active' ? (
                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" title="Sudah Closing"><CheckCircle size={16} /></div>
                                                ) : (
                                                    <span className="text-slate-300 text-[9px] uppercase italic">Pendaftaran</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL: PREVIEW BUKTI */}
            {showProofModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-4 shadow-2xl relative">
                        <button type="button" onClick={() => setShowProofModal(false)} className="absolute -top-4 -right-4 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all" title="Tutup Bukti"><X size={20} /></button>
                        <div className="p-2 text-center">
                            <img src={`http://127.0.0.1:8000/storage/${selectedProof}`} alt="Bukti Transfer" className="w-full h-auto rounded-[2rem] shadow-inner max-h-[70vh] object-contain" />
                            <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest pb-4">Bukti Bayar Pendaftaran</p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: SHARE AUTO */}
            {showLinkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight">Bagikan Link</h3>
                            <button type="button" title="Tutup Modal" onClick={() => { setShowLinkModal(false); setGeneratedLink(''); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {shareOptions.map((opt) => (
                                <button key={opt.name} type="button" onClick={() => handleAutoShare(opt.name, opt.slug)} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left" title={`Share via ${opt.name}`}>
                                    <div className={`p-3 ${opt.color} text-white rounded-xl shadow-lg`}>{opt.icon}</div>
                                    <div className="flex-1">
                                        <p className="font-black text-[#002855] text-sm leading-none">{opt.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Salin Link Pelacak</p>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </button>
                            ))}
                        </div>
                        {generatedLink && (
                            <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Link Tersalin:</p>
                                <p className="text-[10px] font-bold text-[#002855] break-all bg-white p-3 rounded-lg border border-blue-50 shadow-inner">{generatedLink}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;