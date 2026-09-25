<?php

namespace Database\Seeders;

use App\Models\Renewal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RenewalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $renewals = [
            ['name' => 'Cada mes', 'months' => 1, 'percentage' => .2, 'items' => 2, 'delivery_free' => true],
            ['name' => 'Cada 2 meses', 'months' => 2, 'percentage' => .15, 'items' => 2, 'delivery_free' => true],
            ['name' => 'Cada 3 meses', 'months' => 3, 'percentage' => .1, 'items' => 2, 'delivery_free' => true],
            ['name' => 'Cada mes (Navidad)', 'months' => 1, 'percentage' => .2, 'items' => 2, 'delivery_free' => true, 'date_begin' => '2024-12-01', 'date_end' => '2025-01-01'],
        ];
        foreach ($renewals as $renewal) {
            Renewal::updateOrCreate(
                ['name' => $renewal['name']],
                $renewal
            );
        }
    }
}
