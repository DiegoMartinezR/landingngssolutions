<?php

namespace Database\Seeders;

use App\Models\Lang;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first();
        $langId = $lang?->id;

        $members = [
            [
                'name'        => 'Nashany Chiele',
                'job'         => 'QUIROPRÁCTICA',
                'description' => 'Licenciada en Quiropráctica, con experiencia en docencia en Imaginología en la Universidad Feevale (Brasil) y participación en congresos y talleres internacionales sobre neurociencia y cuidado de la columna vertebral en Latinoamérica.',
        
            ],
            [
                'name'        => 'Karina Garduño',
                'job'         => 'QUIROPRÁCTICA',
                'description' => 'Licenciada en Quiropráctica por la Universidad Estatal del Valle de Toluca, México, y cuenta con estudios de posgrado en Maestría en Educación en la Universidad Interamericana para el Desarrollo (UNID).',
                
            ],
            [
                'name'        => 'Yuridia Balderas',
                'job'         => 'QUIROPRÁCTICA',
                'description' => 'Licenciada en Quiropráctica por la Universidad Estatal del Valle de Ecatepec, ha tomado cursos en Vendaje Kinesiológico y Técnica Charrette, y tiene experiencia en ajustes deportivos con Pumas UNAM y rehabilitación post-COVID-19.',
                
            ],
            [
                'name'        => 'Adriana Georgina Avila',
                'job'         => 'QUIROPRÁCTICA',
                'description' => 'Licenciada en Quiropráctica en la Universidad Estatal del Valle de Ecatepec, con certificaciones en técnicas como PRS, Thompson y Gonstead, y participación en congresos y seminarios internacionales sobre quiropráctica y dolor lumbar.',
                
            ],
            [
                'name'        => 'Víctor Martínez',
                'job'         => 'QUIROPRÁCTICO',
                'description' => 'Licenciado en Quiropráctica por la Universidad Estatal del Valle de Toluca en México, con especializaciones en técnicas como Open Cervical y Sacro-Occipital, así como en Quiropráctica pediátrica y otros enfoques avanzados.',
                
            ],
            [
                'name'        => 'Valentina',
                'job'         => 'FISIOTERAPIA Y REHABILITACIÓN',
                'description' => 'Técnica Superior Universitaria en Fisioterapia por la Universidad Politécnica Territorial del Norte de Monagas (UPTNM), con formación en Punción Seca, Curso Complejo Articular del Hombro y Evaluación y Tratamiento Osteopático.',
                
            ],
            [
                'name'        => 'Carol Arotinco',
                'job'         => 'FISIOTERAPIA Y REHABILITACIÓN',
                'description' => 'Terapeuta Física del Instituto Carrión Andrea en San Pablo, especializada en terapia física y rehabilitación. Ofrece tratamientos personalizados para mejorar la salud y el bienestar físico de sus pacientes.',
                
            ],
            [
                'name'        => 'Beatriz Hoyos',
                'job'         => 'FISIOTERAPIA Y REHABILITACIÓN',
                'description' => 'Terapeuta Física del Instituto Carrión Andrea en San Pablo, experta en terapia física y rehabilitación. Ofrece tratamientos personalizados para mejorar la salud y el bienestar físico de sus pacientes.',
                
            ],
            [
                'name'        => 'Maria Jose Herencia',
                'job'         => 'FISIOTERAPIA Y REHABILITACIÓN',
                'description' => 'Técnica en Terapia Física y Rehabilitación por el Instituto Superior Tecnológico Daniel Alcides Carrión, con enfoque en salud musculoesquelética y funcional. Experta en técnicas manuales, masoterapia, movilización articular y recuperación neuromuscular.',
                
            ],
            [
                'name'        => 'Lizbeth Hilasca',
                'job'         => 'ASISTENTE GENERAL',
                'description' => 'Terapeuta Física del Instituto Carrión Andrea en San Pablo, experta en terapia física y rehabilitación. Ofrece tratamientos personalizados para mejorar la salud y el bienestar físico de sus pacientes.',
                
            ],
            [
                'name'        => 'Evelise Evaristo',
                'job'         => 'ASISTENTE GENERAL',
                'description' => 'Licenciada en Administración por la Universidad de Oriente, destaca por su habilidad para gestionar eficazmente recursos y liderar equipos.',
                
            ],
            [
                'name'        => 'Ericka Escate',
                'job'         => 'ASISTENTE GENERAL',
                'description' => 'Profesional en fisioterapia y rehabilitación, con estudios en la Universidad Arzobispo Loayza y el Seguro Social de Salud Base Rebagliati.',
                
            ],
            [
                'name'        => 'Alessandra Romero',
                'job'         => 'ASISTENTE GENERAL',
                'description' => 'Profesional en recepción y soporte administrativo, con formación en Administración y experiencia en gestión de pacientes, agendas y procesos administrativos.',
                
            ],
        ];

        foreach ($members as $member) {
            Staff::create([
                'name'        => $member['name'],
                'job'         => $member['job'],
                'description' => $member['description'],
               
                'slug'        => Str::slug($member['name']),
                'visible'     => true,
                'status'      => true,
                'lang_id'     => $langId,
            ]);
        }
    }
}
