<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaDSeeder extends Seeder
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

        // Find existing Zone D (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-d')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'San Marino',
                'zip_codes' => '91108',
                'h1' => 'Servicios de Limpieza Profesional en San Marino',
                'hero' => 'San Marino destaca por residencias elegantes, espacios amplios y un entorno donde el cuidado del hogar es parte del estándar. Azamora Cleaning Group ofrece un servicio diseñado para mantener interiores organizados, cuidados y en condiciones consistentes. La limpieza aquí sostiene la calidad del espacio. El servicio se ajusta a las necesidades específicas de cada hogar.',
                'intro' => 'San Marino requiere continuidad. Los espacios deben mantenerse limpios, organizados y perfectamente controlados en todo momento. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para propiedades residenciales de alto estándar.',
                'why_us' => ['Precisión', 'Resultados consistentes', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en conservación del hogar',
                'diff_desc' => 'San Marino requiere control constante.',
                'diff_items' => ['Preservación de acabados', 'Orden continuo', 'Cuidado detallado', 'Consistencia del espacio'],
                'coverage' => 'Cobertura en San Marino y zonas cercanas dentro de Los Angeles County, manteniendo el nivel y la consistencia del entorno.',
                'local_msg' => 'En San Marino, el cuidado del espacio refleja su nivel.',
                'seo' => 'Servicios de limpieza en San Marino enfocados en propiedades premium residenciales.',
                'final_msg' => 'El mantenimiento constante protege el valor del hogar.',
                'cta_final' => 'Mantén tu hogar impecable, organizado y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'La Cañada Flintridge',
                'zip_codes' => '91011',
                'h1' => 'Servicios de Limpieza Profesional en La Cañada Flintridge',
                'hero' => 'La Cañada Flintridge combina residencias amplias, zonas tranquilas y espacios donde el control del entorno es esencial. Azamora Cleaning Group ofrece un servicio diseñado para mantener limpieza, orden y equilibrio en propiedades de gran tamaño. La limpieza aquí permite mantener el espacio bajo control. Ajustamos el servicio a la dinámica de cada espacio.',
                'intro' => 'La Cañada Flintridge requiere estructura. Los espacios deben mantenerse organizados, limpios y gestionados por áreas. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para hogares amplios.',
                'why_us' => ['Organización estructurada', 'Resultados consistentes', 'Control por áreas', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en control del espacio',
                'diff_desc' => 'La Cañada Flintridge requiere planificación.',
                'diff_items' => ['División por áreas', 'Mantenimiento continuo', 'Orden funcional', 'Gestión del entorno'],
                'coverage' => 'Servicio disponible en La Cañada Flintridge y áreas próximas dentro de Los Angeles County, con enfoque en orden y control del espacio.',
                'local_msg' => 'En La Cañada Flintridge, el control del espacio define su funcionamiento.',
                'seo' => 'Servicios de limpieza en La Cañada Flintridge enfocados en hogares amplios.',
                'final_msg' => 'El orden permite gestionar el espacio correctamente.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Palos Verdes Estates',
                'zip_codes' => '90274',
                'h1' => 'Servicios de Limpieza Profesional en Palos Verdes Estates',
                'hero' => 'Palos Verdes Estates combina propiedades exclusivas, vistas abiertas y espacios donde el mantenimiento constante es parte del entorno. Azamora Cleaning Group ofrece un servicio diseñado para mantener limpieza, orden y estabilidad en propiedades de alto nivel. La limpieza aquí protege el estado del espacio. El servicio se adapta a las condiciones específicas del entorno.',
                'intro' => 'Palos Verdes Estates requiere control continuo del entorno. Los espacios deben mantenerse limpios, organizados y en condiciones estables frente a uso y entorno. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para propiedades residenciales premium.',
                'why_us' => ['Consistencia', 'Resultados estables', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en preservación del espacio',
                'diff_desc' => 'Palos Verdes Estates requiere continuidad.',
                'diff_items' => ['Mantenimiento constante', 'Cuidado de superficies', 'Orden funcional', 'Control del entorno'],
                'coverage' => 'Atendemos Palos Verdes Estates y zonas cercanas dentro de Los Angeles County, adaptando el servicio a un entorno estable y cuidado.',
                'local_msg' => 'En Palos Verdes Estates, el mantenimiento define la calidad del espacio.',
                'seo' => 'Servicios de limpieza en Palos Verdes Estates enfocados en propiedades premium.',
                'final_msg' => 'La constancia protege el valor del entorno.',
                'cta_final' => 'Mantén tu propiedad limpia, organizada y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Rancho Palos Verdes',
                'zip_codes' => '90275',
                'h1' => 'Servicios de Limpieza Profesional en Rancho Palos Verdes',
                'hero' => 'Rancho Palos Verdes combina propiedades amplias, vistas abiertas y espacios donde el control constante es esencial para conservar el entorno. Azamora Cleaning Group ofrece un servicio diseñado para mantener limpieza, control y estabilidad en propiedades residenciales de alto nivel. La limpieza aquí permite preservar el estado del espacio frente al entorno. Ajustamos el servicio según las condiciones del espacio y del entorno.',
                'intro' => 'Rancho Palos Verdes requiere control continuo del entorno. Los espacios deben mantenerse limpios, organizados y bajo control frente a condiciones externas. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para propiedades residenciales premium.',
                'why_us' => ['Consistencia', 'Control del resultado', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en preservación del entorno',
                'diff_desc' => 'Rancho Palos Verdes requiere continuidad.',
                'diff_items' => ['Mantenimiento constante', 'Cuidado de superficies', 'Control ambiental', 'Orden funcional'],
                'coverage' => 'Cobertura en Rancho Palos Verdes y sectores cercanos dentro de Los Angeles County, respondiendo a espacios amplios y condiciones del entorno.',
                'local_msg' => 'En Rancho Palos Verdes, el mantenimiento protege el valor del espacio.',
                'seo' => 'Servicios de limpieza en Rancho Palos Verdes enfocados en propiedades premium.',
                'final_msg' => 'La constancia conserva el entorno.',
                'cta_final' => 'Mantén tu propiedad limpia, organizada y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Rolling Hills Estates',
                'zip_codes' => '90274',
                'h1' => 'Servicios de Limpieza Profesional en Rolling Hills Estates',
                'hero' => 'Rolling Hills Estates se caracteriza por propiedades privadas, espacios amplios y un entorno donde la discreción es clave. Azamora Cleaning Group ofrece un servicio diseñado para mantener limpieza, orden y control en espacios exclusivos. La limpieza aquí se ejecuta sin interferir en la privacidad del entorno. El servicio se ajusta a la privacidad y características de cada espacio.',
                'intro' => 'Rolling Hills Estates requiere precisión. Los espacios deben mantenerse en condiciones impecables sin alterar la armonía del entorno. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para propiedades exclusivas.',
                'why_us' => ['Discreción', 'Precisión', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en privacidad y control',
                'diff_desc' => 'Rolling Hills Estates requiere un enfoque más reservado.',
                'diff_items' => ['Respeto por el espacio', 'Cuidado detallado', 'Orden absoluto', 'Operación continua'],
                'coverage' => 'Servicio en Rolling Hills Estates y áreas cercanas dentro de Los Angeles County, con una ejecución alineada a la privacidad y al control del espacio.',
                'local_msg' => 'En Rolling Hills Estates, la discreción define la calidad del servicio.',
                'seo' => 'Servicios de limpieza en Rolling Hills Estates enfocados en propiedades exclusivas.',
                'final_msg' => 'La discreción también es calidad.',
                'cta_final' => 'Mantén tu propiedad impecable, organizada y en total control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Los Angeles',
                'zip_codes' => '90001, 90002, 90003, 90004, 90005, 90006, 90007, 90008, 90010, 90011, 90012, 90013, 90014, 90015, 90016, 90017, 90018, 90019, 90020, 90021, 90023, 90024, 90025, 90026, 90029, 90031, 90032, 90033, 90034, 90035, 90036, 90037, 90039, 90041, 90042, 90043, 90044, 90045, 90047, 90056, 90057, 90058, 90059, 90061, 90062, 90063, 90064, 90065, 90066, 90067, 90071',
                'h1' => 'Servicios Profesionales de Limpieza en Los Angeles',
                'hero' => 'Los Angeles es una ciudad extensa donde cada zona presenta diferentes necesidades de limpieza, desde hogares residenciales hasta espacios comerciales y propiedades en constante desarrollo. Azamora Cleaning Group ofrece un servicio diseñado para cubrir esa diversidad con estructura, consistencia y capacidad operativa. La limpieza aquí no es estándar, se adapta a cada entorno. Nos ajustamos a la disponibilidad del cliente, al tipo de propiedad y a la dinámica de cada espacio.',
                'intro' => 'Los Angeles requiere cobertura amplia y ejecución consistente. Los espacios necesitan un servicio que responda tanto a servicio residencial, operación comercial y limpieza especializada tras construcción. Nuestro enfoque está diseñado para cubrir esas tres líneas de servicio de forma completa.',
                'services_intro' => 'Cobertura completa de limpieza en Los Angeles para distintos tipos de espacios.',
                'why_us' => ['Capacidad operativa', 'Adaptación por tipo de espacio', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Cobertura integral en toda la ciudad',
                'diff_desc' => 'Los Angeles requiere un servicio capaz de operar en distintos entornos sin perder consistencia.',
                'diff_items' => ['Adaptación por zona', 'Respuesta a diferentes tipos de propiedad', 'Operación continua', 'Control del espacio en cualquier entorno'],
                'coverage' => 'Operamos en Los Angeles y sectores clave dentro de Los Angeles County, respondiendo a distintos ritmos y necesidades del espacio.',
                'local_msg' => 'En Los Angeles, cada espacio requiere una solución específica.',
                'seo' => 'Servicios de limpieza en Los Angeles con cobertura residencial, comercial y post-construcción.',
                'final_msg' => 'La limpieza en Los Angeles requiere estructura, alcance y consistencia.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y listo para cualquier entorno. Solicita tu estimado gratuito hoy.'
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
