<?php

namespace Database\Seeders;

use App\Models\Aboutus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutuses = [
            [
                'correlative' => 'about-us',
                'name' => 'Nosotros',
                'description' => 'Nos enfocamos en valorar y personalizar la experiencia del *auto cuidado* y del cuidado del *medio ambiente*. Creemos que se puede generar bienestar en las personas mostrándoles la mejor versión de cada *un@* y *empoderándol@s*. Es por eso que apostamos por crear fórmulas únicas a través de experiencias digitales de personalización. Creando productos orgánicos, libre de parabenos, sulfatos y libres de maltrato animal. De las miles de combinaciones que existen, la tuya es única, abrázala.',
            ],
            [
                'correlative' => 'phone',
                'name' => 'Teléfono',
                'description' => '5114605000',
            ],
            [
                'correlative' => 'email',
                'name' => 'Correo',
                'description' => 'hola@vua.pe',
            ],
            [
                'correlative' => 'whatsapp',
                'name' => 'WhatsApp',
                'description' => '5114605000',
            ],
            [
                'correlative' => 'customer-complaints',
                'name' => 'Libro de reclamaciones',
                'description' => 'https://docs.google.com/forms/d/e/1FAIpQLSesYBA7aagw3XFpqZelSLb70mx4qEI4XO2PXh6JcVV5ghnkrQ/viewform'
            ]
        ];

        foreach ($aboutuses as $aboutus) {
            Aboutus::updateOrCreate(['correlative' => $aboutus['correlative']], $aboutus);
        }
    }
}
