<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SgsProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nim',
        'major',
        'scholarship_balance' // PASTIKAN INI ADA
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}