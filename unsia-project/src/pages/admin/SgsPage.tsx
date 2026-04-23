import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, ArrowLeft, Trash2, GraduationCap, Edit, Lock, X } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

// Definisi Struktur Data
interface StudentSgs {
  id: number;
  name: string;
  email: string;
  leads_as_sgs_count: number;
  sgs_profile?: {
    nim: string;
    major: string;
    scholarship_balance: number;
  };
}

const SgsPage = () => {
  const [students, setStudents] = useState<StudentSgs[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ 
    id: 0,
    name: '', 
    email: '', 
    nim: '', 
    major: '',
    password: '' 
  });

  const fetchSgs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/sgs');
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
      toast.error("Gagal sinkronisasi data"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchSgs(); 
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ id: 0, name: '', email: '', nim: '', major: '', password: '' });
    setViewState('form');
  };

  const handleOpenEdit = (student: any) => {
    setModalMode('edit');
    setFormData({
      id: student.id,
      name: student.name,
      email: student.email,
      nim: student.sgs_profile?.nim || '',
      major: student.sgs_profile?.major || '',
      password: '' // Kosongkan password saat awal edit
    });
    setViewState('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/admin/sgs', formData);
        toast.success('Ambassador berhasil ditambahkan');
      } else {
        await api.put(`/admin/sgs/${formData.id}`, formData);
        toast.success('Data ambassador diperbarui');
      }
      setViewState('list');
      fetchSgs();
    } catch (error: any) { 
      toast.error(error.response?.data?.message || 'Terjadi kesalahan sistem'); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus data ambassador ini?")) return;
    try {
      await api.delete(`/admin/sgs/${id}`);
      toast.success("Data berhasil dihapus");
      fetchSgs();
    } catch (e) { 
      toast.error("Gagal menghapus"); 
    }
  };

  // Helper Format Rupiah
  const formatRupiah = (num: any) => {
    const value = parseFloat(num) || 0;
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(value);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.sgs_profile?.nim.includes(searchQuery)
  );

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <button 
           type="button"
           onClick={() => setViewState('list')} 
           className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-colors" 
           title="Kembali"
         >
            <ArrowLeft size={18} /> Kembali ke Daftar
         </button>
         
         <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-[#002855] uppercase tracking-tight">
                    {modalMode === 'create' ? 'Daftarkan Ambassador' : 'Perbarui Data Mahasiswa'}
                </h2>
                <button type="button" onClick={() => setViewState('list')} title="Tutup">
                    <X size={24} className="text-slate-300 hover:text-red-500 transition-colors" />
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                    <label htmlFor="s-name" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nama Lengkap Mahasiswa</label>
                    <input id="s-name" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Sesuai KTM" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label htmlFor="s-nim" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">NIM</label>
                        <input id="s-nim" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} placeholder="2021..." />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="s-major" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Program Studi</label>
                        <input id="s-major" type="text" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} placeholder="Informatika" />
                    </div>
                </div>

                <div className={modalMode === 'edit' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-8"}>
                    <div className="space-y-2">
                        <label htmlFor="s-email" className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Institusi</label>
                        <input id="s-email" type="email" required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="mail@unsia.ac.id" />
                    </div>
                    {modalMode === 'edit' && (
                        <div className="space-y-2">
                            <label htmlFor="s-pass" className="text-[10px] font-black text-amber-600 uppercase ml-1 flex items-center gap-1 tracking-widest"><Lock size={10}/> Reset Password</label>
                            <input id="s-pass" type="password" className="w-full bg-amber-50/30 border border-amber-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-amber-500/10" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Kosongkan jika tidak diubah" />
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">
                  {modalMode === 'create' ? 'Daftarkan Mahasiswa' : 'Simpan Perubahan'}
                </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight leading-none mb-2">Ambassador SGS</h1>
            <p className="text-slate-400 text-sm font-medium italic">Student Get Student Program</p>
         </div>
         <button 
           type="button"
           onClick={handleOpenCreate} 
           className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center gap-2 hover:bg-blue-800 transition-all active:scale-95" 
           title="Tambah Mahasiswa"
         >
            <Plus size={18}/> Tambah Ambassador
         </button>
      </div>

      <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            id="s-search"
            aria-label="Cari Mahasiswa" 
            className="w-full bg-white border border-slate-100 rounded-3xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 shadow-sm" 
            placeholder="Cari nama atau NIM..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[400px]">
         {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-blue-600" size={40}/>
            </div>
         ) : (
            filteredStudents.length === 0 ? (
              <EmptyState title="Kosong" message="Belum ada data mahasiswa SGS." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-50">
                      <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          <th className="px-10 py-6">Ambassador</th>
                          <th className="px-10 py-6">NIM / Prodi</th>
                          <th className="px-10 py-6 text-center">Rekrutan</th>
                          <th className="px-10 py-6 text-right">Total Reward</th>
                          <th className="px-10 py-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold">
                      {filteredStudents.map(s => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-all group">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                    <GraduationCap size={20}/>
                                 </div>
                                 <div>
                                    <p className="text-[#002855]">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{s.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <p className="text-sm text-slate-600">{s.sgs_profile?.nim}</p>
                              <p className="text-[10px] text-blue-500 uppercase">{s.sgs_profile?.major}</p>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">
                                 {s.leads_as_sgs_count || 0}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-right font-black text-emerald-600">
                              {formatRupiah(s.sgs_profile?.scholarship_balance)}
                           </td>
                           <td className="px-10 py-6 text-center">
                              <div className="flex justify-center gap-3">
                                 <button 
                                   onClick={() => handleOpenEdit(s)} 
                                   className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 shadow-sm transition-all" 
                                   title="Edit Data & Password"
                                 >
                                    <Edit size={18}/>
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(s.id)} 
                                   className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 shadow-sm transition-all" 
                                   title="Hapus"
                                 >
                                    <Trash2 size={18}/>
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