<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaBSeeder extends Seeder
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

        // Find existing Zone B (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-b')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'Montebello',
                'zip_codes' => '90640',
                'h1' => 'Servicios Profesionales de Limpieza en Montebello',
                'hero' => 'Montebello combina zonas residenciales con actividad comercial activa en ejes como Whittier Blvd, donde los espacios requieren limpieza continua para mantenerse funcionales. Azamora Cleaning Group ofrece un servicio diseñado para responder a esa mezcla, manteniendo orden, limpieza y control tanto en hogares como en entornos de trabajo. La limpieza aquí permite que el espacio se mantenga operativo y presentable al mismo tiempo.',
                'intro' => 'Montebello requiere equilibrio entre orden residencial y funcionamiento comercial. La limpieza debe adaptarse a ambos entornos sin perder consistencia. Nuestro servicio está diseñado para responder a esa dinámica.',
                'services_intro' => 'Soluciones de limpieza en Montebello para entornos combinados.',
                'why_us' => ['Adaptación a entornos combinados', 'Resultados consistentes', 'Organización funcional', 'Ejecución profesional'],
                'diff_title' => 'Limpieza diseñada para entornos combinados',
                'diff_desc' => 'Montebello requiere soluciones flexibles.',
                'diff_items' => ['Adaptación a uso residencial y comercial', 'Control de áreas activas', 'Limpieza continua', 'Orden funcional'],
                'coverage' => 'Atendemos Montebello y áreas cercanas dentro de Los Angeles County, adaptándonos al ritmo dinámico de la zona.',
                'local_msg' => 'En Montebello, el espacio debe funcionar tanto para vivir como para operar.',
                'seo' => 'Servicios de limpieza en Montebello enfocados en entornos combinados.',
                'final_msg' => 'Un espacio limpio facilita cualquier tipo de actividad.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y listo para cualquier actividad. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Downey',
                'zip_codes' => '90240, 90241, 90242',
                'h1' => 'Servicios Profesionales de Limpieza en Downey',
                'hero' => 'Downey mantiene un flujo constante entre zonas residenciales y áreas comerciales como Firestone Blvd, donde la actividad diaria exige espacios organizados. Azamora Cleaning Group ofrece un servicio enfocado en sostener orden, claridad y funcionalidad en entornos activos. La limpieza aquí permite mantener control en medio del movimiento constante.',
                'intro' => 'Downey requiere limpieza que acompañe su ritmo. Los espacios necesitan mantenimiento que sostenga orden sin frenar la operación diaria. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en Downey para espacios dinámicos.',
                'why_us' => ['Enfoque dinámico', 'Resultados consistentes', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza alineada al ritmo del entorno',
                'diff_desc' => 'Downey exige continuidad.',
                'diff_items' => ['Mantenimiento constante', 'Control de áreas activas', 'Orden funcional', 'Respuesta rápida'],
                'coverage' => 'Cobertura en Downey y sectores cercanos dentro de Los Angeles County, respondiendo a entornos de movimiento constante.',
                'local_msg' => 'En Downey, el orden permite sostener el ritmo del día.',
                'seo' => 'Servicios de limpieza en Downey enfocados en entornos activos.',
                'final_msg' => 'El orden permite mantener la operación sin interrupciones.',
                'cta_final' => 'Mantén tu espacio limpio y en funcionamiento constante. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Rowland Heights',
                'zip_codes' => '91748, 91789',
                'h1' => 'Servicios Profesionales de Limpieza en Rowland Heights',
                'hero' => 'Rowland Heights destaca por su mezcla de zonas residenciales y centros comerciales activos en ejes como Colima Rd. Azamora Cleaning Group ofrece un servicio diseñado para mantener orden, limpieza y control en espacios que combinan vida diaria y actividad comercial. La limpieza aquí permite mantener equilibrio entre ambos entornos.',
                'intro' => 'Rowland Heights requiere flexibilidad. Los espacios necesitan limpieza que se adapte a diferentes usos sin perder consistencia. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en Rowland Heights para entornos de uso diverso.',
                'why_us' => ['Adaptación a diferentes entornos', 'Resultados consistentes', 'Orden funcional', 'Ejecución profesional'],
                'diff_title' => 'Limpieza adaptable a múltiples usos',
                'diff_desc' => 'Rowland Heights combina distintos tipos de espacios.',
                'diff_items' => ['Adaptación a entornos mixtos', 'Control de áreas activas', 'Mantenimiento continuo', 'Organización funcional'],
                'coverage' => 'Servicio disponible en Rowland Heights y alrededores dentro de Los Angeles County, con enfoque en espacios de uso continuo.',
                'local_msg' => 'En Rowland Heights, el espacio debe responder a diferentes usos.',
                'seo' => 'Servicios de limpieza en Rowland Heights enfocados en entornos de uso diverso.',
                'final_msg' => 'El equilibrio del espacio depende de su organización.',
                'cta_final' => 'Mantén tu espacio limpio y preparado para cualquier actividad. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'City of Industry',
                'zip_codes' => '91714, 91715, 91716',
                'h1' => 'Servicios de Limpieza Profesional en City of Industry',
                'hero' => 'City of Industry concentra operaciones industriales, almacenes y espacios donde la continuidad del trabajo es esencial. Azamora Cleaning Group ofrece un servicio diseñado para mantener instalaciones limpias, organizadas y bajo control en entornos de alta actividad. La limpieza aquí no es estética, es parte del funcionamiento del espacio.',
                'intro' => 'City of Industry requiere limpieza integrada a la actividad del espacio. Los entornos deben mantenerse organizados, despejados y funcionales en zonas donde hay movimiento constante de personal, mercancía y operación logística. Nuestro servicio se integra a la operación del espacio sin afectar procesos, tiempos ni actividades en curso.',
                'services_intro' => 'Soluciones de limpieza para entornos industriales, comerciales y operativos.',
                'why_us' => ['Capacidad operativa', 'Resultados consistentes', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en entornos industriales activos',
                'diff_desc' => 'City of Industry exige control en espacios donde la operación no se detiene.',
                'diff_items' => ['Control de áreas de trabajo', 'Gestión de zonas de tránsito', 'Mantenimiento en áreas de carga y almacenamiento', 'Orden continuo en espacios operativos'],
                'coverage' => 'Atendemos City of Industry y su entorno inmediato dentro del corredor industrial del este de Los Angeles County, cubriendo instalaciones logísticas, zonas de almacenamiento y espacios de operación activa en áreas cercanas.',
                'local_msg' => 'En City of Industry, el orden impacta directamente en la operación.',
                'seo' => 'Servicios de limpieza en City of Industry enfocados en entornos industriales, almacenes, centros de distribución y espacios comerciales.',
                'final_msg' => 'La limpieza permite que la operación continúe sin interrupciones.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en funcionamiento. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Long Beach',
                'zip_codes' => '90802, 90803, 90804, 90805, 90806, 90807, 90808, 90810, 90813, 90814, 90815',
                'h1' => 'Servicios Profesionales de Limpieza en Long Beach',
                'hero' => 'Long Beach combina zonas residenciales, actividad portuaria y áreas comerciales activas donde los espacios requieren mantenimiento constante. Azamora Cleaning Group ofrece un servicio diseñado para mantener orden, limpieza y funcionalidad en entornos diversos. La limpieza aquí permite sostener equilibrio entre diferentes usos del espacio.',
                'intro' => 'Long Beach requiere versatilidad. Los espacios necesitan limpieza que se adapte a diferentes entornos sin perder consistencia. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en Long Beach para espacios mixtos y dinámicos.',
                'why_us' => ['Adaptación a distintos entornos', 'Resultados consistentes', 'Ejecución eficiente', 'Enfoque profesional'],
                'diff_title' => 'Limpieza adaptable a múltiples entornos',
                'diff_desc' => 'Long Beach requiere flexibilidad.',
                'diff_items' => ['Adaptación a distintos usos', 'Control de áreas activas', 'Mantenimiento continuo', 'Organización funcional'],
                'coverage' => 'Atendemos Long Beach y zonas próximas dentro de Los Angeles County, adaptándonos a entornos amplios y diversos.',
                'local_msg' => 'En Long Beach, el espacio debe responder a diferentes necesidades.',
                'seo' => 'Servicios de limpieza en Long Beach enfocados en espacios diversos.',
                'final_msg' => 'Un espacio limpio permite adaptarse a diferentes necesidades.',
                'cta_final' => 'Mantén tu espacio limpio y preparado para cualquier actividad. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'El Segundo',
                'zip_codes' => '90245',
                'h1' => 'Servicios Profesionales de Limpieza en El Segundo',
                'hero' => 'El Segundo combina oficinas corporativas, actividad empresarial y zonas residenciales cercanas a centros de trabajo. Azamora Cleaning Group ofrece un servicio enfocado en mantener espacios organizados, limpios y listos para operación continua. La limpieza aquí contribuye directamente al funcionamiento profesional del entorno.',
                'intro' => 'El Segundo requiere precisión. Los espacios necesitan limpieza que mantenga estándares altos en entornos profesionales. Nuestro servicio está diseñado para responder a esa exigencia.',
                'services_intro' => 'Soluciones de limpieza en El Segundo para espacios corporativos y residenciales.',
                'why_us' => ['Ejecución precisa', 'Resultados consistentes', 'Adaptación al entorno profesional', 'Enfoque estructurado'],
                'diff_title' => 'Limpieza alineada a entornos corporativos',
                'diff_desc' => 'El Segundo requiere estándares definidos.',
                'diff_items' => ['Cumplimiento de procesos', 'Control del detalle', 'Orden profesional', 'Consistencia operativa'],
                'coverage' => 'Cobertura en El Segundo y áreas cercanas dentro de Los Angeles County, alineada a espacios que requieren precisión operativa.',
                'local_msg' => 'En El Segundo, la limpieza forma parte del entorno profesional.',
                'seo' => 'Servicios de limpieza en El Segundo enfocados en entornos corporativos.',
                'final_msg' => 'La limpieza sostiene el estándar profesional.',
                'cta_final' => 'Mantén tu espacio limpio y listo para operar. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Burbank',
                'zip_codes' => '91501, 91502, 91504, 91505, 91506',
                'h1' => 'Servicios Profesionales de Limpieza en Burbank',
                'hero' => 'Burbank integra producción audiovisual, oficinas creativas y zonas residenciales activas, donde los espacios requieren mantenimiento constante. Azamora Cleaning Group ofrece un servicio diseñado para sostener orden, limpieza y funcionalidad en entornos dinámicos. La limpieza aquí permite mantener control en espacios de trabajo y vida diaria.',
                'intro' => 'Burbank requiere consistencia. Los espacios necesitan limpieza que se adapte a entornos creativos y operativos sin perder control. Nuestro servicio responde a esa dinámica.',
                'services_intro' => 'Soluciones de limpieza en Burbank para espacios dinámicos.',
                'why_us' => ['Adaptación a entornos creativos', 'Resultados consistentes', 'Ejecución eficiente', 'Enfoque profesional'],
                'diff_title' => 'Limpieza adaptada a entornos dinámicos',
                'diff_desc' => 'Burbank combina múltiples usos.',
                'diff_items' => ['Adaptación a distintos espacios', 'Control de áreas activas', 'Operación continua', 'Orden funcional'],
                'coverage' => 'Servicio en Burbank y zonas cercanas dentro de Los Angeles County, adaptado a entornos dinámicos y en constante actividad.',
                'local_msg' => 'En Burbank, el espacio debe responder a un ritmo creativo y operativo.',
                'seo' => 'Servicios de limpieza en Burbank enfocados en entornos creativos.',
                'final_msg' => 'La organización sostiene entornos productivos.',
                'cta_final' => 'Mantén tu espacio limpio y preparado para cada uso. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Glendale',
                'zip_codes' => '91201, 91202, 91203, 91204, 91205, 91206, 91207, 91208, 91214',
                'h1' => 'Servicios Profesionales de Limpieza en Glendale',
                'hero' => 'Glendale combina zonas residenciales de alto movimiento con áreas comerciales activas como Brand Blvd. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, limpieza y control en espacios que requieren consistencia. La limpieza aquí permite sostener una imagen cuidada y funcional.',
                'intro' => 'Glendale requiere balance. Los espacios necesitan limpieza que mantenga orden tanto en entornos residenciales como comerciales. Nuestro servicio responde a esa combinación.',
                'services_intro' => 'Soluciones de limpieza en Glendale para espacios de uso combinado.',
                'why_us' => ['Resultados consistentes', 'Adaptación al entorno', 'Orden funcional', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en consistencia del espacio',
                'diff_desc' => 'Glendale requiere control constante.',
                'diff_items' => ['Mantenimiento continuo', 'Control de áreas activas', 'Orden funcional', 'Consistencia operativa'],
                'coverage' => 'Atendemos Glendale y alrededores dentro de Los Angeles County, manteniendo consistencia en espacios de uso diario.',
                'local_msg' => 'En Glendale, la limpieza sostiene imagen y funcionamiento.',
                'seo' => 'Servicios de limpieza en Glendale enfocados en espacios de uso combinado.',
                'final_msg' => 'Mantener el espacio organizado preserva su valor y funcionamiento.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en control. Solicita tu estimado gratuito hoy.'
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
