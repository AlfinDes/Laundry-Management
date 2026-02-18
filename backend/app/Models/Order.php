<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Service;

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

    /**
     * Calculate total price based on service type and data
     */
    public function calculatePrice(): float
    {
        if ($this->service_type === 'kiloan') {
            // Get price from services table or default to 7000
            $service = Service::where('name', 'Cuci Kiloan')->first();
            $pricePerKg = $service ? (float) $service->price : 7000.0;
            return (float) ($this->weight * $pricePerKg);
        }

        if ($this->service_type === 'satuan' && is_array($this->items)) {
            $total = 0;
            foreach ($this->items as $item) {
                $price = isset($item['price']) ? (float) $item['price'] : 0.0;
                $qty = isset($item['qty']) ? (int) $item['qty'] : 1;
                $total += ($price * $qty);
            }
            return (float) $total;
        }

        return (float) ($this->total_price ?: 0.0);
    }
}
