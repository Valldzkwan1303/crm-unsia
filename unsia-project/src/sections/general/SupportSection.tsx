import { HelpCircle, MessageCircle, ChevronDown } from "lucide-react";

export default function SupportSection() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-left">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-[#002855]"><HelpCircle size={40} /></div>
            <h3 className="text-3xl font-black text-[#002855]">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-gray-500 font-bold leading-relaxed">Konsultan pendidikan kami siap membantu menjawab pertanyaan Anda mengenai perkuliahan online, biaya kuliah, hingga jalur pendaftaran.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button title="WA Kami" className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg"><MessageCircle size={24} /> WHATSAPP KAMI</button>
              <button title="Kontak Kami" className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-[#002855] px-8 py-4 rounded-2xl font-black transition-all">HUBUNGI KAMI</button>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            {["Apa itu Full Online Learning?", "Apakah ijazah online diakui?", "Bagaimana sistem pembayarannya?"].map((q, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl flex justify-between items-center group cursor-pointer border-l-4 border-transparent hover:border-yellow-400 transition-all">
                <span className="font-black text-[#002855] text-sm">{q}</span>
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}