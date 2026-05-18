import { useState } from "react";
import { HelpCircle, MessageCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Apa itu Full Online Learning?",
    answer: "Full Online Learning adalah metode perkuliahan modern yang dirancang untuk memberikan kebebasan penuh kepada mahasiswa. Seluruh kegiatan akademik, mulai dari penyampaian materi, forum diskusi, ujian, hingga pengumpulan tugas, dilaksanakan 100% secara daring melalui LMS interaktif kami yang selalu hidup 24/7. Tidak ada keharusan hadir ke kampus fisik, sehingga Anda dapat belajar dari mana saja, bahkan saat sedang dalam perjalanan dinas atau di luar negeri.",
  },
  {
    question: "Apakah ijazah online dari UNSIA diakui secara resmi?",
    answer: "Tentu saja. UNSIA adalah perguruan tinggi resmi yang diakui oleh Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia. Lulusan UNSIA mendapatkan ijazah dengan nilai legalitas yang sama persis dengan universitas konvensional lainnya. Kami juga telah terakreditasi oleh BAN-PT, sehingga Anda tidak perlu ragu untuk menggunakan ijazah ini saat mendaftar CPNS, BUMN, maupun perusahaan swasta multinasional.",
  },
  {
    question: "Bagaimana sistem pembayaran biaya kuliahnya?",
    answer: "Kami memahami bahwa fleksibilitas tidak hanya pada waktu belajar, tetapi juga pada kemampuan finansial. Oleh karena itu, UNSIA menawarkan skema pembayaran yang sangat terjangkau dengan opsi cicilan bulanan. Anda dapat melakukan pembayaran dengan mudah melalui berbagai metode seperti Virtual Account, transfer bank, e-Wallet, atau kartu kredit. Hubungi tim konsultan kami untuk menemukan skema beasiswa atau potongan biaya yang sedang berlangsung.",
  },
];

export default function SupportSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToKonsultasi = () =>
    document.getElementById("konsultasi")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="faq" className="py-20 bg-[#F0F6FF]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-xl flex flex-col md:flex-row items-start gap-12">

          {/* Kiri — Info Kontak */}
          <div className="flex-1 space-y-6 text-left w-full">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-[#002855]">
              <HelpCircle size={40} />
            </div>
            <h3 className="text-3xl font-black text-[#002855]">Butuh Bantuan Lebih Lanjut?</h3>
            <p className="text-gray-500 font-bold leading-relaxed">
              Konsultan pendidikan kami siap membantu menjawab pertanyaan Anda mengenai perkuliahan online, biaya kuliah, hingga jalur pendaftaran.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/0895386693566"
                target="_blank"
                rel="noopener noreferrer"
                title="WA Kami"
                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg"
              >
                <MessageCircle size={24} /> WHATSAPP KAMI
              </a>
              <button
                title="Kontak Kami"
                onClick={scrollToKonsultasi}
                className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-[#002855] px-8 py-4 rounded-2xl font-black transition-all"
              >
                HUBUNGI KAMI
              </button>
            </div>
          </div>

          {/* Kanan — FAQ Accordion */}
          <div className="w-full md:w-1/3 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-3xl border transition-all duration-500 overflow-hidden ${openFaq === i ? "border-blue-200 bg-blue-50 shadow-lg" : "border-slate-100 bg-gray-50 hover:bg-white hover:shadow-md"
                  }`}
              >
                <button
                  className="w-full p-5 flex justify-between items-center gap-3 text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-black text-[#002855] text-sm leading-snug">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-blue-500 shrink-0 transition-transform duration-500 ${openFaq === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
