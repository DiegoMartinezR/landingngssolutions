<?php

namespace Database\Seeders;

use App\Models\Color;
use App\Models\Item;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\Text;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = Item::select('id')
            ->where('featured', true)
            ->get();
        $colors = [
            [
                'name' => 'Amarillo',
                'hex' => '#F9E8AF'
            ],
            [
                'name' => 'Blanco',
                'hex' => '#F5F0ED'
            ],
            [
                'name' => 'Celeste',
                'hex' => '#B2E3ED'
            ],
            [
                'name' => 'Lila',
                'hex' => '#E3D0F2'
            ],
            [
                'name' => 'Naranja',
                'hex' => '#F9CCA5'
            ],
            [
                'name' => 'Rosado',
                'hex' => '#F7C2C6'
            ],
            [
                'name' => 'Verde',
                'hex' => '#DCF0BA'
            ]
        ];

        foreach ($items as $item) {
            foreach ($colors as $color) {
                Color::updateOrCreate([
                    'item_id' => $item->id,
                    'name' => $color['name']
                ], [
                    'image' => strtolower($color['name']) . ".png",
                    'hex' => $color['hex']
                ]);
            }
        }
    }
}
