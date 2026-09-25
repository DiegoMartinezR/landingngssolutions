<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Zone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DetailedFacilitySeeder extends Seeder
{
    public function run()
    {
        $lang = \App\Models\Lang::first();
        if (!$lang) return;
        $langId = $lang->id;
        
        $zone = Zone::where('lang_id', $langId)->first(); 
        
        if (!$zone) {
            $zone = Zone::create([
                'name' => 'Los Angeles County',
                'description' => 'Serving the greater Los Angeles area with premium cleaning solutions.',
                'slug' => 'los-angeles-county',
                'status' => true,
                'visible' => true,
                'lang_id' => $langId
            ]);
        }

        $locations = [
            [
                'title' => 'Monrovia',
                'zip_codes' => '91016',
                'hero_description' => 'In Monrovia, where family homes and quiet residential streets near the foothills predominate, keeping the space clean is part of the daily routine.',
                'intro' => 'In Monrovia, home combines rest, routine, and daily activity. Cleaning should sustain order without interrupting the spacing operation. Our service focuses on maintaining that balance constantly.',
                'differentiator_title' => 'Cleaning integrated into the daily routine',
                'differentiator_items' => ['Control of frequent use areas', 'Reduction of accumulation', 'Continuous maintenance', 'Practical order'],
                'local_message' => 'In Monrovia, an organized home facilitates daily life.',
                'seo_block' => 'Cleaning services in Monrovia focused on continuous residential maintenance.'
            ],
            [
                'title' => 'Pasadena',
                'zip_codes' => '91101, 91103, 91104, 91105, 91106, 91107',
                'hero_description' => 'In Pasadena, where well-maintained homes, established residential areas, and spots like Old Pasadena and South Lake stand out, cleanliness is part of the environment standard.',
                'intro' => 'In Pasadena, the state of the space is visible. Cleaning must maintain aesthetics, order, and presentation in every area of the home. Our service responds to that standard.',
                'differentiator_title' => 'Cleaning focused on presentation',
                'differentiator_items' => ['Surface care', 'Visual order', 'Clean finishes', 'Consistency in every service'],
                'local_message' => 'In Pasadena, the state of the home is noticed.',
                'seo_block' => 'Cleaning services in Pasadena focused on detailed maintenance.'
            ],
            [
                'title' => 'Arcadia',
                'zip_codes' => '91006, 91007',
                'hero_description' => 'In Arcadia, where spacious homes and residential areas near spots like Santa Anita and Baldwin Ave predominate, space size demands constant organization.',
                'intro' => 'In Arcadia, spacious areas require control. Cleaning must be organized to maintain each area in consistent conditions.',
                'differentiator_title' => 'Structured cleaning for spacious areas',
                'differentiator_items' => ['Dividing work by zones', 'Maintaining consistency', 'Optimizing times', 'Sustaining general control'],
                'local_message' => 'In Arcadia, space control is key.',
                'seo_block' => 'Cleaning services in Arcadia for spacious homes.'
            ],
            [
                'title' => 'Alhambra',
                'zip_codes' => '91801, 91803',
                'hero_description' => 'In Alhambra, where commercial activity on Valley Blvd and Main St combines with active residential zones, keeping spaces clean is part of daily operation.',
                'intro' => 'In Alhambra, spaces have constant activity. Cleaning must maintain functional order and daily control in every area. Our service is focused on sustaining that balance.',
                'differentiator_title' => 'Cleaning focused on space operation',
                'differentiator_items' => ['Control of high-use areas', 'Continuous care', 'Practical order', 'Service continuity'],
                'local_message' => 'In Alhambra, order allows everything to flow.',
                'seo_block' => 'Cleaning services in Alhambra focused on active and functional spaces.'
            ],
            [
                'title' => 'San Gabriel',
                'zip_codes' => '91775, 91776',
                'hero_description' => 'In San Gabriel, where daily activity concentrates on corridors like Valley Blvd and Las Tunas Dr, spaces demand constant cleaning to stay functional.',
                'intro' => 'In San Gabriel, spaces have constant movement. Cleaning must maintain stability and organization in constantly used spaces. Our service is designed to sustain that continuity.',
                'differentiator_title' => 'Cleaning focused on daily continuity',
                'differentiator_items' => ['Control of frequent areas', 'Reduction of accumulation', 'Continuous maintenance', 'Functional organization'],
                'local_message' => 'In San Gabriel, cleanliness sustains the routine.',
                'seo_block' => 'Cleaning services in San Gabriel focused on constant maintenance.'
            ],
            [
                'title' => 'Temple City',
                'zip_codes' => '91780',
                'hero_description' => 'In Temple City, where quiet residential neighborhoods and family homes predominate, cleanliness is part of the daily balance.',
                'intro' => 'In Temple City, homes require regular cleaning that maintains the space\'s balance. Cleaning should sustain order without affecting the daily routine. Our service is focused on maintaining that stability.',
                'differentiator_title' => 'Cleaning focused on home stability',
                'differentiator_items' => ['Constant maintenance', 'Functional order', 'Control of areas', 'Operational continuity'],
                'local_message' => 'In Temple City, order maintains tranquility.',
                'seo_block' => 'Cleaning services in Temple City focused on residential maintenance.'
            ],
            [
                'title' => 'El Monte',
                'zip_codes' => '91731, 91732, 91733',
                'hero_description' => 'El Monte is characterized by its constant rhythm, homes in daily use, and areas with high family activity.',
                'intro' => 'El Monte requires practical solutions. Daily use of spaces demands efficient cleaning that maintains control without complications. Our service responds to that need.',
                'differentiator_title' => 'Cleaning focused on daily use',
                'differentiator_items' => ['Control of active areas', 'Reduction of accumulation', 'Continuous maintenance', 'Functional order'],
                'local_message' => 'In El Monte, maintaining order is part of the routine.',
                'seo_block' => 'Cleaning services in El Monte focused on practical maintenance.'
            ],
            [
                'title' => 'Covina',
                'zip_codes' => '91722, 91723, 91724',
                'hero_description' => 'Covina combines consolidated residential areas with constant daily activity in homes and family spaces.',
                'intro' => 'Covina requires continuous care that maintains the home\'s balance. Spaces need cleaning that maintains order without interrupting the routine. Our service is focused on sustaining that balance.',
                'differentiator_title' => 'Cleaning focused on home stability',
                'differentiator_items' => ['Continuous maintenance', 'Reduction of accumulation', 'Practical order', 'Service continuity'],
                'local_message' => 'In Covina, order maintains the home\'s balance.',
                'seo_block' => 'Cleaning services in Covina focused on residential maintenance.'
            ],
            [
                'title' => 'West Covina',
                'zip_codes' => '91790, 91791, 91792',
                'hero_description' => 'West Covina combines residential areas with active commercial zones and high-movement spaces.',
                'intro' => 'West Covina requires efficient solutions. Spaces need cleaning that maintains efficient organization in spaces with permanent activity. Our service responds to that need.',
                'differentiator_title' => 'Cleaning focused on space control',
                'differentiator_items' => ['Control of active areas', 'Continuous maintenance', 'Functional order', 'Space optimization'],
                'local_message' => 'In West Covina, order allows everything to work correctly.',
                'seo_block' => 'Cleaning services in West Covina focused on dynamic spaces.'
            ],
            [
                'title' => 'Azusa',
                'zip_codes' => '91702',
                'hero_description' => 'Azusa maintains an active rhythm with family homes, areas near Azusa Ave, and spots near the foothills.',
                'intro' => 'Azusa requires practical solutions. Spaces demand frequent cleaning that allows maintaining order without affecting the routine. Our service is designed to sustain that control.',
                'differentiator_title' => 'Cleaning focused on daily control',
                'differentiator_items' => ['Control of active areas', 'Reduction of accumulation', 'Functional order', 'Service continuity'],
                'local_message' => 'In Azusa, maintaining order is part of the day to day.',
                'seo_block' => 'Cleaning services in Azusa focused on practical maintenance.'
            ],
            [
                'title' => 'Baldwin Park',
                'zip_codes' => '91706',
                'hero_description' => 'Baldwin Park features active residential zones, homes in constant use, and areas near Ramona Blvd with continuous movement.',
                'intro' => 'Baldwin Park requires continuous cleaning that keeps the space operational without interruptions. Spaces need cleaning that maintains control and order without interruptions. Our service responds to that dynamic.',
                'differentiator_title' => 'Cleaning focused on space continuity',
                'differentiator_items' => ['Control of active areas', 'Continuous maintenance', 'Reduction of accumulation', 'Practical order'],
                'local_message' => 'In Baldwin Park, order allows maintaining the day\'s rhythm.',
                'seo_block' => 'Cleaning services in Baldwin Park focused on constant maintenance.'
            ],
            [
                'title' => 'Rosemead',
                'zip_codes' => '91770',
                'hero_description' => 'Rosemead combines residential areas with constant activity in corridors like Garvey Ave, where spaces require continuous cleaning to stay organized.',
                'intro' => 'Rosemead requires continuous cleaning that keeps the space organized at all times. Spaces need cleaning that maintains order without interrupting the daily routine. Our service is designed to sustain that control.',
                'differentiator_title' => 'Cleaning focused on environment control',
                'differentiator_items' => ['Control of active areas', 'Reduction of accumulation', 'Continuous maintenance', 'Functional organization'],
                'local_message' => 'In Rosemead, order allows maintaining daily stability.',
                'seo_block' => 'Cleaning services in Rosemead focused on residential and commercial maintenance.'
            ],
            [
                'title' => 'Monterey Park',
                'zip_codes' => '91754, 91755',
                'hero_description' => 'Monterey Park stands out for its residential density, constant movement, and daily activity around Atlantic Blvd and Garvey Ave.',
                'intro' => 'Monterey Park requires constant cleaning to maintain control in high-activity spaces. Spaces need cleaning that maintains control in environments with high daily activity. Our service responds to that need.',
                'differentiator_title' => 'Cleaning focused on daily environment control',
                'differentiator_items' => ['Control of active areas', 'Reduction of accumulation', 'Continuous maintenance', 'Practical order'],
                'local_message' => 'In Monterey Park, maintaining order is key for daily life.',
                'seo_block' => 'Cleaning services in Monterey Park focused on constant maintenance.'
            ],
            [
                'title' => 'Duarte',
                'zip_codes' => '91010',
                'hero_description' => 'Duarte combines quiet residential areas with spots near Royal Oaks and spaces with lower density that require constant maintenance.',
                'intro' => 'Duarte requires regular care focused on maintaining stability and control. Spaces need cleaning that maintains order without altering the environment tranquility. Our service is designed to sustain that balance.',
                'differentiator_title' => 'Cleaning focused on space stability',
                'differentiator_items' => ['Continuous maintenance', 'Control of areas', 'Practical order', 'Continuity'],
                'local_message' => 'In Duarte, order maintains the home stability.',
                'seo_block' => 'Cleaning services in Duarte focused on residential maintenance.'
            ],
            [
                'title' => 'Altadena',
                'zip_codes' => '91001',
                'hero_description' => 'Altadena is distinguished by its homes near the mountains, properties with more exterior space, and a more natural environment.',
                'intro' => 'Altadena requires a continuous cleaning approach, adapted to the specific conditions of the environment. Spaces demand constant control of dust, impact of exterior use, and interior order maintenance.',
                'differentiator_title' => 'Cleaning adapted to natural environment',
                'differentiator_items' => ['Control of exterior dust', 'Constant interior maintenance', 'Functional order', 'Space protection'],
                'local_message' => 'In Altadena, the environment influences the home state.',
                'seo_block' => 'Cleaning services in Altadena focused on maintenance adapted to the environment.'
            ]
        ];

        foreach ($locations as $loc) {
            $slug = Str::slug($loc['title']);
            
            Facility::updateOrCreate(
                ['slug' => $slug, 'lang_id' => $langId],
                [
                    'title' => $loc['title'],
                    'zip_codes' => $loc['zip_codes'],
                    'description' => $loc['hero_description'],
                    'zone_id' => $zone->id,
                    'status' => true,
                    'visible' => true,
                    'detailed_content' => [
                        'h1' => 'Servicios Profesionales de Limpieza en *' . $loc['title'] . '*',
                        'hero_description' => $loc['hero_description'],
                        'intro' => $loc['intro'],
                        'services_intro' => 'Solutions in ' . $loc['title'] . ' designed for households and active spaces.',
                        'why_choose_us' => ['Professional Staff', 'Licensed & Insured', 'Consistent Results', 'Scheduled Routine'],
                        'differentiator_title' => $loc['differentiator_title'],
                        'differentiator_description' => 'In ' . $loc['title'] . ', maintaining order is clear.',
                        'differentiator_items' => $loc['differentiator_items'],
                        'coverage_message' => 'Serving ' . $loc['title'] . ' and nearby communities in Los Angeles County.',
                        'local_message' => $loc['local_message'],
                        'seo_block' => $loc['seo_block'],
                        'final_message' => 'Consistency maintains the home in balance.'
                    ],
                    'gallery' => [] // Galllery can be added via Admin UI
                ]
            );
        }
    }
}
