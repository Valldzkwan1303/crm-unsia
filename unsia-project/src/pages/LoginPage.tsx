import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';
import { toast } from 'sonner';

/* ── Inline SVG icons for social login mockup ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
    <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ref = searchParams.get('ref');
  const backPath = ref ? `/p/${ref}` : '/';

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  /* ── LOGIKA TIDAK DIUBAH ── */
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
      } else if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'egs' || type === 'egs') {
        navigate('/egs/dashboard');
      } else if (role === 'sgs' || type === 'sgs') {
        navigate('/sgs/dashboard');
      } else {
        navigate('/agent/dashboard');
      }

      toast.success(`Selamat datang, ${user.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login Gagal. Cek email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Halaman Login"
      subtitle="Kelola sistem pendaftaran dalam satu pintu."
      backTo={backPath}
    >
      <form onSubmit={handleLogin} className="space-y-5">

        {/* ── Email ── */}
        <div className="space-y-1">
          <label
            htmlFor="login-email"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
          >
            Email Institusi
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={17}
            />
            <input
              id="login-email"
              name="email"
              type="email"
              required
              className="
                w-full bg-slate-50 border border-slate-200 rounded-2xl
                pl-11 pr-4 py-4 text-sm font-medium text-slate-700
                placeholder-slate-300 outline-none
                focus:bg-white focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]
                transition-all duration-200
              "
              placeholder="admin@unsia.ac.id"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* ── Password ── */}
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label
              htmlFor="login-password"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              Kata Sandi
            </label>
            <button
              type="button"
              className="text-[9px] font-black text-[#002855] uppercase hover:text-blue-700 transition-colors hover:underline underline-offset-2"
            >
              Lupa Password?
            </button>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={17}
            />
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="
                w-full bg-slate-50 border border-slate-200 rounded-2xl
                pl-11 pr-12 py-4 text-sm font-medium text-slate-700
                placeholder-slate-300 outline-none
                focus:bg-white focus:ring-2 focus:ring-[#002855]/20 focus:border-[#002855]
                transition-all duration-200
              "
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002855] transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* ── Submit Button with Shine + Loading ── */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full btn-shine text-white py-4 rounded-2xl
            font-black uppercase text-xs tracking-widest
            shadow-xl shadow-blue-900/20
            flex justify-center items-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed
            mt-2
          "
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Memproses...</span>
            </>
          ) : (
            'Masuk Dashboard'
          )}
        </button>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Atau masuk dengan
          </span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* ── Social Login Mockup ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="
              flex items-center justify-center gap-2.5 py-3 px-4
              border border-slate-200 rounded-xl bg-white
              hover:bg-slate-50 hover:border-slate-300
              transition-all text-xs font-bold text-slate-600
              shadow-sm hover:shadow
            "
            title="Login dengan Google (Segera hadir)"
            disabled
          >
            <GoogleIcon />
            Google
          </button>
          <button
            type="button"
            className="
              flex items-center justify-center gap-2.5 py-3 px-4
              border border-slate-200 rounded-xl bg-white
              hover:bg-slate-50 hover:border-slate-300
              transition-all text-xs font-bold text-slate-600
              shadow-sm hover:shadow
            "
            title="Login dengan Microsoft (Segera hadir)"
            disabled
          >
            <MicrosoftIcon />
            Microsoft
          </button>
        </div>

      </form>
    </AuthLayout>
  );
};

export default LoginPage;