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

    /**
     * Generate unique tracking ID with format DDMMYY-XXX
     * Example: 090226-001 (9 Feb 2026, order #1)
     */
    public static function generateTrackingId(): string
    {
        $datePrefix = now()->format('dmy'); // 090226

        // Find last order created today with this date prefix
        $lastOrder = self::whereDate('created_at', today())
            ->where('tracking_id', 'like', $datePrefix . '-%')
            ->orderBy('tracking_id', 'desc')
            ->first();

        if ($lastOrder) {
            // Extract the last 3 digits and increment
            $lastNumber = (int) substr($lastOrder->tracking_id, -3);
            $newNumber = $lastNumber + 1;
        } else {
            // First order of the day
            $newNumber = 1;
        }

        // Format: DDMMYY-XXX (e.g., 090226-001)
        return sprintf('%s-%03d', $datePrefix, $newNumber);
    }
}
