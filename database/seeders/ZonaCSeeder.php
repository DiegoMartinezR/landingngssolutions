<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaCSeeder extends Seeder
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

        // Find existing Zone C (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-c')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'Hollywood',
                'zip_codes' => '90027, 90028, 90038',
                'h1' => 'Servicios de Limpieza Profesional en Hollywood',
                'hero' => 'Hollywood representa un entorno dinámico donde la imagen, el ritmo y la presentación del espacio son determinantes. Azamora Cleaning Group ofrece un servicio diseñado para mantener espacios impecables en entornos donde cada detalle cuenta. Aquí la limpieza no es mantenimiento básico, forma parte del nivel y la percepción del espacio. El servicio se ajusta a la dinámica del entorno y a las exigencias específicas de cada cliente.',
                'intro' => 'Hollywood exige consistencia visual. Los espacios deben mantenerse limpios, organizados y listos en todo momento. Nuestro servicio está enfocado en sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza en Hollywood para espacios de alto estándar.',
                'why_us' => ['Ejecución discreta', 'Resultados uniformes', 'Cuidado del detalle', 'Enfoque profesional'],
                'diff_title' => 'Limpieza alineada a la imagen del espacio',
                'diff_desc' => 'Hollywood requiere precisión.',
                'diff_items' => ['Preservar presentación', 'Cuidar acabados', 'Mantener orden visual', 'Sostener consistencia'],
                'coverage' => 'Atendemos Hollywood y sectores estratégicos dentro de Los Angeles County, enfocados en entornos de alta visibilidad.',
                'local_msg' => 'En Hollywood, la imagen del espacio lo es todo.',
                'seo' => 'Servicios de limpieza en Hollywood enfocados en espacios premium.',
                'final_msg' => 'La limpieza define la percepción del espacio.',
                'cta_final' => 'Mantén tu espacio impecable y listo en todo momento. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'West Hollywood',
                'zip_codes' => '90046, 90048, 90069',
                'h1' => 'Servicios de Limpieza Profesional en West Hollywood',
                'hero' => 'West Hollywood combina diseño, estilo de vida y espacios donde cada detalle es visible. Azamora Cleaning Group ofrece un servicio enfocado en mantener ambientes cuidados, equilibrados y visualmente impecables. La limpieza aquí forma parte del estilo del espacio. Adaptamos el servicio a cada entorno y a las características de cada entorno.',
                'intro' => 'West Hollywood exige coherencia estética. Los espacios deben mantenerse en condiciones que reflejen su diseño y nivel. Nuestro servicio responde a esa exigencia.',
                'services_intro' => 'Soluciones de limpieza en West Hollywood para espacios de alto nivel.',
                'why_us' => ['Cuidado del detalle', 'Ejecución discreta', 'Resultados consistentes', 'Enfoque profesional'],
                'diff_title' => 'Limpieza enfocada en estética del espacio',
                'diff_desc' => 'West Hollywood requiere precisión visual.',
                'diff_items' => ['Cuidado de superficies', 'Orden visual', 'Preservación de acabados', 'Consistencia estética'],
                'coverage' => 'Cobertura activa en West Hollywood y zonas cercanas dentro de Los Angeles County, adaptada a espacios de diseño y estilo.',
                'local_msg' => 'En West Hollywood, el detalle define el espacio.',
                'seo' => 'Servicios de limpieza en West Hollywood enfocados en espacios de diseño.',
                'final_msg' => 'El detalle mantiene el valor del entorno.',
                'cta_final' => 'Mantén tu espacio limpio, cuidado y alineado con su estilo. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Hollywood Hills',
                'zip_codes' => '90068',
                'h1' => 'Servicios de Limpieza Profesional en Hollywood Hills',
                'hero' => 'Hollywood Hills destaca por propiedades privadas, vistas abiertas y espacios donde el confort y la privacidad son esenciales. Azamora Cleaning Group ofrece un servicio enfocado en mantener hogares impecables, discretos y perfectamente organizados. La limpieza aquí es parte del cuidado integral del espacio. El servicio se adapta a cada propiedad y a las necesidades específicas de cada propiedad.',
                'intro' => 'Hollywood Hills requiere atención personalizada. Los espacios deben mantenerse en condiciones que reflejen confort, privacidad y control. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza en Hollywood Hills para propiedades de alto nivel.',
                'why_us' => ['Discreción', 'Precisión', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en privacidad y detalle',
                'diff_desc' => 'Hollywood Hills requiere control total del entorno.',
                'diff_items' => ['Cuidado detallado', 'Mantenimiento constante', 'Orden absoluto', 'Respeto por el espacio'],
                'coverage' => 'Servicio disponible en Hollywood Hills y áreas residenciales exclusivas dentro de Los Angeles County.',
                'local_msg' => 'En Hollywood Hills, la limpieza acompaña el nivel de vida.',
                'seo' => 'Servicios de limpieza en Hollywood Hills enfocados en propiedades premium.',
                'final_msg' => 'El cuidado del espacio refleja su valor.',
                'cta_final' => 'Mantén tu espacio impecable, privado y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Beverly Hills',
                'zip_codes' => '90210, 90211, 90212',
                'h1' => 'Servicios de Limpieza Profesional en Beverly Hills',
                'hero' => 'Beverly Hills representa un estándar elevado donde cada espacio refleja nivel, detalle y presentación. Azamora Cleaning Group ofrece un servicio enfocado en mantener propiedades impecables, cuidadas y perfectamente organizadas. La limpieza aquí es parte del valor del espacio. Ajustamos el servicio a las exigencias de cada espacio y a las exigencias específicas de cada propiedad.',
                'intro' => 'Beverly Hills exige precisión. Los espacios deben mantenerse en condiciones impecables en todo momento. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza en Beverly Hills para propiedades de alto estándar.',
                'why_us' => ['Discreción', 'Precisión', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en perfección del espacio',
                'diff_desc' => 'Beverly Hills requiere excelencia.',
                'diff_items' => ['Cuidado extremo del detalle', 'Preservación de acabados', 'Orden visual impecable', 'Consistencia total'],
                'coverage' => 'Atendemos Beverly Hills y sus alrededores dentro del área de Los Angeles County, adaptándonos a propiedades de alto nivel y diferentes tipos de espacios.',
                'local_msg' => 'En Beverly Hills, el nivel del espacio se mantiene con detalle.',
                'seo' => 'Servicios de limpieza en Beverly Hills enfocados en propiedades de lujo.',
                'final_msg' => 'El detalle define el valor del espacio.',
                'cta_final' => 'Mantén tu propiedad impecable y al más alto nivel. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Bel Air',
                'zip_codes' => '90077',
                'h1' => 'Servicios de Limpieza Profesional en Bel Air',
                'hero' => 'Bel Air se distingue por propiedades privadas, espacios amplios y un entorno donde la discreción es tan importante como la presentación. Azamora Cleaning Group ofrece un servicio diseñado para mantener interiores impecables, organizados y bajo control en propiedades de alto nivel. La limpieza aquí forma parte de la experiencia de privacidad y cuidado del hogar. Nos adaptamos a la disponibilidad de cada cliente y a las necesidades específicas de cada servicio.',
                'intro' => 'Bel Air requiere control, precisión y absoluta consistencia. Los espacios deben mantenerse en orden sin alterar la armonía ni la privacidad del entorno. Nuestro servicio está diseñado para sostener ese estándar.',
                'services_intro' => 'Soluciones de limpieza en Bel Air para propiedades exclusivas.',
                'why_us' => ['Discreción', 'Cuidado del detalle', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en privacidad y control del entorno',
                'diff_desc' => 'Bel Air requiere un enfoque más reservado y preciso.',
                'diff_items' => ['Respeto total por el espacio', 'Cuidado detallado de acabados', 'Orden absoluto en cada ambiente', 'Mantenimiento constante sin interrupciones'],
                'coverage' => 'Cobertura en Bel Air y zonas privadas dentro de Los Angeles County, enfocada en propiedades exclusivas.',
                'local_msg' => 'En Bel Air, la limpieza debe estar a la altura del entorno y de la privacidad del hogar.',
                'seo' => 'Servicios de limpieza en Bel Air enfocados en propiedades exclusivas y mantenimiento discreto.',
                'final_msg' => 'La discreción también define la calidad del servicio.',
                'cta_final' => 'Mantén tu propiedad impecable, organizada y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Brentwood',
                'zip_codes' => '90049',
                'h1' => 'Servicios de Limpieza Profesional en Brentwood',
                'hero' => 'Brentwood combina elegancia residencial, estilo de vida sofisticado y espacios donde el orden visual forma parte del estándar. Azamora Cleaning Group ofrece un servicio diseñado para mantener propiedades cuidadas, armónicas y visualmente impecables. La limpieza aquí refuerza la estética y la calidad del entorno. Nos adaptamos a la disponibilidad de cada cliente y a las necesidades específicas de cada servicio.',
                'intro' => 'Brentwood requiere consistencia visual y cuidado permanente. Los espacios deben mantenerse organizados, limpios y alineados con el nivel del entorno. Nuestro servicio responde a esa expectativa.',
                'services_intro' => 'Soluciones de limpieza en Brentwood para propiedades de alto nivel.',
                'why_us' => ['Cuidado del detalle', 'Resultados consistentes', 'Sensibilidad estética', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en armonía visual del espacio',
                'diff_desc' => 'Brentwood requiere más que limpieza básica.',
                'diff_items' => ['Preservar la estética del entorno', 'Cuidar superficies y acabados', 'Mantener orden visual constante', 'Sostener una presentación impecable'],
                'coverage' => 'Servicio en Brentwood y áreas residenciales cercanas dentro de Los Angeles County, adaptado a entornos de alto nivel.',
                'local_msg' => 'En Brentwood, la limpieza sostiene la armonía del espacio.',
                'seo' => 'Servicios de limpieza en Brentwood enfocados en propiedades premium y mantenimiento detallado.',
                'final_msg' => 'La armonía del espacio también se construye con limpieza.',
                'cta_final' => 'Mantén tu propiedad limpia, cuidada y alineada con su entorno. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Pacific Palisades',
                'zip_codes' => '90272',
                'h1' => 'Servicios de Limpieza Profesional en Pacific Palisades',
                'hero' => 'Pacific Palisades combina tranquilidad, naturaleza y propiedades donde el orden y el cuidado del espacio son parte del estilo de vida. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes impecables, organizados y en equilibrio con su entorno. La limpieza aquí acompaña la calma del hogar. Nos adaptamos a la disponibilidad de cada cliente y a las características de cada espacio.',
                'intro' => 'Pacific Palisades requiere cuidado continuo del espacio con enfoque en detalle. Los espacios deben mantenerse limpios, organizados y en armonía con su entorno. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza diseñadas para propiedades de alto nivel.',
                'why_us' => ['Discreción', 'Consistencia', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza alineada al entorno residencial',
                'diff_desc' => 'Pacific Palisades requiere equilibrio.',
                'diff_items' => ['Orden constante', 'Cuidado de acabados', 'Mantenimiento continuo', 'Control del espacio'],
                'coverage' => 'Cobertura en Pacific Palisades y zonas cercanas dentro de Los Angeles County, respetando la dinámica residencial del entorno.',
                'local_msg' => 'En Pacific Palisades, el orden acompaña la tranquilidad del hogar.',
                'seo' => 'Servicios de limpieza en Pacific Palisades enfocados en propiedades premium.',
                'final_msg' => 'El cuidado del espacio refleja su entorno.',
                'cta_final' => 'Mantén tu propiedad impecable y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Venice',
                'zip_codes' => '90291',
                'h1' => 'Servicios de Limpieza Profesional en Venice',
                'hero' => 'Venice combina vida costera, creatividad y espacios con movimiento constante. Azamora Cleaning Group ofrece un servicio diseñado para mantener limpieza, orden y control sin afectar el estilo del entorno. En este entorno, la limpieza permite mantener el equilibrio y el funcionamiento del espacio. Nos adaptamos a la disponibilidad de cada cliente y a las características de cada espacio.',
                'intro' => 'Venice requiere adaptabilidad. Los espacios necesitan limpieza que responda a un entorno activo y en constante uso. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para espacios dinámicos.',
                'why_us' => ['Adaptabilidad', 'Resultados estables', 'Ejecución eficiente', 'Enfoque profesional'],
                'diff_title' => 'Limpieza alineada a espacios dinámicos',
                'diff_desc' => 'Venice requiere flexibilidad.',
                'diff_items' => ['Control del espacio', 'Operación continua', 'Orden funcional', 'Respuesta flexible'],
                'coverage' => 'Servicio en Venice y áreas próximas dentro de Los Angeles County, adaptado a espacios creativos y de uso constante.',
                'local_msg' => 'En Venice, el orden permite que el espacio fluya.',
                'seo' => 'Servicios de limpieza en Venice enfocados en espacios dinámicos.',
                'final_msg' => 'El orden sostiene el ritmo del entorno.',
                'cta_final' => 'Mantén tu espacio limpio y listo para su uso diario. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Santa Monica',
                'zip_codes' => '90401, 90402, 90403, 90404, 90405',
                'h1' => 'Servicios de Limpieza Profesional en Santa Monica',
                'hero' => 'Santa Monica combina vida costera, propiedades de alto valor y espacios donde la presentación forma parte del estilo de vida. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes impecables, frescos y organizados en entornos donde cada detalle se percibe. La limpieza aquí acompaña el nivel del entorno. Nos adaptamos a la disponibilidad de cada cliente y a las características de cada espacio.',
                'intro' => 'Santa Monica requiere consistencia. Los espacios deben mantenerse limpios, organizados y alineados con su entorno. Nuestro servicio está diseñado para sostener ese nivel.',
                'services_intro' => 'Soluciones de limpieza para espacios de alto estándar.',
                'why_us' => ['Cuidado del detalle', 'Resultados consistentes', 'Ejecución profesional', 'Enfoque estructurado'],
                'diff_title' => 'Limpieza alineada al estándar del entorno',
                'diff_desc' => 'Santa Monica requiere consistencia.',
                'diff_items' => ['Orden visual', 'Cuidado de superficies', 'Mantenimiento continuo', 'Consistencia estética'],
                'coverage' => 'Atendemos Santa Monica y sectores cercanos dentro de Los Angeles County, alineados a espacios de alto estándar.',
                'local_msg' => 'En Santa Monica, la limpieza forma parte del nivel del espacio.',
                'seo' => 'Servicios de limpieza en Santa Monica enfocados en propiedades premium.',
                'final_msg' => 'La limpieza sostiene la calidad del entorno.',
                'cta_final' => 'Mantén tu espacio limpio, fresco y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Malibu',
                'zip_codes' => '90265',
                'h1' => 'Servicios de Limpieza Profesional en Malibu',
                'hero' => 'Malibu combina propiedades frente al mar, vistas abiertas y espacios donde el entorno influye directamente en el estado del hogar. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes limpios, frescos y protegidos frente a condiciones costeras. La limpieza aquí no solo mantiene, también preserva el espacio. El servicio se ajusta a las condiciones de cada propiedad y a las características de cada propiedad.',
                'intro' => 'Malibu requiere control continuo del entorno. Los espacios necesitan limpieza que controle humedad, sal y exposición al entorno. Nuestro servicio está diseñado para sostener ese equilibrio.',
                'services_intro' => 'Soluciones de limpieza para propiedades costeras.',
                'why_us' => ['Especialización', 'Resultados consistentes', 'Cuidado del detalle', 'Ejecución profesional'],
                'diff_title' => 'Limpieza adaptada a entorno costero',
                'diff_desc' => 'Malibu requiere protección ambiental.',
                'diff_items' => ['Protección de superficies', 'Control ambiental', 'Mantenimiento frecuente', 'Preservación del espacio'],
                'coverage' => 'Atendemos Malibu y zonas costeras dentro de Los Angeles County, con enfoque en propiedades expuestas al entorno marino.',
                'local_msg' => 'En Malibu, el entorno define el cuidado del espacio.',
                'seo' => 'Servicios de limpieza en Malibu enfocados en propiedades costeras.',
                'final_msg' => 'La limpieza protege el valor del espacio.',
                'cta_final' => 'Mantén tu propiedad limpia, protegida y en equilibrio. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Manhattan Beach',
                'zip_codes' => '90266',
                'h1' => 'Servicios de Limpieza Profesional en Manhattan Beach',
                'hero' => 'Manhattan Beach combina vida frente al mar, propiedades modernas y espacios donde la limpieza impacta directamente en la experiencia del lugar. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes ordenados, frescos y visualmente impecables. La limpieza aquí refuerza el estilo del espacio. Nos adaptamos a la disponibilidad de cada cliente y a las características de cada propiedad.',
                'intro' => 'Manhattan Beach requiere consistencia. Los espacios deben mantenerse limpios, organizados y alineados con su entorno. Nuestro servicio responde a ese estándar.',
                'services_intro' => 'Soluciones de limpieza para espacios de alto nivel.',
                'why_us' => ['Resultados controlados', 'Cuidado del detalle', 'Sensibilidad estética', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en percepción del espacio',
                'diff_desc' => 'Manhattan Beach requiere consistencia estética.',
                'diff_items' => ['Orden visual constante', 'Cuidado de superficies', 'Mantenimiento frecuente', 'Consistencia estética'],
                'coverage' => 'Atendemos Manhattan Beach y sus alrededores dentro del área de Los Angeles County, adaptándonos a propiedades costeras y diferentes tipos de espacios.',
                'local_msg' => 'En Manhattan Beach, la limpieza define la experiencia del espacio.',
                'seo' => 'Servicios de limpieza en Manhattan Beach enfocados en propiedades premium.',
                'final_msg' => 'La limpieza sostiene la calidad del entorno.',
                'cta_final' => 'Mantén tu espacio limpio, fresco y alineado con su entorno. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Hermosa Beach',
                'zip_codes' => '90254',
                'h1' => 'Servicios de Limpieza Profesional en Hermosa Beach',
                'hero' => 'Hermosa Beach combina vida costera relajada con espacios donde el orden y la limpieza mantienen el equilibrio del entorno. Azamora Cleaning Group ofrece un servicio diseñado para mantener ambientes limpios, organizados y listos para el uso diario. La limpieza aquí acompaña el ritmo del lugar sin interrumpirlo. Nos adaptamos a la disponibilidad de cada cliente y a las características de cada espacio.',
                'intro' => 'Hermosa Beach requiere control continuo del espacio. Los espacios deben mantenerse limpios y organizados en un entorno de uso constante. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza para espacios costeros activos.',
                'why_us' => ['Consistencia', 'Resultados confiables', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza alineada al ritmo del entorno costero',
                'diff_desc' => 'Hermosa Beach requiere equilibrio.',
                'diff_items' => ['Control constante del entorno', 'Gestión eficiente de áreas activas', 'Mantenimiento del orden funcional', 'Continuidad operativa del servicio'],
                'coverage' => 'Servicio disponible en Hermosa Beach y zonas próximas dentro de Los Angeles County, adaptado a entornos costeros activos.',
                'local_msg' => 'En Hermosa Beach, el orden mantiene el equilibrio del espacio.',
                'seo' => 'Servicios de limpieza en Hermosa Beach enfocados en espacios costeros.',
                'final_msg' => 'La limpieza mantiene el ritmo del entorno.',
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
