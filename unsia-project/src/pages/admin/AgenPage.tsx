import { useEffect, useState } from 'react';
import { 
  Users, CheckCircle, DollarSign, Search, Plus, Trash2, X, ArrowLeft, Smartphone, Loader2, Check, Copy, ChevronRight, Link as LinkIcon
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  area: string;
  status: 'Aktif' | 'Pending' | 'Nonaktif';
  referrals: number;
  commission: number; // Field nominal saldo
  referralCode: string;
  bankInfo: string;
  pending_payouts_count: number;
}

interface Payout {
  id: number;
  amount: number;
  status: string;
  created_at: string;
}

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50 hidden md:table-row">
    <td className="py-5 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-full"></div><div><div className="h-4 bg-slate-100 rounded w-32 mb-2"></div><div className="h-3 bg-slate-50 rounded w-24"></div></div></div></td>
    <td className="py-5 px-6"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
    <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded w-12 mx-auto"></div></td>
    <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
    <td className="py-5 px-6"><div className="flex justify-center gap-2"><div className="w-8 h-8 bg-slate-50 rounded-lg"></div><div className="w-8 h-8 bg-slate-50 rounded-lg"></div></div></td>
  </tr>
);

const AgenPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'create'>('list');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filterTab, setFilterTab] = useState<'Semua' | 'Pending' | 'Aktif'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [payoutConfirm, setPayoutConfirm] = useState<{show: boolean, id: number | null}>({ show: false, id: null });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', area: '' });
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/agents');
      setAgents(Array.isArray(response.data) ? response.data : []);
    } catch (error) { toast.error("Gagal muat data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const executePayout = async () => {
    if(!payoutConfirm.id) return;
    try {
      await api.put(`/admin/payouts/${payoutConfirm.id}/approve`, { note: 'Paid' });
      toast.success('Berhasil dibayar');
      setPayoutConfirm({ show: false, id: null });
      if(selectedAgent) fetchPayouts(selectedAgent.id);
      fetchData();
    } catch (e) { toast.error('Gagal bayar'); }
  };

  const fetchPayouts = async (id: number) => {
    try {
      const res = await api.get(`/admin/agents/${id}/payouts`);
      setPayouts(res.data);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/agents', formData);
      toast.success('Mitra terdaftar');
      setViewState('list');
      setFormData({ name: '', email: '', phone: '', area: '' });
      fetchData();
    } catch (e) { toast.error('Gagal mendaftarkan mitra'); }
  };

  const formatCurrency = (amount: any) => {
    const value = parseFloat(amount) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const calculateTotalCommission = () => agents.reduce((sum, a) => sum + (parseFloat(a.commission as any) || 0), 0);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const filteredAgents = agents.filter(a => {
    const matchesTab = filterTab === 'Semua' ? true : a.status === filterTab;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Nonaktif': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (viewState === 'create') {
    return (
      <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pt-8 pb-20 text-left">
           <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-all"><ArrowLeft size={18}/> Kembali ke Daftar Mitra</button>
           
           <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-2xl">
              <h1 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-2">Undang Mitra Baru</h1>
              <p className="text-slate-500 text-sm font-medium mb-10">Lengkapi formulir di bawah untuk mendaftarkan mitra pemasaran baru ke dalam sistem.</p>
              
              <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                      <label htmlFor="a-name" className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input id="a-name" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama lengkap" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label htmlFor="a-email" className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Terdaftar <span className="text-red-500">*</span></label>
                          <input id="a-email" type="email" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@contoh.com" />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="a-phone" className="text-xs font-black text-slate-500 uppercase tracking-widest">Nomor WhatsApp <span className="text-red-500">*</span></label>
                          <input id="a-phone" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="081234567890" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label htmlFor="a-area" className="text-xs font-black text-slate-500 uppercase tracking-widest">Domisili / Wilayah <span className="text-red-500">*</span></label>
                      <input id="a-area" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Contoh: Jakarta Selatan" />
                  </div>
                  <button type="submit" className="w-full bg-[#002855] text-white py-4 mt-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-blue-800 transition-all flex justify-center items-center gap-2">Daftarkan Mitra</button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-700 text-left -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
         <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin</p>
              <ChevronRight size={14} className="text-slate-300" />
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Mitra Pemasaran</p>
            </div>
            <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight mb-2 leading-none">Mitra Umum</h1>
            <p className="text-slate-500 text-sm font-medium">Manajemen agen pemasaran dan komisi afiliasi.</p>
         </div>
         <button onClick={() => setViewState('create')} className="bg-[#002855] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-blue-800 transition-all">
            <Plus size={18}/> Undang Mitra Baru
         </button>
      </div>

      {/* STATISTICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Mitra</p><h3 className="text-3xl font-black text-[#002855]">{agents.length}</h3></div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Aktif</p><h3 className="text-3xl font-black text-emerald-600">{agents.filter(a=>a.status==='Aktif').length}</h3></div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Total Komisi Keluar</p><h3 className="text-3xl font-black text-amber-600">{formatCurrency(calculateTotalCommission())}</h3></div>
            <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform"><DollarSign size={24}/></div>
         </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex bg-slate-200/50 p-1 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200/50">
            {['Semua', 'Pending', 'Aktif'].map((tab) => {
                const count = agents.filter(a => tab === 'Semua' ? true : a.status === tab).length;
                return (
                  <button key={tab} onClick={() => setFilterTab(tab as any)} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${filterTab === tab ? 'bg-[#002855] text-white shadow-md' : 'text-slate-500 hover:text-[#002855] hover:bg-slate-200/50'}`}>
                      {tab} <span className={`text-[10px] ${filterTab === tab ? 'text-blue-200' : 'text-slate-400'}`}>({count})</span>
                  </button>
                );
            })}
         </div>
         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input aria-label="Cari Mitra" type="text" placeholder="Cari nama atau email..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10 transition-all shadow-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
         </div>
      </div>

      {/* DATA TABLE (DESKTOP) & CARDS (MOBILE) */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[400px]">
         {/* Desktop Table View */}
         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 tracking-wider">
                  <tr>
                     <th className="px-6 py-5">Mitra</th>
                     <th className="px-6 py-5">Status</th>
                     <th className="px-6 py-5 text-center">Referral</th>
                     <th className="px-6 py-5">Saldo Komisi</th>
                     <th className="px-6 py-5 text-center">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAgents.length === 0 ? (
                     <tr>
                        <td colSpan={5}>
                           <div className="flex flex-col items-center justify-center py-20 text-center">
                              <div className="bg-slate-50 p-6 rounded-full mb-4">
                                 <Users size={48} className="text-slate-300" />
                              </div>
                              <h3 className="text-lg font-bold text-[#002855] mb-1">Belum ada mitra</h3>
                              <p className="text-slate-500 text-sm">Data mitra tidak ditemukan atau belum ditambahkan.</p>
                           </div>
                        </td>
                     </tr>
                  ) : (
                     filteredAgents.map(agent => (
                        <tr key={agent.id} className="hover:bg-slate-50/80 transition-colors group">
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                                    {getInitials(agent.name)}
                                 </div>
                                 <div>
                                    <p className="text-[#002855] font-bold capitalize leading-tight mb-0.5">{agent.name}</p>
                                    <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{agent.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5 align-middle">
                              <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(agent.status)}`}>
                                 {agent.status}
                              </span>
                           </td>
                           <td className="px-6 py-5 text-center text-blue-600 font-black text-lg align-middle">{agent.referrals}</td>
                           <td className="px-6 py-5 align-middle">
                              <p className="text-[#002855] font-black">{formatCurrency(agent.commission)}</p>
                           </td>
                           <td className="px-6 py-5 align-middle">
                              <div className="flex justify-center gap-2">
                                 {agent.status === 'Pending' ? (
                                    <button onClick={async () => { await api.put(`/admin/agents/${agent.id}/approve`); fetchData(); }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-bold shadow-md hover:bg-emerald-700 transition-all" title="Setujui Mitra">Setujui</button>
                                 ) : (
                                    <button onClick={() => { setSelectedAgent(agent); fetchPayouts(agent.id); setShowDetailModal(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative" title="Lihat Detail">
                                      <Smartphone size={18}/>
                                      {agent.pending_payouts_count > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </button>
                                 )}
                                 <button onClick={async () => { if(window.confirm('Hapus mitra ini?')) { await api.delete(`/admin/agents/${agent.id}`); fetchData(); } }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Hapus Mitra"><Trash2 size={18}/></button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>

         {/* Mobile Card View */}
         <div className="md:hidden p-4 space-y-4 bg-[#F8FAFC]">
            {filteredAgents.length === 0 ? (
               <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-slate-300" />
                  </div>
                  <p className="text-[#002855] font-bold text-lg">Belum ada mitra</p>
                  <p className="text-sm text-slate-500 mt-1">Coba sesuaikan filter atau cari kembali.</p>
               </div>
            ) : (
               filteredAgents.map(agent => (
                  <div key={agent.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative group">
                     <div className="absolute top-5 right-5">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(agent.status)}`}>
                           {agent.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                           {getInitials(agent.name)}
                        </div>
                        <div className="pr-16">
                           <p className="text-[#002855] font-bold text-base leading-tight capitalize mb-1">{agent.name}</p>
                           <p className="text-xs text-slate-500 font-medium truncate">{agent.email}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Referral</p>
                           <p className="text-lg font-black text-blue-600">{agent.referrals}</p>
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Saldo Komisi</p>
                           <p className="text-sm font-black text-[#002855]">{formatCurrency(agent.commission)}</p>
                        </div>
                     </div>
                     <div className="flex justify-end pt-4 border-t border-slate-100">
                        <div className="flex gap-2">
                           {agent.status === 'Pending' ? (
                              <button onClick={async () => { await api.put(`/admin/agents/${agent.id}/approve`); fetchData(); }} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs uppercase font-bold shadow-md w-full text-center">Setujui</button>
                           ) : (
                              <button onClick={() => { setSelectedAgent(agent); fetchPayouts(agent.id); setShowDetailModal(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-[#002855] hover:bg-blue-50 rounded-xl transition-all relative">
                                <Smartphone size={18}/>
                                {agent.pending_payouts_count > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                              </button>
                           )}
                           <button onClick={async () => { if(window.confirm('Hapus mitra ini?')) { await api.delete(`/admin/agents/${agent.id}`); fetchData(); } }} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedAgent && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
               {/* Modal Header */}
               <div className="p-8 border-b border-slate-100 flex justify-between items-start shrink-0">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full bg-[#002855] flex items-center justify-center text-xl font-black text-white shadow-inner shrink-0">{getInitials(selectedAgent.name)}</div>
                     <div>
                        <h3 className="text-2xl font-black text-[#002855] tracking-tight leading-none mb-1">{selectedAgent.name}</h3>
                        <p className="text-slate-500 font-semibold text-sm mb-2">{selectedAgent.email}</p>
                        <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/p/${selectedAgent.referralCode}`); toast.success("Link disalin!"); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                           {copiedLink ? <Check size={14} className="text-emerald-500"/> : <LinkIcon size={14}/>} {copiedLink ? 'Tersalin!' : 'Salin Link Referral'}
                        </button>
                     </div>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><X size={20}/></button>
               </div>
               
               {/* Modal Body */}
               <div className="p-8 overflow-y-auto no-scrollbar space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">WhatsApp Mitra</p>
                           <p className="text-[#002855] font-black text-lg">{selectedAgent.phone || '-'}</p>
                        </div>
                        <div className="p-6 bg-[#002855] rounded-2xl shadow-xl shadow-[#002855]/20 text-white flex flex-col justify-center">
                           <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Saldo Tersedia</p>
                           <p className="text-2xl font-black">{formatCurrency(selectedAgent.commission)}</p>
                        </div>
                    </div>
                    
                    <div className="text-left">
                        <h4 className="text-sm font-black text-[#002855] uppercase tracking-widest mb-4">Riwayat Penarikan Dana</h4>
                        {payouts.length === 0 ? (
                            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center">
                                <p className="text-slate-400 text-sm font-semibold">Belum ada riwayat penarikan dana.</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                      <tr><th className="px-6 py-4">Tanggal & Nominal</th><th className="px-6 py-4 text-center">Status</th><th className="px-6 py-4 text-right">Aksi</th></tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100 font-bold">
                                      {payouts.map(p => (
                                         <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                               <p className="text-xs text-slate-500 font-semibold mb-0.5">{new Date(p.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                                               <p className="text-[#002855] font-black text-sm">{formatCurrency(p.amount)}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center align-middle">
                                               <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${p.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                  {p.status}
                                               </span>
                                            </td>
                                            <td className="px-6 py-4 text-right align-middle">
                                               {p.status === 'Menunggu' && <button onClick={() => setPayoutConfirm({show: true, id: p.id})} className="bg-[#002855] text-white px-5 py-2.5 rounded-xl text-[10px] uppercase font-bold shadow-md hover:bg-blue-800 transition-all" title="Konfirmasi Bayar">Tandai Dibayar</button>}
                                            </td>
                                         </tr>
                                      ))}
                                   </tbody>
                                </table>
                            </div>
                        )}
                    </div>
               </div>
            </div>
         </div>
      )}

      {/* CONFIRMATION MODAL */}
      {payoutConfirm.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#002855] rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
              <h3 className="text-xl font-black text-[#002855] mb-2 tracking-tight">Konfirmasi Bayar</h3>
              <p className="text-slate-500 text-sm font-medium">Apakah dana sudah ditransfer ke mitra pemasaran ini?</p>
            </div>
            <div className="bg-slate-50 p-4 flex gap-3 border-t border-slate-100">
              <button onClick={() => setPayoutConfirm({show: false, id: null})} className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all">Batal</button>
              <button onClick={executePayout} className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase bg-[#002855] text-white shadow-lg hover:bg-blue-800 transition-all">Ya, Bayar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenPage;