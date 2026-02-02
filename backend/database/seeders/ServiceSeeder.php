<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Cuci Kiloan',
                'price' => 7000,
                'unit' => 'kg',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Satuan',
                'price' => 5000,
                'unit' => 'pcs',
                'is_active' => true,
            ],
            [
                'name' => 'Setrika',
                'price' => 3000,
                'unit' => 'kg',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Sepatu',
                'price' => 25000,
                'unit' => 'pcs',
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Karpet',
                'price' => 15000,
                'unit' => 'item',
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name' => $service['name']],
                $service
            );
        }
    }
}
