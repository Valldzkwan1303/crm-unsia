import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ArrowLeft, Trash2, School, Edit} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

const BtsPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ id: 0, name: '', email: '', bts_id: '', unit: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bts');
      setStaff(res.data);
    } catch (e) { toast.error("Gagal muat data petugas BTS"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenEdit = (s: any) => {
    setModalMode('edit');
    setFormData({ id: s.id, name: s.name, email: s.email, bts_id: s.bts_id, unit: s.unit });
    setViewState('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Menyimpan...");
    try {
      if (modalMode === 'create') await api.post('/admin/bts', formData);
      else await api.put(`/admin/bts/${formData.id}`, formData);
      toast.success("Berhasil diperbarui!", { id: load });
      setViewState('list');
      fetchData();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error", { id: load }); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus petugas lapangan ini?")) return;
    try {
      await api.delete(`/admin/bts/${id}`);
      toast.success("Petugas dihapus");
      fetchData();
    } catch (e) { toast.error("Gagal menghapus"); }
  };

  const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.bts_id?.includes(searchQuery));

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-all"><ArrowLeft size={18} /> Kembali</button>
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-[#002855] uppercase mb-10">{modalMode === 'create' ? 'Daftarkan Petugas BTS' : 'Edit Petugas'}</h2>
            <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Petugas</label><input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama & Gelar" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Petugas BTS</label><input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.bts_id} onChange={e => setFormData({...formData, bts_id: e.target.value})} placeholder="BTS-xxx" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit / Wilayah</label><input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="Contoh: Jakarta Barat" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Resmi</label><input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="petugas@unsia.ac.id" /></div>
                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">SIMPAN DATA PETUGAS</button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
         <div><h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Petugas Back to School</h1><p className="text-slate-400 text-sm italic">Manajemen Tim Sosialisasi Lapangan</p></div>
         <button onClick={() => { setModalMode('create'); setFormData({id:0,name:'',email:'',bts_id:'',unit:''}); setViewState('form'); }} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center gap-2 transition-all active:scale-95"><Plus size={18}/> Tambah Petugas</button>
      </div>
      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input className="w-full bg-white border border-slate-100 rounded-3xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5" placeholder="Cari nama atau ID Petugas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[400px]">
         {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div> : (
            filteredStaff.length === 0 ? <EmptyState title="Kosong" message="Belum ada petugas BTS terdaftar." /> : (
            <div className="overflow-x-auto"><table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase text-gray-400"><tr className="tracking-widest"><th className="px-10 py-6">Petugas</th><th className="px-10 py-6">ID / Unit</th><th className="px-10 py-6 text-center">Rekrutan</th><th className="px-10 py-6 text-center">Aksi</th></tr></thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {filteredStaff.map(s => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-all">
                           <td className="px-10 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-black"><School size={20}/></div><div><p className="text-[#002855]">{s.name}</p><p className="text-[10px] text-slate-400 uppercase">{s.email}</p></div></div></td>
                           <td className="px-10 py-6"><p className="text-sm text-slate-600">{s.bts_id}</p><p className="text-[10px] text-blue-500 uppercase">{s.unit}</p></td>
                           <td className="px-10 py-6 text-center"><span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">{s.rekrutan}</span></td>
                           <td className="px-10 py-6 text-center"><div className="flex justify-center gap-3"><button onClick={() => handleOpenEdit(s)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 shadow-sm transition-all" title="Edit"><Edit size={18}/></button><button onClick={() => handleDelete(s.id)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 shadow-sm transition-all" title="Hapus"><Trash2 size={18}/></button></div></td>
                        </tr>
                     ))}
                  </tbody>
            </table></div>
            )
         )}
      </div>
    </div>
  );
};

export default BtsPage;