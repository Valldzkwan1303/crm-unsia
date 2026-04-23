import { useState, useEffect } from 'react';
import { Wallet, X, Loader2, History, ArrowUpRight, CreditCard, Check } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'sonner';

// IMPORT LOGO LOKAL
import bcaLogo from '../../assets/bca-logo.png';
import mandiriLogo from '../../assets/mandiri-logo.png';
import bniLogo from '../../assets/bni-logo.png';
import briLogo from '../../assets/bri-logo.png';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  desc: string;
}

const AgentFinance = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRekeningModal, setShowRekeningModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const [bankForm, setBankForm] = useState({
    bank_name: '',
    account_number: ''
  });

  const banks = [
    { id: 'BCA', name: 'BCA', logo: bcaLogo },
    { id: 'Mandiri', name: 'Mandiri', logo: mandiriLogo },
    { id: 'BNI', name: 'BNI', logo: bniLogo },
    { id: 'BRI', name: 'BRI', logo: briLogo },
  ];

  const fetchFinanceData = async () => {
    try {
      const response = await api.get('/agent/finance');
      setBalance(response.data.balance);
      setTransactions(response.data.history);
      setBankForm({
        bank_name: response.data.bank_name || '',
        account_number: response.data.account_number || ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleUpdateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bank_name) {
        toast.error("Silakan pilih bank terlebih dahulu");
        return;
    }
    try {
      await api.post('/agent/bank', bankForm);
      toast.success('Informasi rekening berhasil disimpan');
      setShowRekeningModal(false);
      fetchFinanceData();
    } catch (error) {
      toast.error('Gagal menyimpan data rekening');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseInt(withdrawAmount) < 50000) {
        toast.error("Minimal penarikan Rp 50.000");
        return;
    }
    try {
      await api.post('/agent/withdraw', { amount: withdrawAmount });
      toast.success('Permintaan penarikan dikirim!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchFinanceData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menarik dana');
    }
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-gradient-to-br from-[#002855] to-blue-700 p-10 rounded-[3rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Komisi Bisa Ditarik</p>
            <h3 className="text-4xl font-black mb-8 tracking-tighter">{formatRupiah(balance)}</h3>
            <button onClick={() => setShowWithdrawModal(true)} className="bg-white text-[#002855] px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg active:scale-95">
                Tarik Dana
            </button>
          </div>
          <Wallet className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
                <button 
                  onClick={() => setShowRekeningModal(true)}
                  className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-[#002855] hover:text-white transition-all shadow-sm group"
                  title="Atur Rekening"
                >
                    <CreditCard size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
                <div>
                    <h4 className="text-lg font-black text-[#002855] uppercase tracking-tight">Info Rekening</h4>
                    {bankForm.account_number ? (
                      <p className="text-[#002855] font-bold text-sm mt-1">{bankForm.bank_name} - {bankForm.account_number}</p>
                    ) : (
                      <p className="text-slate-400 text-sm font-medium italic mt-1">Data bank belum diatur.</p>
                    )}
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
        <div className="p-8 border-b border-slate-50 flex items-center gap-3">
          <History className="text-slate-400" size={20} />
          <h3 className="text-lg font-black text-[#002855] uppercase tracking-tight">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr><th className="p-6">Deskripsi</th><th className="p-6 text-center">Jumlah</th><th className="p-6 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-bold">
              {transactions.length === 0 ? (
                <tr><td colSpan={3} className="p-10 text-center text-slate-400 italic font-medium">Belum ada riwayat keuangan.</td></tr>
              ) : transactions.map((trx, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6"><p className="text-[#002855]">{trx.desc}</p><p className="text-[10px] text-slate-400 uppercase">{trx.date}</p></td>
                  <td className="p-6 text-center text-emerald-600 text-lg font-black">{formatRupiah(trx.amount)}</td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${trx.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRekeningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Pilih Bank Anda</h3>
                <button onClick={() => setShowRekeningModal(false)} title="Tutup Modal"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdateBank} className="space-y-8">
                <div className="max-h-80 overflow-y-auto no-scrollbar pr-2">
                    <div className="grid grid-cols-2 gap-4">
                    {banks.map((bank) => (
                        <button
                        key={bank.id}
                        type="button"
                        onClick={() => setBankForm({...bankForm, bank_name: bank.id})}
                        className={`p-6 border-2 rounded-[2rem] flex flex-col items-center gap-4 transition-all ${
                            bankForm.bank_name === bank.id 
                            ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[0.98]' 
                            : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                        }`}
                        >
                        {/* PERBAIKAN: Wadah logo diperbesar menjadi h-16 (64px) */}
                        <div className="h-16 w-full flex items-center justify-center">
                            <img 
                              src={bank.logo} 
                              alt={bank.name} 
                              className="max-h-full max-w-[80%] object-contain" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${bankForm.bank_name === bank.id ? 'text-blue-600' : 'text-slate-400'}`}>
                            {bank.name}
                            </span>
                            {bankForm.bank_name === bank.id && <Check size={12} className="text-blue-600" />}
                        </div>
                        </button>
                    ))}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="acc-number" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Rekening</label>
                    <input id="acc-number" type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10" value={bankForm.account_number} onChange={e => setBankForm({...bankForm, account_number: e.target.value})} required placeholder="Masukkan nomor rekening" />
                </div>

                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all">
                    Simpan Informasi Bank
                </button>
            </form>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Tarik Komisi</h3>
                <button onClick={() => setShowWithdrawModal(false)} title="Tutup Modal"><X size={24}/></button>
            </div>
            <div className="space-y-6">
                <div className="space-y-1.5">
                    <label htmlFor="draw-amount" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal Rupiah</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-[#002855]">Rp</span>
                        <input id="draw-amount" type="number" className="w-full bg-slate-50 border-none rounded-2xl pl-12 p-4 text-xl font-black focus:ring-4 focus:ring-blue-500/10 outline-none" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                    </div>
                </div>
                <button onClick={handleWithdraw} className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                    Kirim Pengajuan <ArrowUpRight size={18}/>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentFinance;