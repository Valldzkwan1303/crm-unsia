import { useState, useEffect } from 'react';
import { 
  LogOut, Loader2, BookOpen, ChevronRight, Sparkles, Send, 
  AlertTriangle, Info, X, CheckCircle2, CreditCard, QrCode, UploadCloud,
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const questions = [
    { q: "Apa kepanjangan dari UNSIA?", a: ["Univ. Siber Asia", "Univ. Sistem Asia"], correct: 0 },
    { q: "Metode kuliah di UNSIA adalah...", a: ["Full Online", "Tatap Muka"], correct: 0 },
    { q: "Apakah ijazah UNSIA resmi diakui?", a: ["Tidak", "Ya, Terakreditasi"], correct: 1 },
    { q: "Siapa target utama UNSIA?", a: ["Hanya Pelajar", "Profesional & Umum"], correct: 1 },
    { q: "Apa keunggulan kuliah siber?", a: ["Fleksibel", "Harus di Kelas"], correct: 0 },
  ];

  const fetchStatus = async () => {
    try {
      const res = await api.get('/student/status');
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleAnswer = (index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const submitExam = async () => {
    setLoading(true);
    try {
      await api.post('/student/submit-test', { answers: userAnswers, questions: questions });
      setIsTakingTest(false);
      fetchStatus();
    } catch (e) { toast.error("Gagal mengirim jawaban"); }
    finally { setLoading(false); }
  };

  const handleUploadUKT = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('ukt_proof', file);
    setUploading(true);
    try {
      await api.post('/student/upload-ukt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Bukti bayar berhasil dikirim!");
      setShowPaymentModal(false);
      fetchStatus();
    } catch (e) {
      toast.error("Gagal mengunggah bukti.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  const lead = data?.lead;
  if (!lead) return null;

  const testResults = lead.test_results ? JSON.parse(lead.test_results) : [];
  const isPassed = lead.status === 'test_passed' || lead.status === 'awaiting_payment' || lead.status === 'active';
  const isFailed = lead.status === 'test_failed';
  const isWaitingVerif = lead.status === 'awaiting_payment';

  // FIX: Mengganti Inline Style dengan Mapping Class Tailwind (Menghilangkan Kuning)
  const progressSteps = ["w-1/5", "w-2/5", "w-3/5", "w-4/5", "w-full"];

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${isPassed ? 'bg-emerald-50/50' : isFailed ? 'bg-rose-50/50' : 'bg-slate-50'}`}>
      
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#002855] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">U</div>
                <span className="font-black text-[#002855] text-sm uppercase tracking-tighter">Portal Mahasiswa</span>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase flex items-center gap-2 transition-all">Logout <LogOut size={14}/></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {isTakingTest ? (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-blue-50 animate-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Soal {currentQuestion + 1} / {questions.length}</span>
                    <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                        {/* FIX: Menggunakan Class Tailwind dinamis, bukan inline style */}
                        <div className={`h-full bg-blue-600 transition-all duration-500 ${progressSteps[currentQuestion]}`}></div>
                    </div>
                </div>
                <h2 className="text-2xl font-black text-[#002855] mb-10 leading-tight">{questions[currentQuestion].q}</h2>
                <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].a.map((opt, i) => (
                        <button key={i} type="button" onClick={() => handleAnswer(i)} className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold ${userAnswers[currentQuestion] === i ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-50 hover:border-blue-200 text-slate-600'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
                <div className="mt-12 flex justify-between items-center">
                    <button type="button" disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(prev => prev - 1)} className="text-xs font-bold text-slate-400 disabled:opacity-0 hover:text-[#002855]">Kembali</button>
                    {currentQuestion === questions.length - 1 ? (
                        <button type="button" onClick={submitExam} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-800 transition-all flex items-center gap-2">Kirim Ujian <Send size={16}/></button>
                    ) : (
                        <button type="button" onClick={() => setCurrentQuestion(prev => prev + 1)} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">Lanjut <ChevronRight size={16}/></button>
                    )}
                </div>
            </div>
        ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white">
                    <div className={`p-8 text-center border-b-2 border-dashed border-slate-100 ${isPassed ? 'bg-emerald-50/30' : isFailed ? 'bg-rose-50/30' : 'bg-blue-50/30'}`}>
                         <h1 className="text-3xl font-black text-[#002855] tracking-tight uppercase">Penerimaan Mahasiswa Baru</h1>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Universitas Siber Asia (UNSIA)</p>
                    </div>

                    <div className="p-10 md:p-16 text-center">
                        {lead.status === 'calon_mahasiswa' && (
                            <div className="max-w-lg mx-auto space-y-8">
                                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><BookOpen size={40}/></div>
                                <h2 className="text-4xl font-black text-[#002855] leading-tight text-center">Akun Anda Aktif! <br/>Silakan Ikuti Ujian.</h2>
                                <p className="text-slate-400 font-medium italic leading-relaxed text-center">"Gunakan kesempatan ini sebaik mungkin. Pastikan koneksi internet stabil sebelum memulai."</p>
                                <button type="button" onClick={() => setIsTakingTest(true)} className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all">Mulai Test Seleksi</button>
                            </div>
                        )}

                        {isPassed && lead.status !== 'active' && (
                            <div className="max-w-2xl mx-auto space-y-10">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl"><CheckCircle2 size={48}/></div>
                                    <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-emerald-900 leading-none mb-4">CONGRATULATIONS!</h2>
                                    <p className="text-emerald-700 font-bold text-xl uppercase tracking-widest">Anda Dinyatakan Lulus Seleksi</p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-y border-slate-50">
                                    <div className="text-center px-8 border-r border-slate-100 hidden md:block">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Skor Ujian</p>
                                        <p className="text-3xl font-black text-[#002855]">{lead.test_score}</p>
                                    </div>
                                    <div className="text-center md:text-left flex-1 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                                        <h4 className="font-black text-emerald-900 text-sm mb-2 flex items-center gap-2"><Info size={16}/> Langkah Selanjutnya</h4>
                                        <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">Lakukan pelunasan Daftar Ulang & UKT. Setelah diverifikasi, NIM resmi Anda akan terbit.</p>
                                    </div>
                                </div>

                                {isWaitingVerif ? (
                                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 text-amber-700 flex items-center justify-center gap-3 animate-pulse">
                                        <Loader2 className="animate-spin" size={20}/>
                                        <span className="text-xs font-black uppercase tracking-widest">Sedang Diverifikasi Admin</span>
                                    </div>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => setShowPaymentModal(true)} 
                                        className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
                                    >
                                        <CreditCard size={18}/> Selesaikan Daftar Ulang
                                    </button>
                                )}
                            </div>
                        )}

                        {isFailed && (
                            <div className="max-w-lg mx-auto space-y-8">
                                <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl"><X size={48}/></div>
                                <div>
                                    <h2 className="text-4xl font-black text-rose-900 leading-tight mb-2">Mohon Maaf...</h2>
                                    <p className="text-rose-600 font-bold uppercase tracking-widest text-sm">Skor Anda: {lead.test_score}</p>
                                </div>
                                <p className="text-slate-400 font-medium italic leading-relaxed text-center">"Kegagalan adalah awal dari pembelajaran. Anda dapat mencoba kembali di gelombang berikutnya."</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setShowReview(true)} className="bg-white border-2 border-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"><Info size={14}/> Rincian Kesalahan</button>
                                    <button type="button" onClick={() => window.location.reload()} className="bg-rose-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-700 shadow-lg">Bantuan</button>
                                </div>
                            </div>
                        )}
                        
                        {lead.status === 'active' && (
                            <div className="max-w-lg mx-auto space-y-8 py-10">
                                <CheckCircle2 className="mx-auto text-emerald-500" size={80} />
                                <h2 className="text-4xl font-black text-[#002855]">Selamat Bergabung!</h2>
                                <p className="text-slate-500 font-medium">Anda telah resmi menjadi Mahasiswa UNSIA.</p>
                                <button type="button" className="px-10 py-4 bg-[#002855] text-white rounded-2xl font-black uppercase text-xs tracking-widest">Masuk ke LMS</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>

      {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative animate-in zoom-in-95 duration-500 flex flex-col md:flex-row overflow-hidden">
                  {/* FIX: Menambahkan atribut title pada tombol icon X */}
                  <button type="button" title="Tutup" onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 z-10"><X size={24}/></button>
                  
                  <div className="md:w-1/2 bg-slate-50 p-10 flex flex-col justify-center text-left">
                      <h3 className="text-2xl font-black text-[#002855] uppercase mb-6 flex items-center gap-2"><QrCode size={24} className="text-blue-600" /> Pembayaran</h3>
                      <div className="space-y-6">
                          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tagihan UKT SMT 1</p>
                              <p className="text-2xl font-black text-[#002855]">Rp 3.500.000</p>
                          </div>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed text-left">Gunakan QRIS di samping atau transfer ke Virtual Account Universitas Siber Asia.</p>
                      </div>
                  </div>

                  <div className="md:w-1/2 p-10 text-center flex flex-col justify-center items-center">
                       <div className="w-48 h-48 bg-slate-100 rounded-3xl mb-8 flex items-center justify-center border-2 border-dashed border-slate-200">
                            <QrCode size={120} className="text-slate-300 opacity-50" />
                       </div>
                       <label className="w-full relative group cursor-pointer">
                            <div className="w-full py-5 bg-[#002855] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl group-hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                                {uploading ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={18}/>}
                                {uploading ? "Mengirim..." : "Upload Bukti UKT"}
                            </div>
                            <input type="file" className="hidden" onChange={handleUploadUKT} disabled={uploading} accept="image/*,application/pdf" />
                       </label>
                  </div>
              </div>
          </div>
      )}

      {showReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rose-900/20 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 max-h-[85vh] overflow-y-auto no-scrollbar text-left">
                {/* FIX: Menambahkan atribut title pada tombol icon X */}
                <button type="button" title="Tutup Review" onClick={() => setShowReview(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-rose-500 transition-colors"><X size={24}/></button>
                <h3 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-8 flex items-center gap-3"><AlertTriangle className="text-rose-500" /> Evaluasi Ujian</h3>
                <div className="space-y-6">
                    {testResults.map((res: any, i: number) => (
                        <div key={i} className={`p-6 rounded-2xl border-l-8 ${res.is_correct ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'} text-left`}>
                            <p className="text-sm font-black text-slate-700 mb-3">{i+1}. {res.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-left"><p className="text-[10px] uppercase font-black text-slate-400">Jawaban Kamu</p><p className={`text-xs font-bold ${res.is_correct ? 'text-emerald-600' : 'text-rose-600'}`}>{res.your_answer}</p></div>
                                {!res.is_correct && <div className="text-left"><p className="text-[10px] uppercase font-black text-slate-400">Jawaban Benar</p><p className="text-xs font-bold text-emerald-600">{res.correct_answer}</p></div>}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => setShowReview(false)} className="w-full mt-10 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Tutup Review</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;