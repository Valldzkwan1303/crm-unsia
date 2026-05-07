<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'location_name',
        'location_slug',
        'total_leads'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'location_id');
    }
}