import { useEffect, useState } from 'react';
import { 
  Users, CheckCircle, DollarSign, Search, Plus, Trash2, X, ArrowLeft, Smartphone, Loader2, Check 
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
    } catch (e) { toast.error('Gagal'); }
  };

  const formatCurrency = (amount: any) => {
    const value = parseFloat(amount) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const calculateTotalCommission = () => agents.reduce((sum, a) => sum + (parseFloat(a.commission as any) || 0), 0);

  const filteredAgents = agents.filter(a => {
    const matchesTab = filterTab === 'Semua' ? true : a.status === filterTab;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (viewState === 'create') {
    return (
      <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setViewState('list')} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#002855] shadow-sm transition-all" title="Kembali"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Undang Mitra</h1>
         </div>
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl">
            <form onSubmit={handleCreate} className="space-y-8">
                <div className="space-y-2">
                    <label htmlFor="a-name" className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Lengkap</label>
                    <input id="a-name" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Lengkap" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="a-email" className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                        <input id="a-email" type="email" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="a-phone" className="text-[10px] font-black text-slate-400 uppercase ml-1">WhatsApp</label>
                        <input id="a-phone" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="08..." />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="a-area" className="text-[10px] font-black text-slate-400 uppercase ml-1">Domisili</label>
                    <input id="a-area" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Wilayah" />
                </div>
                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-800 transition-all" title="Simpan Mitra">Daftarkan Mitra</button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div><h1 className="text-3xl font-black text-[#002855] uppercase leading-none mb-2">Mitra Umum</h1><p className="text-slate-400 text-sm font-medium italic">Manajemen partner pemasaran</p></div>
         <button onClick={() => setViewState('create')} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center gap-2 transition-all active:scale-95" title="Tambah Mitra">
            <Plus size={18}/> Undang Mitra
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div><p className="text-[10px] font-black text-slate-400 uppercase">Total Mitra</p><h3 className="text-2xl font-black text-[#002855]">{agents.length}</h3></div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users size={20}/></div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div><p className="text-[10px] font-black text-slate-400 uppercase">Aktif</p><h3 className="text-2xl font-black text-emerald-500">{agents.filter(a=>a.status==='Aktif').length}</h3></div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={20}/></div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div><p className="text-[10px] font-black text-slate-400 uppercase">Total Komisi</p><h3 className="text-2xl font-black text-amber-500">{formatCurrency(calculateTotalCommission())}</h3></div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><DollarSign size={20}/></div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
            {['Semua', 'Pending', 'Aktif'].map((tab) => (
                <button key={tab} onClick={() => setFilterTab(tab as any)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterTab === tab ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-slate-400 hover:text-[#002855]'}`} title={`Filter ${tab}`}>
                    {tab} <span className="text-[10px] opacity-50 ml-1">({agents.filter(a => tab === 'Semua' ? true : a.status === tab).length})</span>
                </button>
            ))}
         </div>
         <div className="relative w-full md:w-80 px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
            <input aria-label="Cari Mitra" id="search-agent" type="text" placeholder="Cari mitra..." className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
         </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
         {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div> : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-50">
                     <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <th className="px-10 py-6">Mitra</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-center">Referral</th>
                        <th className="px-10 py-6">Saldo</th> {/* KOLOM BARU */}
                        <th className="px-10 py-6 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {filteredAgents.map(agent => (
                        <tr key={agent.id} className="hover:bg-blue-50/30 transition-all group">
                           <td className="px-10 py-6">
                              <p className="text-[#002855] text-base">{agent.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-tight">{agent.email}</p>
                           </td>
                           <td className="px-10 py-6">
                              <span className={`px-4 py-1 rounded-full text-[10px] uppercase border ${agent.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                 {agent.status}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-center text-blue-600 text-lg">{agent.referrals}</td>
                           
                           {/* MENAMPILKAN NOMINAL SALDO AGEN */}
                           <td className="px-10 py-6 text-[#002855] font-black">
                              {formatCurrency(agent.commission)}
                           </td>

                           <td className="px-10 py-6 text-center">
                              <div className="flex justify-center gap-2">
                                 {agent.status === 'Pending' ? (
                                    <button onClick={async () => { await api.put(`/admin/agents/${agent.id}/approve`); fetchData(); }} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] uppercase font-bold" title="Setujui Mitra">Approve</button>
                                 ) : (
                                    <button onClick={() => { setSelectedAgent(agent); fetchPayouts(agent.id); setShowDetailModal(true); }} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all relative" title="Lihat Detail">
                                      <Smartphone size={20}/>
                                      {agent.pending_payouts_count > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                                    </button>
                                 )}
                                 <button onClick={async () => { if(window.confirm('Hapus?')) { await api.delete(`/admin/agents/${agent.id}`); fetchData(); } }} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 transition-all" title="Hapus Mitra"><Trash2 size={20}/></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      {showDetailModal && selectedAgent && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh]">
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-2xl font-black text-blue-600 shadow-inner">{selectedAgent.name.charAt(0)}</div>
                     <div><h3 className="text-3xl font-black text-[#002855] tracking-tight">{selectedAgent.name}</h3><p className="text-slate-400 font-bold uppercase text-xs">{selectedAgent.email}</p></div>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all" title="Tutup Modal"><X size={24}/></button>
               </div>
               <div className="p-10 overflow-y-auto no-scrollbar space-y-8">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">WhatsApp</p>
                           <p className="text-[#002855] font-black">{selectedAgent.phone || '-'}</p>
                        </div>
                        <div className="p-5 bg-[#002855] rounded-2xl shadow-lg text-white">
                           <p className="text-[10px] opacity-70 font-bold uppercase mb-1">Saldo Tersedia</p>
                           <p className="text-xl font-black">{formatCurrency(selectedAgent.commission)}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-slate-100/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <tr><th className="px-8 py-4">Tanggal</th><th className="px-8 py-4 text-center">Status</th><th className="px-8 py-4 text-right">Aksi</th></tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 font-bold">
                              {payouts.map(p => (
                                 <tr key={p.id}>
                                    <td className="px-8 py-5 text-sm">{new Date(p.created_at).toLocaleDateString()} <p className="text-[#002855] font-black">{formatCurrency(p.amount)}</p></td>
                                    <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[9px] uppercase border ${p.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{p.status}</span></td>
                                    <td className="px-8 py-5 text-right">{p.status === 'Menunggu' && <button onClick={() => setPayoutConfirm({show: true, id: p.id})} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold" title="Konfirmasi Bayar">Bayar</button>}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                    </div>
               </div>
            </div>
         </div>
      )}

      {payoutConfirm.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-100 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><Check size={32} /></div>
              <h3 className="text-2xl font-black text-[#002855] mb-2 tracking-tight">Konfirmasi Bayar</h3>
              <p className="text-slate-500 text-sm">Dana sudah ditransfer ke mitra ini?</p>
            </div>
            <div className="bg-slate-50 p-4 flex gap-3">
              <button onClick={() => setPayoutConfirm({show: false, id: null})} className="flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase text-slate-400 hover:text-slate-600">Batal</button>
              <button onClick={executePayout} className="flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase bg-blue-600 text-white shadow-lg">Ya, Bayar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenPage;