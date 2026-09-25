<?php

namespace Database\Seeders;

use App\Models\Lang;
use App\Models\Testimony;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestimonySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) return;

        // Clear existing testimonies
        Testimony::query()->delete();

        $cases = [
            [
                'name' => 'Carlos M.',
                'correlative' => '34 años - Long FUE Frontal - 6 meses',
                'description' => 'El impacto en mi seguridad ha sido increíble. Elegí Capilar Advanced porque no quería raparme. El procedimiento fue cómodo y hoy, pocos meses después, los resultados son sumamente naturales. Nadie notó el procedimiento.',
                'rating' => 5,
                'before_url' => 'https://i.ibb.co/tTjGghQh/Gemini-Generated-Image-1l0fjb1l0fjb1l0f.webp',
                'after_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
            ],
            [
                'name' => 'Roberto V.',
                'correlative' => '42 años - Reconstrucción de Coronilla - 12 meses',
                'description' => 'Mi pérdida de cabello en la coronilla avanzaba rápido y me hacía ver de mucha más edad. El doctor diseñó una densidad excelente y el cabello creció con la dirección natural. Totalmente recomendado.',
                'rating' => 5,
                'before_url' => 'https://i.ibb.co/pvrPnsx9/Gemini-Generated-Image-y00zhky00zhky00z.png',
                'after_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            ],
            [
                'name' => 'Luis A.',
                'correlative' => '29 años - FUE Densificación - 9 meses',
                'description' => 'La atención personalizada y el profesionalismo del equipo de Capilar Advanced me dieron la confianza que necesitaba. El diseño de mi línea frontal quedó perfecto y mi autoestima mejoró al 100%.',
                'rating' => 5,
                'before_url' => 'https://i.ibb.co/C3Y58D4r/Gemini-Generated-Image-4vqqke4vqqke4vqq.png',
                'after_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
            ]
        ];

        foreach ($cases as $case) {
            $beforeFilename = $this->downloadAndStore($case['before_url'], 'before');
            $afterFilename = $this->downloadAndStore($case['after_url'], 'after');

            Testimony::create([
                'name' => $case['name'],
                'correlative' => $case['correlative'],
                'description' => $case['description'],
                'rating' => $case['rating'],
                'visible' => true,
                'status' => true,
                'image' => $beforeFilename,
                'image_secondary' => $afterFilename,
                'lang_id' => $lang->id,
            ]);
        }
    }

    private function downloadAndStore(string $url, string $prefix): ?string
    {
        try {
            $response = Http::withoutVerifying()->timeout(30)->get($url);
            if ($response->successful()) {
                $ext = 'jpg';
                if (str_contains($url, '.webp')) {
                    $ext = 'webp';
                } elseif (str_contains($url, '.png')) {
                    $ext = 'png';
                }
                
                $filename = Str::uuid() . '_' . $prefix . '.' . $ext;
                Storage::put('images/testimony/' . $filename, $response->body());
                return $filename;
            }
        } catch (\Throwable $th) {
            // Ignore error
        }
        return null;
    }
}
