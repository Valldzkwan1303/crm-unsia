import { useState, useEffect } from 'react';
import { Wallet, X, Loader2, History, ArrowUpRight, ArrowDownLeft, CreditCard, Check, DollarSign, Clock, Filter, AlertCircle } from 'lucide-react';
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

  const [filter, setFilter] = useState('Semua');
  const paymentMethods = [
    {
      category: 'Bank Umum',
      items: [
        { id: 'BCA', name: 'BCA', logo: bcaLogo, type: 'bank' },
        { id: 'Mandiri', name: 'Mandiri', logo: mandiriLogo, type: 'bank' },
        { id: 'BNI', name: 'BNI', logo: bniLogo, type: 'bank' },
        { id: 'BRI', name: 'BRI', logo: briLogo, type: 'bank' },
      ]
    },
    {
      category: 'E-Wallet',
      items: [
        { id: 'GoPay', name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', type: 'ewallet' },
        { id: 'OVO', name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', type: 'ewallet' },
        { id: 'DANA', name: 'DANA', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg', type: 'ewallet' },
        { id: 'LinkAja', name: 'LinkAja', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg', type: 'ewallet' },
      ]
    }
  ];

  const totalPendapatan = transactions.filter(t => t.status === 'Selesai' && !t.desc.toLowerCase().includes('tarik')).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalDitarik = transactions.filter(t => t.status === 'Selesai' && t.desc.toLowerCase().includes('tarik')).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  const totalPending = transactions.filter(t => t.status === 'Menunggu').reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

  const filteredTransactions = transactions.filter(t => {
      if (filter === 'Semua') return true;
      return t.status === filter;
  });

  const getMethodType = (id: string) => {
      for (const cat of paymentMethods) {
          const item = cat.items.find(i => i.id === id);
          if (item) return item.type;
      }
      return 'bank';
  };

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

  const formatRupiah = (num: number) => {
      const validNum = isNaN(Number(num)) ? 0 : Number(num);
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(validNum);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 bg-[#F8FAFC] min-h-screen">
      {/* SUMMARY CARDS (Ide Tambahan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign size={24} /></div>
              <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Pendapatan</p>
                  <h3 className="text-xl font-black text-emerald-600 mt-1">{formatRupiah(totalPendapatan)}</h3>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><ArrowUpRight size={24} /></div>
              <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sudah Ditarik</p>
                  <h3 className="text-xl font-black text-[#002855] mt-1">{formatRupiah(totalDitarik)}</h3>
              </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24} /></div>
              <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Komisi Pending</p>
                  <h3 className="text-xl font-black text-amber-600 mt-1">{formatRupiah(totalPending)}</h3>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* HERO FINANCE CARD */}
        <div className="bg-gradient-to-br from-[#002855] via-blue-800 to-blue-600 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-blue-100 text-[9px] font-black uppercase tracking-widest">Komisi Bisa Ditarik</p>
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter drop-shadow-md">{formatRupiah(balance)}</h3>
            <button onClick={() => setShowWithdrawModal(true)} className="bg-white text-[#002855] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-[#002855] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 shadow-lg flex items-center justify-center gap-2 w-full md:w-auto">
                Tarik Dana <ArrowUpRight size={16} />
            </button>
          </div>
          <Wallet className="absolute -bottom-8 -right-8 w-40 h-40 text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
        </div>

        {/* INFO REKENING CARD */}
        <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow duration-500">
            <div className="flex items-center gap-6 relative z-10">
                <button 
                  onClick={() => setShowRekeningModal(true)}
                  className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#002855] hover:text-white hover:shadow-lg transition-all duration-500 shadow-sm flex-shrink-0"
                  title="Atur Rekening"
                >
                    <CreditCard size={28} className="group-hover:rotate-6 transition-transform" />
                </button>
                <div>
                    <h4 className="text-lg font-black text-[#002855] uppercase tracking-tight">Info Pembayaran</h4>
                    {bankForm.account_number ? (
                      <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                        <p className="text-[#002855] font-black text-sm">{bankForm.bank_name}</p>
                        <p className="text-blue-600 font-mono text-xs tracking-widest mt-1">{bankForm.account_number}</p>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-500" />
                        <p className="text-slate-400 text-sm font-medium italic">Data pembayaran belum diatur.</p>
                      </div>
                    )}
                </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl"><History size={20} /></div>
            <div>
                <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Riwayat Transaksi</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Daftar mutasi saldo</p>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
              {['Semua', 'Selesai', 'Menunggu', 'Gagal'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${filter === f ? 'bg-white shadow-sm ring-1 ring-black/5 text-[#002855]' : 'text-slate-400 hover:text-slate-600'}`}>
                      {f}
                  </button>
              ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="p-16 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Wallet size={40} />
              </div>
              <h4 className="text-[#002855] font-black text-lg mb-2">Belum Ada Transaksi</h4>
              <p className="text-slate-400 text-sm font-medium">Riwayat transaksi Anda akan muncul di sini.</p>
          </div>
        ) : (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr><th className="p-6">Deskripsi Transaksi</th><th className="p-6 text-center">Nominal</th><th className="p-6 text-center">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.map((trx, i) => {
                  const isWithdraw = trx.desc.toLowerCase().includes('tarik');
                  return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl flex-shrink-0 ${isWithdraw ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                {isWithdraw ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                            <div>
                                <p className="text-[#002855] font-bold text-sm">{trx.desc}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{trx.date}</p>
                            </div>
                        </div>
                    </td>
                    <td className={`p-6 text-center text-lg font-semibold ${isWithdraw ? 'text-slate-600' : 'text-emerald-600'}`}>
                        {isWithdraw ? '-' : '+'}{formatRupiah(trx.amount)}
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${trx.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : trx.status === 'Gagal' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                          {trx.status}
                      </span>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE LIST VIEW */}
        {filteredTransactions.length > 0 && (
            <div className="md:hidden divide-y divide-slate-50">
                {filteredTransactions.map((trx, i) => {
                    const isWithdraw = trx.desc.toLowerCase().includes('tarik');
                    return (
                        <div key={i} className="p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl flex-shrink-0 ${isWithdraw ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                    {isWithdraw ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                </div>
                                <div>
                                    <p className="text-[#002855] font-bold text-sm line-clamp-1">{trx.desc}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{trx.date}</p>
                                    <span className={`inline-block mt-2 px-2 py-0.5 rounded border text-[9px] font-black uppercase ${trx.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : trx.status === 'Gagal' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {trx.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-semibold ${isWithdraw ? 'text-slate-600' : 'text-emerald-600'}`}>
                                    {isWithdraw ? '-' : '+'}{formatRupiah(trx.amount)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {showRekeningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Metode Pembayaran</h3>
                    <p className="text-slate-400 text-xs font-medium mt-1">Pilih bank atau e-wallet tujuan penarikan.</p>
                </div>
                <button onClick={() => setShowRekeningModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors" title="Tutup"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUpdateBank} className="space-y-8">
                <div className="max-h-[50vh] overflow-y-auto no-scrollbar pr-2 space-y-8">
                    {paymentMethods.map((cat, idx) => (
                        <div key={idx}>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                {cat.category}
                                <div className="h-px flex-1 bg-slate-100"></div>
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {cat.items.map((bank) => (
                                <button
                                key={bank.id}
                                type="button"
                                onClick={() => setBankForm({...bankForm, bank_name: bank.id})}
                                className={`p-4 border-2 rounded-[1.5rem] flex flex-col items-center gap-3 transition-all duration-300 ${
                                    bankForm.bank_name === bank.id 
                                    ? 'border-blue-600 bg-blue-50/50 shadow-md scale-[0.98]' 
                                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                                }`}
                                >
                                <div className="h-12 w-full flex items-center justify-center">
                                    <img src={bank.logo} alt={bank.name} className="max-h-full max-w-[80%] object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex items-center justify-between w-full mt-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${bankForm.bank_name === bank.id ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {bank.name}
                                    </span>
                                    {bankForm.bank_name === bank.id && <Check size={14} className="text-blue-600" />}
                                </div>
                                </button>
                            ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <label htmlFor="acc-number" className="text-[10px] font-black text-[#002855] uppercase tracking-widest ml-1">
                        {getMethodType(bankForm.bank_name) === 'ewallet' ? 'Nomor HP (Terdaftar di E-Wallet)' : 'Nomor Rekening Bank'}
                    </label>
                    <input id="acc-number" type="text" className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" value={bankForm.account_number} onChange={e => setBankForm({...bankForm, account_number: e.target.value})} required placeholder={getMethodType(bankForm.bank_name) === 'ewallet' ? "081234567xxx" : "Masukkan nomor rekening"} />
                </div>

                <button type="submit" className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300">
                    Simpan Data Pembayaran
                </button>
            </form>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002855]/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-[#002855] uppercase tracking-tight">Tarik Komisi</h3>
                    <p className="text-slate-400 text-xs mt-1">Saldo: {formatRupiah(balance)}</p>
                </div>
                <button onClick={() => setShowWithdrawModal(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors" title="Tutup Modal"><X size={20}/></button>
            </div>

            {(!bankForm.account_number || !bankForm.bank_name) ? (
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
                    <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-red-600 mb-4">Mohon atur info rekening/pembayaran terlebih dahulu.</p>
                    <button onClick={() => { setShowWithdrawModal(false); setShowRekeningModal(true); }} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Atur Rekening</button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <CreditCard size={18} className="text-[#002855]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transfer Ke</p>
                            <p className="text-sm font-bold text-[#002855] leading-none mt-1">{bankForm.bank_name} - {bankForm.account_number}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="draw-amount" className="text-[10px] font-black text-[#002855] uppercase tracking-widest ml-1">Nominal Penarikan (Rp)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">Rp</span>
                            <input id="draw-amount" type="number" className="w-full bg-white border border-slate-200 rounded-2xl pl-14 p-4 text-xl font-black text-[#002855] focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" placeholder="0" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-1"><AlertCircle size={10} /> Minimal penarikan Rp 50.000</p>
                    </div>
                    
                    <button onClick={handleWithdraw} className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#002855]/20 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        Konfirmasi Penarikan
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentFinance;