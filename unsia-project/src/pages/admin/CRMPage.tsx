import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Edit, Eye, X, Download, CheckSquare, Square, Users, CheckCircle, Clock, Search, FileText, School, Building2, XCircle, ChevronRight, QrCode
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
    agent_profile?: { type: string; nim?: string; nip?: string; }
  };
  prodi_interest: string;
  status: string;
  notes: string;
  source_platform?: string;
  test_score?: number;
  payment_proof?: string;
  registration_fee_proof?: string;
  school_origin?: string;
  partner_origin?: string;
}

type TabFilter = 'Semua' | 'Berhasil' | 'Proses' | 'Gagal';

const CRMPage = ({ filterKanal }: { filterKanal?: number }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<TabFilter>('Semua');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, success: 0, process: 0, failed: 0 });
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', email: '', phone: '', prodi_interest: 'Informatika', status: 'lead', channel_id: 1, notes: '' });

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/admin/leads');
      const data = response.data;
      setLeads(data);
      setStats({
        total: data.length,
        success: data.filter((l: Lead) => l.status === 'active').length,
        failed: data.filter((l: Lead) => l.status === 'test_failed').length,
        process: data.filter((l: Lead) => !['active', 'test_failed'].includes(l.status)).length
      });
    } catch (_error) { toast.error('Gagal sinkronisasi data'); }
  }, []);

  useEffect(() => { fetchData(); }, [filterKanal, fetchData]);

  const handleOpenEdit = (lead: Lead) => {
    setModalMode('edit');
    setFormData(lead);
    setViewState('form');
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (filteredData: Lead[]) => {
    setSelectedIds(selectedIds.length === filteredData.length && filteredData.length > 0 ? [] : filteredData.map(l => l.id));
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    const load = toast.loading("Memproses...");
    try {
      await api.post('/admin/leads/bulk-update', { ids: selectedIds, status: 'Registered' });
      toast.success("Berhasil", { id: load });
      setSelectedIds([]);
      fetchData();
    } catch (_error) { toast.error('Gagal', { id: load }); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/admin/leads', { ...formData, channel_id: filterKanal || 1 });
        toast.success('Maba ditambahkan!');
      } else {
        await api.put(`/admin/leads/${formData.id}`, formData);
        toast.success('Data diperbarui!');
      }
      setViewState('list');
      fetchData();
    } catch (_error) { toast.error('Gagal simpan'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pendaftar?')) return;
    try { await api.delete(`/admin/leads/${id}`); toast.success('Dihapus'); fetchData(); } catch (_error) { toast.error('Gagal'); }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (_error) { toast.error('Gagal ekspor'); }
  };

  const filteredLeads = leads.filter(lead => {
    if (filterKanal && Number(lead.channel_id) !== filterKanal) return false;
    const matchesTab = activeTab === 'Semua' ? true :
      activeTab === 'Berhasil' ? (lead.status === 'active') :
        activeTab === 'Gagal' ? (lead.status === 'test_failed') :
          (!['active', 'test_failed'].includes(lead.status));
    const searchLower = searchQuery.toLowerCase();
    return matchesTab && (lead.name.toLowerCase().includes(searchLower) || lead.email.toLowerCase().includes(searchLower));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'lead': return 'bg-blue-100 text-blue-700';
      case 'test_failed': return 'bg-rose-100 text-rose-700';
      case 'test_passed': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (viewState === 'form') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002855] to-blue-700 px-8 py-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-white font-black text-xl tracking-tight uppercase">{modalMode === 'create' ? 'Tambah Maba' : 'Edit Data'}</h2>
              <p className="text-blue-200 text-sm mt-1">Lengkapi informasi prospek di bawah ini</p>
            </div>
            <button type="button" onClick={() => setViewState('list')} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="p-8 overflow-y-auto">
            <form id="leadForm" onSubmit={handleSave} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-300" placeholder="Budi Santoso" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-300" placeholder="budi@contoh.com" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-300" placeholder="0812xxxxxx" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                  <select className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-semibold text-slate-700 transition-all bg-white appearance-none" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="lead">Lead</option><option value="calon_mahasiswa">Calon Mahasiswa</option><option value="test_passed">Lulus Seleksi</option><option value="awaiting_payment">Menunggu Bayar</option><option value="active">Mahasiswa Aktif</option><option value="test_failed">Gagal Seleksi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Catatan</label>
                <textarea rows={3} className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:outline-none text-sm font-semibold text-slate-700 transition-all placeholder:text-slate-300" placeholder="Tambahkan catatan internal..." value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end shrink-0">
            <button type="button" onClick={() => setViewState('list')} className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Batal</button>
            <button form="leadForm" type="submit" className="px-6 py-3 rounded-xl bg-[#002855] text-white font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-md">Simpan Data</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 space-y-8 text-left -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight mb-1">{filterKanal === 3 ? 'Back to School' : filterKanal === 6 ? 'Kerjasama B2B' : 'CRM Leads'}</h1>
          <p className="text-slate-500 text-sm font-medium">Manajemen data prospek dan pendaftaran mahasiswa baru.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedIds.length > 0 && <button type="button" onClick={handleBulkApprove} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all">ACC {selectedIds.length}</button>}
          {(filterKanal === 3 || filterKanal === 6) && (
            <button onClick={() => navigate('/admin/kanal')} className="border-2 border-blue-600 text-blue-600 bg-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all"><QrCode size={16} /> Buat QR Baru</button>
          )}
          <button type="button" onClick={handleExport} className="border-2 border-[#002855] text-[#002855] bg-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all shadow-sm" title="Export CSV"><Download size={16} /> Export</button>
          <button type="button" onClick={() => { setModalMode('create'); setFormData({ name: '', email: '', phone: '', prodi_interest: 'Informatika', status: 'lead', channel_id: filterKanal || 1, notes: '' }); setViewState('form'); }} className="bg-[#002855] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-blue-800 transition-all"><Plus size={16} /> Tambah</button>
        </div>
      </div>

      {/* STATISTICS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={80} className="text-blue-600" /></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><Users size={20} /></div>
          </div>
          <div className="relative z-10"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Leads</p><h3 className="text-3xl font-black text-[#002855]">{stats.total}</h3></div>
        </div>
        
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle size={80} className="text-emerald-600" /></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
          </div>
          <div className="relative z-10"><p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Berhasil</p><h3 className="text-3xl font-black text-emerald-600">{stats.success}</h3></div>
        </div>

        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Clock size={80} className="text-amber-600" /></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl"><Clock size={20} /></div>
          </div>
          <div className="relative z-10"><p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Diproses</p><h3 className="text-3xl font-black text-amber-600">{stats.process}</h3></div>
        </div>

        <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><XCircle size={80} className="text-rose-600" /></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl"><XCircle size={20} /></div>
          </div>
          <div className="relative z-10"><p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Gagal</p><h3 className="text-3xl font-black text-rose-600">{stats.failed}</h3></div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-slate-200/50 p-1 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200/50">
          {['Semua', 'Berhasil', 'Proses', 'Gagal'].map(t => (
            <button key={t} type="button" onClick={() => { setActiveTab(t as TabFilter); setSelectedIds([]); }} className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${activeTab === t ? 'bg-[#002855] text-white shadow-md' : 'text-slate-500 hover:text-[#002855] hover:bg-slate-200/50'}`}>{t}</button>
          ))}
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input aria-label="Cari" className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10 transition-all shadow-sm" placeholder="Cari nama atau email mahasiswa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* DATA TABLE (DESKTOP) & CARDS (MOBILE) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-5 px-6 w-12 text-center"><button type="button" onClick={() => handleSelectAll(filteredLeads)} title="Pilih Semua">{selectedIds.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="text-[#002855]" size={18} /> : <Square size={18} className="text-slate-400" />}</button></th>
                <th className="py-5 px-6 text-[#002855]">Mahasiswa</th>
                <th className="py-5 px-6 text-[#002855]">Kanal & Referensi</th>
                <th className="py-5 px-6 text-center text-[#002855]">Status</th>
                <th className="py-5 px-6 text-center text-[#002855]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                          <Search size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-[#002855] mb-1">Data Tidak Ditemukan</h3>
                        <p className="text-slate-500 text-sm">Coba sesuaikan kata kunci pencarian atau filter tab.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map(l => (
                    <tr key={l.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.includes(l.id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-5 px-6 text-center align-middle">
                        <button type="button" onClick={() => handleSelectRow(l.id)} title="Pilih">
                          <CheckSquare className={`${selectedIds.includes(l.id) ? 'text-[#002855]' : 'text-slate-300 group-hover:text-slate-400'} transition-colors`} size={18} />
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                            {getInitials(l.name)}
                          </div>
                          <div>
                            <p className="text-[#002855] font-bold capitalize leading-tight mb-0.5">{l.name}</p>
                            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{l.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 uppercase">
                            {Number(l.channel_id) === 1 && 'UMUM'}
                            {Number(l.channel_id) === 2 && 'AGENT'}
                            {Number(l.channel_id) === 3 && 'BTS'}
                            {Number(l.channel_id) === 4 && 'SGS'}
                            {Number(l.channel_id) === 5 && 'EGS'}
                            {Number(l.channel_id) === 6 && 'KERJASAMA'}
                          </span>
                          <span className="text-[11px] text-blue-600 font-semibold mt-0.5">
                            Ref: {l.agent?.name || 'Sistem'}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {Number(l.channel_id) === 3 ? (l.school_origin || 'Sekolah Terdaftar') :
                              Number(l.channel_id) === 6 ? (l.partner_origin || 'Instansi Terdaftar') :
                                l.source_platform || 'Direct'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center align-middle">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(l.status)}`}>
                          {l.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-5 px-6 align-middle">
                        <div className="flex justify-center gap-2">
                          <button type="button" title="Detail" onClick={() => { setSelectedLead(l); setShowDetailModal(true); }} className="p-2.5 text-slate-400 hover:text-[#002855] hover:bg-blue-50 rounded-xl transition-all"><Eye size={18} /></button>
                          <button type="button" title="Edit" onClick={() => handleOpenEdit(l)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><Edit size={18} /></button>
                          <button type="button" title="Hapus" onClick={() => handleDelete(l.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
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
          {filteredLeads.length === 0 ? (
             <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search size={24} className="text-slate-300" />
               </div>
               <p className="text-[#002855] font-bold text-lg">Data Tidak Ditemukan</p>
               <p className="text-sm text-slate-500 mt-1">Coba kata kunci lain atau ubah filter.</p>
             </div>
          ) : (
             filteredLeads.map(l => (
               <div key={l.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-[#002855]/20 transition-all">
                 <div className="absolute top-5 right-5">
                    <button type="button" onClick={() => handleSelectRow(l.id)}>
                      <CheckSquare className={`${selectedIds.includes(l.id) ? 'text-[#002855]' : 'text-slate-200'} transition-colors`} size={20} />
                    </button>
                 </div>
                 <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#002855] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                      {getInitials(l.name)}
                    </div>
                    <div className="pr-8">
                      <p className="text-[#002855] font-bold text-base leading-tight capitalize mb-1">{l.name}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{l.email}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Kanal</p>
                      <p className="text-xs font-bold text-slate-700">
                         {Number(l.channel_id) === 1 ? 'UMUM' : Number(l.channel_id) === 2 ? 'AGENT' : Number(l.channel_id) === 3 ? 'BTS' : Number(l.channel_id) === 4 ? 'SGS' : Number(l.channel_id) === 5 ? 'EGS' : 'KERJASAMA'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getStatusColor(l.status)}`}>
                        {l.status.replace('_', ' ')}
                      </span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Referensi</span>
                     <p className="text-xs font-bold text-blue-600">{l.agent?.name || 'Sistem'}</p>
                   </div>
                   <div className="flex gap-2">
                     <button type="button" onClick={() => { setSelectedLead(l); setShowDetailModal(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#002855] hover:bg-blue-50 rounded-xl transition-all"><Eye size={18} /></button>
                     <button type="button" onClick={() => handleOpenEdit(l)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><Edit size={18} /></button>
                     <button type="button" onClick={() => handleDelete(l.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                   </div>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto no-scrollbar text-left text-[#002855]">
            <div className="flex justify-between mb-8">
              <div className="text-left">
                <h3 className="text-2xl font-black uppercase leading-tight">{selectedLead.name}</h3>
                <p className="text-slate-400 italic text-sm lowercase">{selectedLead.email}</p>
              </div>
              <button type="button" title="Tutup Detail" onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-left">
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">WhatsApp</p>
                  <p className="font-black text-sm">{selectedLead.phone}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Nilai Ujian</p>
                  <p className="text-blue-600 font-black text-xl">{selectedLead.test_score ?? 0} / 100</p>
                </div>
              </div>
              <div className="space-y-2 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">Bukti Pembayaran</p>
                {selectedLead.payment_proof || selectedLead.registration_fee_proof ? (
                  <div className="relative group overflow-hidden rounded-3xl border-2 border-slate-100 h-44 shadow-inner bg-slate-50 flex items-center justify-center">
                    <img src={`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`} alt="Bukti" className="w-full h-full object-cover transition-all group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#002855]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button type="button" title="Lihat" onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`, '_blank')} className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-xl flex items-center gap-2 tracking-widest"><Eye size={14} /> Lihat Full</button>
                    </div>
                  </div>
                ) : <div className="h-44 bg-slate-50 rounded-3xl border-dashed border-2 border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Belum Ada File</div>}
              </div>
            </div>

            {(selectedLead.school_origin || selectedLead.partner_origin) && (
              <div className="mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                  {Number(selectedLead.channel_id) === 3 ? <School size={20} /> : <Building2 size={20} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Identitas Jalur {Number(selectedLead.channel_id) === 3 ? 'Sekolah' : 'Instansi'}</p>
                  <p className="font-black text-[#002855] text-base uppercase">{selectedLead.school_origin || selectedLead.partner_origin}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-blue-200" />
              </div>
            )}

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 italic text-slate-500 text-sm text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase not-italic mb-2 flex items-center gap-2"><FileText size={14} /> Informasi Tambahan</p>
              "{selectedLead.notes || "Tidak ada catatan internal."}"
            </div>

            <div className="flex flex-col gap-3">
              {selectedLead.status === 'lead' && (
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/activate`); toast.success("Akun Aktif!"); setShowDetailModal(false); fetchData(); } catch (_error) { toast.error("Gagal"); } }} className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"><CheckCircle size={20} /> Aktifkan Akun Seleksi</button>
              )}
              {(selectedLead.status === 'awaiting_payment' || selectedLead.status === 'test_passed') && (
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/sahkan`); toast.success("Closing!"); setShowDetailModal(false); fetchData(); } catch (_error) { toast.error("Gagal"); } }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"><CheckCircle size={20} /> Sahkan & Cairkan Komisi</button>
              )}
              <button type="button" title="Tutup Modal" onClick={() => setShowDetailModal(false)} className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;