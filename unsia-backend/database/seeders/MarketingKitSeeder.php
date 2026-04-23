<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketingKit;

class MarketingKitSeeder extends Seeder
{
    public function run(): void
    {
        $kits = [
            [
                'title' => 'Poster Kuliah Online S1 Informatika',
                'type' => 'Image',
                'content' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
            ],
            [
                'title' => 'Banner Pendaftaran TA 2026',
                'type' => 'Image',
                'content' => 'https://images.unsplash.com/photo-1523240715181-01489bb2865d?q=80&w=800',
            ],
            [
                'title' => 'Copywriting Promo Mahasiswa Baru',
                'type' => 'Text',
                'content' => 'Halo teman-teman! Buat kalian yang mau kuliah sambil kerja, UNSIA solusinya. Full online dan biaya cicilan murah banget.',
            ],
            [
                'title' => 'Copywriting Benefit Join UNSIA',
                'type' => 'Text',
                'content' => 'Kenapa harus UNSIA? 1. Full Online 2. Akreditasi BAN-PT 3. Kurikulum Standar Global. Yuk daftar!',
            ],
        ];

        foreach ($kits as $kit) {
            MarketingKit::create($kit);
        }
    }
}