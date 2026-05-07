import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit, Eye, X, ArrowLeft, Download, CheckSquare, Square, Users, CheckCircle, Clock, Search, FileText, School, Building2, XCircle, ChevronRight, QrCode
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
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

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50">
    <td className="p-6 w-12"><div className="w-5 h-5 bg-slate-100 rounded"></div></td>
    <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-50 rounded w-1/2"></div></td>
    <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div><div className="h-3 bg-slate-50 rounded w-1/4"></div></td>
    <td className="px-8 py-6"><div className="h-6 bg-slate-100 rounded-full w-20 mx-auto"></div></td>
    <td className="px-8 py-6"><div className="flex justify-center gap-2"><div className="w-10 h-10 bg-slate-50 rounded-xl"></div><div className="w-10 h-10 bg-slate-50 rounded-xl"></div></div></td>
  </tr>
);

const CRMPage = ({ filterKanal }: { filterKanal?: number }) => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Berhasil' | 'Proses' | 'Gagal'>('Semua');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, success: 0, process: 0, failed: 0 });
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', email: '', phone: '', prodi_interest: 'Informatika', status: 'lead', channel_id: 1, notes: '' });

  const fetchData = async () => {
    setLoading(true);
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
    } catch (error) { toast.error('Gagal sinkronisasi data'); }
    finally { setTimeout(() => setLoading(false), 500); }
  };

  useEffect(() => { fetchData(); }, [filterKanal]);

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
    } catch (error) { toast.error('Gagal', { id: load }); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/admin/leads', { ...formData, channel_id: 1 });
        toast.success('Maba ditambahkan!');
      } else {
        await api.put(`/admin/leads/${formData.id}`, formData);
        toast.success('Data diperbarui!');
      }
      setViewState('list');
      fetchData();
    } catch (error) { toast.error('Gagal simpan'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pendaftar?')) return;
    try { await api.delete(`/admin/leads/${id}`); toast.success('Dihapus'); fetchData(); } catch (error) { toast.error('Gagal'); }
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
    } catch (error) { toast.error('Gagal ekspor'); }
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
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lead': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'test_failed': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'test_passed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-all" title="Kembali"><ArrowLeft size={18} /> Kembali ke Daftar</button>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 text-left text-[#002855]">
          <h2 className="text-2xl font-black mb-10 uppercase tracking-tight">{modalMode === 'create' ? 'Tambah Maba' : 'Edit Data'}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Nama" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <input placeholder="Email" type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              <input placeholder="WhatsApp" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
              <select title="Ubah Status" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="lead">Lead</option><option value="calon_mahasiswa">Calon Mahasiswa</option><option value="test_passed">Lulus Seleksi</option><option value="awaiting_payment">Menunggu Bayar</option><option value="active">Mahasiswa Aktif</option><option value="test_failed">Gagal Seleksi</option>
              </select>
            </div>
            <textarea placeholder="Catatan" rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Simpan Data Mahasiswa</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight mb-2 leading-none">{filterKanal === 3 ? 'Back to School' : filterKanal === 6 ? 'Kerjasama B2B' : 'CRM Leads'}</h1><p className="text-slate-400 text-sm font-medium italic">Manajemen pendaftaran maba.</p></div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && <button type="button" onClick={handleBulkApprove} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">ACC {selectedIds.length}</button>}
          {/* TOMBOL GENERATE QR CEPAT */}
          {(filterKanal === 3 || filterKanal === 6) && (
            <button onClick={() => navigate('/admin/kanal')} className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"><QrCode size={18} /> Buat QR Baru</button>
          )}
          <button type="button" onClick={handleExport} className="bg-white border border-slate-200 text-[#002855] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50" title="Export CSV"><Download size={18} /> Export</button>
          <button type="button" onClick={() => { setModalMode('create'); setViewState('form'); }} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all hover:bg-blue-800"><Plus size={18} /> Tambah</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total</p><h3 className="text-2xl font-black text-[#002855]">{stats.total}</h3></div><div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Users size={20} /></div></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-emerald-400 uppercase leading-none mb-1">Berhasil</p><h3 className="text-2xl font-black text-emerald-600">{stats.success}</h3></div><div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={20} /></div></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-blue-400 uppercase leading-none mb-1">Proses</p><h3 className="text-2xl font-black text-blue-600">{stats.process}</h3></div><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Clock size={20} /></div></div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"><div><p className="text-[10px] font-black text-rose-400 uppercase leading-none mb-1">Gagal</p><h3 className="text-2xl font-black text-rose-600">{stats.failed}</h3></div><div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><XCircle size={20} /></div></div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
          {['Semua', 'Berhasil', 'Proses', 'Gagal'].map(t => (
            <button key={t} type="button" onClick={() => { setActiveTab(t as any); setSelectedIds([]); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === t ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
          ))}
        </div>
        <div className="relative w-full md:w-80 px-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input aria-label="Cari" className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="Cari data..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
              <tr>
                <th className="p-6 w-12 text-center"><button type="button" onClick={() => handleSelectAll(filteredLeads)} title="Pilih Semua">{selectedIds.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="text-blue-600" /> : <Square />}</button></th>
                <th className="px-8 py-6 text-[#002855]">Mahasiswa</th><th className="px-8 py-6 text-[#002855]">Kanal & Identitas</th><th className="px-8 py-6 text-center text-[#002855]">Status</th><th className="px-8 py-6 text-center text-[#002855]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold">
              {loading ? (
                <>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow />
                </>
              ) : (
                filteredLeads.length === 0 ? <tr><td colSpan={5}><EmptyState title="Kosong" message="Data tidak ada." /></td></tr> : (
                  filteredLeads.map(l => (
                    <tr key={l.id} className={`hover:bg-blue-50/30 transition-all ${selectedIds.includes(l.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-6 text-center"><button type="button" onClick={() => handleSelectRow(l.id)} title="Pilih"><CheckSquare className={selectedIds.includes(l.id) ? 'text-blue-600' : 'text-slate-200'} /></button></td>
                      <td className="px-8 py-6"><div><p className="text-[#002855] text-base capitalize">{l.name}</p><p className="text-xs text-slate-400 font-medium italic lowercase">{l.email}</p></div></td>

                      <td className="px-8 py-6">
                        <div className="flex flex-col text-left">
                          {/* Baris 1: NAMA KANAL */}
                          <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">
                            {Number(l.channel_id) === 1 && 'UMUM'}
                            {Number(l.channel_id) === 2 && 'AGENT'}
                            {Number(l.channel_id) === 3 && 'BTS'}
                            {Number(l.channel_id) === 4 && 'SGS'}
                            {Number(l.channel_id) === 5 && 'EGS'}
                            {Number(l.channel_id) === 6 && 'KERJASAMA'}
                          </p>

                          <p className="text-[10px] text-blue-600 font-black italic uppercase leading-none mt-0.5">
                            Ref: {l.agent?.name || 'Sistem'}
                          </p>

                          <p className="text-[9px] text-slate-600 font-black uppercase mt-1 tracking-widest leading-none">
                            {Number(l.channel_id) === 3 ? (l.school_origin || 'Sekolah Terdaftar') :
                              Number(l.channel_id) === 6 ? (l.partner_origin || 'Instansi Terdaftar') :
                                'Official Web'}
                          </p>

                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                            {l.source_platform || 'Direct'}
                          </p>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(l.status)}`}>{l.status.replace('_', ' ')}</span></td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-3">
                          <button type="button" title="Detail" onClick={() => { setSelectedLead(l); setShowDetailModal(true); }} className="p-3 bg-slate-50 text-slate-300 hover:text-blue-600 rounded-2xl transition-all shadow-sm"><Eye size={18} /></button>
                          <button type="button" title="Edit" onClick={() => handleOpenEdit(l)} className="p-3 bg-slate-50 text-slate-300 hover:text-amber-600 rounded-2xl transition-all shadow-sm"><Edit size={18} /></button>
                          <button type="button" title="Hapus" onClick={() => handleDelete(l.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-red-600 rounded-2xl transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL Tetap Sama (Proteksi identitas jalur khusus) */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar text-left text-[#002855]">
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
              <div className="mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4 animate-in slide-in-from-left-4">
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
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/activate`); toast.success("Akun Aktif!"); setShowDetailModal(false); fetchData(); } catch (e) { toast.error("Gagal"); } }} className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"><CheckCircle size={20} /> Aktifkan Akun Seleksi</button>
              )}
              {(selectedLead.status === 'awaiting_payment' || selectedLead.status === 'test_passed') && (
                <button type="button" onClick={async () => { try { await api.put(`/admin/leads/${selectedLead.id}/sahkan`); toast.success("Closing!"); setShowDetailModal(false); fetchData(); } catch (e) { toast.error("Gagal"); } }} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"><CheckCircle size={20} /> Sahkan & Cairkan Komisi</button>
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