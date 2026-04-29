import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // Tambahkan useSearchParams
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { toast } from 'sonner';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

      localStorage.clear();

      localStorage.setItem('token', access_token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('partnerType', user.type || user.role);

      const role = user.role?.toLowerCase();
      const type = user.type?.toLowerCase();

      if (role === 'admin') {
        navigate('/admin/dashboard');
      }
      else if (role === 'student') {
        navigate('/student/dashboard');
      }
      else if (role === 'egs' || type === 'egs') {
        navigate('/egs/dashboard');
      }
      else if (role === 'sgs' || type === 'sgs') {
        navigate('/sgs/dashboard');
      }
      else {
        navigate('/agent/dashboard');
      }

      toast.success(`Selamat datang, ${user.name}!`);
    } catch (err: any) {
      toast.error('Login Gagal. Cek email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Portal Masuk"
      subtitle="Kelola sistem pendaftaran dalam satu pintu."
      backTo={backPath}
    >
      <form onSubmit={handleLogin} className="space-y-6">

        <div className="space-y-1">
          <label htmlFor="login-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
            Email Institusi
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
              placeholder="admin@unsia.ac.id"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="space-y-1">
          <div className="flex justify-between items-center px-2">
            <label htmlFor="login-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Kata Sandi
            </label>
            <button type="button" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Lupa Password?</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              id="login-password" // WAJIB ADA ID
              name="password"     // WAJIB ADA NAME
              type={showPassword ? "text" : "password"}
              required
              className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              title={showPassword ? "Sembunyikan" : "Tampilkan"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-800 transition-all flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Masuk Dashboard'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;