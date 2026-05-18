import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowLeft, Trash2, Edit, UserPlus, ChevronRight, Users, Target, DollarSign, Briefcase } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50 hidden md:table-row">
    <td className="py-5 px-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-full"></div><div><div className="h-4 bg-slate-100 rounded w-32 mb-2"></div><div className="h-3 bg-slate-50 rounded w-24"></div></div></div></td>
    <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded w-20 mb-2"></div><div className="h-3 bg-slate-50 rounded w-24"></div></td>
    <td className="py-5 px-6"><div className="h-6 bg-slate-100 rounded-full w-12 mx-auto"></div></td>
    <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
    <td className="py-5 px-6"><div className="flex justify-center gap-2"><div className="w-8 h-8 bg-slate-50 rounded-lg"></div><div className="w-8 h-8 bg-slate-50 rounded-lg"></div></div></td>
  </tr>
);

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
      email: s.email,
      nip: s.nip || '',
      department: s.unit || '',
      password: ''
    });
    setViewState('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sedang menyimpan...");
    try {
      if (modalMode === 'create') {
        await api.post('/admin/egs', formData);
        toast.success('Staf EGS berhasil didaftarkan', { id: loadingToast });
      } else {
        await api.put(`/admin/egs/${formData.id}`, formData);
        toast.success('Data staf berhasil diperbarui', { id: loadingToast });
      }
      setViewState('list');
      setFormData({ id: 0, name: '', email: '', nip: '', department: '', password: '' });
      fetchEgs();
    } catch (error: any) { 
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

  const getUnitColor = (unit: string) => {
    const u = (unit || '').toLowerCase();
    if (u.includes('dosen') || u.includes('akademik') || u.includes('prodi')) {
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.nip && s.nip.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.unit && s.unit.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPegawai = staff.length;
  const totalRekrutan = staff.reduce((sum, s) => sum + (parseInt(s.rekrutan) || 0), 0);
  const totalBonus = staff.reduce((sum, s) => sum + (parseInt(s.bonus) || 0), 0);

  if (viewState === 'form') {
    return (
      <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pt-8 pb-20 text-left">
           <button type="button" onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-colors" title="Kembali ke daftar">
              <ArrowLeft size={18} /> Kembali ke Daftar
           </button>
           <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-2xl">
              <h2 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-2">
                  {modalMode === 'create' ? 'Daftarkan Staf EGS' : 'Edit Data Staf'}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-10">Lengkapi data di bawah ini untuk mendaftarkan atau memperbarui data pegawai Universitas Siber Asia ke dalam program Employee Get Student.</p>
              
              <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                      <label htmlFor="e-name" className="text-xs font-black text-slate-500 uppercase tracking-widest">Nama Lengkap Pegawai <span className="text-red-500">*</span></label>
                      <input id="e-name" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan Nama & Gelar" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="e-nip" className="text-xs font-black text-slate-500 uppercase tracking-widest">NIP <span className="text-red-500">*</span></label>
                        <input id="e-nip" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} placeholder="Contoh: 199xxx" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="e-dept" className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit Kerja <span className="text-red-500">*</span></label>
                        <input id="e-dept" type="text" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="Dosen Informatika / Biro Akademik" />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <label htmlFor="e-email" className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Resmi <span className="text-red-500">*</span></label>
                      <input id="e-email" type="email" required className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#002855] focus:ring-4 focus:ring-[#002855]/10 transition-all placeholder:text-slate-300" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@unsia.ac.id" />
                  </div>
                  <button type="submit" className="w-full bg-[#002855] text-white py-4 mt-4 rounded-xl font-black uppercase text-sm shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                      Simpan Data Pegawai
                  </button>
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
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Ambassador EGS</p>
            </div>
            <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight mb-2 leading-none">Ambassador EGS</h1>
            <p className="text-slate-500 text-sm font-medium">Program Afiliasi Karyawan & Dosen (Employee Get Student).</p>
         </div>
         <button type="button" onClick={() => { setModalMode('create'); setFormData({id:0, name:'', email:'', nip:'', department:'', password:''}); setViewState('form'); }} className="bg-[#002855] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-blue-800 transition-all">
            <UserPlus size={18}/> Tambah Staf
         </button>
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pegawai EGS</p><h3 className="text-3xl font-black text-[#002855]">{totalPegawai}</h3></div>
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Users size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Rekrutan</p><h3 className="text-3xl font-black text-indigo-600">{totalRekrutan}</h3></div>
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Target size={24}/></div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div><p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Total Bonus KPI</p><h3 className="text-3xl font-black text-emerald-600">{formatRupiah(totalBonus)}</h3></div>
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><DollarSign size={24}/></div>
         </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-end">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold shadow-sm outline-none focus:border-[#002855] focus:ring-2 focus:ring-[#002855]/10 transition-all" placeholder="Cari nama, NIP, atau Unit Kerja..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* DATA TABLE & CARDS */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[400px]">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                   <th className="px-6 py-5">Pegawai</th>
                   <th className="px-6 py-5">NIP / Unit Kerja</th>
                   <th className="px-6 py-5 text-center">Rekrutan</th>
                   <th className="px-6 py-5 text-right">Bonus KPI</th>
                   <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                 {filteredStaff.length === 0 ? (
                    <tr>
                       <td colSpan={5}>
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                             <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <Users size={48} className="text-slate-300" />
                             </div>
                             <h3 className="text-lg font-bold text-[#002855] mb-1">Belum Ada Data</h3>
                             <p className="text-slate-500 text-sm">Tidak ada staf dalam program ambassador ini.</p>
                          </div>
                       </td>
                    </tr>
                 ) : (
                    filteredStaff.map(s => (
                       <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-5">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#002855] flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                                   <Briefcase size={18} />
                                </div>
                                <div>
                                   <p className="text-[#002855] font-bold capitalize leading-tight mb-0.5">{s.name}</p>
                                   <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{s.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <p className="text-sm font-black text-slate-600 mb-1">{s.nip}</p>
                             <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getUnitColor(s.unit)}`}>
                                {s.unit || 'Umum'}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-center align-middle">
                             <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-600 border border-blue-100">
                                {s.rekrutan || 0}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-right align-middle">
                             <p className="text-emerald-600 font-black">{formatRupiah(s.bonus)}</p>
                          </td>
                          <td className="px-6 py-5 align-middle">
                             <div className="flex justify-center gap-2">
                                <span title="Edit Pegawai">
                                    <button 
                                        type="button" 
                                        onClick={() => handleOpenEdit(s)} 
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#002855] hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                </span>
                                <span title="Hapus Pegawai">
                                    <button 
                                        type="button" 
                                        onClick={() => handleDelete(s.id)} 
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </span>
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
            {filteredStaff.length === 0 ? (
               <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={24} className="text-slate-300" />
                  </div>
                  <p className="text-[#002855] font-bold text-lg">Belum Ada Data</p>
                  <p className="text-sm text-slate-500 mt-1">Tidak ada staf dalam program ambassador ini.</p>
               </div>
            ) : (
               filteredStaff.map(s => (
                  <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-[#002855]/20 transition-all">
                     <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#002855] flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                           <Briefcase size={20} />
                        </div>
                        <div className="pr-2">
                           <p className="text-[#002855] font-bold text-base leading-tight capitalize mb-1">{s.name}</p>
                           <p className="text-xs text-slate-500 font-medium truncate">{s.email}</p>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200/60">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">NIP</p>
                              <p className="text-sm font-black text-slate-600">{s.nip}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Unit Kerja</p>
                              <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getUnitColor(s.unit)}`}>
                                 {s.unit || 'Umum'}
                              </span>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rekrutan</p>
                              <span className="inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700">
                                 {s.rekrutan || 0}
                              </span>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bonus KPI</p>
                              <p className="text-sm font-black text-emerald-600">{formatRupiah(s.bonus)}</p>
                           </div>
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => handleOpenEdit(s)} className="p-3 bg-slate-50 text-slate-400 hover:text-[#002855] hover:bg-blue-50 rounded-xl transition-all shadow-sm flex-1 flex justify-center items-center gap-2 text-xs font-bold"><Edit size={16}/> Edit</button>
                        <button type="button" onClick={() => handleDelete(s.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm flex-1 flex justify-center items-center gap-2 text-xs font-bold"><Trash2 size={16}/> Hapus</button>
                     </div>
                  </div>
               ))
            )}
        </div>
      </div>
    </div>
  );
};

export default EgsPage;