<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaESeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) return;
        $langId = $lang->id;

        // Find existing Zone E (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-e')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'Newport Beach',
                'zip_codes' => '92660, 92661, 92662, 92663',
                'h1' => 'Servicios de Limpieza Profesional en Newport Beach',
                'hero' => 'Newport Beach reúne propiedades frente al mar, residencias de alto nivel y espacios donde el estándar de limpieza es parte del estilo de vida. Azamora Cleaning Group ofrece un servicio diseñado para mantener interiores impecables, equilibrados y cuidados con precisión. Aquí la limpieza no solo mantiene, también proyecta el nivel del entorno. El servicio se ajusta a las condiciones específicas de cada propiedad.',
                'intro' => 'Newport Beach requiere consistencia y control. Los espacios deben mantenerse en condiciones impecables frente a uso constante y exposición costera. Nuestro servicio está diseñado para responder a ese nivel.',
                'services_intro' => 'Soluciones de limpieza para propiedades de alto estándar.',
                'why_us' => ['Precisión', 'Consistencia', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en conservación del espacio',
                'diff_desc' => 'Newport Beach requiere precisión costera.',
                'diff_items' => ['Protección de acabados', 'Control de condiciones costeras', 'Seguimiento constante del estado del espacio', 'Orden visual impecable'],
                'coverage' => 'Cobertura en Newport Beach y zonas estratégicas de Orange County, orientada a propiedades frente al mar y espacios de alto estándar.',
                'local_msg' => 'En Newport Beach, el estado del espacio refleja su nivel.',
                'seo' => 'Servicios de limpieza en Newport Beach enfocados en propiedades premium.',
                'final_msg' => 'La limpieza sostiene el valor del entorno.',
                'cta_final' => 'Mantén tu propiedad impecable y en control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Huntington Beach',
                'zip_codes' => '92646, 92647, 92648, 92649',
                'h1' => 'Servicios de Limpieza Profesional en Huntington Beach',
                'hero' => 'Huntington Beach combina vida costera activa, propiedades frente al mar y espacios donde el uso constante exige mantenimiento continuo. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes limpios, equilibrados y preparados para uso continuo. La limpieza aquí acompaña el ritmo del entorno sin interrumpirlo. Ajustamos el servicio al ritmo y uso de cada espacio.',
                'intro' => 'Huntington Beach requiere control continuo del espacio. Los espacios necesitan limpieza que responda a uso continuo, exposición costera y movimiento diario. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para espacios costeros activos.',
                'why_us' => ['Consistencia', 'Resultados confiables', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza alineada al ritmo costero',
                'diff_desc' => 'Huntington Beach requiere continuidad.',
                'diff_items' => ['Control de áreas activas', 'Control operativo del espacio', 'Orden funcional', 'Respuesta eficiente'],
                'coverage' => 'Servicio disponible en Huntington Beach y sectores activos de Orange County, adaptado a entornos costeros con alto flujo.',
                'local_msg' => 'En Huntington Beach, el orden mantiene el equilibrio del espacio.',
                'seo' => 'Servicios de limpieza en Huntington Beach enfocados en espacios costeros.',
                'final_msg' => 'La limpieza sostiene el ritmo del entorno.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Dana Point',
                'zip_codes' => '92629',
                'h1' => 'Servicios de Limpieza Profesional en Dana Point',
                'hero' => 'Dana Point combina propiedades costeras, vistas abiertas y espacios donde el mantenimiento constante es clave. Azamora Cleaning Group ofrece un servicio enfocado en mantener limpieza, control y equilibrio en entornos expuestos al ambiente marino. La limpieza aquí protege la condición del espacio. El servicio se adapta al entorno y exigencias de cada propiedad.',
                'intro' => 'Dana Point requiere control continuo del entorno. Los espacios necesitan limpieza que controle condiciones externas y uso continuo. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para propiedades costeras.',
                'why_us' => ['Consistencia', 'Control del entorno', 'Resultados confiables', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en protección del espacio',
                'diff_desc' => 'Dana Point requiere mantenimiento marino.',
                'diff_items' => ['Control ambiental', 'Seguimiento del entorno', 'Cuidado de superficies', 'Orden funcional'],
                'coverage' => 'Atención en Dana Point y áreas costeras de Orange County, enfocada en espacios expuestos al entorno marino.',
                'local_msg' => 'En Dana Point, el entorno exige mantenimiento constante.',
                'seo' => 'Servicios de limpieza en Dana Point enfocados en propiedades costeras.',
                'final_msg' => 'La limpieza conserva el valor del espacio.',
                'cta_final' => 'Mantén tu espacio limpio, protegido y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
        ];

        foreach ($facilities as $data) {
            $slug = Str::slug($data['title']);

            Facility::updateOrCreate(
                ['slug' => $slug, 'lang_id' => $langId],
                [
                    'title' => $data['title'],
                    'zip_codes' => $data['zip_codes'],
                    'description' => $data['hero'], 
                    'zone_id' => $zone->id,
                    'status' => true,
                    'visible' => true,
                    'detailed_content' => [
                        'h1' => $data['h1'],
                        'hero_description' => $data['hero'],
                        'intro' => $data['intro'],
                        'services_intro' => $data['services_intro'],
                        'why_choose_us' => $data['why_us'],
                        'differentiator_title' => $data['diff_title'],
                        'differentiator_description' => $data['diff_desc'],
                        'differentiator_items' => $data['diff_items'],
                        'coverage_message' => $data['coverage'],
                        'local_message' => $data['local_msg'],
                        'seo_block' => $data['seo'],
                        'final_message' => $data['final_msg']
                    ],
                    'gallery' => []
                ]
            );
        }
    }
}
