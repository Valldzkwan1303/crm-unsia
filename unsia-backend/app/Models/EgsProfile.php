<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EgsProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nip',
        'department',
        'performance_bonus' 
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}