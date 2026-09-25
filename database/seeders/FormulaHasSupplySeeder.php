<?php

namespace Database\Seeders;

use App\Models\Formula;
use App\Models\FormulaHasSupply;
use App\Models\Supply;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormulaHasSupplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formulas = [
            'has_treatment.true' => [
                'Arroz fermentado',
                'Amarantho'
            ],
            'has_treatment.false' => [
                'Té verde'
            ],
            'scalp_type.dry' => [
                'Quinoa',
                'Amarantho',
                'Propaneidol'
            ],
            'scalp_type.normal' => [
                'Quinoa',
                'Amarantho',
            ],
            'scalp_type.oily' => [
                'Quinoa',
                'Amarantho',
                'Romero',
                'Manzanilla',
                'Arnica',
                'Salvia',
                'Capuchina',
                'Cáscara de limón'
            ],
            'hair_type.coily' => ['Acacia'],
            'hair_type.wavy' => ['Acacia'],
            'hair_type.straight' => ['Soya fermentada'],
            'hair_goals.deep-hydration' => [
                'Tamarindo',
                'Aloe vera',
                'Pantenol',
                'Polifenoles'
            ],
            'hair_goals.anti-frizz' => [
                'Manteca de Karité',
                'Aceite de argón',
                'Aceite de coco'
            ],
            'hair_goals.volume' => [
                'Alfa clorella',
                'Caléndula',
                'Papaya',
                'Acerola',
                'Avena',
                'Ginkgo Biloba',
                'Biotina',
                'Tara',
                'Cafeína',
                'Arginina',
                'Guaraná'
            ],
            'hair_goals.anti-dandruff' => [
                'Tomillo',
                'Ácido salicílico',
                'Sauce',
                'Pino',
                'Zinc'
            ],
            'hair_goals.smoothing' => [
                'Keratina',
                'Ceramidas',
                'Dimeticona'
            ],
            'hair_goals.split-ends-repair' => [
                'Jalea real',
                'Vinagre de manzana'
            ],
            'hair_goals.defined-curls' => [
                'Jojoba',
                'Brassica'
            ],
            'hair_goals.extreme-shine' => [
                'Yacón',
                'Uva',
                'Gluconolactona'
            ],
        ];

        foreach ($formulas as $key => $supplies) {
            [$name, $correlative] = explode('.', $key);
            $formulaJpa = Formula::select('id')
                ->where('name', $name)
                ->where('correlative', $correlative)
                ->first();
            foreach ($supplies as $supply) {
                $supplyJpa = Supply::select('id')
                    ->where('name', $supply)
                    ->first();
                FormulaHasSupply::updateOrCreate([
                    'formula_id' => $formulaJpa->id,
                    'supply_id' => $supplyJpa->id
                ]);
            }
        }
    }
}
