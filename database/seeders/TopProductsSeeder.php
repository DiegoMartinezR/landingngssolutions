<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TopProductsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Clear old items
        Item::query()->delete();

        $lang = \App\Models\Lang::where('is_default', true)->first() ?? \App\Models\Lang::first();
        $langId = $lang ? $lang->id : null;

        // 2. Resolve or create categories
        $catAm = Category::where('slug', 'antenas-am')->first() ?? Category::create([
            'name' => 'Antenas AM',
            'slug' => 'antenas-am',
            'description' => 'Sistemas antihurto acustomagnéticos de alta sensibilidad',
            'status' => true,
            'visible' => true,
            'lang_id' => $langId
        ]);

        $catDeac = Category::where('slug', 'desacopladores')->first() ?? Category::create([
            'name' => 'Desacopladores',
            'slug' => 'desacopladores',
            'description' => 'Equipos para neutralizar o retirar sensores en caja',
            'status' => true,
            'visible' => true,
            'lang_id' => $langId
        ]);

        // 3. Copy transparent PNG images from the documents folder to storage
        $easImagesPath = public_path('Documentos-20260529T035844Z-3-001/Documentos/Imagenes de EAS');
        $destPath = storage_path('app/images/item');

        if (!file_exists($destPath)) {
            mkdir($destPath, 0755, true);
        }

        $imageMap = [
            'antena-pegasus-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/SET MASTER - SLAVE/ACRILICAS EAS/PEGASUS/_SNY6788.png',
            'antena-atlanta-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/SET MASTER - SLAVE/PEDESTALES EAS/ATLANTA/_SNY6794.png',
            'antena-prometeo-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/SET MASTER - SLAVE/PEDESTALES EAS/PROMETEO/_SNY6792.png',
            'antena-titan-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/SET MASTER - SLAVE/PEDESTALES EAS/TITAN/_SNY6836.png',
            'antena-zeus-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/SET MASTER - SLAVE/PEDESTALES EAS/ZEUS/_SNY6848.png',
            'antena-monoblack-transparent.png' => $easImagesPath . '/SUMINISTRO DE ANTENAS ANTIHURTOS/ANTENAS ACUSTOMAGNETICAS (AM)/MONO TRANSRECEPTOR/ACRILICAS EAS/MONO ACRILICA BLACK/_SNY6786 (1).png'
        ];

        foreach ($imageMap as $destName => $srcPath) {
            if (file_exists($srcPath)) {
                copy($srcPath, $destPath . '/' . $destName);
            }
        }

        // 4. Seed the 6 top products with their transparent PNG images
        $items = [
            [
                'name' => 'Antena Pegasus AM',
                'slug' => 'antena-pegasus-am-premium',
                'summary' => 'Arco antihurto de acrílico premium con detección de hasta 2 metros y alertas visuales.',
                'description' => 'Antena de seguridad para ingresos comerciales con detección superior de hasta 2.0 metros de ancho. Fabricada en acrílico alemán resistente con luz LED de alarma integrada en la estructura. Calibración digital automática remota.',
                'price' => 1599.00,
                'discount' => 1399.00,
                'final_price' => 1399.00,
                'discount_percent' => 12.5,
                'image' => 'antena-pegasus-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => true,
                'offering' => true,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 25,
                'score' => 5
            ],
            [
                'name' => 'Antena Atlanta AM',
                'slug' => 'antena-atlanta-am',
                'summary' => 'Pedestal acustomagnético metálico con diseño robusto para retail de alto tránsito.',
                'description' => 'Estructura metálica de alta resistencia ideal para supermercados y tiendas por departamento. Máximo rango de detección para etiquetas rígidas y adhesivas, con tecnología de calibración digital.',
                'price' => 1299.00,
                'discount' => 1149.00,
                'final_price' => 1149.00,
                'discount_percent' => 11.5,
                'image' => 'antena-atlanta-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => false,
                'offering' => true,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 30,
                'score' => 5
            ],
            [
                'name' => 'Antena Prometeo AM',
                'slug' => 'antena-prometeo-am',
                'summary' => 'Estructura de ABS reforzada y óptimo rango de detección antinterferencias.',
                'description' => 'Arco de seguridad antihurto fabricado con ABS de alto impacto. Cuenta con procesamiento digital de señal avanzado que previene falsas alarmas debidas a ruido eléctrico.',
                'price' => 1190.00,
                'discount' => 999.00,
                'final_price' => 999.00,
                'discount_percent' => 16.0,
                'image' => 'antena-prometeo-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => true,
                'offering' => false,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 40,
                'score' => 5
            ],
            [
                'name' => 'Antena Titan AM',
                'slug' => 'antena-titan-am',
                'summary' => 'Sistema premium con calibración automática y alertas acústicas de alta potencia.',
                'description' => 'Antena de detección avanzada con indicador de alarma sonoro y visual configurable. Su diseño estilizado combina con interiores modernos manteniendo un blindaje de seguridad eficaz.',
                'price' => 1350.00,
                'discount' => 1199.00,
                'final_price' => 1199.00,
                'discount_percent' => 11.1,
                'image' => 'antena-titan-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => false,
                'offering' => true,
                'recommended' => false,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 18,
                'score' => 5
            ],
            [
                'name' => 'Antena Zeus AM',
                'slug' => 'antena-zeus-am',
                'summary' => 'Elegante pedestal de aluminio anodizado de alto rendimiento para boutiques exclusivas.',
                'description' => 'La fusión perfecta de estética y seguridad. Construida en aluminio anodizado ultra-ligero que destaca en tiendas retail premium con pasillos anchos y alta afluencia.',
                'price' => 1490.00,
                'discount' => 1299.00,
                'final_price' => 1299.00,
                'discount_percent' => 12.8,
                'image' => 'antena-zeus-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => true,
                'offering' => true,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 12,
                'score' => 5
            ],
            [
                'name' => 'Antena Mono Black AM',
                'slug' => 'antena-mono-black-am',
                'summary' => 'Arco transreceptor único de alta eficiencia ideal para accesos estrechos.',
                'description' => 'Ideal para farmacias o boutiques con una sola puerta de acceso. Un solo pedestal ubicado al centro que cubre ambos lados de entrada con un rango sobresaliente y discreto.',
                'price' => 1050.00,
                'discount' => 899.00,
                'final_price' => 899.00,
                'discount_percent' => 14.3,
                'image' => 'antena-monoblack-transparent.png',
                'category_id' => $catAm->id,
                'is_new' => false,
                'offering' => true,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 15,
                'score' => 5
            ]
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
