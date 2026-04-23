import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, LogOut, Loader2, BookOpen,
  ChevronRight, QrCode, AlertCircle, Sparkles, Upload
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/student/status');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleStartTest = async () => {
    if (!confirm("Mulai Ujian Seleksi sekarang? Pastikan koneksi stabil.")) return;
    setIsTakingTest(true);
    setTimeout(async () => {
      try {
        // Panggil API untuk submit test (Backend akan menentukan lulus/gagal secara random)
        await api.post('/student/submit-test');
        fetchStatus();
        toast.success("Ujian Selesai. Hasil telah keluar!");
      } catch (e) {
        toast.error("Gagal memproses hasil ujian");
      } finally {
        setIsTakingTest(false);
      }
    }, 3000); // Simulasi proses penilaian 3 detik
  };

  const handleUploadUKT = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('payment_proof', file);

    setUploading(true);
    try {
      await api.post('/student/upload-payment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Bukti Daftar Ulang berhasil dikirim!");
      fetchStatus();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Gagal mengunggah gambar";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const lead = data.lead;
  const status = lead.status;

  const isLulus = status === 'test_passed' || status === 'active';
  const isGagal = status === 'test_failed';
  const isCalon = status === 'calon_mahasiswa';

  const theme = {
    bg: isLulus ? 'bg-emerald-50' : isGagal ? 'bg-rose-50' : 'bg-slate-50',
    header: isLulus ? 'bg-emerald-600' : isGagal ? 'bg-rose-600' : 'bg-[#002855]',
    text: isLulus ? 'text-emerald-900' : isGagal ? 'text-rose-900' : 'text-[#002855]',
    accent: isLulus ? 'bg-emerald-500' : isGagal ? 'bg-rose-500' : 'bg-blue-600',
    border: isLulus ? 'border-emerald-100' : isGagal ? 'border-rose-100' : 'border-blue-100'
  };

  return (
    <div className={`min-h-screen ${theme.bg} font-sans pb-20 transition-colors duration-1000`}>

      {/* HEADER SECTION */}
      <header className={`${theme.header} text-white p-10 pb-40 relative transition-colors duration-1000`}>
        <div className="max-w-5xl mx-auto flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight capitalize">Halo, {data.user.name}!</h1>
            <p className="text-white/70 text-[10px] mt-1 uppercase tracking-[0.2em] font-black">
              {isLulus ? 'Seleksi Tahap Akhir' : isGagal ? 'Hasil Evaluasi' : 'Portal Calon Mahasiswa'}
            </p>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} title="Logout" className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto -mt-24 px-6 relative z-20">

        {/* BANNER NOTIFIKASI */}
        <div className={`bg-white rounded-[2.5rem] p-5 mb-8 shadow-2xl flex items-center gap-5 border-2 ${theme.border} animate-in slide-in-from-top-4 duration-700`}>
          <div className={`p-4 rounded-2xl ${theme.accent} text-white shadow-lg`}>
            {isLulus ? <Sparkles size={28} /> : isGagal ? <AlertCircle size={28} /> : <BookOpen size={28} />}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Terbaru</p>
            <p className={`text-base font-black ${theme.text}`}>
              {isCalon && "Akses ujian telah dibuka. Silakan kerjakan test seleksi sekarang."}
              {status === 'test_passed' && "Selamat! Anda dinyatakan LULUS. Segera selesaikan Daftar Ulang."}
              {status === 'test_failed' && "Mohon maaf, Anda belum memenuhi kriteria kelulusan akademik."}
              {status === 'active' && "Selamat Datang! Anda resmi menjadi Mahasiswa Aktif UNSIA."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100 text-center relative overflow-hidden">

          {/* 1. TAMPILAN MAU UJIAN (BIRU) */}
          {isCalon && (
            <div className="max-w-md mx-auto space-y-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><BookOpen size={48} /></div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#002855]">Ujian Masuk Online</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">Selesaikan 20 soal logika dan umum dalam waktu 15 menit sebagai syarat utama menjadi mahasiswa.</p>
              </div>
              <button
                onClick={handleStartTest}
                className="w-full bg-[#002855] hover:bg-blue-800 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Mulai Ujian Sekarang <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* 2. TAMPILAN LULUS / DAFTAR ULANG (HIJAU) */}
          {status === 'test_passed' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left animate-in slide-in-from-bottom-6">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg"><CheckCircle size={40} /></div>
                <h2 className="text-4xl font-black text-emerald-900 leading-tight tracking-tighter uppercase">Selamat!<br />Anda <span className="text-emerald-500 italic">Lulus.</span></h2>
                <p className="text-emerald-700/70 text-sm font-medium leading-relaxed">
                  Langkah terakhir adalah melakukan <strong>Daftar Ulang & Pembayaran UKT</strong>. Setelah ini selesai, NIM Anda akan diterbitkan secara otomatis oleh sistem.
                </p>
                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                  <div className="flex justify-between items-center mb-1 text-emerald-800 font-black"><span className="text-xs uppercase opacity-60">Total Biaya:</span><span className="text-xl">Rp 3.500.000</span></div>
                  <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest italic">*UKT Semester 1 + Jas Almamater</p>
                </div>
                <label className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-all">
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                  {uploading ? 'Mengirim Data...' : 'Upload Bukti UKT'}
                  <input type="file" hidden onChange={handleUploadUKT} accept="image/*" disabled={uploading} />
                </label>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center shadow-inner">
                <QrCode size={180} className="text-emerald-900 opacity-20 mb-6" />
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metode Virtual Account</p>
                  <p className="text-lg font-black text-emerald-700">BCA 8000 9982 3412</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. TAMPILAN GAGAL (MERAH) */}
          {status === 'test_failed' && (
            <div className="max-w-md mx-auto space-y-8 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg"><XCircle size={48} /></div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-rose-900 uppercase tracking-tighter">Tetap Semangat!</h2>
                <p className="text-rose-700/70 text-sm font-medium leading-relaxed px-4">Jangan berkecil hati. Kegagalan hari ini adalah langkah menuju kesuksesan di masa depan. Anda diperbolehkan mengikuti seleksi kembali pada gelombang berikutnya.</p>
              </div>
              <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 italic text-rose-800 text-sm font-medium">
                "Pendidikan adalah paspor ke masa depan, karena hari esok adalah milik mereka yang mempersiapkannya hari ini."
              </div>
              <button onClick={() => window.location.reload()} className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Coba Lagi Nanti</button>
            </div>
          )}

          {/* 4. STATUS: SUDAH JADI MAHASISWA */}
          {status === 'active' && (
            <div className="max-w-md mx-auto space-y-8 py-6 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl"><CheckCircle size={48} /></div>
              <h2 className="text-3xl font-black text-emerald-900 tracking-tighter uppercase">Selamat Datang, Mahasiswa!</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Anda telah resmi menjadi bagian dari Universitas Siber Asia. Silakan masuk ke Sistem Akademik (SIAKAD) untuk memulai perkuliahan.</p>
              <button className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Buka SIAKAD Portal</button>
            </div>
          )}
        </div>
      </main>

      {/* OVERLAY LOADING UJIAN */}
      {isTakingTest && (
        <div className="fixed inset-0 z-[100] bg-[#002855] flex flex-col items-center justify-center text-white p-6 text-center">
          <Loader2 className="animate-spin mb-8 text-blue-400" size={80} />
          <h2 className="text-4xl font-black uppercase tracking-tighter animate-pulse mb-2">Penilaian Ujian...</h2>
          <p className="text-blue-200 font-medium italic">Sistem sedang menganalisis jawaban Anda. Mohon jangan menutup halaman ini.</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;