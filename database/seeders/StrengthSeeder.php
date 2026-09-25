<?php

namespace Database\Seeders;

use App\Models\Lang;
use App\Models\Strength;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StrengthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) return;

        // Clear existing strengths to avoid duplicates
        Strength::query()->delete();

        $strengths = [
            [
                'name' => 'Resultados Naturales',
                'description' => 'Diseñamos una línea frontal acorde a tus facciones para un resultado completamente indetectable.',
                'image_url' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
            ],
            [
                'name' => 'Especialistas Médicos',
                'description' => 'Procedimientos realizados 100% por médicos cirujanos, asegurando los máximos estándares de calidad.',
                'image_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
            ],
            [
                'name' => 'Técnica Long FUE',
                'description' => 'Extracción e implantación folículo por folículo asegurando la más alta tasa de supervivencia.',
                'image_url' => 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80',
            ],
            [
                'name' => 'Acompañamiento Post',
                'description' => 'Seguimiento médico presencial guiado durante 12 meses para garantizar la evolución de cada folículo.',
                'image_url' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
            ],
            [
                'name' => 'Sin Dolor',
                'description' => 'Aplicación de anestesia local y protocolos mínimamente invasivos.',
                'image_url' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
            ],
        ];

        foreach ($strengths as $strength) {
            $filename = $this->downloadAndStore($strength['image_url']);

            Strength::create([
                'name' => $strength['name'],
                'description' => $strength['description'],
                'image' => $filename,
                'visible' => true,
                'status' => true,
                'lang_id' => $lang->id,
            ]);
        }
    }

    private function downloadAndStore(string $url): ?string
    {
        try {
            $response = Http::withoutVerifying()->timeout(30)->get($url);
            if ($response->successful()) {
                $filename = Str::uuid() . '.jpg';
                Storage::put('images/strength/' . $filename, $response->body());
                return $filename;
            }
        } catch (\Throwable $th) {
            // Ignore error
        }
        return null;
    }
}
