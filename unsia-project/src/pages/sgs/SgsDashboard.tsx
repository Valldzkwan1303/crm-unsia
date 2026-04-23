import { useEffect, useState } from 'react';
import { Users, Download, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../api/axios';
import { Card } from '../../components/Card';

const SgsDashboard = () => {
  const [stats, setStats] = useState<any>({ 
    total_referrals: 0, 
    nim: '...',
    agent_name: 'Ambassador'
  });
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats({
        total_referrals: res.data.stats.total_referrals, 
        agent_name: res.data.stats.agent_name,
        nim: res.data.stats.agent_code 
      });
      setReferrals(res.data.referrals);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
};

  useEffect(() => { 
    fetchData(); 
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* BANNER UTAMA */}
      <div className="bg-gradient-to-br from-indigo-700 to-[#002855] p-10 rounded-[3rem] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
            <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest w-fit border border-white/20">Official Ambassador</div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
                Halo, {stats.agent_name}!<br/>
                <span className="text-indigo-200">Bantu Teman Kuliah di UNSIA.</span>
            </h1>
            <p className="text-indigo-100/60 max-w-sm font-medium italic leading-relaxed">
                Bagikan kebaikan pendidikan siber. NIM Anda adalah kunci akses jalur prioritas bagi teman-teman Anda.
            </p>
        </div>
        <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-3 group">
            <QRCodeSVG value={`${window.location.origin}/join?sgs=${stats.nim}`} size={130} />
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-800 transition-colors">
                <Download size={14}/> Download QR
            </button>
        </div>
      </div>

      {/* STATS GRID (2 KOLOM BESAR) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-10 flex flex-col justify-center border-indigo-50 bg-indigo-50/10 hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pencapaian Ambassador</p>
                <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users size={24} />
                </div>
            </div>
            <h3 className="text-6xl font-black text-[#002855] tracking-tighter">{stats.total_referrals}</h3>
            <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-tight">Teman Berhasil Diajak</p>
        </Card>

        <Card className="p-10 flex flex-col justify-center border-slate-100 bg-white">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Identitas Digital Anda</p>
            <div className="flex items-center gap-6">
                <div className="flex-1">
                    <p className="text-3xl font-black text-[#002855] uppercase font-mono tracking-widest">{stats.nim}</p>
                    <div className="h-1.5 w-12 bg-indigo-500 rounded-full mt-3"></div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Status Akun</p>
                    <p className="text-xs font-black text-emerald-500 uppercase italic">Mahasiswa Aktif</p>
                </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-6 italic font-medium leading-relaxed">
                * NIM ini digunakan sebagai kode referral otomatis pada link pendaftaran Anda.
            </p>
        </Card>
      </div>

      {/* MONITORING DAFTAR TEMAN */}
      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/5">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50">
            <div>
                <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Status Pendaftaran Teman</h3>
                <p className="text-slate-400 text-xs font-medium italic mt-1">Pantau perkembangan pendaftaran teman yang Anda ajak.</p>
            </div>
            <button className="hidden md:flex text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] items-center gap-2 hover:gap-4 transition-all group">
                Selengkapnya <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
            </button>
        </div>
        <div className="p-8 space-y-4">
            {referrals.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic font-medium">
                    Belum ada data pendaftaran teman yang masuk melalui NIM Anda.
                </div>
            ) : referrals.map((r, i) => (
                <div key={i} className="p-6 border border-slate-50 rounded-[2rem] flex items-center justify-between hover:bg-slate-50/50 hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                            <CheckCircle size={24}/>
                        </div>
                        <div>
                            <p className="font-black text-[#002855] text-lg tracking-tight">{r.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{r.prodi}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                            r.status === 'Registered' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                            {r.status}
                        </span>
                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-2 mr-2">{r.date}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SgsDashboard;