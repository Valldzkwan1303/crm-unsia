<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B2bProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'b2b_id',
        'department',
        'balance'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}