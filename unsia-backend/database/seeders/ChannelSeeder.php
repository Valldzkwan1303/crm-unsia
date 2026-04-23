<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Channel;

class ChannelSeeder extends Seeder
{
    public function run()
    {
        $channels = [
            ['id' => 1, 'name' => 'Umum', 'type' => 'Online', 'status' => 'Aktif'],
            ['id' => 2, 'name' => 'Mitra Umum', 'type' => 'Referral', 'status' => 'Aktif'],
            ['id' => 3, 'name' => 'Back to School', 'type' => 'Event', 'status' => 'Aktif'],
            ['id' => 4, 'name' => 'Student Get Student', 'type' => 'Referral', 'status' => 'Aktif'],
            ['id' => 5, 'name' => 'Employee Get Student', 'type' => 'Referral', 'status' => 'Aktif'],
            ['id' => 6, 'name' => 'Kerjasama', 'type' => 'B2B', 'status' => 'Aktif'],
        ];

        foreach ($channels as $channel) {
            Channel::updateOrCreate(['id' => $channel['id']], $channel);
        }
    }
}