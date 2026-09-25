<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Lang;
use App\Models\Zone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ZoneAndFacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lang = Lang::where('status', true)->first() ?? Lang::create([
            'name' => 'Español',
            'description' => 'es',
            'status' => true,
            'visible' => true,
            'is_default' => true
        ]);

        $zones = [
            [
                'name' => 'Lima *Este (SJL)',
                'description' => 'Nuestra zona principal en el corazón de San Juan de Lurigancho, con instalaciones modernas y equipamiento de última generación.',
                'map' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124854.44474775439!2d-77.0189725!3d-11.9881885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f87b3a7261%3A0x67399580b069d67!2sSan%20Juan%20de%20Lurigancho!5e0!3m2!1ses!2spe!4v1710890000000!5m2!1ses!2spe" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'latitude' => '-11.9881885',
                'longitude' => '-77.0189725',
                'facilities' => [
                    [
                        'title' => 'Sede Las Flores',
                        'description' => 'Especialistas en terapia física y rehabilitación post-operatoria con más de 10 años de experiencia.',
                        'ubications' => ['Av. Las Flores de Primavera 123, SJL'],
                        'phones' => ['+51 987 654 321'],
                        'emails' => ['flores@azamora.com'],
                        'business_hours' => ['Lun - Vie: 8:00 AM - 8:00 PM', 'Sáb: 9:00 AM - 1:00 PM'],
                        'latitude' => '-11.990425', 'longitude' => '-77.010123'
                    ],
                    [
                        'title' => 'Sede Canto Grande',
                        'description' => 'Centro integral de fisioterapia deportiva y recuperación muscular avanzada.',
                        'ubications' => ['Av. Canto Grande 456, SJL'],
                        'phones' => ['+51 987 654 322'],
                        'emails' => ['cantogrande@azamora.com'],
                        'business_hours' => ['Lun - Sáb: 7:00 AM - 9:00 PM'],
                        'latitude' => '-11.975432', 'longitude' => '-77.005678'
                    ],
                    [
                        'title' => 'Sede San Hilarión',
                        'description' => 'Atención especializada en fisioterapia pediátrica y geriátrica.',
                        'ubications' => ['Jr. San Hilarión 789, SJL'],
                        'phones' => ['+51 987 654 324'],
                        'emails' => ['hilarion@azamora.com'],
                        'business_hours' => ['Lun - Vie: 8:00 AM - 6:00 PM'],
                        'latitude' => '-11.982111', 'longitude' => '-77.015222'
                    ]
                ]
            ],
            [
                'name' => 'Lima *Norte (Los Olivos)',
                'description' => 'Presencia estratégica en Lima Norte, brindando atención personalizada y técnicas avanzadas de fisioterapia.',
                'map' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.123456789!2d-77.06!3d-11.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cfc4ca4d5e13%3A0x23a3f3a0c5c3c0!2sLos%20Olivos!5e0!3m2!1ses!2spe!4v1710890000000!5m2!1ses!2spe" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'latitude' => '-11.95',
                'longitude' => '-77.06',
                'facilities' => [
                    [
                        'title' => 'Sede Izaguirre',
                        'description' => 'Ubicada estratégicamente en una de las zonas más accesibles de Los Olivos.',
                        'ubications' => ['Av. Carlos Izaguirre 789, Los Olivos'],
                        'phones' => ['+51 987 654 323'],
                        'emails' => ['izaguirre@azamora.com'],
                        'business_hours' => ['Lun - Vie: 9:00 AM - 7:00 PM'],
                        'latitude' => '-11.954321', 'longitude' => '-77.071234'
                    ],
                    [
                        'title' => 'Sede Antúnez de Mayolo',
                        'description' => 'Especialistas en tratamiento de columna y dolores crónicos.',
                        'ubications' => ['Av. Antúnez de Mayolo 101, Los Olivos'],
                        'phones' => ['+51 987 654 325'],
                        'emails' => ['mayolo@azamora.com'],
                        'business_hours' => ['Lun - Sáb: 8:30 AM - 7:30 PM'],
                        'latitude' => '-11.961234', 'longitude' => '-77.065432'
                    ]
                ]
            ],
            [
                'name' => 'Lima *Sur (Surco / Chorrillos)',
                'description' => 'Atención de calidad en la zona sur de Lima, con ambientes relajantes y profesionales altamente calificados.',
                'map' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.867!2d-77.01!3d-12.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b828!2sChorrillos!5e0!3m2!1ses!2spe!4v1710890000000!5m2!1ses!2spe" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
                'latitude' => '-12.16',
                'longitude' => '-77.01',
                'facilities' => [
                    [
                        'title' => 'Sede Matellini',
                        'description' => 'Contamos con equipos de última generación para una recuperación rápida.',
                        'ubications' => ['Av. Matellini 202, Chorrillos'],
                        'phones' => ['+51 987 654 326'],
                        'emails' => ['matellini@azamora.com'],
                        'business_hours' => ['Lun - Sáb: 9:00 AM - 8:00 PM'],
                        'latitude' => '-12.174321', 'longitude' => '-77.025432'
                    ],
                    [
                        'title' => 'Sede El Derby (Surco)',
                        'description' => 'Atención premium en nutrición y medicina deportiva.',
                        'ubications' => ['Av. El Derby 303, Santiago de Surco'],
                        'phones' => ['+51 987 654 327'],
                        'emails' => ['elderby@azamora.com'],
                        'business_hours' => ['Lun - Vie: 8:00 AM - 9:00 PM'],
                        'latitude' => '-12.094321', 'longitude' => '-76.975432'
                    ]
                ]
            ]
        ];

        foreach ($zones as $zData) {
            $zone = Zone::create([
                'name' => $zData['name'],
                'description' => $zData['description'],
                'map' => $zData['map'],
                'latitude' => $zData['latitude'],
                'longitude' => $zData['longitude'],
                'slug' => Str::slug(str_replace('*', '', $zData['name'])),
                'lang_id' => $lang->id,
                'status' => true,
                'visible' => true,
                'gallery' => []
            ]);

            foreach ($zData['facilities'] as $fData) {
                Facility::create([
                    'zone_id' => $zone->id,
                    'title' => $fData['title'],
                    'description' => $fData['description'],
                    'ubications' => $fData['ubications'],
                    'phones' => $fData['phones'],
                    'emails' => $fData['emails'],
                    'business_hours' => $fData['business_hours'],
                    'latitude' => $fData['latitude'],
                    'longitude' => $fData['longitude'],
                    'lang_id' => $lang->id,
                    'status' => true,
                    'visible' => true,
                    'gallery' => []
                ]);
            }
        }
    }
}
