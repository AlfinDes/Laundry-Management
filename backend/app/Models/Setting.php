<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['admin_id', 'key', 'value'];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
