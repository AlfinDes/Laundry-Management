<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin
        $admin = Admin::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Premium Laundry',
                'password' => Hash::make('admin123'),
            ]
        );

        // Create default services for this admin
        $services = [
            ['name' => 'Cuci Kiloan', 'price' => 7000, 'unit' => 'kg', 'is_active' => true],
            ['name' => 'Cuci Satuan (Kemeja)', 'price' => 15000, 'unit' => 'pcs', 'is_active' => true],
            ['name' => 'Cuci Satuan (Celana)', 'price' => 12000, 'unit' => 'pcs', 'is_active' => true],
            ['name' => 'Cuci Selimut', 'price' => 25000, 'unit' => 'pcs', 'is_active' => true],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['admin_id' => $admin->id, 'name' => $service['name']],
                $service + ['admin_id' => $admin->id]
            );
        }

        // Create default settings for this admin
        $settings = [
            'laundry_name' => 'Premium Laundry',
            'whatsapp_number' => '628123456789',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['admin_id' => $admin->id, 'key' => $key],
                ['value' => $value]
            );
        }
    }
}
