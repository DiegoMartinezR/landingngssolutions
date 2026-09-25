<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\Lang;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZonaASeeder extends Seeder
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

        // Find existing Zone A (must exist before running this seeder)
        $zone = Zone::where('slug', 'zona-a')
            ->where('lang_id', $langId)
            ->firstOrFail();

        $facilities = [
            [
                'title' => 'Monrovia',
                'zip_codes' => '91016',
                'h1' => 'Servicios Profesionales de Limpieza en Monrovia',
                'hero' => 'En Monrovia, donde predominan hogares familiares, calles residenciales tranquilas y zonas cercanas a las foothills, mantener el espacio limpio forma parte de la rutina diaria. Azamora Cleaning Group ofrece un servicio diseñado para adaptarse a ese ritmo, asegurando orden, claridad y continuidad en cada área del hogar. Aquí la limpieza no interrumpe, se integra a tu día.',
                'intro' => 'En Monrovia, el hogar combina descanso, rutina y actividad diaria. La limpieza debe sostener orden sin interrumpir el funcionamiento del espacio. Nuestro servicio se enfoca en mantener ese equilibrio de forma constante.',
                'services_intro' => 'Soluciones de limpieza en Monrovia diseñadas para hogares en uso continuo.',
                'why_us' => ['Rutinas claras de trabajo', 'Resultados consistentes', 'Adaptación al ritmo del hogar', 'Ejecución profesional'],
                'diff_title' => 'Limpieza integrada a la rutina diaria',
                'diff_desc' => 'En Monrovia, el objetivo es mantener el hogar funcional sin interrupciones.',
                'diff_items' => ['Control de áreas de uso frecuente', 'Reducción de acumulación', 'Mantenimiento continuo', 'Orden práctico'],
                'coverage' => 'Atendemos Monrovia y zonas cercanas dentro de Los Angeles County, cubriendo áreas residenciales alrededor.',
                'local_msg' => 'En Monrovia, un hogar organizado facilita el día a día.',
                'seo' => 'Servicios de limpieza en Monrovia enfocados en mantenimiento residencial continuo.',
                'final_msg' => 'La constancia mantiene el hogar en equilibrio.',
                'cta_final' => 'Mantén tu hogar limpio y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Pasadena',
                'zip_codes' => '91101, 91103, 91104, 91105, 91106, 91107',
                'h1' => 'Servicios Profesionales de Limpieza en Pasadena',
                'hero' => 'En Pasadena, donde destacan viviendas bien conservadas, zonas residenciales establecidas y áreas como Old Pasadena y South Lake, la limpieza forma parte del estándar del entorno. Azamora Cleaning Group ofrece un servicio enfocado en mantener ese nivel, cuidando presentación, detalle y consistencia en cada espacio. Aquí la limpieza refleja el estado del hogar.',
                'intro' => 'En Pasadena, el estado del espacio es visible. La limpieza debe mantener estética, orden y presentación en cada área del hogar. Nuestro servicio responde a ese estándar.',
                'services_intro' => 'Soluciones de limpieza en Pasadena enfocadas en cuidado y presentación del espacio.',
                'why_us' => ['Enfoque en detalle', 'Resultados visibles', 'Consistencia en acabados', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en presentación',
                'diff_desc' => 'En Pasadena, la limpieza debe sostener la imagen del espacio.',
                'diff_items' => ['Cuidado de superficies', 'Orden visual', 'Acabados limpios', 'Consistencia en cada servicio'],
                'coverage' => 'Atendemos Pasadena y su entorno dentro de Los Angeles County, con cobertura en comunidades cercanas.',
                'local_msg' => 'En Pasadena, el estado del hogar se nota.',
                'seo' => 'Servicios de limpieza en Pasadena enfocados en mantenimiento detallado.',
                'final_msg' => 'La limpieza sostiene la imagen del hogar.',
                'cta_final' => 'Mantén tu espacio al nivel que merece. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Arcadia',
                'zip_codes' => '91006, 91007',
                'h1' => 'Servicios Profesionales de Limpieza en Arcadia',
                'hero' => 'En Arcadia, donde predominan viviendas amplias y zonas residenciales cercanas a áreas como Santa Anita y Baldwin Ave, el tamaño del espacio exige organización constante. Azamora Cleaning Group ofrece un servicio estructurado para mantener orden, control y funcionalidad en cada área. Aquí la limpieza permite aprovechar mejor el espacio.',
                'intro' => 'En Arcadia, los espacios amplios requieren control. La limpieza debe ser organizada para mantener cada área en condiciones consistentes.',
                'services_intro' => 'Soluciones de limpieza en Arcadia diseñadas para espacios grandes y activos.',
                'why_us' => ['Trabajo estructurado', 'Control por áreas', 'Resultados consistentes', 'Ejecución profesional'],
                'diff_title' => 'Limpieza estructurada para espacios amplios',
                'diff_desc' => 'En Arcadia, el orden depende de cómo se organiza la limpieza.',
                'diff_items' => ['Dividir el trabajo por zonas', 'Mantener consistencia', 'Optimizar tiempos', 'Sostener control general'],
                'coverage' => 'Atendemos Arcadia y áreas vecinas dentro de Los Angeles County, abarcando zonas residenciales cercanas.',
                'local_msg' => 'En Arcadia, el control del espacio es clave.',
                'seo' => 'Servicios de limpieza en Arcadia para hogares amplios.',
                'final_msg' => 'El orden permite aprovechar el espacio.',
                'cta_final' => 'Mantén cada área limpia y organizada. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Alhambra',
                'zip_codes' => '91801, 91803',
                'h1' => 'Servicios Profesionales de Limpieza en Alhambra',
                'hero' => 'En Alhambra, donde la actividad comercial en Valley Blvd y Main St se combina con zonas residenciales activas, mantener los espacios limpios es parte del funcionamiento diario. Azamora Cleaning Group ofrece un servicio diseñado para sostener orden, claridad y control en entornos con uso constante. Aquí la limpieza permite que todo funcione sin interrupciones.',
                'intro' => 'En Alhambra, los espacios tienen actividad constante. La limpieza debe mantener orden funcional y control diario en cada área. Nuestro servicio está enfocado en sostener ese equilibrio.',
                'services_intro' => 'Soluciones de limpieza en Alhambra diseñadas para espacios residenciales y comerciales activos.',
                'why_us' => ['Orden funcional', 'Resultados consistentes', 'Adaptación al ritmo del espacio', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en funcionamiento del espacio',
                'diff_desc' => 'En Alhambra, el objetivo es mantener espacios operativos.',
                'diff_items' => ['Control de áreas de alto uso', 'Cuidado continuo', 'Orden práctico', 'Continuidad del servicio'],
                'coverage' => 'Atendemos Alhambra y su entorno dentro de Los Angeles County, incluyendo zonas cercanas de alta actividad.',
                'local_msg' => 'En Alhambra, el orden permite que todo fluya.',
                'seo' => 'Servicios de limpieza en Alhambra enfocados en espacios activos y funcionales.',
                'final_msg' => 'La limpieza sostiene el ritmo del espacio.',
                'cta_final' => 'Mantén tu espacio limpio y funcionando correctamente. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'San Gabriel',
                'zip_codes' => '91775, 91776',
                'h1' => 'Servicios Profesionales de Limpieza en San Gabriel',
                'hero' => 'En San Gabriel, donde la actividad diaria se concentra en corredores como Valley Blvd y Las Tunas Dr, los espacios requieren limpieza constante para mantenerse funcionales. Azamora Cleaning Group ofrece un servicio enfocado en sostener orden, claridad y continuidad en entornos de uso frecuente. Aquí la limpieza mantiene el ritmo del día sin interrupciones.',
                'intro' => 'En San Gabriel, los espacios tienen movimiento constante. La limpieza debe mantener estabilidad y organización en espacios de uso constante. Nuestro servicio está diseñado para sostener esa continuidad.',
                'services_intro' => 'Soluciones de limpieza en San Gabriel para hogares y espacios activos.',
                'why_us' => ['Control del espacio', 'Resultados constantes', 'Adaptación al ritmo diario', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en continuidad diaria',
                'diff_desc' => 'En San Gabriel, mantener orden constante es clave.',
                'diff_items' => ['Control de áreas frecuentes', 'Reducción de acumulación', 'Mantenimiento continuo', 'Organización funcional'],
                'coverage' => 'Atendemos San Gabriel y áreas cercanas dentro de Los Angeles County, manteniendo cobertura en toda la zona.',
                'local_msg' => 'En San Gabriel, la limpieza sostiene la rutina.',
                'seo' => 'Servicios de limpieza en San Gabriel enfocados en mantenimiento constante.',
                'final_msg' => 'El orden mantiene el flujo del día.',
                'cta_final' => 'Mantén tu espacio organizado y funcional. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Temple City',
                'zip_codes' => '91780',
                'h1' => 'Servicios Profesionales de Limpieza en Temple City',
                'hero' => 'En Temple City, donde predominan barrios residenciales tranquilos y hogares familiares, la limpieza forma parte del equilibrio diario. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, estabilidad y claridad en cada espacio. Aquí la limpieza aporta control sin alterar la tranquilidad del entorno.',
                'intro' => 'En Temple City, los hogares requieren limpieza regular que mantenga el equilibrio del espacio. La limpieza debe sostener orden sin afectar la rutina diaria. Nuestro servicio está enfocado en mantener esa estabilidad.',
                'services_intro' => 'Soluciones de limpieza en Temple City para espacios residenciales.',
                'why_us' => ['Consistencia', 'Orden práctico', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en estabilidad del hogar',
                'diff_desc' => 'En Temple City, el objetivo es mantener el equilibrio del espacio.',
                'diff_items' => ['Mantenimiento constante', 'Orden funcional', 'Control de áreas', 'Continuidad operativa'],
                'coverage' => 'Atendemos Temple City y su entorno dentro de Los Angeles County, cubriendo comunidades residenciales cercanas.',
                'local_msg' => 'En Temple City, el orden mantiene la tranquilidad.',
                'seo' => 'Servicios de limpieza en Temple City enfocados en mantenimiento residencial.',
                'final_msg' => 'La estabilidad comienza con el orden.',
                'cta_final' => 'Mantén tu hogar limpio y estable. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'El Monte',
                'zip_codes' => '91731, 91732, 91733',
                'h1' => 'Servicios Profesionales de Limpieza en El Monte',
                'hero' => 'El Monte se caracteriza por su ritmo constante, viviendas en uso diario y zonas con alta actividad familiar. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, limpieza y funcionalidad en espacios que no se detienen. La limpieza aquí sostiene el día a día y evita acumulación innecesaria.',
                'intro' => 'El Monte requiere soluciones prácticas. El uso diario de los espacios exige limpieza eficiente que mantenga control sin complicaciones. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en El Monte diseñadas para espacios con alta actividad.',
                'why_us' => ['Enfoque práctico', 'Resultados constantes', 'Adaptación al ritmo del espacio', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en uso diario',
                'diff_desc' => 'El Monte demanda soluciones simples y efectivas.',
                'diff_items' => ['Control de áreas activas', 'Reducción de acumulación', 'Mantenimiento continuo', 'Orden funcional'],
                'coverage' => 'Atendemos El Monte y zonas cercanas dentro de Los Angeles County, con cobertura activa en áreas aledañas.',
                'local_msg' => 'En El Monte, mantener el orden es parte de la rutina.',
                'seo' => 'Servicios de limpieza en El Monte enfocados en mantenimiento práctico.',
                'final_msg' => 'La limpieza permite sostener el ritmo del día.',
                'cta_final' => 'Mantén tu espacio limpio y funcionando correctamente. Contáctanos para tu estimado.'
            ],
            [
                'title' => 'Covina',
                'zip_codes' => '91722, 91723, 91724',
                'h1' => 'Servicios Profesionales de Limpieza en Covina',
                'hero' => 'Covina combina zonas residenciales consolidadas con actividad diaria constante en hogares y espacios familiares. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, claridad y continuidad en cada área del hogar. La limpieza aquí sostiene estabilidad y control en el espacio.',
                'intro' => 'Covina requiere un cuidado continuo que mantenga el equilibrio del hogar. Los espacios necesitan limpieza que mantenga orden sin interrumpir la rutina. Nuestro servicio está enfocado en sostener ese equilibrio.',
                'services_intro' => 'Soluciones de limpieza en Covina diseñadas para hogares activos.',
                'why_us' => ['Consistencia', 'Orden funcional', 'Adaptación al espacio', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en estabilidad del hogar',
                'diff_desc' => 'Covina requiere control constante.',
                'diff_items' => ['Mantenimiento continuo', 'Reducción de acumulación', 'Orden práctico', 'Continuidad del servicio'],
                'coverage' => 'Atendemos Covina y su entorno dentro de Los Angeles County, cubriendo zonas residenciales cercanas.',
                'local_msg' => 'En Covina, el orden mantiene el equilibrio del hogar.',
                'seo' => 'Servicios de limpieza en Covina enfocados en mantenimiento residencial.',
                'final_msg' => 'La estabilidad comienza con el orden.',
                'cta_final' => 'Mantén tu espacio limpio y organizado. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'West Covina',
                'zip_codes' => '91790, 91791, 91792',
                'h1' => 'Servicios Profesionales de Limpieza en West Covina',
                'hero' => 'West Covina combina áreas residenciales con zonas comerciales activas y espacios de alto movimiento. Azamora Cleaning Group ofrece un servicio diseñado para mantener orden, control y funcionalidad en entornos dinámicos. La limpieza aquí permite que el espacio opere sin interrupciones.',
                'intro' => 'West Covina requiere soluciones eficientes. Los espacios necesitan limpieza que mantenga organización eficiente en espacios con actividad permanente. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en West Covina diseñadas para espacios activos.',
                'why_us' => ['Ejecución eficiente', 'Resultados consistentes', 'Adaptación al entorno', 'Enfoque profesional'],
                'diff_title' => 'Limpieza enfocada en control del espacio',
                'diff_desc' => 'West Covina requiere organización constante.',
                'diff_items' => ['Control de áreas activas', 'Mantenimiento continuo', 'Orden funcional', 'Optimización del espacio'],
                'coverage' => 'Atendemos West Covina y áreas cercanas dentro de Los Angeles County, con cobertura en toda la zona.',
                'local_msg' => 'En West Covina, el orden permite que todo funcione correctamente.',
                'seo' => 'Servicios de limpieza en West Covina enfocados en espacios dinámicos.',
                'final_msg' => 'Un espacio organizado mejora el funcionamiento general.',
                'cta_final' => 'Mantén tu espacio limpio, organizado y en control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Azusa',
                'zip_codes' => '91702',
                'h1' => 'Servicios Profesionales de Limpieza en Azusa',
                'hero' => 'Azusa mantiene un ritmo activo con hogares familiares, zonas cercanas a Azusa Ave y áreas próximas a las foothills. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, limpieza y control en espacios que se usan todos los días. La limpieza aquí ayuda a mantener equilibrio sin complicaciones.',
                'intro' => 'Azusa requiere soluciones prácticas. Los espacios requieren limpieza frecuente que permita mantener orden sin afectar la rutina. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza en Azusa para hogares en uso continuo.',
                'why_us' => ['Enfoque práctico', 'Resultados constantes', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en daily control',
                'diff_desc' => 'Azusa requiere continuidad para mantener el espacio bajo control.',
                'diff_items' => ['Control de áreas activas', 'Reducción de acumulación', 'Orden funcional', 'Continuidad del servicio'],
                'coverage' => 'Atendemos Azusa y su entorno dentro de Los Angeles County, abarcando comunidades cercanas.',
                'local_msg' => 'En Azusa, mantener el orden es parte del día a día.',
                'seo' => 'Servicios de limpieza en Azusa enfocados en mantenimiento práctico.',
                'final_msg' => 'La limpieza permite sostener la rutina.',
                'cta_final' => 'Mantén tu espacio limpio y bajo control. Agenda tu servicio hoy.'
            ],
            [
                'title' => 'Baldwin Park',
                'zip_codes' => '91706',
                'h1' => 'Servicios Profesionales de Limpieza en Baldwin Park',
                'hero' => 'Baldwin Park presenta zonas residenciales activas, viviendas en uso constante y áreas cercanas a Ramona Blvd con movimiento continuo. Azamora Cleaning Group ofrece un servicio diseñado para mantener orden, limpieza y funcionalidad en espacios que no se detienen. La limpieza aquí sostiene el ritmo del hogar y del trabajo diario.',
                'intro' => 'Baldwin Park requiere limpieza continua que mantenga el espacio operativo sin interrupciones. Los espacios necesitan limpieza que mantenga control y orden sin interrupciones. Nuestro servicio responde a esa dinámica.',
                'services_intro' => 'Soluciones de limpieza en Baldwin Park para espacios activos.',
                'why_us' => ['Consistencia', 'Orden funcional', 'Adaptación al ritmo', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en continuidad del espacio',
                'diff_desc' => 'Baldwin Park requiere soluciones constantes.',
                'diff_items' => ['Control de áreas activas', 'Mantenimiento continuo', 'Reducción de acumulación', 'Orden práctico'],
                'coverage' => 'Atendemos Baldwin Park y zonas cercanas dentro de Los Angeles County, cubriendo áreas residenciales activas.',
                'local_msg' => 'En Baldwin Park, el orden permite mantener el ritmo del día.',
                'seo' => 'Servicios de limpieza en Baldwin Park enfocados en mantenimiento constante.',
                'final_msg' => 'El orden sostiene el funcionamiento del espacio.',
                'cta_final' => 'Mantén tu espacio limpio y funcionando correctamente. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Rosemead',
                'zip_codes' => '91770',
                'h1' => 'Servicios Profesionales de Limpieza en Rosemead',
                'hero' => 'Rosemead combina zonas residenciales con actividad constante en corredores como Garvey Ave, donde los espacios requieren limpieza continua para mantenerse organizados. Azamora Cleaning Group ofrece un servicio enfocado en sostener orden, claridad y funcionalidad en entornos de uso frecuente. La limpieza aquí permite mantener control sin complicaciones.',
                'intro' => 'Rosemead requiere limpieza continua que mantenga el espacio organizado en todo momento. Los espacios necesitan limpieza que mantenga orden sin interrumpir la rutina diaria. Nuestro servicio está diseñado para sostener ese control.',
                'services_intro' => 'Soluciones de limpieza en Rosemead para hogares y espacios activos.',
                'why_us' => ['Resultados constantes', 'Orden funcional', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en control del entorno',
                'diff_desc' => 'Rosemead requiere consistencia.',
                'diff_items' => ['Control de áreas activas', 'Reducción de acumulación', 'Mantenimiento continuo', 'Organización funcional'],
                'coverage' => 'Atendemos Rosemead y su entorno dentro de Los Angeles County, con presencia en zonas cercanas.',
                'local_msg' => 'En Rosemead, el orden permite mantener estabilidad diaria.',
                'seo' => 'Servicios de limpieza en Rosemead enfocados en mantenimiento residencial y comercial.',
                'final_msg' => 'Mantener el entorno limpio asegura continuidad en el día a día.',
                'cta_final' => 'Mantén tu espacio limpio y organizado. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Monterey Park',
                'zip_codes' => '91754, 91755',
                'h1' => 'Servicios Profesionales de Limpieza en Monterey Park',
                'hero' => 'Monterey Park destaca por su densidad residencial, movimiento constante y actividad diaria alrededor de Atlantic Blvd y Garvey Ave. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, claridad y control en espacios que se utilizan intensamente. La limpieza aquí permite mantener el entorno organizado sin perder ritmo.',
                'intro' => 'Monterey Park requiere constante limpieza para mantener control en espacios de alta actividad. Los espacios necesitan limpieza que mantenga control en entornos con alta actividad diaria. Nuestro servicio responde a esa necesidad.',
                'services_intro' => 'Soluciones de limpieza en Monterey Park diseñadas para hogares y espacios activos.',
                'why_us' => ['Resultados consistentes', 'Orden funcional', 'Adaptación al ritmo del espacio', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en control diario del entorno',
                'diff_desc' => 'Monterey Park requiere organización constante.',
                'diff_items' => ['Control de áreas activas', 'Reducción de acumulación', 'Mantenimiento continuo', 'Orden práctico'],
                'coverage' => 'Atendemos Monterey Park y áreas cercanas dentro de Los Angeles County, cubriendo comunidades aledañas.',
                'local_msg' => 'En Monterey Park, mantener el orden es clave para el día a día.',
                'seo' => 'Servicios de limpieza en Monterey Park enfocados en mantenimiento constante.',
                'final_msg' => 'El orden permite sostener el ritmo del entorno.',
                'cta_final' => 'Mantén tu espacio limpio y bajo control. Solicita tu estimado gratuito hoy.'
            ],
            [
                'title' => 'Duarte',
                'zip_codes' => '91010',
                'h1' => 'Servicios Profesionales de Limpieza en Duarte',
                'hero' => 'Duarte combina zonas residenciales tranquilas con áreas cercanas a Royal Oaks y espacios con menor densidad que requieren mantenimiento constante. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, limpieza y estabilidad en entornos más relajados pero activos. La limpieza aquí sostiene el equilibrio del hogar.',
                'intro' => 'Duarte requiere un cuidado regular enfocado en mantener estabilidad y control. Los espacios necesitan limpieza que mantenga orden sin alterar la tranquilidad del entorno. Nuestro servicio está diseñado para sostener ese balance.',
                'services_intro' => 'Soluciones de limpieza en Duarte para hogares residenciales.',
                'why_us' => ['Consistencia', 'Orden funcional', 'Adaptación al entorno', 'Ejecución profesional'],
                'diff_title' => 'Limpieza enfocada en estabilidad del espacio',
                'diff_desc' => 'Duarte requiere equilibrio constante.',
                'diff_items' => ['Mantenimiento continuo', 'Control de áreas', 'Orden práctico', 'Continuidad'],
                'coverage' => 'Atendemos Duarte y su entorno dentro de Los Angeles County, abarcando zonas residenciales cercanas.',
                'local_msg' => 'En Duarte, el orden mantiene la estabilidad del hogar.',
                'seo' => 'Servicios de limpieza en Duarte enfocados en mantenimiento residencial.',
                'final_msg' => 'La estabilidad comienza con el orden.',
                'cta_final' => 'Mantén tu espacio limpio y en equilibrio. Solicita tu estimado hoy.'
            ],
            [
                'title' => 'Altadena',
                'zip_codes' => '91001',
                'h1' => 'Servicios Profesionales de Limpieza en Altadena',
                'hero' => 'Altadena se distingue por sus viviendas cercanas a las montañas, propiedades con mayor espacio exterior y un entorno más natural. Azamora Cleaning Group ofrece un servicio enfocado en mantener orden, limpieza y control en hogares que requieren atención constante tanto en interiores como en accesos. La limpieza aquí ayuda a conservar el equilibrio del entorno.',
                'intro' => 'Altadena requiere un enfoque de limpieza continuo, adaptado a las condiciones específicas del entorno. Los espacios demandan control constante de polvo, impacto del uso exterior y mantenimiento del orden interior. Nuestro servicio responde de forma estructurada a estas exigencias, garantizando consistencia y resultados de alto nivel.',
                'services_intro' => 'Soluciones de limpieza en Altadena para hogares con mayor exposición al entorno.',
                'why_us' => ['Resultados consistentes', 'Control del entorno', 'Adaptación a condiciones externas', 'Ejecución profesional'],
                'diff_title' => 'Limpieza adaptada a entorno natural',
                'diff_desc' => 'Altadena requiere control constante del ambiente.',
                'diff_items' => ['Control de polvo exterior', 'Mantenimiento interior constante', 'Orden funcional', 'Protección del espacio'],
                'coverage' => 'Atendemos Altadena y áreas cercanas dentro de Los Angeles County, con cobertura en zonas aledañas.',
                'local_msg' => 'En Altadena, el entorno influye en el estado del hogar.',
                'seo' => 'Servicios de limpieza en Altadena enfocados en mantenimiento adaptado al entorno.',
                'final_msg' => 'El control del entorno mantiene el hogar en equilibrio.',
                'cta_final' => 'Mantén tu espacio limpio y en control. Solicita tu estimado gratuito hoy.'
            ],
        ];

        foreach ($facilities as $data) {
            $slug = Str::slug($data['title']);

            Facility::updateOrCreate(
                ['slug' => $slug, 'lang_id' => $langId],
                [
                    'title' => $data['title'],
                    'zip_codes' => $data['zip_codes'],
                    'description' => $data['hero'], // Use HERO description as main brief desc
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
