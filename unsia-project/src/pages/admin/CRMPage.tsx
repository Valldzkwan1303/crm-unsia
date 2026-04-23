import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit, Eye, X, ArrowLeft, Download, CheckSquare, Square, Users, CheckCircle, Clock, Search, FileText
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

// ==========================================
// 1. DEFINISI INTERFACE (Lengkap & Terperinci)
// ==========================================
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  channel_id: number;
  channel?: { name: string };
  agent_id?: number;
  agent?: { name: string };
  sgs_id?: number;
  sgs?: { name: string };
  egs_id?: number;
  egs?: { name: string };
  prodi_interest: string;
  status: string;
  notes: string;
  source_platform?: string;        // Fix Error Property
  test_score?: number;
  payment_proof?: string;          // Bukti Daftar Ulang (Tahap Akhir)
  registration_fee_proof?: string; // Bukti Pendaftaran/Formulir (Tahap Awal)
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
      toast.error('Gagal sinkronisasi data dengan server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    const loadingToast = toast.loading("Memproses persetujuan massal...");
    try {
      const response = await api.post('/admin/leads/bulk-update', {
        ids: selectedIds,
        status: 'Registered'
      });
      toast.success(response.data.message, { id: loadingToast });
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      toast.error('Gagal memproses data massal', { id: loadingToast });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') await api.post('/admin/leads', formData);
      else await api.put(`/admin/leads/${formData.id}`, formData);
      toast.success('Data pendaftar berhasil disimpan');
      setViewState('list');
      fetchData();
    } catch (error) {
      toast.error('Gagal menyimpan perubahan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pendaftar ini secara permanen?')) return;
    try {
      await api.delete(`/admin/leads/${id}`);
      toast.success('Data pendaftar dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_report_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Laporan berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengekspor data');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesTab = activeTab === 'Semua' ? true : 
                       activeTab === 'Registered' ? (lead.status === 'active' || lead.status === 'Registered') : 
                       (lead.status !== 'active' && lead.status !== 'Registered');
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = lead.name.toLowerCase().includes(searchLower) || 
                          lead.email.toLowerCase().includes(searchLower);
                          
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'Registered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'lead':
      case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'awaiting_payment': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'test_passed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'calon_mahasiswa': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const SkeletonTable = () => (
    <div className="p-10 space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-8 items-center animate-pulse">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
          <div className="flex-1 h-4 bg-slate-50 rounded w-1/4"></div>
          <div className="flex-1 h-4 bg-slate-50 rounded w-1/4"></div>
          <div className="w-24 h-8 bg-slate-50 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-colors" title="Kembali">
          <ArrowLeft size={18} /> Kembali ke Daftar
        </button>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
          <h2 className="text-2xl font-black text-[#002855] mb-10 uppercase tracking-tight">
            {modalMode === 'create' ? 'Tambah Mahasiswa Baru' : 'Edit Data Mahasiswa'}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input placeholder="Nama Lengkap" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <input placeholder="Email" type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              <input placeholder="WhatsApp" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
              <select title="Ubah Status" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="lead">Peminat (Lead)</option>
                <option value="calon_mahasiswa">Calon Mahasiswa</option>
                <option value="test_passed">Lulus Seleksi</option>
                <option value="awaiting_payment">Menunggu Bayar UKT</option>
                <option value="active">Mahasiswa Aktif</option>
              </select>
            </div>
            <textarea placeholder="Catatan Admin" rows={3} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all mt-4">Simpan Data Mahasiswa</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">CRM Leads</h1>
          <p className="text-slate-400 text-sm font-medium italic uppercase tracking-tighter">Database Pendaftar Baru</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button type="button" onClick={handleBulkApprove} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg animate-in zoom-in transition-all" title="ACC Massal">
              ACC {selectedIds.length} Data
            </button>
          )}
          <button type="button" onClick={handleExport} className="bg-white border border-slate-200 text-[#002855] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all" title="Download CSV">
            <Download size={18} /> Export
          </button>
          <button type="button" onClick={handleOpenCreate} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2" title="Tambah Data">
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pendaftar</p><h3 className="text-2xl font-black text-[#002855]">{stats.total_leads}</h3></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={20} /></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telah ACC</p><h3 className="text-2xl font-black text-emerald-500">{stats.registered}</h3></div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={20} /></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum Verifikasi</p><h3 className="text-2xl font-black text-amber-500">{stats.pending}</h3></div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={20} /></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
          {['Semua', 'Registered', 'Pending'].map(t => (
            <button key={t} type="button" onClick={() => { setActiveTab(t as any); setSelectedIds([]); }} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === t ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-slate-400 hover:text-[#002855]'}`} title={t}>{t}</button>
          ))}
        </div>
        <div className="relative w-full md:w-80 px-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input aria-label="Cari Mahasiswa" className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" placeholder="Cari nama atau email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[400px]">
        {loading ? <SkeletonTable /> : (
          filteredLeads.length === 0 ? <EmptyState title="Belum Ada Data" message={`Tidak ada mahasiswa dalam kategori ${activeTab}.`} /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    <th className="p-6 w-12 text-center">
                      <button type="button" onClick={() => setSelectedIds(selectedIds.length === filteredLeads.length ? [] : filteredLeads.map(l => l.id))} title="Pilih Semua">
                        {selectedIds.length > 0 && selectedIds.length === filteredLeads.length ? <CheckSquare className="text-blue-600" size={18} /> : <Square size={18} />}
                      </button>
                    </th>
                    <th className="px-8 py-6">Mahasiswa</th>
                    <th className="px-8 py-6">Kanal (Sumber)</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                  {filteredLeads.map(l => (
                    <tr key={l.id} className={`hover:bg-blue-50/30 transition-all ${selectedIds.includes(l.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="p-6 text-center">
                        <button type="button" onClick={() => handleSelectRow(l.id)} title="Pilih">
                          <CheckSquare className={selectedIds.includes(l.id) ? 'text-blue-600' : 'text-slate-200'} size={18} />
                        </button>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-[#002855] text-base">{l.name}</div>
                        <div className="text-xs text-slate-400 font-medium lowercase italic">{l.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          {l.agent ? (
                            <>
                              <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">Mitra Umum</p>
                              <p className="text-[10px] text-blue-600 font-black italic">Ref: {l.agent.name}</p>
                            </>
                          ) : l.sgs ? (
                            <>
                              <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">Ambassador SGS</p>
                              <p className="text-[10px] text-indigo-600 font-black italic">Ref: {l.sgs.name}</p>
                            </>
                          ) : l.egs ? (
                            <>
                              <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">Ambassador EGS</p>
                              <p className="text-[10px] text-emerald-600 font-black italic">Ref: {l.egs.name}</p>
                            </>
                          ) : (
                            <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">Website Utama</p>
                          )}
                          <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">{l.source_platform || 'Direct'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
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

      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">

            <div className="flex justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#002855] leading-tight">{selectedLead.name}</h3>
                <p className="text-slate-400 font-medium lowercase italic">{selectedLead.email}</p>
              </div>
              <button type="button" title="Tutup Detail" onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-[#002855] font-black text-sm">{selectedLead.phone}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Ujian</p>
                  <p className="text-blue-600 font-black text-lg">{selectedLead.test_score || 0} / 100</p>
                </div>
              </div>

              {/* Tampilan Bukti Bayar Dinamis (Awal vs Akhir) */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lampiran Bukti Pembayaran</p>
                {selectedLead.payment_proof || selectedLead.registration_fee_proof ? (
                  <div className="relative group overflow-hidden rounded-3xl border-2 border-slate-100">
                    <img
                      src={`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`}
                      alt="Payment Proof"
                      className="w-full h-40 object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-[#002855]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <button type="button" title="Lihat Full" onClick={() => window.open(`http://127.0.0.1:8000/storage/${selectedLead.payment_proof || selectedLead.registration_fee_proof}`, '_blank')} className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-xs shadow-xl flex items-center gap-2"><Eye size={14}/> Lihat Full</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center">
                    <p className="text-slate-400 text-xs italic font-medium uppercase tracking-widest text-center px-4">Belum ada bukti yang diunggah pendaftar</p>
                  </div>
                )}
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 text-center">
                    {selectedLead.payment_proof ? "Bukti Daftar Ulang (Closing)" : selectedLead.registration_fee_proof ? "Bukti Biaya Pendaftaran (Awal)" : "Tidak ada file"}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 font-medium leading-relaxed italic text-slate-500">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 not-italic flex items-center gap-2"><FileText size={12}/> Catatan Internal</p>
               "{selectedLead.notes || "Tidak ada catatan tambahan."}"
            </div>

            <div className="flex flex-col gap-3">
              {/* GERBANG 1: AKTIVASI AKUN (Status Lead & Sudah Bayar Awal) */}
              {selectedLead.status === 'lead' && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Aktifkan akun ini? Calon maba akan bisa login untuk ujian.")) return;
                    try {
                      await api.put(`/admin/leads/${selectedLead.id}/activate`);
                      toast.success("Akun BERHASIL diaktifkan!");
                      setShowDetailModal(false);
                      fetchData();
                    } catch (e) { toast.error("Gagal mengaktifkan akun"); }
                  }}
                  className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
                  title="Aktivasi Akun"
                >
                  <CheckCircle size={20} /> Aktifkan Akun (Kirim Akses Ujian)
                </button>
              )}

              {/* GERBANG 2: PENGESAHAN MAHASISWA (Status Awaiting Payment & Sudah Bayar Akhir) */}
              {(selectedLead.status === 'awaiting_payment' || selectedLead.status === 'test_passed') && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Sahkan mahasiswa ini? Komisi partner akan otomatis cair.")) return;
                    try {
                      await api.put(`/admin/leads/${selectedLead.id}/sahkan`);
                      toast.success("Mahasiswa resmi menjadi MAHASISWA AKTIF!");
                      setShowDetailModal(false);
                      fetchData();
                    } catch (e) { toast.error("Gagal melakukan pengesahan"); }
                  }}
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                  title="Sahkan Mahasiswa"
                >
                  <CheckCircle size={20} /> Sahkan Mahasiswa (Cairkan Komisi)
                </button>
              )}

              <button type="button" onClick={() => setShowDetailModal(false)} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Tutup Modal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMPage;