<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentProfile extends Model
{
    protected $fillable = ['user_id', 'type', 'nim', 'phone', 'area', 'referral_code'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}