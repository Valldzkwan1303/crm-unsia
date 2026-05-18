import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Loader2, Camera, ArrowLeft, Lock, CheckCircle, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    avatar: '',
    referral_code: ''
  });

  const [pass, setPass] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [modalAction, setModalAction] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const role = localStorage.getItem('userRole');
      setUserRole(role || '');

      const response = await api.get('/me');
      
      setProfile({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.agent_profile?.phone || '',
          area: response.data.agent_profile?.area || '',
          referral_code: response.data.agent_profile?.referral_code || '',
          avatar: response.data.avatar_url || ''
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files[0] == null) return;
    const formData = new FormData();
    formData.append('avatar', e.target.files[0]);
    setLoading(true);
    try {
      await api.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModalAction({
        show: true,
        type: 'success',
        title: 'Foto Diperbarui',
        message: 'Foto profil Anda berhasil diperbarui.',
        onClose: () => window.location.reload()
      });
    } catch (error) {
      console.error(error);
      setModalAction({ show: true, type: 'error', title: 'Gagal Upload', message: 'Ukuran foto maksimal 2MB.' });
    } finally { setLoading(false); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/profile/update', profile);
      localStorage.setItem('userName', profile.name);
      setModalAction({
        show: true,
        type: 'success',
        title: 'Profil Disimpan',
        message: 'Informasi profil Anda telah berhasil diperbarui.',
        onClose: () => fetchData()
      });
    } catch (error) {
      console.error(error);
      setModalAction({ show: true, type: 'error', title: 'Gagal Simpan', message: 'Cek kembali data Anda.' });
    } finally { setLoading(false); }
  };

  const handleUpdateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/agent/update-referral', { referral_code: profile.referral_code });
      setModalAction({
        show: true,
        type: 'success',
        title: 'Kode Diperbarui',
        message: 'Kode Referral Anda telah berubah.',
        onClose: () => fetchData()
      });
    } catch (error: unknown) {
      console.error(error);
      setModalAction({ show: true, type: 'error', title: 'Gagal', message: 'Kode sudah digunakan.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/profile/password', pass);
      setPass({ current_password: '', new_password: '', new_password_confirmation: '' });
      setModalAction({ show: true, type: 'success', title: 'Password Diganti', message: 'Keamanan akun Anda diperbarui.' });
    } catch (error: unknown) {
      console.error(error);
      setModalAction({ show: true, type: 'error', title: 'Gagal', message: 'Password lama salah.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-700 text-left -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#002855] shadow-sm transition-all" title="Kembali">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-black text-[#002855] uppercase tracking-tight">Pengaturan Profil</h1>
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] border-8 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner">
                {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={80} className="text-slate-300" />}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-4 bg-[#002855] text-white rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-90" title="Ganti Foto Profil">
                <Camera size={20} />
            </button>
            <input aria-label="Upload Avatar" type="file" id="avatar-input" hidden ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" />
        </div>
        <div className="text-center md:text-left space-y-2 relative z-10">
            <h2 className="text-3xl font-black text-[#002855] tracking-tight">{profile.name}</h2>
            <p className="text-slate-400 font-bold text-lg">{profile.email}</p>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100 mt-2">{userRole} access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-10"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><User size={20}/></div><h3 className="text-xl font-black text-[#002855] uppercase">Data Personal</h3></div>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-1">
                <label htmlFor="p-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input id="p-name" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required placeholder="Nama Lengkap" />
            </div>
            <div className="space-y-1">
                <label htmlFor="p-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                <input id="p-email" type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required placeholder="Alamat Email" />
            </div>
            {userRole === 'agent' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="p-phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                        <input id="p-phone" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="08..." />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="p-area" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wilayah</label>
                        <input id="p-area" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={profile.area} onChange={e => setProfile({...profile, area: e.target.value})} placeholder="Domisili" />
                    </div>
                </div>
            )}
            <button type="submit" disabled={loading} className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-blue-800 transition-all">{loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Simpan Profil'}</button>
          </form>

          {userRole === 'agent' && (
            <div className="mt-12 pt-10 border-t border-slate-50">
               <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Fingerprint size={20}/></div><h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Kustom Referral</h3></div>
               <div className="space-y-4">
                  <div className="space-y-1">
                      <label htmlFor="p-ref" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kode Referral Aktif</label>
                      <div className="flex gap-2">
                        <input id="p-ref" className="flex-1 bg-slate-50 border-none rounded-2xl p-4 text-sm font-black text-blue-600 outline-none focus:ring-4 focus:ring-blue-500/10" value={profile.referral_code} onChange={e => setProfile({...profile, referral_code: e.target.value.toUpperCase()})} placeholder="AGENT-KODE" />
                        <button type="button" onClick={handleUpdateReferral} className="bg-[#002855] text-white px-6 rounded-2xl font-black text-[10px] uppercase shadow-lg" title="Ganti Kode Referral">Ganti</button>
                      </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg flex flex-col">
          <div className="flex items-center gap-3 mb-10"><div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Lock size={20}/></div><h3 className="text-xl font-black text-[#002855] uppercase">Keamanan</h3></div>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-1 relative">
                <label htmlFor="p-old" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Lama</label>
                <div className="relative">
                  <input id="p-old" type={showOldPass ? "text" : "password"} required className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" value={pass.current_password} onChange={e => setPass({...pass, current_password: e.target.value})} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>
            <div className="space-y-1 relative">
                <label htmlFor="p-new" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                <div className="relative">
                  <input id="p-new" type={showNewPass ? "text" : "password"} required className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" value={pass.new_password} onChange={e => setPass({...pass, new_password: e.target.value})} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>
            <div className="space-y-1 relative">
                <label htmlFor="p-conf" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</label>
                <div className="relative">
                  <input id="p-conf" type={showConfPass ? "text" : "password"} required className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10" value={pass.new_password_confirmation} onChange={e => setPass({...pass, new_password_confirmation: e.target.value})} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfPass(!showConfPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">
                    {showConfPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-700 transition-all">{loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Update Password'}</button>
          </form>
        </div>
      </div>

      {modalAction.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalAction.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
              <CheckCircle size={44} />
            </div>
            <h3 className="text-2xl font-black text-[#002855] mb-2">{modalAction.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{modalAction.message}</p>
            <button onClick={() => { setModalAction({...modalAction, show: false}); if(modalAction.onClose) modalAction.onClose(); }} className="w-full bg-[#002855] py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg" title="Selesai">Selesai</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SettingsPage;