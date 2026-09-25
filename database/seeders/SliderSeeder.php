<?php

namespace Database\Seeders;

use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'name' => 'De las miles de combinaciones que existen, la tuya es *única*.',
                'description' => 'Rutina capilar hecha solo para ti',
                'image' => 'background_animated.gif',
                'button_text' => 'Haz el test y crea tu fórmula',
                'button_link' => '/test',
            ]
        ];

        foreach ($sliders as $slider) {
            Slider::updateOrCreate(['name' => $slider['name']], $slider);
        }
    }
}
