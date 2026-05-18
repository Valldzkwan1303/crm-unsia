import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Lock, Loader2, CheckCircle, AlertCircle, Smartphone, Mail } from 'lucide-react';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const RegisterAgent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', area: '', password: '' });
  const [modal, setModal] = useState({ show: false, type: 'success' as 'success' | 'error', title: '', message: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/register-agent', formData);
      setModal({ show: true, type: 'success', title: 'Registrasi Berhasil', message: 'Data Anda telah kami terima. Mohon tunggu verifikasi Admin sebelum Anda dapat mengakses dashboard partner.' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setModal({ show: true, type: 'error', title: 'Gagal Daftar', message: err.response?.data?.message || 'Terjadi kesalahan sistem, silakan coba lagi.' });
    } finally { setIsLoading(false); }
  };

  return (
    <AuthLayout 
      title="Gabung Partner" 
      subtitle="Jadilah bagian dari revolusi pendidikan digital Indonesia." 
      backTo="/"  // PERBAIKAN: Tombol kembali sekarang ke Beranda Utama
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input id="reg-name" required className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Sesuai KTP" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label htmlFor="reg-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input id="reg-email" type="email" required className="w-full bg-slate-50 border-none rounded-2xl pl-10 p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none" placeholder="mail@anda.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
            </div>
            <div className="space-y-1.5">
                <label htmlFor="reg-wa" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
                <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input id="reg-wa" required className="w-full bg-slate-50 border-none rounded-2xl pl-10 p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none" placeholder="0812..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
            </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-area" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Domisili</label>
          <div className="relative text-slate-400">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input id="reg-area" required className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Contoh: Jakarta Selatan" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
          </div>
        </div>

        <div className="space-y-1.5 pb-2">
          <label htmlFor="reg-pass" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kata Sandi</label>
          <div className="relative text-slate-400">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input id="reg-pass" type="password" required className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Min. 8 Karakter" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-[#002855] text-white font-black py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 uppercase tracking-widest text-xs active:scale-95">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Kirim Pendaftaran'}
        </button>

        <p className="text-center text-sm text-slate-400 font-medium pt-2">
          Sudah punya akun partner? <button type="button" onClick={() => navigate('/login')} className="text-blue-600 font-bold hover:underline">Masuk di sini</button>
        </p>
      </form>

      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modal.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
              {modal.type === 'success' ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
            </div>
            <h3 className="text-2xl font-black text-[#002855] mb-2">{modal.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{modal.message}</p>
            <button onClick={() => { setModal({...modal, show: false}); if(modal.type === 'success') navigate('/login'); }} className="w-full bg-[#002855] py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg">Tutup</button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default RegisterAgent;