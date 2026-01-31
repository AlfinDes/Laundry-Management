<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Order::create([
            'tracking_id' => 'LND-7482',
            'customer_name' => 'Budi Santoso',
            'customer_address' => 'Jl. Merdeka No. 10, Jakarta',
            'customer_phone' => '081234567890',
            'service_type' => 'kiloan',
            'order_type' => 'pickup',
            'status' => 'pending',
            'weight' => 5.5,
            'total_price' => 55000,
            'payment_status' => 'unpaid',
        ]);

        \App\Models\Order::create([
            'tracking_id' => 'LND-9123',
            'customer_name' => 'Siti Aminah',
            'customer_address' => 'Griya Asri Blok C, Bandung',
            'customer_phone' => '087712345678',
            'service_type' => 'satuan',
            'order_type' => 'dropoff',
            'status' => 'washing',
            'items' => json_encode([
                ['name' => 'Jas Pria', 'qty' => 1, 'price' => 25000],
                ['name' => 'Bedcover', 'qty' => 1, 'price' => 35000],
            ]),
            'total_price' => 60000,
            'payment_status' => 'paid',
        ]);

        \App\Models\Order::create([
            'tracking_id' => 'LND-5541',
            'customer_name' => 'Andi Wijaya',
            'customer_address' => 'Apartment Pavilion Lt. 5, Jakarta',
            'customer_phone' => '081198765432',
            'service_type' => 'both',
            'order_type' => 'pickup',
            'status' => 'ironing',
            'weight' => 3.0,
            'items' => json_encode([
                ['name' => 'Sprei', 'qty' => 1, 'price' => 15000],
            ]),
            'total_price' => 45000,
            'payment_status' => 'unpaid',
        ]);
    }
}
