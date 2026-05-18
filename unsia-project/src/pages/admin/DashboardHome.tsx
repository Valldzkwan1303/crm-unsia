import { useEffect, useState, useCallback } from 'react';
import {
  Users, UserCheck, DollarSign, TrendingUp, BarChart3, Loader2,
  PieChart as PieIcon, Target, Share2, Trophy,
  Plus, Download, Clock, Zap, ArrowUpRight, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../api/axios';
import { Card } from '../../components/Card';

// ── Mini SVG Sparkline komponen ──
const Sparkline = ({ trend = 'up' }: { trend?: 'up' | 'down' }) => {
  const upPoints = "0,30 10,25 20,20 30,22 40,15 50,10 60,12";
  const downPoints = "0,10 10,15 20,12 30,18 40,20 50,25 60,28";
  const points = trend === 'up' ? upPoints : downPoints;
  const color = trend === 'up' ? '#3B82F6' : '#F59E0B';
  return (
    <svg width="60" height="36" viewBox="0 0 60 36" className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${trend}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ── Modul: formatRelativeTime ──
const formatRelativeTime = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} jam lalu`;
  return `${Math.floor(diffHrs / 24)} hari lalu`;
};

// ── Program Studi options ──
const PROGRAM_STUDI = [
  'S1 Informatika',
  'S1 Manajemen',
  'S1 Akuntansi',
  'S1 Ilmu Komunikasi',
  'S1 Hukum',
  'S1 Psikologi',
  'S2 Manajemen',
  'S2 Informatika',
];

// ── Modal Tambah Prospek ──
interface ProspekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProspekModal = ({ isOpen, onClose, onSuccess }: ProspekModalProps) => {
  const [form, setForm] = useState({ nama: '', email: '', whatsapp: '', prodi: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/admin/prospects', {
        name: form.nama,
        email: form.email || undefined,
        phone: form.whatsapp,
        prodi_interest: form.prodi,
        source_platform: 'Admin Panel',
      });
      setSaving(false);
      setSuccess(true);
      onSuccess(); // refresh dashboard stats
      setTimeout(() => {
        setSuccess(false);
        setForm({ nama: '', email: '', whatsapp: '', prodi: '' });
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setSaving(false);
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const msg =
        axiosErr?.response?.data?.message ||
        (axiosErr?.response?.data?.errors
          ? Object.values(axiosErr.response.data.errors).flat().join(' ')
          : 'Gagal menyimpan data. Coba lagi.');
      setError(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002855] to-blue-700 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg tracking-tight">Tambah Prospek</h2>
            <p className="text-blue-200 text-xs mt-0.5">Pendaftaran manual calon mahasiswa</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-1.5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
              <span className="text-xs font-bold leading-snug">{error}</span>
            </div>
          )}
          {/* Nama */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              required
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-700 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-700 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              required
              placeholder="08xxxxxxxxxx"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-700 transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Program Studi */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
              Program Studi <span className="text-red-500">*</span>
            </label>
            <select
              name="prodi"
              value={form.prodi}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-medium text-slate-700 transition-all bg-white appearance-none"
            >
              <option value="" disabled>-- Pilih Program Studi --</option>
              {PROGRAM_STUDI.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || success}
              className="flex-1 px-4 py-3 rounded-xl bg-[#002855] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Menyimpan…</>
              ) : success ? (
                <><CheckCircle size={14} /> Tersimpan!</>
              ) : (
                'Simpan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AuditLog {
  id: number;
  action: string;
  module: string;
  details: string;
  created_at: string;
  user?: { name: string };
}

interface DashboardData {
  stats: { total_leads: number; active_agents: number; closing_rate: number; total_commission: number };
  source_data: { name: string; value: number }[];
  channel_data: { name: string; leads: number }[];
  agent_performance: { name: string; value: number }[];
}

const DashboardHome = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Greeting dinamis berdasarkan jam
  const hour = new Date().getHours();
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';
  const userName = localStorage.getItem('userName') || 'Administrator';
  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const COLORS = ['#002855', '#3B82F6', '#25D366', '#E1306C', '#8B5CF6', '#F59E0B'];

  const fetchData = useCallback(async () => {
    try {
      const [dashRes, logsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/audit-logs').catch(() => ({ data: { data: [] } }))
      ]);
      setData(dashRes.data);
      setAuditLogs(logsRes.data?.data?.slice(0, 6) || []);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  const handleExport = () => {
    if (!data) return;
    const { stats } = data;
    const rows = [
      ['Metrik', 'Nilai'],
      ['Total Prospek', stats.total_leads],
      ['Mitra Aktif', stats.active_agents],
      ['Closing Rate (%)', stats.closing_rate],
      ['Total Komisi (IDR)', stats.total_commission],
      ['Tanggal Export', new Date().toLocaleDateString('id-ID')],
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Laporan_Dashboard_CRM.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = data?.stats || { total_leads: 0, active_agents: 0, closing_rate: 0, total_commission: 0 };
  const source_data = data?.source_data || [];
  const channel_data = data?.channel_data || [];
  const agent_performance = data?.agent_performance || [];

  const statCards = [
    {
      label: 'Total Prospek',
      value: stats.total_leads,
      icon: Users,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: 'Data real-time',
      badgeUp: true,
    },
    {
      label: 'Mitra Aktif',
      value: stats.active_agents,
      icon: TrendingUp,
      bg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      badge: 'Data real-time',
      badgeUp: true,
    },
    {
      label: 'Closing Rate',
      value: `${stats.closing_rate}%`,
      icon: UserCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badge: 'Active vs Total Leads',
      badgeUp: true,
    },
    {
      label: 'Total Komisi',
      value: formatRupiah(stats.total_commission),
      icon: DollarSign,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badge: 'Akumulasi seluruh wallet',
      badgeUp: true,
    },
  ];

  // Target kolektif dihitung dari channel_data (total real leads)
  const collectiveTarget = Math.max(stats.total_leads + 10, 50);
  const progressPercent = Math.min(Math.round((stats.total_leads / collectiveTarget) * 100), 100);
  const dynamicProgressStyle = { '--p-width': `${progressPercent}%` } as React.CSSProperties;

  return (
    <div className="space-y-6 pb-10">
      <ProspekModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* ══ GREETING HEADER ══ */}
      <div className="bg-gradient-to-r from-[#002855] to-blue-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
        {/* Dekorasi */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-8 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">{todayStr}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{userName}!</span>
            </h1>
            <p className="text-blue-200/70 text-sm font-medium mt-1.5">
              Berikut adalah ringkasan performa sistem hari ini.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#002855] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Tambah Prospek</span>
              <span className="sm:hidden">Prospek</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export Laporan</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS + SPARKLINE ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100/80 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 ${card.bg} ${card.iconColor} rounded-xl`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</p>
            <h3 className="text-xl md:text-2xl font-black text-[#002855] leading-tight">{card.value}</h3>
            <div className="flex items-center gap-1 mt-2 text-[10px] font-black text-emerald-500">
              <ArrowUpRight size={12} />
              {card.badge}
            </div>
          </div>
        ))}
      </div>

      {/* ══ CHARTS ROW ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* PIE 1: Sumber Sosmed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Share2 size={18} /></div>
            <div>
              <h4 className="font-black text-[#002855] text-sm">Sumber Sosmed</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Distribusi leads</p>
            </div>
          </div>
          <div className="h-56 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={source_data} innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                  {source_data.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE 2: Kontribusi Mitra */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><PieIcon size={18} /></div>
            <div>
              <h4 className="font-black text-[#002855] text-sm">Kontribusi Mitra</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mahasiswa aktif per mitra</p>
            </div>
          </div>
          <div className="h-56 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={agent_performance} innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                  {agent_performance.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TARGET + LEADERBOARD */}
        <div className="flex flex-col gap-4">

          {/* Target Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Target size={18} /></div>
              <div>
                <h4 className="font-black text-[#002855] text-sm">Target Kolektif</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stats.total_leads} / {collectiveTarget} leads</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-400 text-xs">Progress Bulan Ini</span>
                <span className="font-black text-blue-600 text-lg">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-1000 w-[var(--p-width)]"
                  style={dynamicProgressStyle}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {progressPercent >= 100 ? '🎉 Target tercapai!' : `Butuh ${collectiveTarget - stats.total_leads} leads lagi untuk mencapai target.`}
              </p>
            </div>
          </div>

          {/* Top 3 Leaderboard */}
          <div className="bg-gradient-to-br from-[#002855] to-blue-800 rounded-2xl p-5 shadow-xl shadow-blue-900/20 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-400" size={18} />
              <h4 className="font-black uppercase text-xs tracking-widest">Top 3 Perekrut</h4>
            </div>
            <div className="space-y-2.5">
              {agent_performance.slice(0, 3).map((agent: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white/8 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-slate-300 text-slate-700' : 'bg-amber-700 text-amber-100'}`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold truncate max-w-[100px]">{agent.name}</span>
                  </div>
                  <span className="text-[10px] font-black bg-blue-500/50 px-2.5 py-1 rounded-full shrink-0">{agent.value} Maba</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BAR CHART + RECENT ACTIVITIES ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* BAR CHART: Kanal Performa */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={18} /></div>
              <div>
                <h4 className="font-black text-[#002855] text-sm">Performa Kanal Pendaftaran</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total leads per kanal</p>
              </div>
            </div>
            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider">Bulan Ini</span>
          </div>
          <div className="h-72 overflow-x-auto no-scrollbar">
            <ResponsiveContainer width="100%" height="100%" minWidth={500}>
              <BarChart data={channel_data} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#f0f9ff', radius: 10 }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="leads" radius={[10, 10, 0, 0]}>
                  {channel_data.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITIES — dari Audit Log API */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Clock size={18} /></div>
            <div>
              <h4 className="font-black text-[#002855] text-sm">Log Aktivitas</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Audit trail sistem</p>
            </div>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-72 no-scrollbar">
            {auditLogs.length === 0 ? (
              <p className="text-center text-slate-300 text-xs italic py-8">Belum ada log aktivitas.</p>
            ) : auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <Clock size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-700 leading-snug capitalize">{log.action} — {log.module}</p>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{log.details}</p>
                  {log.user && <p className="text-[10px] text-blue-500 font-bold mt-0.5">oleh: {log.user.name}</p>}
                </div>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wide shrink-0 mt-0.5">{formatRelativeTime(log.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;