import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2, User, Landmark, School,
  Briefcase, BookOpen, ChevronDown, Check, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../../components/AuthLayout';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // MENGUMPULKAN SEMUA PARAMETER JALUR PENDAFTARAN
  const params = {
    ref: searchParams.get('ref'),    
    school: searchParams.get('school'),
    sgs: searchParams.get('sgs'),      
    egs: searchParams.get('egs'),      
    partner: searchParams.get('partner'), 
    src: searchParams.get('src')       
  };

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', prodi_interest: 'Informatika'
  });

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const prodiOptions = ['Informatika', 'Sistem Informasi', 'Manajemen', 'Akuntansi', 'Ilmu Komunikasi'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/public/leads', {
        ...formData,
        ...params 
      });

      const registrationCode = response.data.registration_code;
      navigate(`/pembayaran-pendaftaran/${registrationCode}`);

    } catch (error) {
      alert('Email sudah terdaftar atau terjadi gangguan koneksi. Silakan gunakan email lain.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderInfo = () => {
    if (params.ref) return { title: 'Rekomendasi Mitra', icon: <User size={18} />, text: `Partner: ${params.ref}` };
    if (params.sgs) return { title: 'Ambassador Mahasiswa', icon: <GraduationCap size={18} />, text: `NIM: ${params.sgs}` };
    if (params.egs) return { title: 'Ambassador Karyawan', icon: <Briefcase size={18} />, text: `NIP: ${params.egs}` };
    if (params.school) return { title: 'Jalur Sosialisasi Sekolah', icon: <School size={18} />, text: params.school.replace(/-/g, ' ') };
    if (params.partner) return { title: 'Jalur Kerjasama Instansi', icon: <Landmark size={18} />, text: params.partner.replace(/-/g, ' ') };
    return null;
  };

  const backPath = params.ref ? `/p/${params.ref}` : '/';

  const info = getHeaderInfo();

  return (
    <AuthLayout title="Daftar Kuliah" subtitle="Lengkapi data Anda untuk pendaftaran UNSIA." backTo={backPath}>
      <form onSubmit={handleSubmitData} className="space-y-5">
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        {/* INFO BADGE: MENUNJUKKAN JALUR MASUK MAHASISWA */}
        {info && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 text-[#002855] mb-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg">{info.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">{info.title}</p>
              <p className="text-sm font-black uppercase tracking-tight">{info.text}</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nama Lengkap</label>
          <input
            id="name"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sesuai KTP"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email</label>
          <input
            id="email"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="mail@anda.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
          <input
            id="phone"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0812..."
            required
          />
        </div>

        <div className="space-y-1" ref={dropdownRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Program Studi</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold flex items-center justify-between outline-none focus:ring-4 focus:ring-blue-500/10"
            >
              <div className="flex items-center gap-4">
                <BookOpen size={18} className="text-slate-300" />
                <span className="text-slate-800">{formData.prodi_interest}</span>
              </div>
              <ChevronDown size={18} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden no-scrollbar">
                {prodiOptions.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setFormData({ ...formData, prodi_interest: p }); setIsOpen(false); }}
                    className="w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between hover:bg-blue-50 transition-colors"
                  >
                    {p}
                    {formData.prodi_interest === p && <Check size={16} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Lanjut ke Pembayaran'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default JoinPage;