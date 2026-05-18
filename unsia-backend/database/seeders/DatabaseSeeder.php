<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\AgentProfile;
use App\Models\Wallet;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // === AKUN ADMIN ===
        User::updateOrCreate(
            ['email' => 'admin@unsia.ac.id'],
            [
                'name'      => 'Administrator',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        // === AKUN AGENT DUMMY (untuk tes login) ===
        $agentUser = User::updateOrCreate(
            ['email' => 'agent@gmail.com'],
            [
                'name'      => 'Agent Demo',
                'password'  => Hash::make('password123'),
                'role'      => 'agent',
                'is_active' => true,
            ]
        );

        // Buat agent_profile jika belum ada
        AgentProfile::updateOrCreate(
            ['user_id' => $agentUser->id],
            [
                'type'          => 'umum',
                'phone'         => '081234567890',
                'area'          => 'Jakarta Selatan',
                'referral_code' => 'REF-AGT-DEMO1',
            ]
        );

        // Buat wallet jika belum ada
        Wallet::updateOrCreate(
            ['user_id' => $agentUser->id],
            [
                'balance'         => 0,
                'pending_balance' => 0,
            ]
        );

        // === SEEDERS LAINNYA ===
        $this->call(ChannelSeeder::class);

        echo "✅ Seeder selesai: Admin, Agent Demo, dan 6 Kanal berhasil diisi!\n";
        echo "   → Admin    : admin@unsia.ac.id  / password\n";
        echo "   → Agent    : agent@gmail.com    / password123\n";
    }
}