import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit, Eye, X, ArrowLeft, Download, CheckSquare, Square, Users, CheckCircle, Clock, Search, FileText, Loader2
} from 'lucide-react'; // FIX: Loader2 ditambahkan ke import
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

// ==========================================
// 1. INTERFACE LEAD (FIXED: Menambahkan properti agar TypeScript tidak error)
// ==========================================
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  channel_id: number;
  channel?: { name: string };
  agent_id?: number;
  agent?: {
    name: string;
    // KUNCI: Tambahkan agent_profile di sini agar React bisa baca tipe 'sgs' atau 'egs'
    agent_profile?: { type: string; nim?: string; nip?: string; }
  };
  prodi_interest: string;
  status: string;
  notes: string;
  source_platform?: string;
  test_score?: number; // FIX: test_score didaftarkan
  payment_proof?: string;
  registration_fee_proof?: string;
}

const CRMPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Registered' | 'Pending'>('Semua');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState({
    total_leads: 0,
    registered: 0,
    pending: 0
  });

  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '', email: '', phone: '', prodi_interest: 'Informatika', status: 'lead', channel_id: 1, notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/leads');
      const data = response.data;
      setLeads(data);

      setStats({
        total_leads: data.length,
        registered: data.filter((l: Lead) => l.status === 'active' || l.status === 'Registered').length,
        pending: data.filter((l: Lead) => l.status !== 'active' && l.status !== 'Registered').length
      });
    } catch (error) {
      toast.error('Gagal sinkronisasi data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SEMUA FUNGSI HANDLE TETAP SAMA (TIDAK DIUBAH) ---
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', phone: '', prodi_interest: 'Informatika', status: 'lead', channel_id: 1, notes: '' });
    setViewState('form');
  };

  const handleOpenEdit = (lead: Lead) => {
    setModalMode('edit');
    setFormData(lead);
    setViewState('form');
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (filteredData: Lead[]) => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(l => l.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    const loadingToast = toast.loading("Memproses...");
    try {
      await api.post('/admin/leads/bulk-update', { ids: selectedIds, status: 'Registered' });
      toast.success("Sukses", { id: loadingToast });
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      toast.error('Gagal', { id: loadingToast });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/admin/leads', { ...formData, prodi_interest: formData.prodi_interest || 'Informatika', channel_id: 1 });
        toast.success('Berhasil!');
      } else {
        await api.put(`/admin/leads/${formData.id}`, formData);
        toast.success('Data diperbarui!');
      }
      setViewState('list');
      fetchData();
    } catch (error: any) {
      toast.error('Gagal simpan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus?')) return;
    try { await api.delete(`/admin/leads/${id}`); toast.success('Dihapus'); fetchData(); } catch (error) { toast.error('Gagal'); }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) { toast.error('Gagal ekspor'); }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesTab = activeTab === 'Semua' ? true :
      activeTab === 'Registered' ? (lead.status === 'active' || lead.status === 'Registered') :
        (lead.status !== 'active' && lead.status !== 'Registered');
    const searchLower = searchQuery.toLowerCase();
    return matchesTab && (lead.name.toLowerCase().includes(searchLower) || lead.email.toLowerCase().includes(searchLower));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'Registered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lead': case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'awaiting_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'test_passed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'calon_mahasiswa': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-all" title="Kembali">
          <ArrowLeft size={18} /> Kembali ke Daftar
        </button>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 text-left">
          <h2 className="text-2xl font-black text-[#002855] mb-10 uppercase tracking-tight">{modalMode === 'create' ? 'Tambah Maba' : 'Edit Maba'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Nama" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <input placeholder="Email" type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              <input placeholder="WhatsApp" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
              <select title="Ubah Status" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="lead">Lead</option>
                <option value="calon_mahasiswa">Calon Mahasiswa</option>
                <option value="test_passed">Lulus Seleksi</option>
                <option value="awaiting_payment">Menunggu Bayar</option>
                <option value="active">Mahasiswa Aktif</option>
              </select>
            </div>
            <textarea placeholder="Catatan" rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase text-xs">Simpan Data</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-left">
      {/* Header, Stats, Filter Area Tetap Sama --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">CRM Leads</h1><p className="text-slate-400 text-sm font-medium italic">Database Pendaftar Baru</p></div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && <button type="button" onClick={handleBulkApprove} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg" title="ACC Massal">ACC {selectedIds.length}</button>}
          <button type="button" onClick={handleExport} className="bg-white border border-slate-200 text-[#002855] px-6 py-3 rounded-2xl font-bold flex items-center gap-2" title="Export CSV"><Download size={18} /> Export</button>
          <button type="button" onClick={handleOpenCreate} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase flex items-center gap-2" title="Tambah"><Plus size={18} /> Tambah</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-slate-400 uppercase">Total</p><h3 className="text-2xl font-black text-[#002855]">{stats.total_leads}</h3></div><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={20} /></div></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-slate-400 uppercase">Telah ACC</p><h3 className="text-2xl font-black text-emerald-500">{stats.registered}</h3></div><div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={20} /></div></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-slate-400 uppercase">Pending</p><h3 className="text-2xl font-black text-amber-500">{stats.pending}</h3></div><div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={20} /></div></div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
          {['Semua', 'Registered', 'Pending'].map(t => (
            <button key={t} type="button" onClick={() => { setActiveTab(t as any); setSelectedIds([]); }} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`} title={t}>{t}</button>
          ))}
        </div>
        <div className="relative w-full md:w-80 px-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input aria-label="Cari" className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold" placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* ==========================================
          TABEL CRM (DIPERBAIKI IDENTITAS SGS)
          ========================================== */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div> : (
          filteredLeads.length === 0 ? <EmptyState title="Kosong" message="Tidak ada data." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <tr>
                    <th className="p-6 w-12 text-center"><button type="button" onClick={() => handleSelectAll(filteredLeads)} title="Pilih Semua">{selectedIds.length === filteredLeads.length ? <CheckSquare className="text-blue-600" /> : <Square />}</button></th>
                    <th className="px-8 py-6">Mahasiswa</th><th className="px-8 py-6">Kanal (Sumber)</th><th className="px-8 py-6 text-center">Status</th><th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                  {filteredLeads.map(l => (
                    <tr key={l.id} className="hover:bg-blue-50/30 transition-all">
                      <td className="p-6 text-center"><button type="button" onClick={() => handleSelectRow(l.id)} title="Pilih"><CheckSquare className={selectedIds.includes(l.id) ? 'text-blue-600' : 'text-slate-200'} /></button></td>
                      <td className="px-8 py-6"><div><p className="text-[#002855] text-base">{l.name}</p><p className="text-xs text-slate-400 font-medium">{l.email}</p></div></td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col text-left">
                          <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">
                            {l.channel_id === 4 ? 'Ambassador SGS' :
                              l.channel_id === 5 ? 'Ambassador EGS' :
                                l.agent_id ? 'Mitra Umum' : 'Website Utama'}
                          </p>
                          <p className="text-[10px] text-blue-600 font-black italic">
                            Ref: {l.agent?.name || (l.agent_id ? 'Partner' : 'Website')}
                          </p>
                          <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">
                            {l.source_platform || 'Direct'}
                          </p>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(l.status)}`}>{l.status}</span></td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-3">
                          <button type="button" title="Detail" onClick={() => { setSelectedLead(l); setShowDetailModal(true); }} className="p-3 bg-slate-50 text-slate-300 hover:text-blue-600 rounded-2xl transition-all shadow-sm"><Eye size={18} /></button>
                          <button type="button" title="Edit" onClick={() => handleOpenEdit(l)} className="p-3 bg-slate-50 text-slate-300 hover:text-amber-600 rounded-2xl transition-all shadow-sm"><Edit size={18} /></button>
                          <button type="button" title="Hapus" onClick={() => handleDelete(l.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-red-600 rounded-2xl transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Modal Detail Tetap Sama --- */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar text-left">
            <div className="flex justify-between mb-8">
              <div><h3 className="text-2xl font-black text-[#002855] leading-tight">{selectedLead.name}</h3><p className="text-slate-400 italic text-sm">{selectedLead.email}</p></div>
              <button type="button" title="Tutup Detail" onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p><p className="text-[#002855] font-black">{selectedLead.phone}</p></div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Ujian</p><p className="text-blue-600 font-black text-lg">{selectedLead.test_score ?? 0} / 100</p></div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bukti Transfer</p>
                {selectedLead.payment_proof || selectedLead.registration_fee_proof ? (
                  <div className="relative group overflow-hidden rounded-3xl border-2 border-slate-100 h-40">
                    <img src={`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`} alt="Bukti" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#002855]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button type="button" title="Lihat Full" onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`, '_blank')} className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-xs">Lihat Full</button>
                    </div>
                  </div>
                ) : <div className="h-40 bg-slate-50 rounded-3xl border-dashed border-2 border-slate-200 flex items-center justify-center text-xs text-slate-400 italic">Belum ada bukti.</div>}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 font-medium leading-relaxed italic text-slate-500">
              <p className="text-[10px] font-black text-slate-400 uppercase not-italic mb-2 flex items-center gap-2"><FileText size={12} /> Catatan Internal</p>
              "{selectedLead.notes || "Tidak ada catatan."}"
            </div>

            <div className="flex flex-col gap-3">
              {selectedLead.status === 'lead' && (
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/activate`); toast.success("Aktif!"); setShowDetailModal(false); fetchData(); } catch (e) { toast.error("Gagal"); } }} className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Aktifkan Akun (Akses Ujian)
                </button>
              )}
              {(selectedLead.status === 'awaiting_payment' || selectedLead.status === 'test_passed') && (
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/sahkan`); toast.success("Mahasiswa SAH!"); setShowDetailModal(false); fetchData(); } catch (e) { toast.error("Gagal"); } }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Sahkan Mahasiswa (Cairkan Komisi)
                </button>
              )}
              <button type="button" onClick={() => setShowDetailModal(false)} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">Tutup Modal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;