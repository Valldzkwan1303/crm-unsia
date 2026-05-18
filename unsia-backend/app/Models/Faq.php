<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'category',
        'is_popular',
        'helpful_count',
        'not_helpful_count',
    ];
}
