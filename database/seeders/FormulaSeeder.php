<?php

namespace Database\Seeders;

use App\Models\Formula;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $steps = [
            'has_treatment' => [
                'true' => 'Si',
                'false' => 'No',
            ],
            'scalp_type' => [
                'dry' => 'Seco',
                'normal' => 'Normal',
                'oily' => 'Graso',
            ],
            'hair_type' => [
                'coily' => 'Crespo',
                'wavy' => 'Ondulado',
                'straight' => 'Lacio',
            ],
            'hair_goals' => [
                'deep-hydration' => 'Hidratación profunda',
                'anti-frizz' => 'Antifrizz',
                'volume' => 'Volumen',
                'anti-dandruff' => 'Anticaspa',
                'smoothing' => 'Alisado',
                'split-ends-repair' => 'Reparación puntas abiertas',
                'defined-curls' => 'Rizos definidos',
                'extreme-shine' => 'Brillo extremo',
                'strengthening' => 'Fortalecimiento',
            ]
        ];

        foreach ($steps as $step => $formulas) {
            foreach ($formulas as $correlative => $formula) {
                Formula::updateOrCreate([
                    'name' => $step,
                    'correlative' => $correlative,
                ], [
                    'description' => $formula
                ]);
            }
        }
    }
}
