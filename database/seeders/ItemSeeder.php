<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'name' => 'Shampoo',
                'slug' => 'shampoo',
                'description' => 'Limpia profundamente el cabello, eliminando impurezas, residuos y exceso de grasa, dejando una sensación de frescura y ligereza.',
                'price' => 69.9,
                'discount' => 0,
                'image' => 'shampoo.png',
                'featured' => true,

            ],
            [
                'name' => 'Acondicionador',
                'slug' => 'acondicionador',
                'description' => 'Hidrata y suaviza el cabello, facilitando el desenredo y dejándolo manejable y sedoso al tacto.',
                'price' => 69.9,
                'discount' => 0,
                'image' => 'conditioner.png',
                'featured' => true,
            ]
        ];

        foreach ($items as $item) {
            Item::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
