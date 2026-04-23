import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Tambahkan useSearchParams
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { toast } from 'sonner';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Ambil kode referral dari URL jika ada (misal: /login?ref=REF-NOP-183)
  const ref = searchParams.get('ref');
  const backPath = ref ? `/p/${ref}` : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { access_token, user } = res.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'agent') navigate('/agent/dashboard');
      else if (user.role === 'student') navigate('/student/dashboard');
      
      toast.success(`Selamat datang kembali, ${user.name}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login gagal. Cek email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Portal Masuk" 
      subtitle="Kelola sistem pemasaran UNSIA dalam satu pintu."
      backTo={backPath} // SEKARANG DINAMIS: Balik ke Agent Landing Page
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {/* ... isi form login kamu ... */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Institusi</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="email" required className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="admin@unsia.ac.id" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kata Sandi</label>
            <button type="button" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Lupa Password?</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type={showPassword ? "text" : "password"} required className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95 flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Masuk Dashboard'}
        </button>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Belum menjadi mitra agen? <button type="button" onClick={() => navigate('/register-agent')} className="text-blue-600 hover:underline">Daftar Sekarang</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;