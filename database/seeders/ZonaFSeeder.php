<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaFSeeder extends Seeder
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

        // Find existing Zone F (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-f')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'Irvine',
                'zip_codes' => '92602, 92603, 92604, 92606, 92612, 92614, 92617, 92618, 92620',
                'h1' => 'Servicios de Limpieza Profesional en Irvine',
                'hero' => 'Irvine se caracteriza por comunidades planificadas, espacios modernos y un entorno donde el orden y la organización son parte del estándar. Azamora Cleaning Group implementa un servicio enfocado en mantener ambientes limpios, estructurados y perfectamente controlados. La limpieza aquí sostiene eficiencia y presentación. El servicio se ajusta a la dinámica operativa de cada espacio.',
                'intro' => 'Irvine requiere consistencia. Los espacios deben mantenerse organizados, limpios y funcionales en todo momento. Nuestro servicio está diseñado para sostener ese nivel de control.',
                'services_intro' => 'Soluciones de limpieza para espacios residenciales y profesionales.',
                'why_us' => ['Orden estructurado', 'Resultados consistentes', 'Ejecución eficiente', 'Enfoque profesional'],
                'diff_title' => 'Limpieza enfocada en organización del espacio',
                'diff_desc' => 'Irvine exige control continuo.',
                'diff_items' => ['Organización por áreas', 'Mantenimiento constante', 'Orden funcional', 'Continuidad operativa'],
                'coverage' => 'Cobertura en Irvine y zonas planificadas dentro de Orange County, con enfoque en entornos organizados y estructurados.',
                'local_msg' => 'En Irvine, el orden define el funcionamiento del espacio.',
                'seo' => 'Servicios de limpieza en Irvine enfocados en mantenimiento estructurado.',
                'final_msg' => 'El orden sostiene la eficiencia del entorno.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Costa Mesa',
                'zip_codes' => '92626, 92627',
                'h1' => 'Servicios de Limpieza Profesional en Costa Mesa',
                'hero' => 'Costa Mesa combina actividad comercial, espacios residenciales y zonas donde el movimiento es constante. Azamora Cleaning Group opera con un servicio orientado a mantener limpieza, orden y control en entornos dinámicos. La limpieza aquí sostiene el ritmo del entorno. Ajustamos el servicio al ritmo y uso de cada entorno.',
                'intro' => 'Costa Mesa requiere dinamismo. Los espacios necesitan limpieza que responda a uso constante sin perder control. Nuestro servicio está diseñado para sostener ese ritmo.',
                'services_intro' => 'Soluciones de limpieza para espacios activos.',
                'why_us' => ['Adaptación al entorno', 'Resultados consistentes', 'Ejecución rápida', 'Enfoque profesional'],
                'diff_title' => 'Limpieza enfocada en entornos activos',
                'diff_desc' => 'Costa Mesa requiere control constante.',
                'diff_items' => ['Mantenimiento continuo', 'Orden funcional', 'Control de áreas activas', 'Respuesta eficiente'],
                'coverage' => 'Servicio en Costa Mesa y áreas activas dentro de Orange County, adaptado a espacios con alto flujo.',
                'local_msg' => 'En Costa Mesa, el orden permite sostener el ritmo del espacio.',
                'seo' => 'Servicios de limpieza en Costa Mesa enfocados en espacios dinámicos.',
                'final_msg' => 'La limpieza mantiene el control del entorno.',
                'cta_final' => 'Mantén tu espacio limpio y funcionando correctamente. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Laguna Beach',
                'zip_codes' => '92651',
                'h1' => 'Servicios de Limpieza Profesional en Laguna Beach',
                'hero' => 'Laguna Beach destaca por su estética, propiedades de alto valor y espacios donde cada detalle es visible. Azamora Cleaning Group desarrolla un servicio enfocado en mantener ambientes limpios, equilibrados y visualmente impecables. La limpieza aquí realza la estética del espacio. El servicio se ajusta a las condiciones específicas de cada propiedad.',
                'intro' => 'Laguna Beach requiere sensibilidad. Los espacios deben mantenerse en condiciones que respeten materiales, diseño y entorno. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para propiedades de alto valor estético.',
                'why_us' => ['Precisión', 'Resultados consistentes', 'Sensibilidad estética', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en estética del entorno',
                'diff_desc' => 'Laguna Beach requiere atención constante.',
                'diff_items' => ['Cuidado de materiales', 'Orden visual', 'Mantenimiento continuo', 'Preservación del espacio'],
                'coverage' => 'Atendemos Laguna Beach y zonas selectas dentro de Orange County, enfocados en espacios de alto valor estético.',
                'local_msg' => 'En Laguna Beach, el detalle define el espacio.',
                'seo' => 'Servicios de limpieza en Laguna Beach enfocados en propiedades premium.',
                'final_msg' => 'El detalle mantiene el valor del entorno.',
                'cta_final' => 'Mantén tu propiedad limpia, cuidada y alineada con su entorno. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Laguna Niguel',
                'zip_codes' => '92677',
                'h1' => 'Servicios de Limpieza Profesional en Laguna Niguel',
                'hero' => 'Laguna Niguel destaca por sus comunidades residenciales organizadas, espacios bien cuidados y un entorno donde el orden forma parte del día a día. Azamora Cleaning Group opera con un servicio diseñado para mantener hogares limpios, equilibrados y en control constante. La limpieza aquí mantiene estabilidad operativa. Ajustamos el servicio a la dinámica de cada hogar.',
                'intro' => 'Laguna Niguel requiere consistencia. Los espacios deben mantenerse organizados, limpios y funcionales en todo momento. Nuestro servicio está diseñado para sostener ese equilibrio.',
                'services_intro' => 'Soluciones de limpieza para hogares y espacios residenciales.',
                'why_us' => ['Consistencia', 'Orden estructurado', 'Resultados confiables', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en estabilidad del espacio',
                'diff_desc' => 'Laguna Niguel requiere cuidado continuo.',
                'diff_items' => ['Orden continuo', 'Control de áreas', 'Mantenimiento regular', 'Funcionalidad del espacio'],
                'coverage' => 'Cobertura en Laguna Niguel y comunidades residenciales dentro de Orange County, orientada a entornos familiares.',
                'local_msg' => 'En Laguna Niguel, el orden mantiene la estabilidad del hogar.',
                'seo' => 'Servicios de limpieza en Laguna Niguel enfocados en mantenimiento residencial.',
                'final_msg' => 'La constancia mantiene el hogar en control.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'San Juan Capistrano',
                'zip_codes' => '92675, 92693',
                'h1' => 'Servicios de Limpieza Profesional en San Juan Capistrano',
                'hero' => 'San Juan Capistrano combina tradición, espacios amplios y propiedades donde el cuidado del entorno es clave. Azamora Cleaning Group ejecuta un servicio enfocado en mantener limpieza, orden y control en espacios que requieren mantenimiento constante. La limpieza aquí ayuda a conservar el valor del entorno. El servicio se adapta al entorno y a las condiciones de cada espacio.',
                'intro' => 'San Juan Capistrano requiere mantenimiento continuo. Los espacios deben mantenerse limpios, organizados y en condiciones estables. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para propiedades residenciales y espacios amplios.',
                'why_us' => ['Consistencia', 'Resultados confiables', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en conservación del espacio',
                'diff_desc' => 'San Juan Capistrano requiere continuidad.',
                'diff_items' => ['Cuidado continuo', 'Control del entorno', 'Orden funcional', 'Preservación del espacio'],
                'coverage' => 'Servicio en San Juan Capistrano y áreas tradicionales dentro de Orange County, adaptado a espacios amplios.',
                'local_msg' => 'En San Juan Capistrano, el cuidado del espacio mantiene su valor.',
                'seo' => 'Servicios de limpieza en San Juan Capistrano enfocados en mantenimiento residencial.',
                'final_msg' => 'El mantenimiento constante preserva el entorno.',
                'cta_final' => 'Mantén tu espacio limpio, estable y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Anaheim',
                'zip_codes' => '92801, 92802, 92804, 92805, 92806, 92807, 92808',
                'h1' => 'Servicios Profesionales de Limpieza en Anaheim',
                'hero' => 'Anaheim mantiene un flujo constante entre turismo, zonas residenciales y áreas comerciales cercanas a Harbor Blvd y Katella Ave. Azamora Cleaning Group opera con un servicio diseñado para sostener orden y limpieza en espacios que reciben movimiento continuo. La limpieza aquí permite control en entornos de alta rotación. Ajustamos el servicio al flujo y tipo de operación del espacio.',
                'intro' => 'Anaheim exige consistencia. Los espacios necesitan limpieza que responda a un flujo constante de uso. Nuestro servicio está enfocado en sostener ese ritmo sin interrupciones.',
                'services_intro' => 'Soluciones de limpieza en Anaheim para entornos dinámicos.',
                'why_us' => ['Capacidad de adaptación', 'Resultados constantes', 'Respuesta eficiente', 'Ejecución profesional'],
                'diff_title' => 'Limpieza diseñada para alta rotación',
                'diff_desc' => 'Anaheim requiere control constante.',
                'diff_items' => ['Mantenimiento frecuente', 'Control de áreas activas', 'Orden inmediato', 'Continuidad operativa'],
                'coverage' => 'Cobertura en Anaheim y zonas de alto movimiento dentro de Orange County, enfocada en espacios de uso continuo.',
                'local_msg' => 'En Anaheim, el flujo no se detiene y el orden tampoco.',
                'seo' => 'Servicios de limpieza en Anaheim enfocados en espacios de alto movimiento.',
                'final_msg' => 'La limpieza permite sostener el ritmo constante.',
                'cta_final' => 'Mantén tu espacio limpio y listo para cada uso. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Santa Ana',
                'zip_codes' => '92701, 92703, 92704, 92705, 92706, 92707',
                'h1' => 'Servicios Profesionales de Limpieza en Santa Ana',
                'hero' => 'Santa Ana combina actividad comercial intensa, zonas residenciales y áreas de alto tránsito donde los espacios requieren control continuo. Azamora Cleaning Group implementa un servicio enfocado en mantener orden, limpieza y funcionalidad en entornos con uso continuo. La limpieza aquí sostiene el control operativo. El servicio se ajusta a la dinámica de uso de cada entorno.',
                'intro' => 'Santa Ana requiere soluciones eficientes. Los espacios necesitan limpieza que mantenga orden constante en entornos de alta actividad. Nuestro servicio está diseñado para responder a esa dinámica.',
                'services_intro' => 'Soluciones de limpieza en Santa Ana para espacios activos.',
                'why_us' => ['Ejecución eficiente', 'Resultados constantes', 'Adaptación al entorno', 'Enfoque profesional'],
                'diff_title' => 'Limpieza enfocada en entornos de alta actividad',
                'diff_desc' => 'Santa Ana requiere control constante.',
                'diff_items' => ['Mantenimiento continuo', 'Control de áreas activas', 'Orden funcional', 'Respuesta rápida'],
                'coverage' => 'Servicio en Santa Ana y áreas comerciales dentro de Orange County, orientado a entornos de alta actividad.',
                'local_msg' => 'En Santa Ana, el orden permite mantener control en medio del movimiento.',
                'seo' => 'Servicios de limpieza en Santa Ana enfocados en espacios dinámicos.',
                'final_msg' => 'La limpieza mantiene el control del entorno.',
                'cta_final' => 'Mantén tu espacio limpio y en funcionamiento. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Yorba Linda',
                'zip_codes' => '92885, 92886, 92887',
                'h1' => 'Servicios de Limpieza Profesional en Yorba Linda',
                'hero' => 'Yorba Linda destaca por sus hogares amplios, zonas residenciales tranquilas y espacios donde el orden es parte del estándar. Azamora Cleaning Group desarrolla un servicio enfocado en mantener limpieza, control y organización en cada área del hogar. La limpieza aquí mantiene el orden estructurado. Ajustamos el servicio a la estructura y distribución del hogar.',
                'intro' => 'Yorba Linda requiere control por áreas. Los espacios deben mantenerse organizados, limpios y en condiciones consistentes. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para hogares amplios.',
                'why_us' => ['Organización estructurada', 'Resultados consistentes', 'Control por áreas', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en organización del espacio',
                'diff_desc' => 'Yorba Linda requiere estructura.',
                'diff_items' => ['División por áreas', 'Mantenimiento constante', 'Orden funcional', 'Control estructurado'],
                'coverage' => 'Atendemos Yorba Linda y zonas residenciales dentro de Orange County, con enfoque en hogares amplios y organizados.',
                'local_msg' => 'En Yorba Linda, el orden mantiene el control del hogar.',
                'seo' => 'Servicios de limpieza en Yorba Linda enfocados en mantenimiento residencial.',
                'final_msg' => 'El orden permite controlar el espacio.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en equilibrio. Solicita tu estimado gratuito hoy.'
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
