<?php

namespace Database\Seeders;

use App\Models\Fragrance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FragranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fragrances = [
            [
                'name' => 'Sweet Pear',
                'image' => 'fragrance-sweet-pear.png'
            ],
            [
                'name' => 'Coco Tropical',
                'image' => 'fragrance-coco-tropical.png'
            ],
            [
                'name' => 'Manzana Verde',
                'image' => 'fragrance-manzana-verde.png'
            ],
            [
                'name' => 'Brisa Marina',
                'image' => 'fragrance-brisa-marina.png'
            ],
            [
                'name' => 'Raspberry Bliss',
                'image' => 'fragrance-raspberry-bliss.png'
            ],
            [
                'name' => 'Sin fragancia',
                'image' => 'fragrance-sin-fragancia.png'
            ],
        ];

        foreach ($fragrances as $fragrance) {
            Fragrance::updateOrCreate(['name' => $fragrance['name']], $fragrance);
        }
    }
}
