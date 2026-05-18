<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MarketingAssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\MarketingAsset::insert([
            // Flyers
            [
                'title' => 'Flyer Beasiswa Prestasi 2024',
                'category' => 'Flyer',
                'type' => 'file',
                'file_url' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Brosur Program Studi Informatika',
                'category' => 'Flyer',
                'type' => 'file',
                'file_url' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Flyer Pendaftaran Mahasiswa Baru Gelombang 1',
                'category' => 'Flyer',
                'type' => 'file',
                'file_url' => 'https://images.unsplash.com/photo-1546410531-ea4cea477149?q=80&w=1000&auto=format&fit=crop',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1546410531-ea4cea477149?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Poster Keunggulan Belajar Full Online',
                'category' => 'Flyer',
                'type' => 'file',
                'file_url' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Videos
            [
                'title' => 'Video Profil Universitas Siber Asia',
                'category' => 'Video',
                'type' => 'file',
                'file_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tour Virtual Kampus Pusat',
                'category' => 'Video',
                'type' => 'file',
                'file_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Testimoni Alumni Sukses UNSIA',
                'category' => 'Video',
                'type' => 'file',
                'file_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                'content' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Copywriting
            [
                'title' => 'Teks Promo Pendaftaran Umum (WhatsApp)',
                'category' => 'Copywriting',
                'type' => 'text',
                'file_url' => null,
                'content' => "Halo teman-teman! \n\nMau kuliah tapi sibuk kerja? Universitas Siber Asia (UNSIA) solusinya! Kuliah S1 100% online resmi berakreditasi BAN-PT dengan biaya sangat terjangkau.\n\n🌟 Keunggulan UNSIA:\n- Waktu fleksibel (bisa sambil kerja)\n- Dosen praktisi ahli di bidangnya\n- Lulusan disiapkan untuk dunia kerja digital\n\nYakin masih mau menunda masa depan?\nDaftar sekarang juga!",
                'thumbnail' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Teks Promo Beasiswa Karyawan (Instagram)',
                'category' => 'Copywriting',
                'type' => 'text',
                'file_url' => null,
                'content' => "Kabar gembira untuk para profesional muda! 🚀\n\nTingkatkan karirmu dengan gelar S1 dari Universitas Siber Asia. Dapatkan beasiswa khusus kelas karyawan bulan ini.\n\nKuliah pintar, karir lancar! Klik link di bawah untuk informasi selengkapnya.",
                'thumbnail' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Teks Broadcast Edukasi Jurusan IT',
                'category' => 'Copywriting',
                'type' => 'text',
                'file_url' => null,
                'content' => "Dunia digital butuh kamu! 💻\n\nProgram Studi Informatika & Sistem Informasi di UNSIA dirancang khusus untuk mencetak talenta unggul siap pakai. Pelajari AI, Data Science, dan Web Development bersama ahlinya.\n\nAmbil langkah pertamamu menuju masa depan cerah. Daftar segera!",
                'thumbnail' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
