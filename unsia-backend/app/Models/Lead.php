<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CampaignLocation;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'prodi_interest',
        'channel_id',
        'agent_id',
        'location_id',
        'school_origin',
        'partner_origin',
        'source_platform',
        'registration_code',
        'registration_fee_proof',
        'status',
        'test_score',
        'payment_proof',
        'notes',
        'admin_note'
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    // TAMBAHKAN RELASI INI BIAR CRM BISA BACA NAMA SEKOLAH DARI TABEL HISTORY
    public function location()
    {
        return $this->belongsTo(CampaignLocation::class, 'location_id');
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}