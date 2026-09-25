<?php

namespace Database\Seeders;

use App\Models\Lang;
use App\Models\Strength;
use App\Models\Indicator;
use App\Models\LandingHome;
use App\Models\Service;
use App\Models\Testimony;
use App\Models\General;
use App\Models\Social;
use App\Models\Category;
use App\Models\Item;
use App\Models\Specialty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NgsSolutionsSeeder extends Seeder
{
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) {
            $lang = Lang::create([
                'name' => 'Español',
                'correlative' => 'es',
                'is_default' => true,
                'status' => true,
                'visible' => true
            ]);
        }

        // 1. CLEAR LEGACY TABLES
        Strength::query()->delete();
        Indicator::query()->delete();
        LandingHome::query()->delete();
        Service::query()->delete();
        Testimony::query()->delete();
        Category::query()->delete();
        Item::query()->delete();
        Specialty::query()->delete();

        // 2. CATEGORIES
        $catAm = Category::create([
            'name' => 'Antenas AM',
            'slug' => 'antenas-am',
            'description' => 'Sistemas antihurto acustomagnéticos de alta sensibilidad',
            'status' => true,
            'visible' => true,
            'lang_id' => $lang->id,
        ]);

        $catRf = Category::create([
            'name' => 'Antenas RF',
            'slug' => 'antenas-rf',
            'description' => 'Sistemas antihurto por radiofrecuencia tradicionales',
            'status' => true,
            'visible' => true,
            'lang_id' => $lang->id,
        ]);

        $catTags = Category::create([
            'name' => 'Tags Rígidos',
            'slug' => 'tags-rigidos',
            'description' => 'Sensores plásticos reutilizables de alta resistencia',
            'status' => true,
            'visible' => true,
            'lang_id' => $lang->id,
        ]);

        $catDeac = Category::create([
            'name' => 'Desactivadores',
            'slug' => 'desactivadores',
            'description' => 'Equipos para neutralizar o retirar sensores en caja',
            'status' => true,
            'visible' => true,
            'lang_id' => $lang->id,
        ]);

        // 3. ITEMS (PRODUCTS)
        $items = [
            [
                'name' => 'Antena Pegasus AM Premium',
                'slug' => 'antena-pegasus-am-premium',
                'summary' => 'Arco antihurto acrílico de alta gama con tecnología acustomagnética y alertas visuales integradas.',
                'description' => 'Antena de seguridad para ingresos comerciales con detección superior de hasta 2.0 metros de ancho. Fabricada en acrílico alemán resistente con luz LED de alarma integrada en la estructura. Calibración digital automática remota.',
                'price' => 1599.00,
                'discount' => 1399.00,
                'final_price' => 1399.00,
                'discount_percent' => 12.5,
                'image' => 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop',
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
                'name' => 'Sensor Ovni Strong RF',
                'slug' => 'sensor-ovni-strong-rf',
                'summary' => 'Tag de radiofrecuencia ultra-resistente con diseño circular plano que impide intentos de forzado físico.',
                'description' => 'Tag de seguridad de 8.2 MHz compatible con antenas RF. Su exclusivo diseño esférico aplanado evita que sea manipulado con cortadores o cuchillas en tiendas de moda.',
                'price' => 0.85,
                'discount' => 0.65,
                'final_price' => 0.65,
                'discount_percent' => 23.5,
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop',
                'category_id' => $catTags->id,
                'is_new' => false,
                'offering' => true,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 5000,
                'score' => 5
            ],
            [
                'name' => 'Sensor Peak AM Super',
                'slug' => 'sensor-peak-am-super',
                'summary' => 'Etiqueta rígida acustomagnética de alta sensibilidad ideal para prendas delicadas y calzado.',
                'description' => 'Sensor especial para tiendas de moda con tecnología de 58 KHz AM. Ofrece el máximo rango de detección con antenas acustomagnéticas sin maltratar las telas finas de ropa y calzado premium.',
                'price' => 1.10,
                'discount' => 0.90,
                'final_price' => 0.90,
                'discount_percent' => 18.1,
                'image' => 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=600&auto=format&fit=crop',
                'category_id' => $catTags->id,
                'is_new' => true,
                'offering' => false,
                'recommended' => true,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 3500,
                'score' => 5
            ],
            [
                'name' => 'Desactivador Digital AM Ultra',
                'slug' => 'desactivador-digital-am-ultra',
                'summary' => 'Desactivador electrónico de mesa con retroalimentación sonora y gran velocidad de escaneo.',
                'description' => 'Equipo de desactivación de etiquetas adhesivas AM en cajas de cobro. Cuenta con indicación de estado visual y sonora en tiempo real. Optimiza la velocidad de atención al cliente.',
                'price' => 350.00,
                'discount' => 299.00,
                'final_price' => 299.00,
                'discount_percent' => 14.5,
                'image' => 'https://images.unsplash.com/photo-1601597111158-2fceff270190?q=80&w=600&auto=format&fit=crop',
                'category_id' => $catDeac->id,
                'is_new' => false,
                'offering' => true,
                'recommended' => false,
                'featured' => true,
                'visible' => true,
                'status' => true,
                'stock' => 15,
                'score' => 4
            ]
        ];

        foreach ($items as $item) {
            Item::create($item);
        }

        // 4. LANDING HOME SECTIONS
        $landings = [
            [
                'correlative' => 'page_home_hero',
                'title' => 'Protege tu negocio con tecnología **EAS de confianza**',
                'subtitle' => 'Sistemas Antihurto EAS',
                'description' => 'Soluciones de seguridad retail sin intermediarios. Provisión, instalación, soporte técnico y capacitación garantizada a nivel nacional.',
                'image' => null,
                'video' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_mensaje',
                'title' => 'Protegemos lo que con esfuerzo **has construido**',
                'subtitle' => 'Quiénes Somos',
                'description' => 'En NGS Solutions, combinamos innovación tecnológica y un equipo de ingeniería calificado para resguardar tus activos. Ofrecemos una presencia sólida y honesta, trabajando de forma directa para retail, almacenes y comercios en todo el país.',
                'image' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_enfoque',
                'title' => 'Por Qué **NGS Solutions**',
                'subtitle' => 'Diferenciación NGS',
                'description' => 'Ofrecemos soluciones directas, honestas y de alta tecnología para la protección de tu retail en todo el Perú.',
                'image' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_services',
                'title' => 'Soluciones Tecnológicas **Antihurto**',
                'subtitle' => 'Nuestras Soluciones',
                'description' => 'Equipamiento de última generación AM y RF adaptado a las necesidades específicas de tu sector de retail o comercio.',
                'image' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_testimonies',
                'title' => 'Lo que dicen **nuestros clientes**',
                'subtitle' => 'Testimonios',
                'description' => 'Superintendentes de prevención de pérdidas y gerentes comerciales avalan nuestra efectividad.',
                'image' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_staff',
                'title' => 'Ingeniería y Soporte de **Nivel Nacional**',
                'subtitle' => 'Equipo Técnico',
                'description' => 'Contamos con un equipo de ingenieros y técnicos especializados listos para atenderte en cualquier región del Perú. Ofrecemos instalación profesional, calibración fina y mantenimiento preventivo para garantizar que tu inversión funcione al 100% todos los días.',
                'image' => null,
                'lang_id' => $lang->id,
            ],
            [
                'correlative' => 'page_home_aliados',
                'title' => 'Empresas que **confían en nosotros**',
                'subtitle' => 'Nuestros Aliados',
                'description' => '¿Quieres optimizar la prevención de pérdidas en tu negocio?',
                'image' => null,
                'lang_id' => $lang->id,
            ]
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
                'lang_id' => $ld['lang_id'],
            ]);
        }

        // 5. SERVICES (5 items)
        $brainPath = 'C:/Users/asus/.gemini/antigravity/brain/a8836e24-5c70-4ba7-a44a-f64a5ef962d6';
        $destPath = storage_path('app/images/service');

        if (!file_exists($destPath)) {
            mkdir($destPath, 0755, true);
        }

        $mappings = [
            'provision' => 'eas_supplies_tags*.png',
            'antenas' => 'eas_antennas*.png',
            'soporte' => 'eas_support*.png',
            'capacitacion' => 'eas_training*.png',
            'consultoria' => 'eas_consulting*.png'
        ];

        $imagesSeeded = [];

        foreach ($mappings as $key => $pattern) {
            $files = glob($brainPath . '/' . $pattern);
            if (!empty($files)) {
                $srcFile = end($files);
                $fileName = $key . '.png';
                $destFile = $destPath . '/' . $fileName;
                copy($srcFile, $destFile);
                $imagesSeeded[$key] = $fileName;
            } else {
                $imagesSeeded[$key] = null;
            }
        }

        $services = [
            [
                'title' => 'Provisión de Suministros EAS',
                'description' => 'Etiquetas adhesivas, tags rígidos, pines, acopladores y desactivadores de alta calidad compatibles con sistemas AM y RF. Aseguramos stock permanente para tu operación sin intermediarios.',
                'characteristics' => ['Tags rígidos ultra resistentes', 'Etiquetas AM y RF de máxima detección', 'Desactivadores y desacopladores de alta velocidad'],
                'image_key' => 'provision',
            ],
            [
                'title' => 'Implementación de Antenas y Arcos',
                'description' => 'Instalación profesional de antenas antihurto AM y RF con diseños modernos y elegantes que se integran a la estética de tu tienda sin obstaculizar el flujo de clientes.',
                'characteristics' => ['Antenas acrílicas premium', 'Calibración digital antinterferencia', 'Diseño minimalista y moderno'],
                'image_key' => 'antenas',
            ],
            [
                'title' => 'Soporte Técnico Especializado',
                'description' => 'Asistencia rápida con cobertura nacional. Realizamos mantenimiento preventivo y correctivo para asegurar la operatividad y calibración óptima de tus sistemas antihurto.',
                'characteristics' => ['Técnicos locales en cada departamento', 'Mantenimiento preventivo programado', 'Respuesta de soporte ágil'],
                'image_key' => 'soporte',
            ],
            [
                'title' => 'Capacitación al Personal',
                'description' => 'Formación especializada para tus equipos de seguridad y prevención de pérdidas, asegurando el uso correcto de los sistemas y la reducción de robos internos y externos.',
                'characteristics' => ['Instrucción práctica in-situ', 'Manuales y guías de mejores prácticas', 'Optimización de protocolos de prevención'],
                'image_key' => 'capacitacion',
            ],
            [
                'title' => 'Consultoría EAS a Medida',
                'description' => 'Analizamos la infraestructura de tu tienda y los puntos críticos de vulnerabilidad para diseñar un sistema óptimo y costo-eficiente que maximice tu retorno de inversión.',
                'characteristics' => ['Análisis de riesgos y vulnerabilidad', 'Diseño de soluciones personalizadas', 'Retorno de inversión garantizado'],
                'image_key' => 'consultoria',
            ]
        ];

        foreach ($services as $i => $srv) {
            $imgName = isset($imagesSeeded[$srv['image_key']]) ? $imagesSeeded[$srv['image_key']] : null;
            Service::create([
                'title' => $srv['title'],
                'description' => $srv['description'],
                'image' => $imgName,
                'characteristics' => $srv['characteristics'],
                'visible' => true,
                'status' => true,
                'slug' => Str::slug($srv['title']),
                'lang_id' => $lang->id,
                'order_index' => $i,
            ]);
        }

        // 6. STRENGTHS (differentiators)
        $strengths = [
            [
                'name' => 'Técnicos Descentralizados',
                'description' => 'Contamos con personal técnico calificado en cada departamento del Perú para una respuesta inmediata y local.'
            ],
            [
                'name' => 'Postventa Garantizada',
                'description' => 'Acompañamos a tu negocio con soporte continuo, capacitaciones a tu personal y auditorías periódicas de tus sistemas.'
            ],
            [
                'name' => 'Desarrollo a Medida',
                'description' => 'Si no tenemos el equipamiento exacto que requiere tu proyecto, lo importamos o lo desarrollamos para ti.'
            ],
            [
                'name' => 'Trabajo Directo y Honesto',
                'description' => 'Vendemos lo que realmente necesitas. Sin intermediarios, sin revendedores y con total transparencia comercial.'
            ],
            [
                'name' => 'Tecnología Anti-Interferencias',
                'description' => 'Nuestras antenas usan tecnología de última generación AM y RF para evitar falsas alarmas y falsos negativos.'
            ]
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

        // 7. SPECIALTIES (product categories / areas)
        $specialities = [
            [
                'name' => 'Sistemas AM (Acustomagnético)',
                'description' => 'Tecnología de alta penetración y excelente detección ideal para tiendas de ropa, farmacias y ferreterías.'
            ],
            [
                'name' => 'Sistemas RF (Radiofrecuencia)',
                'description' => 'Solución económica y efectiva para supermercados, librerías y retail en general.'
            ],
            [
                'name' => 'Protección de Exhibición',
                'description' => 'Sistemas de seguridad y alarmas interactivas para smartphones, tablets y electrónica en exhibición.'
            ],
            [
                'name' => 'Contadores de Personas',
                'description' => 'Sensores inteligentes para medir el aforo en tiempo real y analizar la conversión de tu tienda.'
            ],
            [
                'name' => 'Accesorios y Tags EAS',
                'description' => 'Etiquetas adhesivas, tags rígidos, pines y desacopladores de máxima resistencia en stock permanente.'
            ]
        ];

        foreach ($specialities as $sp) {
            Specialty::create([
                'name' => $sp['name'],
                'description' => $sp['description'],
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // 8. INDICATORS (stats)
        $indicators = [
            ['symbol' => '+', 'name' => '1,200', 'description' => 'Tiendas Protegidas en Perú'],
            ['symbol' => '', 'name' => '24', 'description' => 'Departamentos con cobertura técnica local'],
            ['symbol' => '+', 'name' => '8', 'description' => 'Años de Operación Directa'],
            ['symbol' => '%', 'name' => '100', 'description' => 'Soporte y Garantía Postventa']
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

        // 9. TESTIMONIES
        $testimonies = [
            [
                'name' => 'Roberto Villanueva',
                'correlative' => 'Jefe de Prevención de Pérdidas - Supermercados del Norte',
                'description' => 'La implementación de las antenas AM Pegasus de NGS Solutions redujo nuestra merma desconocida en un 45% en los primeros tres meses. Su soporte en Chiclayo es excelente.',
                'rating' => 5,
            ],
            [
                'name' => 'Clara Inga',
                'correlative' => 'Gerente de Operaciones - Retail Moda Perú',
                'description' => 'Trabajar de forma directa con NGS nos ha ahorrado costos de intermediación y nos dio acceso a tags rígidos desarrollados a medida para nuestras prendas delicadas.',
                'rating' => 5,
            ],
            [
                'name' => 'Santiago Peralta',
                'correlative' => 'Especificador de Proyectos - Estudio Peralta & Asoc.',
                'description' => 'Como arquitectos de centros comerciales, confiamos la integración de arcos antihurto a NGS por su diseño minimalista que respeta la estética del ingreso comercial.',
                'rating' => 5,
            ]
        ];

        foreach ($testimonies as $t) {
            Testimony::create([
                'name' => $t['name'],
                'correlative' => $t['correlative'],
                'description' => $t['description'],
                'rating' => $t['rating'],
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }

        // 10. GENERALS
        $generals = [
            ['correlative' => 'support_phone', 'name' => 'WhatsApp Comercial', 'description' => '+51 923 274 820'],
            ['correlative' => 'phone_contact', 'name' => 'Teléfono Ventas', 'description' => '+51 957 159 396'],
            ['correlative' => 'support_email', 'name' => 'Email de soporte', 'description' => 'ventas@groupngssolutions.com'],
            ['correlative' => 'email_contact', 'name' => 'Correo de contacto', 'description' => 'ventas@groupngssolutions.com'],
            ['correlative' => 'footer_description', 'name' => 'Descripción del Footer', 'description' => 'Somos tu mejor aliado en soluciones tecnológicas. Especialistas en sistemas antihurto EAS para retail, ofreciendo equipos de última generación, instalación profesional, capacitación y soporte técnico a nivel nacional.'],
            ['correlative' => 'address', 'name' => 'Dirección Principal', 'description' => 'Calle Juanjui 686 - El Agustino - Lima'],
            ['correlative' => 'opening_hours', 'name' => 'Horario de Atención', 'description' => 'De lunes a viernes - 9:00 am a 6:00 pm']
        ];

        foreach ($generals as $g) {
            General::updateOrCreate(
                ['correlative' => $g['correlative']],
                [
                    'name' => $g['name'],
                    'description' => $g['description'],
                    'status' => true,
                    'lang_id' => $lang->id,
                ]
            );
        }

        // 11. SOCIALS
        $socials = [
            ['name' => 'Facebook', 'icon' => 'fab fa-facebook-f', 'link' => 'https://facebook.com/ngssolutions', 'description' => 'Facebook'],
            ['name' => 'Instagram', 'icon' => 'fab fa-instagram', 'link' => 'https://instagram.com/ngssolutions', 'description' => 'Instagram'],
            ['name' => 'LinkedIn', 'icon' => 'fab fa-linkedin-in', 'link' => 'https://linkedin.com/company/ngs-solutions', 'description' => 'LinkedIn']
        ];

        foreach ($socials as $s) {
            Social::updateOrCreate(
                ['name' => $s['name']],
                [
                    'icon' => $s['icon'],
                    'link' => $s['link'],
                    'description' => $s['description'],
                    'visible' => true,
                    'status' => true,
                ]
            );
        }
    }
}
