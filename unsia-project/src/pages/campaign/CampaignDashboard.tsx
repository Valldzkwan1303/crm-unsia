import { useState, useEffect } from 'react';
import { 
  Plus, QrCode, Link as LinkIcon, Loader2, 
  MapPin, X, Copy, Check 
} from 'lucide-react'; // Icon dibersihkan dari yang tidak terpakai
import api from '../../api/axios';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const CampaignDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [showQR, setShowQR] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // FIX: Tambahkan default value '' agar tidak error 'null'
  const userRole = localStorage.getItem('userRole') || 'bts'; 

  const fetchHistory = async () => {
    try {
      const res = await api.get('/agent/campaign-locations');
      setLocations(res.data);
    } catch (e) { 
      toast.error("Gagal muat history lokasi"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation) return;
    const load = toast.loading("Menyimpan lokasi...");
    try {
      await api.post('/agent/campaign-locations', { location_name: newLocation });
      toast.success("Lokasi berhasil disimpan!", { id: load });
      setNewLocation('');
      fetchHistory();
    } catch (e) { 
      toast.error("Gagal menyimpan lokasi", { id: load }); 
    }
  };

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/join?loc=${slug}&src=direct`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40}/>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10 text-left">
      {/* BANNER IDENTITAS */}
      <div className="bg-gradient-to-br from-[#002855] to-blue-600 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-900/20">
        <h1 className="text-3xl font-black uppercase tracking-tight">
            Portal {userRole === 'bts' ? 'Back to School' : 'Kerjasama B2B'}
        </h1>
        <p className="text-blue-100 italic mt-2 font-medium opacity-80">
            Kelola daftar {userRole === 'bts' ? 'sekolah' : 'instansi'} kunjungan lapangan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT LOKASI BARU */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Plus size={24}/></div>
            <h3 className="font-black text-[#002855] uppercase text-sm tracking-widest">
                {userRole === 'bts' ? 'Tambah Sekolah' : 'Tambah Instansi'}
            </h3>
          </div>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <input 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 text-sm"
              placeholder={userRole === 'bts' ? "Contoh: SMAN 1 Jakarta" : "Contoh: PT. Telkom"}
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              required
            />
            <button type="submit" className="w-full py-4 bg-[#002855] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-800 transition-all">
                Simpan Ke History
            </button>
          </form>
        </div>

        {/* TABEL HISTORY */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-[#002855] uppercase text-sm tracking-widest leading-none">History Kunjungan</h3>
            <MapPin size={20} className="text-slate-300"/>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                <tr>
                  <th className="p-6">Lokasi {userRole === 'bts' ? 'Sekolah' : 'Instansi'}</th>
                  <th className="p-6 text-center">Rekrutan</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {locations.length === 0 ? (
                    <tr><td colSpan={3} className="p-16 text-center text-slate-300 italic text-xs uppercase tracking-widest">Belum ada history data.</td></tr>
                ) : locations.map((loc: any) => (
                  <tr key={loc.id} className="hover:bg-blue-50/30 transition-all">
                    <td className="p-6 text-[#002855] text-sm uppercase">{loc.location_name}</td>
                    <td className="p-6 text-center">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                            {loc.total_leads}
                        </span>
                    </td>
                    <td className="p-6">
                        <div className="flex justify-center gap-2">
                            <button type="button" title="Lihat QR" onClick={() => setShowQR(loc)} className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all"><QrCode size={18}/></button>
                            <button type="button" title="Salin Link" onClick={() => copyLink(loc.location_slug)} className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-500 transition-all"><LinkIcon size={18}/></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL QR CODE */}
      {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/40 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl relative text-center animate-in zoom-in-95">
                  <button type="button" onClick={() => setShowQR(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors" title="Tutup"><X size={24}/></button>
                  <h3 className="text-xl font-black text-[#002855] uppercase mb-1 leading-tight">{showQR.location_name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Scan pendaftaran jalur {userRole.toUpperCase()}</p>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-inner inline-block border-4 border-slate-50 mb-8">
                    <QRCodeSVG value={`${window.location.origin}/join?loc=${showQR.location_slug}&src=qrcode`} size={180} />
                  </div>
                  <button type="button" onClick={() => copyLink(showQR.location_slug)} className="w-full py-4 bg-slate-50 text-[#002855] rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                    {copied ? <Check size={16} className="text-emerald-500"/> : <Copy size={16}/>} 
                    {copied ? 'Berhasil Disalin' : 'Salin Tautan'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CampaignDashboard;