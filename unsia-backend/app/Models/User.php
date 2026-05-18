<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\EgsProfile;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? url('storage/' . $this->avatar) : null;
    }

    public function agentProfile()
    {
        return $this->hasOne(AgentProfile::class, 'user_id');
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'agent_id');
    }

    public function log($action, $module, $details)
    {
        AuditLog::create([
            'user_id' => $this->id,
            'action' => $action,
            'module' => $module,
            'details' => $details,
            'ip_address' => request()->ip()
        ]);
    }

    public function sgsProfile()
    {
        return $this->hasOne(SgsProfile::class);
    }

    public function leadsAsSgs()
    {
        return $this->hasMany(Lead::class, 'sgs_id');
    }

    public function egsProfile()
    {
        return $this->hasOne(EgsProfile::class, 'user_id');
    }
    public function leadsAsEgs()
    {
        return $this->hasMany(Lead::class, 'egs_id');
    }

    public function btsProfile()
    {
        return $this->hasOne(BtsProfile::class, 'user_id');
    }

    public function b2bProfile()
    {
        return $this->hasOne(B2bProfile::class, 'user_id');
    }
}