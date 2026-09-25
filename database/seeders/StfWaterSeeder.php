<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\General;
use App\Models\Indicator;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Service;
use App\Models\Social;
use App\Models\Strength;
use App\Models\Testimony;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StfWaterSeeder extends Seeder
{
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) return;

        // ========== STRENGTHS (8 total: 4 problem cards + 4 differentiators) ==========
        Strength::query()->delete();

        $strengths = [
            // Problem cards (first 4 — used as `benefits` in component)
            ['name' => 'Desperdicio de Combustible y Energía', 'description' => 'Solo 1 mm de incrustación calcárea en una caldera de vapor eleva el consumo de combustible hasta en un 10%. Esto representa miles de dólares en sobrecostos directos de energía al año.'],
            ['name' => 'Obstrucción de Tuberías', 'description' => 'Reducción progresiva del flujo útil y aumento de contrapresión dentro de la red de distribución de agua caliente y vapor.'],
            ['name' => 'Aumento de Costos de Mantenimiento', 'description' => 'Paradas de producción no planificadas y necesidad constante de limpiezas químicas desincrustantes agresivas.'],
            ['name' => 'Reducción de Vida Útil', 'description' => 'Deterioro acelerado de bienes de capital críticos: calderas, intercambiadores de calor y membranas de ósmosis inversa.'],
            // Differentiators (last 4 — used as `strenghts` in component)
            ['name' => 'Ingeniería de Procesos', 'description' => 'Configuraciones calculadas al detalle según curvas de caudal pico y composición analítica de dureza.'],
            ['name' => 'Soporte de Campo Autorizado', 'description' => 'Equipo certificado para puesta en marcha local, programación de cabezales multivías y repuestos rápidos.'],
            ['name' => 'Componentes Certificados', 'description' => 'Válvulas Clack/Fleck, resinas Dowex/Lanxess y tanques con certificación ASME y NSF.'],
            ['name' => 'Costos de Ciclo Optimizados', 'description' => 'Modelos de salmuera racionalizada que minimizan el consumo salino regenerador por volumen de agua tratada.'],
        ];

        foreach ($strengths as $st) {
            Strength::create([
                'name' => $st['name'],
                'description' => $st['description'],
                'image' => null,
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // ========== INDICATORS (4 metrics) ==========
        Indicator::where('status', true)->delete();

        $indicators = [
            ['symbol' => '%', 'name' => '85', 'description' => 'Reducción de incrustaciones en calderas'],
            ['symbol' => '%', 'name' => '10-25', 'description' => 'Ahorro en consumo de combustible'],
            ['symbol' => '%', 'name' => '60', 'description' => 'Menos paradas por mantenimiento correctivo'],
            ['symbol' => '', 'name' => '<12 meses', 'description' => 'Retorno de inversión garantizado'],
        ];

        foreach ($indicators as $ind) {
            Indicator::create([
                'symbol' => $ind['symbol'],
                'name' => $ind['name'],
                'description' => $ind['description'],
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // ========== LANDING HOME (8 sections) ==========
        LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $lang->id)->delete();

        $landings = [
            [
                'correlative' => 'page_home_hero',
                'title' => 'REDUZCA INCRUSTACIONES Y MEJORE LA EFICIENCIA DE SU PLANTA',
                'subtitle' => '+15 años de ingeniería en tratamiento de agua industrial',
                'description' => 'Sistemas industriales de ablandamiento de agua diseñados según la necesidad de su proceso. Proteja sus calderas, torres de enfriamiento y equipos críticos con ingeniería de alta especificación.',
                'image' => null,
                'video' => null,
            ],
            [
                'correlative' => 'page_home_mensaje',
                'title' => 'El *Impacto Oculto* del Agua Dura',
                'subtitle' => 'El Problema',
                'description' => 'La acumulación de calcio y magnesio no es solo un problema de mantenimiento; es una fuga constante en la rentabilidad de su operación.',
                'image' => null,
            ],
            [
                'correlative' => 'page_home_enfoque',
                'title' => '*Por Qué* STF Water',
                'subtitle' => 'Nuestra Ventaja',
                'description' => 'No solo proveemos sistemas de suavización: estructuramos propuestas termodinámicas integrales y soporte calificado de diseño hidráulico conforme a la especificación de sus equipos.',
                'image' => null,
            ],
            [
                'correlative' => 'page_home_services',
                'title' => 'Aplicaciones *Críticas* Industriales',
                'subtitle' => 'Sectores',
                'description' => 'Sistemas diseñados en PRFV o acero inoxidable AISI 316, automatizados para cumplir los flujos de su sector productivo.',
                'image' => null,
            ],
            [
                'correlative' => 'page_home_testimonies',
                'title' => 'Garantía *Comprobada* por la Industria',
                'subtitle' => 'Casos de Éxito',
                'description' => 'Superintendentes térmicos y directivos industriales corroboran el óptimo desempeño de nuestros equipos.',
                'image' => null,
            ],
            [
                'correlative' => 'page_home_staff',
                'title' => null,
                'subtitle' => null,
                'description' => null,
                'image' => null,
            ],
            [
                'correlative' => 'page_home_solution',
                'title' => 'Intercambio *Iónico* de Alta Eficiencia',
                'subtitle' => 'Nuestra Solución',
                'description' => json_encode([
                    'intro' => 'Nuestros ablandadores industriales capturan selectivamente el calcio y magnesio en camas de resinas de alto rendimiento, liberando agua 100% libre de dureza.',
                    'items' => [
                        ['title' => 'Agua Blanda de Suministro Continuo', 'description' => 'Arreglos dúplex o tríplex alternantes para asegurar cero interrupciones de flujo en regeneración.'],
                        ['title' => 'Optimización Directa de Energía', 'description' => 'Transferencia de calor limpia en serpentines y placas metálicas libres de sarro, maximizando el rendimiento térmico.'],
                        ['title' => 'Protección de Activos Críticos', 'description' => 'Alargue sustancial del ciclo de servicio de calderas pirotubulares e industriales, eliminando averías prematuras.'],
                    ],
                ]),
                'image' => null,
            ],
            [
                'correlative' => 'page_home_social_proof',
                'title' => 'Sectores que confían en STF Water',
                'subtitle' => null,
                'description' => json_encode(['MINERÍA', 'ALIMENTOS', 'HOTELERÍA', 'HVAC', 'FARMACÉUTICA', 'ENERGÍA']),
                'image' => null,
            ],
        ];

        foreach ($landings as $ld) {
            LandingHome::create([
                'title' => $ld['title'],
                'subtitle' => $ld['subtitle'],
                'description' => $ld['description'],
                'image' => $ld['image'],
                'correlative' => $ld['correlative'],
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // ========== SERVICES (5 applications) ==========
        Service::where('status', true)->where('lang_id', $lang->id)->delete();

        $services = [
            ['title' => 'Cuartos de Calderas', 'description' => 'Ablandamiento continuo con sistemas Duplex Alternantes STF, asegurando agua de reposición a < 1 ppm de dureza 24/7 sin paradas por regeneración.', 'characteristics' => ['Sistemas Duplex Alternantes', '< 1 ppm de dureza constante', 'Caudal típico: 5 - 30 m³/h']],
            ['title' => 'Minería', 'description' => 'Ablandadores de alta resistencia con tanques de PRFV reforzado para ambientes corrosivos y válvulas multivía automatizadas.', 'characteristics' => ['PRFV reforzado grado industrial', 'Válvulas multivía automatizadas', 'Caudal típico: 25 - 150 m³/h']],
            ['title' => 'Alimentos y Bebidas', 'description' => 'Sistemas sanitarios de intercambio iónico con resina catiónica tipo gel aprobada por la FDA y componentes higiénicos de alta purga.', 'characteristics' => ['Resina FDA grado alimenticio', 'Componentes higiénicos sanitarios', 'Caudal típico: 8 - 45 m³/h']],
            ['title' => 'Hotelería y Hospitales', 'description' => 'Ablandador Simplex/Duplex proporcional inteligente con regeneración volumétrica secuencial, ahorrando hasta 30% de sal.', 'characteristics' => ['Regeneración volumétrica inteligente', 'Ahorro de sal hasta 30%', 'Caudal típico: 3 - 20 m³/h']],
            ['title' => 'Sistemas HVAC', 'description' => 'Ablandadores con automatización de regenerador continuo conectado a controladores térmicos o de purga por conductividad.', 'characteristics' => ['Automatización regenerador continuo', 'Control por conductividad', 'Caudal típico: 1 - 15 m³/h']],
        ];

        foreach ($services as $i => $srv) {
            Service::create([
                'title' => $srv['title'],
                'description' => $srv['description'],
                'image' => null,
                'characteristics' => $srv['characteristics'],
                'visible' => true,
                'status' => true,
                'slug' => Str::slug($srv['title']),
                'lang_id' => $lang->id,
                'order_index' => $i,
            ]);
        }

        // ========== TESTIMONIES (3) ==========
        Testimony::where('status', true)->where('lang_id', $lang->id)->delete();

        $testimonies = [
            ['name' => 'Ing. Alejandro Silva', 'correlative' => 'Superintendente - Cervecería Industrial del Sur', 'description' => 'Redujimos las purgas de nuestras calderas de vapor en un 35% en solo una semana de comisionar el ablandador duplex alternante de STF Water. El ahorro de energía amortizó la inversión en los primeros 8 meses.', 'rating' => 5],
            ['name' => 'Dra. Marina Fuentes', 'correlative' => 'Directora HVAC - Corporativo Metrópoli', 'description' => 'El ablandador Triplex de alta frecuencia protege la batería de chillers de nuestro corporativo. Desde su arranque las mediciones señalan 0 ppm constantes, erradicando las limpiezas químicas agresivas.', 'rating' => 5],
            ['name' => 'Ing. Carlos Mendoza', 'correlative' => 'Jefe de Planta - Procesadora Pampa Orgánica', 'description' => 'La asesoría e ingeniería previa resolvió nuestra incógnita en la captación de agua dura de pozo que superaba las 600 ppm. La unidad de resina FDA opera de forma proporcional inteligente reduciendo al mínimo el gasto de salmuera.', 'rating' => 5],
        ];

        foreach ($testimonies as $tc) {
            Testimony::create([
                'name' => $tc['name'],
                'correlative' => $tc['correlative'],
                'description' => $tc['description'],
                'rating' => $tc['rating'],
                'image' => null,
                'image_secondary' => null,
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // ========== CERTIFICATIONS (4) ==========
        Certification::where('status', true)->where('lang_id', $lang->id)->delete();

        $certifications = [
            ['title' => 'ASME & NSF Standard', 'description' => 'Resinas e inertes certificados para uso continuo alimentario e industrial de alta temperatura.'],
            ['title' => 'Asistencia y Comisión', 'description' => 'Puesta en marcha por ingenieros especializados en control de automatización de regenerados.'],
            ['title' => 'Prueba Inicial Gratis', 'description' => 'Fisicoquímico básico de dureza inicial para configurar el volumen exacto del lecho de resina.'],
            ['title' => 'Consumibles & Repuestos', 'description' => 'Suministro garantizado de sal pellet de alta pureza y material de repuesto de válvulas alternantes.'],
        ];

        foreach ($certifications as $cert) {
            Certification::create([
                'title' => $cert['title'],
                'description' => $cert['description'],
                'image' => null,
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // ========== GENERALS ==========
        $generalData = [
            ['correlative' => 'support_phone', 'name' => 'Teléfono de soporte', 'description' => '+51 999 888 777'],
            ['correlative' => 'support_email', 'name' => 'Email de soporte', 'description' => 'ingenieria@stfwater.com'],
            ['correlative' => 'footer_description', 'name' => 'Footer Description', 'description' => 'STF Water es la división de ingeniería de procesos hídricos líder en América Latina. Proveemos ablandadores, filtración multimedia y ósmosis de rango industrial pesado.'],
            ['correlative' => 'address', 'name' => 'Dirección', 'description' => 'Av. Mariscal La Mar, 638 - Miraflores, Lima'],
            ['correlative' => 'whatsapp_advisors', 'name' => 'WhatsApp Advisors', 'description' => json_encode([
                ['name' => 'Asesor Técnico', 'phone' => '+51999888777', 'message' => 'Hola, quiero información sobre soluciones de ablandamiento STF Water para mi planta.', 'position' => 'Ingeniero de Procesos'],
            ])],
        ];

        foreach ($generalData as $data) {
            General::updateOrCreate(
                ['correlative' => $data['correlative']],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'status' => true,
                    'lang_id' => $lang->id,
                ]
            );
        }

        // ========== SOCIALS ==========
        $socials = [
            ['name' => 'STF Water Facebook', 'icon' => 'fab fa-facebook-f', 'link' => '#', 'description' => 'Facebook'],
            ['name' => 'STF Water Instagram', 'icon' => 'fab fa-instagram', 'link' => '#', 'description' => 'Instagram'],
            ['name' => 'STF Water LinkedIn', 'icon' => 'fab fa-linkedin-in', 'link' => '#', 'description' => 'LinkedIn'],
        ];

        foreach ($socials as $social) {
            Social::updateOrCreate(
                ['icon' => $social['icon']],
                [
                    'name' => $social['name'],
                    'description' => $social['description'],
                    'link' => $social['link'],
                    'visible' => true,
                    'status' => true,
                ]
            );
        }

        $this->command->info('STF Water data seeded successfully!');
    }
}
