import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ArrowLeft, Trash2, Briefcase, Edit, X } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

const EgsPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ 
    id: 0,
    name: '', 
    email: '', 
    nip: '', 
    department: '',
    password: '' 
  });

  const fetchEgs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/egs');
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
      toast.error("Gagal muat data staf"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchEgs(); }, []);

  const handleOpenEdit = (s: any) => {
    setModalMode('edit');
    setFormData({
      id: s.id,
      name: s.name,
      email: s.email, // Pastikan email terisi saat edit
      nip: s.egs_profile?.nip || '',
      department: s.egs_profile?.department || '',
      password: ''
    });
    setViewState('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sedang menyimpan...");
    try {
      if (modalMode === 'create') {
        // PERBAIKAN: Kirim data murni (JSON)
        await api.post('/admin/egs', formData);
        toast.success('Ambassador EGS berhasil didaftarkan', { id: loadingToast });
      } else {
        await api.put(`/admin/egs/${formData.id}`, formData);
        toast.success('Data staf berhasil diperbarui', { id: loadingToast });
      }
      setViewState('list');
      setFormData({ id: 0, name: '', email: '', nip: '', department: '', password: '' });
      fetchEgs();
    } catch (error: any) { 
      // Tampilkan error spesifik dari Laravel jika validasi gagal
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan sistem';
      toast.error(errorMsg, { id: loadingToast }); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus data staf ini?")) return;
    try {
      await api.delete(`/admin/egs/${id}`);
      toast.success("Data berhasil dihapus");
      fetchEgs();
    } catch (e) { toast.error("Gagal menghapus"); }
  };

  const formatRupiah = (num: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.egs_profile?.nip.includes(searchQuery)
  );

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-colors">
            <ArrowLeft size={18} /> Kembali
         </button>
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-[#002855] uppercase tracking-tight">
                    {modalMode === 'create' ? 'Daftarkan Staf EGS' : 'Edit Data Staf'}
                </h2>
                <button type="button" onClick={() => setViewState('list')} title="Tutup">
                    <X size={24} className="text-slate-300 hover:text-red-500 transition-colors" />
                </button>
            </div>
            <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                    <label htmlFor="e-name" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Lengkap Pegawai</label>
                    <input id="e-name" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama & Gelar" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="e-nip" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">NIP</label>
                        <input id="e-nip" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} placeholder="199xxx" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="e-dept" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Unit Kerja</label>
                        <input id="e-dept" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="Dosen / Biro" />
                    </div>
                </div>

                {/* BAGIAN EMAIL: Pastikan input ini terhubung ke formData.email */}
                <div className="space-y-2">
                    <label htmlFor="e-email" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Resmi</label>
                    <input 
                        id="e-email" 
                        type="email" 
                        required 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        placeholder="email@unsia.ac.id" 
                    />
                </div>

                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-800 transition-all">
                    {modalMode === 'create' ? 'Simpan Data Pegawai' : 'Simpan Perubahan'}
                </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div><h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">Ambassador EGS</h1><p className="text-slate-400 text-sm font-medium italic">Employee Get Student Program</p></div>
         <button type="button" onClick={() => { setModalMode('create'); setFormData({id:0, name:'', email:'', nip:'', department:'', password:''}); setViewState('form'); }} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center gap-2 hover:bg-blue-800 transition-all active:scale-95">
            <Plus size={18}/> Tambah Staf
         </button>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input id="e-search" aria-label="Cari" className="w-full bg-white border border-slate-100 rounded-3xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 shadow-sm" placeholder="Cari nama atau NIP..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[400px]">
         {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div> : (
            filteredStaff.length === 0 ? <EmptyState title="Kosong" message="Tidak ada data staf ambassador." /> : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-50">
                     <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <th className="px-10 py-6">Pegawai</th><th className="px-10 py-6">NIP / Unit</th><th className="px-10 py-6 text-center">Rekrutan</th><th className="px-10 py-6 text-right">Bonus KPI</th><th className="px-10 py-6 text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {filteredStaff.map(s => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-all group">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black"><Briefcase size={20}/></div>
                                 <div><p className="text-[#002855]">{s.name}</p><p className="text-[10px] text-slate-400 uppercase tracking-tighter">{s.email}</p></div>
                              </div>
                           </td>
                           <td className="px-10 py-6"><p className="text-sm text-slate-600">{s.egs_profile?.nip}</p><p className="text-[10px] text-blue-500 uppercase">{s.egs_profile?.department}</p></td>
                           <td className="px-10 py-6 text-center"><span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">{s.leads_as_egs_count || 0}</span></td>
                           <td className="px-10 py-6 text-right text-emerald-600 font-black">{formatRupiah(s.egs_profile?.performance_bonus)}</td>
                           <td className="px-10 py-6 text-center">
                              <div className="flex justify-center gap-3">
                                 <button type="button" onClick={() => handleOpenEdit(s)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 shadow-sm transition-all" title="Edit Staf"><Edit size={18}/></button>
                                 <button type="button" onClick={() => handleDelete(s.id)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 shadow-sm transition-all" title="Hapus"><Trash2 size={18}/></button>
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
    </div>
  );
};

export default EgsPage;