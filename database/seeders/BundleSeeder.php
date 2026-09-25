<?php

namespace Database\Seeders;

use App\Models\Bundle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BundleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DúoPack, TriPack, CuatriPack, PentaPack, SixPack
        $bundles = [
            ['name' => 'un DuoPack', 'description' => 'Ahorra S/59.80 agregando 1 und +', 'percentage' => .2857, 'items_quantity' => 2, 'includes_all_items' => true],
            ['name' => 'un TriPack', 'description' => 'Ahorra S/129.70 agregando 1 und +', 'percentage' => .2857, 'items_quantity' => 3, 'includes_all_items' => true],
            ['name' => 'un CuatriPack', 'description' => 'Ahorra S/149.10 agregando 1 und +', 'percentage' => .2857, 'items_quantity' => 4, 'includes_all_items' => true],
            ['name' => 'un PentaPack', 'description' => 'Ahorra S/169.50 agregando 1 und +', 'percentage' => .2857, 'items_quantity' => 5, 'includes_all_items' => true],
            ['name' => 'un SixPack', 'description' => 'Ahorra S/189.40 agregando 1 und +', 'percentage' => .2857, 'items_quantity' => 6, 'includes_all_items' => true],
            ['name' => 'mas de 6', 'description' => 'Full ahorro', 'percentage' => .2857, 'items_quantity' => 6, 'comparator' => '>', 'includes_all_items' => true],
        ];

        foreach ($bundles as $bundle) {
            Bundle::updateOrCreate(['name' => $bundle['name']], $bundle);
        }
    }
}
