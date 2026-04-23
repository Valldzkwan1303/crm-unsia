import { useState, useEffect } from 'react';
import { Mail, Plus, Send, Trash2, Edit, ArrowLeft, Loader2, BarChart3, Eye } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';

interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: 'Terkirim' | 'Draft' | 'Terjadwal';
  recipients_count: number;
  sent_count: number;
  open_rate: number;
  scheduled_at: string;
  content: string;
}

const EmailPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<'list' | 'form'>('list');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '', subject: '', content: '', status: 'Draft'
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/campaigns');
      setCampaigns(response.data);
    } catch (e) {
      toast.error('Gagal memuat data kampanye');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') await api.post('/admin/campaigns', formData);
      else await api.put(`/admin/campaigns/${formData.id}`, formData);
      toast.success('Kampanye berhasil disimpan');
      setViewState('list');
      fetchCampaigns();
    } catch (e) {
      toast.error('Gagal menyimpan kampanye');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kampanye ini?')) return;
    try {
      await api.delete(`/admin/campaigns/${id}`);
      toast.success('Kampanye dihapus');
      fetchCampaigns();
    } catch (e) {
      toast.error('Gagal menghapus');
    }
  };

  if (viewState === 'form') {
    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-[#002855] transition-colors">
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50">
          <h2 className="text-2xl font-black text-[#002855] mb-10 uppercase tracking-tight">
            {modalMode === 'create' ? 'Buat Kampanye Baru' : 'Edit Kampanye'}
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="e-name" className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Kampanye</label>
              <input id="e-name" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Contoh: Promo Ramadhan 2024" />
            </div>
            <div className="space-y-1">
              <label htmlFor="e-subject" className="text-[10px] font-black text-slate-400 uppercase ml-1">Subject Email</label>
              <input id="e-subject" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.subject || ''} onChange={e => setFormData({...formData, subject: e.target.value})} required placeholder="Subject yang menarik perhatian..." />
            </div>
            <div className="space-y-1">
              <label htmlFor="e-content" className="text-[10px] font-black text-slate-400 uppercase ml-1">Isi Pesan</label>
              <textarea id="e-content" rows={6} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} required placeholder="Tulis pesan email di sini..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label htmlFor="e-date" className="text-[10px] font-black text-slate-400 uppercase ml-1">Jadwal Kirim</label>
                    <input id="e-date" type="date" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none" value={formData.scheduled_at?.split('T')[0] || ''} onChange={e => setFormData({...formData, scheduled_at: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label htmlFor="e-status" className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
                    <select id="e-status" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                        <option value="Draft">Draft</option>
                        <option value="Terjadwal">Terjadwal</option>
                        <option value="Terkirim">Terkirim</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg mt-4">Simpan Kampanye</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002855] tracking-tight uppercase leading-none mb-2">Email Marketing</h1>
          <p className="text-slate-400 text-sm font-medium italic">Kelola broadcast dan automasi email ke leads.</p>
        </div>
        <button onClick={() => { setModalMode('create'); setFormData({status:'Draft'}); setViewState('form'); }} className="bg-[#002855] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2">
           <Plus size={18}/> Buat Kampanye
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-lg">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Email</p><h3 className="text-2xl font-black text-[#002855]">{campaigns.length}</h3></div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Mail size={20}/></div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-lg">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terkirim</p><h3 className="text-2xl font-black text-emerald-500">{campaigns.reduce((a,b) => a + b.sent_count, 0)}</h3></div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Send size={20}/></div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:shadow-lg">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Open Rate</p><h3 className="text-2xl font-black text-blue-500">42%</h3></div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={20}/></div>
          </div>
      </div>

      {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div> : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.length === 0 ? <EmptyState title="Belum Ada Kampanye" message="Mulai buat kampanye email pertama Anda untuk memfollow-up leads." /> : campaigns.map((c) => (
            <div key={c.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-[#002855] tracking-tight">{c.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${c.status === 'Terkirim' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{c.status}</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium italic">Subject: {c.subject}</p>
                </div>
                <div className="grid grid-cols-3 gap-8 text-center border-l border-slate-100 pl-8 hidden lg:grid">
                  <div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Penerima</p><p className="text-sm font-black text-[#002855]">{c.recipients_count}</p></div>
                  <div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Terbuka</p><p className="text-sm font-black text-blue-600">{c.open_rate}%</p></div>
                  <div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Jadwal</p><p className="text-sm font-black text-slate-400">{c.scheduled_at || '-'}</p></div>
                </div>
                <div className="flex gap-2">
                    <button title="Lihat Preview" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 transition-all"><Eye size={18}/></button>
                    <button title="Edit" onClick={() => { setModalMode('edit'); setFormData(c); setViewState('form'); }} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-amber-600 transition-all"><Edit size={18}/></button>
                    <button title="Hapus" onClick={() => handleDelete(c.id)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-600 transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailPage;