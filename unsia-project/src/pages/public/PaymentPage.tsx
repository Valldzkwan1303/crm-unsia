import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    QrCode, Upload, Loader2, CheckCircle, ArrowLeft,
    ShieldCheck, Info, CreditCard
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const PaymentPage = () => {
    const { regCode } = useParams();
    const navigate = useNavigate();

    const [leadData, setLeadData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const agentCode = leadData?.agent_code;
    const backPath = agentCode ? `/p/${agentCode}` : '/';

    useEffect(() => {
        const fetchLeadStatus = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/public/leads/check-status/${regCode}`);
                setLeadData(response.data);
            } catch (error) {
                console.error("Invalid Code:", error);
                toast.error("Link pendaftaran tidak valid atau sudah kadaluwarsa.");
                navigate('/join');
            } finally {
                setLoading(false);
            }
        };

        if (regCode) {
            fetchLeadStatus();
        }
    }, [regCode, navigate]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !leadData) return;

        const formData = new FormData();
        formData.append('payment_proof', file);
        setUploading(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/public/leads/${leadData.id}/upload-registration`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
            toast.success("Bukti pembayaran berhasil dikirim!");
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengunggah bukti bayar. Pastikan format gambar JPG/PNG.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Halaman Pembayaran...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center max-w-md animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-[#002855] mb-4 tracking-tight">Terima Kasih!</h2>
                    <p className="text-slate-500 mb-10 font-medium leading-relaxed">
                        Bukti pembayaran atas nama <strong>{leadData?.name}</strong> sudah kami terima. Admin akan memverifikasi dalam 1x24 jam.
                        Akses login akan dikirimkan ke email <strong>{leadData?.email}</strong>.
                    </p>
                    <button 
                        onClick={() => navigate(backPath)} 
                        className="w-full bg-[#002855] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-800 transition-all"
                    >
                        Selesai & Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center py-12 px-6">
            <div className="max-w-5xl w-full mb-10">
                {/* BUTTON KEMBALI DINAMIS */}
                <button 
                    onClick={() => navigate(backPath)} 
                    className="flex items-center gap-2 text-slate-400 hover:text-[#002855] font-bold transition-all" 
                    title="Kembali ke Halaman Partner"
                >
                    <ArrowLeft size={20} /> Kembali ke Profil Partner
                </button>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-700">

                {/* SISI KIRI: INFORMASI TAGIHAN */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                            <CreditCard size={14} /> Tahap Pembayaran
                        </div>
                        <h1 className="text-5xl font-black text-[#002855] leading-tight tracking-tighter uppercase">Selesaikan <br />Pendaftaran.</h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Halo <span className="text-[#002855] font-bold">{leadData?.name}</span>, silakan lakukan pembayaran untuk mendapatkan akses akun ujian masuk Universitas Siber Asia.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-bold text-sm">Biaya Registrasi:</span>
                            <div className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Wajib</div>
                        </div>
                        <div className="text-5xl font-black text-[#002855] mb-2 tracking-tighter">Rp 250.000</div>
                        <p className="text-slate-400 text-xs italic font-medium mt-4">*Berlaku untuk pendaftaran Gelombang 1 TA 2024/2025.</p>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                        <Info className="text-amber-500 shrink-0" size={24} />
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                            Pastikan Anda mengunggah foto bukti transfer yang jelas (struk ATM atau screenshot m-banking) agar proses verifikasi lebih cepat.
                        </p>
                    </div>
                </div>

                {/* SISI KANAN: METODE BAYAR & UPLOAD */}
                <div className="space-y-6">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white flex flex-col items-center text-center">
                        <div className="flex items-center gap-3 mb-8">
                            <QrCode size={24} className="text-blue-600" />
                            <span className="font-black text-[#002855] uppercase tracking-widest">QRIS PAYMENT</span>
                        </div>

                        {/* QR Code Section */}
                        <div className="w-64 h-64 bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 shadow-inner mb-8 transition-transform hover:scale-105 duration-500">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                alt="QRIS Pembayaran"
                                className="w-full h-full object-contain opacity-90"
                            />
                        </div>

                        <div className="space-y-4 w-full">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Konfirmasi Transfer</p>
                            <label className="w-full bg-[#002855] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl cursor-pointer hover:bg-blue-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                {uploading ? 'Memproses...' : 'Upload Bukti Bayar'}
                                <input type="file" id="payment-upload" hidden onChange={handleUpload} accept="image/*" disabled={uploading} />
                            </label>
                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest pt-2">ID REG: {regCode}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Bank Grade Encryption by UNSIA</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;