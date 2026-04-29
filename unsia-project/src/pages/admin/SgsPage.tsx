import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ArrowLeft, Trash2, Edit } from 'lucide-react'; // GraduationCap dan X dihapus karena tidak terpakai
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

const SgsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ id: 0, name: '', email: '', nim: '', major: 'Informatika' });

  const fetchSgs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/sgs');
      setStudents(res.data);
    } catch (e) { 
      toast.error("Gagal muat data ambassador"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchSgs(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const load = toast.loading("Menyimpan data...");
    try {
      if (modalMode === 'create') await api.post('/admin/sgs', formData);
      else await api.put(`/admin/sgs/${formData.id}`, formData);
      
      toast.success("Berhasil memperbarui data!", { id: load });
      setViewState('list');
      fetchSgs();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Terjadi kesalahan", { id: load }); 
    }
  };

  const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nim.includes(searchQuery)
  );

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-indigo-600 transition-colors" title="Kembali ke daftar">
            <ArrowLeft size={18} /> Kembali ke Daftar
         </button>
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-10">
                {modalMode === 'create' ? 'Daftarkan Ambassador' : 'Edit Ambassador'}
            </h2>
            <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Mahasiswa Aktif</label>
                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Lengkap" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIM</label>
                      <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} placeholder="20210xxx" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Studi</label>
                      <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} placeholder="Informatika" />
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Mahasiswa</label>
                    <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="mhs@unsia.ac.id" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-indigo-700 transition-all">
                    SIMPAN DATA AMBASSADOR
                </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div><h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Ambassador SGS</h1><p className="text-slate-400 text-sm italic">Program Mahasiswa Ajak Mahasiswa</p></div>
         <button type="button" onClick={() => { setModalMode('create'); setFormData({id:0,name:'',email:'',nim:'',major:'Informatika'}); setViewState('form'); }} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Plus size={18}/> Tambah Mahasiswa
         </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input className="w-full bg-white border border-slate-100 rounded-3xl pl-12 pr-4 py-4 text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5" placeholder="Cari NIM atau Nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/5 min-h-[400px]">
        {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40}/></div> : (
           filteredStudents.length === 0 ? <EmptyState title="Belum Ada Data" message="Tidak ada mahasiswa dalam program ambassador ini." /> : (
           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black uppercase text-gray-400">
                <tr><th className="px-10 py-6">Mahasiswa</th><th className="px-10 py-6">NIM / Prodi</th><th className="px-10 py-6 text-center">Rekrutan</th><th className="px-10 py-6 text-right">Beasiswa</th><th className="px-10 py-6 text-center">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-indigo-50/30 transition-all">
                    <td className="px-10 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">S</div><div><p className="text-[#002855]">{s.name}</p><p className="text-[10px] text-slate-400 font-medium">{s.email}</p></div></div></td>
                    <td className="px-10 py-6"><p className="text-sm text-slate-600">{s.nim}</p><p className="text-[10px] text-indigo-500 uppercase">{s.prodi}</p></td>
                    <td className="px-10 py-6 text-center"><span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black">{s.rekrutan}</span></td>
                    <td className="px-10 py-6 text-right text-emerald-600 font-black">{formatRupiah(s.tabungan)}</td>
                    <td className="px-10 py-6 text-center">
                        <div className="flex justify-center gap-2">
                            {/* FIX: Ditambahkan atribut title agar tidak error linter */}
                            <button 
                                type="button" 
                                title="Edit Ambassador" 
                                onClick={() => { setModalMode('edit'); setFormData(s); setViewState('form'); }} 
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
                            >
                                <Edit size={16}/>
                            </button>
                            <button 
                                type="button" 
                                title="Hapus Ambassador" 
                                onClick={() => { if(confirm("Hapus data ambassador ini?")) api.delete(`/admin/sgs/${s.id}`).then(() => fetchSgs()); }} 
                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-all shadow-sm"
                            >
                                <Trash2 size={16}/>
                            </button>
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

export default SgsPage;