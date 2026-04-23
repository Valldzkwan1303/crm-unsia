<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BotController extends Controller
{
    public function getOptions(Request $request)
    {
        $mode = $request->query('mode', 'student'); 
        $parentId = $request->query('parent_id', 'root');

        $tree = [
            'student' => [
                'root' => [
                    'text' => 'Halo! Selamat datang di UNSIA. Ada yang bisa saya bantu terkait informasi perkuliahan?',
                    'options' => [
                        ['id' => 's_prodi', 'label' => 'Daftar Jurusan'],
                        ['id' => 's_biaya', 'label' => 'Biaya Kuliah'],
                        ['id' => 's_cara', 'label' => 'Cara Mendaftar'],
                    ]
                ],
                's_prodi' => [
                    'text' => 'UNSIA memiliki 5 Prodi unggulan: Informatika, Sistem Informasi, Manajemen, Akuntansi, dan Komunikasi. Semua terakreditasi BAN-PT.',
                    'options' => [
                        ['id' => 'root', 'label' => 'Tanya Hal Lain'],
                        ['id' => 'admin', 'label' => 'Hubungi Admin (WA)', 'is_admin' => true],
                    ]
                ],
                's_biaya' => [
                    'text' => 'Biaya kuliah kami sangat terjangkau dengan sistem cicilan bulanan mulai dari 500rb-an.',
                    'options' => [
                        ['id' => 'admin', 'label' => 'Minta Rincian Biaya (WA)', 'is_admin' => true],
                        ['id' => 'root', 'label' => 'Kembali'],
                    ]
                ],
                's_cara' => [
                    'text' => 'Pendaftaran dilakukan full online. Cukup siapkan Scan KTP & Ijazah, lalu isi formulir di link pendaftaran.',
                    'options' => [
                        ['id' => 'root', 'label' => 'Oke, Paham'],
                        ['id' => 'admin', 'label' => 'Bantu Saya Daftar (WA)', 'is_admin' => true],
                    ]
                ]
            ],
            'agent' => [
                'root' => [
                    'text' => 'Halo Partner! Ada yang bisa asisten bantu terkait sistem kemitraan?',
                    'options' => [
                        ['id' => 'a_komisi', 'label' => 'Masalah Komisi'],
                        ['id' => 'a_referral', 'label' => 'Link Referral'],
                        ['id' => 'a_payout', 'label' => 'Status Penarikan'],
                    ]
                ],
                'a_komisi' => [
                    'text' => 'Komisi cair otomatis setelah status mahasiswa menjadi "Registered" (Selesai Daftar Ulang).',
                    'options' => [
                        ['id' => 'admin', 'label' => 'Tanya Admin (WA)', 'is_admin' => true],
                        ['id' => 'root', 'label' => 'Menu Utama'],
                    ]
                ],
                'a_referral' => [
                    'text' => 'Gunakan tombol "Salin Link" di dashboard untuk membagikan link unik Anda.',
                    'options' => [
                        ['id' => 'root', 'label' => 'Siap!'],
                        ['id' => 'admin', 'label' => 'Link Bermasalah (WA)', 'is_admin' => true],
                    ]
                ],
                'a_payout' => [
                    'text' => 'Penarikan dana diproses dalam 1-2 hari kerja. Pastikan rekening sudah sesuai di menu Profil.',
                    'options' => [
                        ['id' => 'admin', 'label' => 'Cek Status (WA)', 'is_admin' => true],
                        ['id' => 'root', 'label' => 'Kembali'],
                    ]
                ]
            ]
        ];

        if (!isset($tree[$mode])) {
            $mode = 'student';
        }

        $data = $tree[$mode][$parentId] ?? $tree[$mode]['root'];

        return response()->json($data);
    }
}