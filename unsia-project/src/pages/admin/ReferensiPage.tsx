import { useState, useEffect } from 'react';
import { BookOpen, MapPin, Award, Building2, Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

interface RefData {
  id: number;
  code: string;
  name: string;
  description?: string;
  degree?: string;
  category?: string;
  status: 'Aktif' | 'Nonaktif';
}

type Category = 'prodi' | 'wilayah' | 'jenjang' | 'institusi';

const ReferensiPage = () => {
  const [activeTab, setActiveTab] = useState<Category>('prodi');
  const [data, setData] = useState<RefData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<RefData>>({ status: 'Aktif' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/references?type=${activeTab}`);
      setData(response.data);
    } catch (e) {
      toast.error('Gagal memuat data master');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') await api.post(`/admin/references?type=${activeTab}`, formData);
      else await api.put(`/admin/references/${formData.id}?type=${activeTab}`, formData);
      toast.success('Berhasil disimpan');
      setShowModal(false);
      fetchData();
    } catch (e) { toast.error('Gagal menyimpan'); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Hapus data master ini?')) return;
    try {
      await api.delete(`/admin/references/${id}?type=${activeTab}`);
      toast.success('Dihapus');
      fetchData();
    } catch (e) { toast.error('Gagal'); }
  };

  const getTitle = () => ({ prodi: 'Program Studi', wilayah: 'Wilayah Domisili', jenjang: 'Jenjang Pendidikan', institusi: 'Institusi Kerjasama' }[activeTab]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Data Master Sistem</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { id: 'prodi', label: 'Prodi', icon: <BookOpen size={20}/> },
          { id: 'wilayah', label: 'Wilayah', icon: <MapPin size={20}/> },
          { id: 'jenjang', label: 'Jenjang', icon: <Award size={20}/> },
          { id: 'institusi', label: 'Institusi', icon: <Building2 size={20}/> },
        ].map((tab) => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id as Category)} className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex items-center gap-4 ${activeTab === tab.id ? 'bg-[#002855] text-white border-transparent shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 shadow-sm'}`}>
            <div className={`p-3 rounded-2xl ${activeTab === tab.id ? 'bg-white/10' : 'bg-slate-50 text-blue-600'}`}>{tab.icon}</div>
            <span className="font-black uppercase text-xs tracking-widest">{tab.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-black text-[#002855] uppercase tracking-tight">{getTitle()}</h2>
          <button onClick={() => { setModalMode('create'); setFormData({status:'Aktif'}); setShowModal(true); }} className="bg-[#002855] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase shadow-lg flex items-center gap-2"><Plus size={16}/> Tambah Data</button>
        </div>

        {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div> : (
          data.length === 0 ? <EmptyState title="Belum Ada Data" message="Silakan tambahkan data master untuk kategori ini." /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest"><th className="px-8 py-6">Kode</th><th className="px-8 py-6">Nama Item</th><th className="px-8 py-6 text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map(item => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors font-bold">
                      <td className="px-8 py-6"><span className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-mono text-[#002855]">{item.code}</span></td>
                      <td className="px-8 py-6 text-[#002855]">{item.name}</td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button title="Edit" onClick={() => { setModalMode('edit'); setFormData(item); setShowModal(true); }} className="p-3 bg-slate-50 text-slate-300 hover:text-amber-600 rounded-2xl transition-all"><Edit size={18}/></button>
                          <button title="Hapus" onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-red-600 rounded-2xl transition-all"><Trash2 size={18}/></button>
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

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002855]/20 backdrop-blur-sm p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black text-[#002855] uppercase">{modalMode === 'create' ? 'Tambah' : 'Edit'} Data</h3><button onClick={() => setShowModal(false)} title="Tutup"><X size={24}/></button></div>
            <form onSubmit={handleSave} className="space-y-6">
              <input placeholder="Kode Master" className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} required />
              <input placeholder="Nama Item" className="w-full bg-slate-50 border-none rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Simpan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferensiPage;