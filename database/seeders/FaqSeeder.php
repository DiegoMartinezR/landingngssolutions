<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Lang;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first();
        $langId = $lang ? $lang->id : null;

        $faqs = [
            [
                'name' => '¿Están asegurados y protegidos?',
                'description' => 'Sí. Operamos con seguro y garantía de fianza para brindar respaldo y confianza en cada servicio.',
                'visible' => true,
                'status' => true,
                'lang_id' => $langId,
            ],
            [
                'name' => '¿Qué tipo de espacios atienden?',
                'description' => 'Trabajamos con espacios residenciales, comerciales y propiedades en distintas condiciones o etapas.',
                'visible' => true,
                'status' => true,
                'lang_id' => $langId,
            ],
            [
                'name' => '¿Cómo aseguran la calidad del servicio?',
                'description' => 'Aplicamos estándares definidos, supervisión constante y atención meticulosa al detalle.',
                'visible' => true,
                'status' => true,
                'lang_id' => $langId,
            ],
            [
                'name' => '¿Pueden adaptarse a mis necesidades específicas?',
                'description' => 'Sí. Ajustamos cada servicio según el tipo de espacio, nivel requerido, frecuencia y condiciones particulares.',
                'visible' => true,
                'status' => true,
                'lang_id' => $langId,
            ],
            [
                'name' => '¿Cómo puedo solicitar el servicio?',
                'description' => 'Puedes solicitar un estimado gratuito o agendar una llamada directamente desde la página.',
                'visible' => true,
                'status' => true,
                'lang_id' => $langId,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}
