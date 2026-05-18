<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            // AKUN
            ['question' => 'Bagaimana cara mengganti kata sandi (password)?', 'answer' => 'Anda dapat mengganti kata sandi melalui menu Pengaturan Profil di pojok kanan atas, lalu pilih tab "Keamanan". Masukkan kata sandi lama dan kata sandi baru Anda.', 'category' => 'Akun', 'is_popular' => false],
            ['question' => 'Apa yang harus dilakukan jika saya lupa email untuk login?', 'answer' => 'Jika Anda lupa email login, silakan hubungi tim Support melalui WhatsApp yang tersedia di halaman Pusat Bantuan ini dengan melampirkan KTP dan Nomor HP yang terdaftar.', 'category' => 'Akun', 'is_popular' => false],
            ['question' => 'Bagaimana cara memperbarui foto profil?', 'answer' => 'Masuk ke menu Profil, klik pada foto avatar Anda saat ini, lalu pilih unggah foto baru dari perangkat Anda. Pastikan format foto adalah JPG/PNG dengan ukuran maksimal 2MB.', 'category' => 'Akun', 'is_popular' => false],
            ['question' => 'Berapa lama proses verifikasi akun Partner baru?', 'answer' => 'Proses verifikasi akun Partner biasanya memakan waktu maksimal 1x24 jam hari kerja setelah Anda melengkapi semua dokumen persyaratan.', 'category' => 'Akun', 'is_popular' => false],
            // KEUANGAN
            ['question' => 'Bagaimana cara mencairkan komisi saya?', 'answer' => 'Buka menu Keuangan, pastikan Anda sudah mengatur Nomor Rekening/E-Wallet tujuan. Kemudian klik tombol "Tarik Dana", masukkan nominal penarikan minimal Rp 50.000, lalu klik "Kirim Pengajuan".', 'category' => 'Keuangan', 'is_popular' => true],
            ['question' => 'Berapa minimal saldo yang bisa ditarik?', 'answer' => 'Minimal saldo yang dapat ditarik untuk setiap transaksi penarikan dana adalah Rp 50.000.', 'category' => 'Keuangan', 'is_popular' => true],
            ['question' => 'Berapa lama proses pencairan komisi ke rekening?', 'answer' => 'Pencairan komisi akan diproses oleh tim keuangan kami dalam waktu 1-3 hari kerja (Senin-Jumat).', 'category' => 'Keuangan', 'is_popular' => true],
            ['question' => 'Apakah ada potongan biaya transfer antar bank?', 'answer' => 'Saat ini, seluruh biaya transfer ke bank-bank besar (BCA, Mandiri, BNI, BRI) maupun E-Wallet ditanggung oleh sistem. Tidak ada potongan untuk Partner.', 'category' => 'Keuangan', 'is_popular' => false],
            // PANDUAN
            ['question' => 'Bagaimana cara mendapatkan materi promosi terbaru?', 'answer' => 'Anda bisa mendapatkan materi promosi terbaru berupa flyer digital, video, dan copywriting melalui menu "Materi Promo" di sidebar kiri. Silakan unduh secara gratis.', 'category' => 'Panduan', 'is_popular' => false],
            ['question' => 'Apa tips terbaik untuk merekrut calon mahasiswa?', 'answer' => 'Gunakan fitur Share to WhatsApp dari menu Materi Promo, manfaatkan Copywriting yang sudah disediakan, dan bagikan pengalaman positif tentang fleksibilitas belajar di UNSIA.', 'category' => 'Panduan', 'is_popular' => true],
            ['question' => 'Apakah saya boleh membuat website sendiri untuk promosi?', 'answer' => 'Boleh. Namun Anda diwajibkan untuk menautkan (embed) link pendaftaran spesifik referral Anda dan tidak boleh menyalahgunakan logo UNSIA untuk aktivitas ilegal.', 'category' => 'Panduan', 'is_popular' => false],
            // TEKNIS
            ['question' => 'Mengapa link referral saya tidak bisa dibuka?', 'answer' => 'Pastikan koneksi internet stabil. Jika masalah berlanjut, cobalah salin ulang link referral Anda dari Dashboard. Jika masih gagal, segera hubungi tim Teknis kami via Email.', 'category' => 'Teknis', 'is_popular' => true],
            ['question' => 'Apakah calon mahasiswa harus mendaftar melalui browser HP atau Laptop?', 'answer' => 'Pendaftaran dapat dilakukan melalui perangkat apa pun (Smartphone, Tablet, PC) asalkan menggunakan browser versi terbaru (Chrome/Safari direkomendasikan).', 'category' => 'Teknis', 'is_popular' => false],
            ['question' => 'Bagaimana cara kerja QR Code pendaftaran?', 'answer' => 'QR Code berfungsi persis seperti link referral Anda. Calon mahasiswa cukup memindai (scan) QR code tersebut dengan kamera HP mereka, dan akan langsung diarahkan ke form pendaftaran khusus Anda.', 'category' => 'Teknis', 'is_popular' => false],
            ['question' => 'Data statistik di Dashboard saya tidak update, apa yang harus saya lakukan?', 'answer' => 'Terkadang sistem memerlukan waktu untuk sinkronisasi data (cache). Cobalah muat ulang (refresh) halaman setelah beberapa menit. Jika tidak berubah dalam 1x24 jam, laporkan masalah ini.', 'category' => 'Teknis', 'is_popular' => false],
        ];

        foreach ($faqs as $faq) {
            \App\Models\Faq::create($faq);
        }
    }
}
