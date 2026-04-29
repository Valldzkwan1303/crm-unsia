<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject',
        'content',
        'status',
        'scheduled_at',
        'recipients_count',
        'sent_count',
        'open_rate',
    ];
    
    protected $casts = [
        'scheduled_at' => 'date',
    ];
}