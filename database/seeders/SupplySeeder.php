<?php

namespace Database\Seeders;

use App\Models\Supply;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supplies = [
            [
                'image' => 'arroz-fermentado.png',
                'name' => 'Arroz fermentado',
                'description' => 'Suaviza'
            ],
            [
                'image' => 'maracuya.png',
                'name' => 'Maracuyá',
                'description' => 'Antioxidante'
            ],
            [
                'image' => 'te-verde.png',
                'name' => 'Té verde',
                'description' => 'Crecimiento'
            ],
            [
                'image' => 'acacia.png',
                'name' => 'Acacia',
                'description' => 'Fortalece'
            ],
            [
                'image' => 'soya-fermentada.png',
                'name' => 'Soya fermentada',
                'description' => 'Revitaliza'
            ],
            [
                'image' => 'quinoa.png',
                'name' => 'Quinoa',
                'description' => 'Brillo'
            ],
            [
                'image' => 'amarantho.png',
                'name' => 'Amarantho',
                'description' => 'Restaura'
            ],
            [
                'image' => 'propaneidol.png',
                'name' => 'Propaneidol',
                'description' => 'Humectante'
            ],
            [
                'image' => 'romero.png',
                'name' => 'Romero',
                'description' => 'Purificante',
                'featured' => true
            ],
            [
                'image' => 'manzanilla.png',
                'name' => 'Manzanilla',
                'description' => 'Crecimiento'
            ],
            [
                'image' => 'arnica.png',
                'name' => 'Arnica',
                'description' => 'Nutrición'
            ],
            [
                'image' => 'salvia.png',
                'name' => 'Salvia',
                'description' => 'Regenera'
            ],
            [
                'image' => 'capuchina.png',
                'name' => 'Capuchina',
                'description' => 'Anticaspa'
            ],
            [
                'image' => 'cascara-limon.png',
                'name' => 'Cáscara de limón',
                'description' => 'Purifica'
            ],
            [
                'image' => 'tamarindo.png',
                'name' => 'Tamarindo',
                'description' => 'Vitalidad'
            ],
            [
                'image' => 'aloe-vera.png',
                'name' => 'Aloe vera',
                'description' => 'Nutrición'
            ],
            [
                'image' => 'pantenol.png',
                'name' => 'Pantenol',
                'description' => 'Hidratación'
            ],
            [
                'image' => 'polifenoles.png',
                'name' => 'Polifenoles',
                'description' => 'Antioxidante'
            ],
            [
                'image' => 'yacon.png',
                'name' => 'Yacón',
                'description' => 'Antiinflamatorio'
            ],
            [
                'image' => 'uva.png',
                'name' => 'Uva',
                'description' => 'Hidratación'
            ],
            [
                'image' => 'gluconolactona.png',
                'name' => 'Gluconolactona',
                'description' => 'Limpieza'
            ],
            [
                'image' => 'manteca-karite.png',
                'name' => 'Manteca de Karité',
                'description' => 'Cabello sano',
                'featured' => true
            ],
            [
                'image' => 'aceite-argon.png',
                'name' => 'Aceite de argón',
                'description' => 'Antifrizz'
            ],
            [
                'image' => 'aceite-coco.png',
                'name' => 'Aceite de coco',
                'description' => 'Restaura',
                'featured' => true
            ],
            [
                'image' => 'tomillo.png',
                'name' => 'Tomillo',
                'description' => 'Anticaspa'
            ],
            [
                'image' => 'acido-salicilico.png',
                'name' => 'Ácido salicílico',
                'description' => 'Nutrición',
                'featured' => true
            ],
            [
                'image' => 'sauce.png',
                'name' => 'Sauce',
                'description' => 'Cabello sano'
            ],
            [
                'image' => 'pino.png',
                'name' => 'Pino',
                'description' => 'Suavidad'
            ],
            [
                'image' => 'zinc.png',
                'name' => 'Zinc',
                'description' => 'Fortalecimiento'
            ],
            [
                'image' => 'jalea-real.png',
                'name' => 'Jalea real',
                'description' => 'Repara puntas'
            ],
            [
                'image' => 'vinagre-manzana.png',
                'name' => 'Vinagre de manzana',
                'description' => 'Antibacteriana'
            ],
            [
                'image' => 'alga-clorella.png',
                'name' => 'Alfa clorella',
                'description' => 'Hidratación'
            ],
            [
                'image' => 'calendula.png',
                'name' => 'Caléndula',
                'description' => 'Anticaspa',
                'featured' => true
            ],
            [
                'image' => 'papaya.png',
                'name' => 'Papaya',
                'description' => 'Crecimiento'
            ],
            [
                'image' => 'acerola.png',
                'name' => 'Acerola',
                'description' => 'Hidratación'
            ],
            [
                'image' => 'avena.png',
                'name' => 'Avena',
                'description' => 'Suavidad'
            ],
            [
                'image' => 'ginkgo-biloba.png',
                'name' => 'Ginkgo Biloba',
                'description' => 'Vitalidad'
            ],
            [
                'image' => 'biotina.png',
                'name' => 'Biotina',
                'description' => 'Crecimiento',
                'featured' => true
            ],
            [
                'image' => 'tara.png',
                'name' => 'Tara',
                'description' => 'Volumen'
            ],
            [
                'image' => 'cafeina.png',
                'name' => 'Cafeína',
                'description' => 'Volumen'
            ],
            [
                'image' => 'arginina.png',
                'name' => 'Arginina',
                'description' => 'Crecimiento'
            ],
            [
                'image' => 'guarana.png',
                'name' => 'Guaraná',
                'description' => 'Fortalecimiento'
            ],
            [
                'image' => 'filtro-solar.png',
                'name' => 'Filtro solar UVA/UVB',
                'description' => 'Protege'
            ],
            [
                'image' => 'vitamina-e.png',
                'name' => 'Vitamina E',
                'description' => 'Hidratación'
            ],
            [
                'image' => 'seda.png',
                'name' => 'Seda',
                'description' => 'Antifrizz'
            ],
            [
                'image' => 'almendras.png',
                'name' => 'Almendras',
                'description' => 'Suavidad'
            ],
            [
                'image' => 'tocoferol.png',
                'name' => 'Tocoferol',
                'description' => 'Crecimiento'
            ],
            [
                'image' => 'jojoba.png',
                'name' => 'Jojoba',
                'description' => 'Rizos definidos'
            ],
            [
                'image' => 'brassica.png',
                'name' => 'Brassica',
                'description' => 'Desenredante'
            ],
            [
                'image' => 'keratina.png',
                'name' => 'Keratina',
                'description' => 'Alisado'
            ],
            [
                'image' => 'ceramidas.png',
                'name' => 'Ceramidas',
                'description' => 'Fortalecimiento'
            ],
            [
                'image' => 'dimeticona.png',
                'name' => 'Dimeticona',
                'description' => 'Alisado'
            ],
        ];

        foreach ($supplies as $supply) {
            Supply::updateOrCreate(['name' => $supply['name']], $supply);
        }
    }
}
