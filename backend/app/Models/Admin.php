<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }

    /**
     * Get a specific setting value for this admin
     */
    public function getSetting(string $key, ?string $default = null): ?string
    {
        $setting = $this->settings()->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }
}
