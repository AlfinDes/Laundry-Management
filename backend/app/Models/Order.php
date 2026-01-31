<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'tracking_id',
        'customer_name',
        'customer_address',
        'customer_phone',
        'service_type',
        'order_type',
        'status',
        'weight',
        'items',
        'total_price',
        'payment_status',
    ];

    protected $casts = [
        'items' => 'array',
        'weight' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];
}
