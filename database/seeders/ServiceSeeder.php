<?php

namespace Database\Seeders;

use App\Models\Lang;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lang = Lang::where('is_default', true)->first() ?? Lang::first();
        if (!$lang) return;

        // Clear existing services to avoid duplicates
        Service::query()->delete();

        $services = [
            [
                'title' => "Trasplante sin rapado\n(Long F.U.E.)",
                'description' => "Técnica avanzada que extrae folículos capilares con pelo largo, minimizando daño y logrando resultados más naturales y rápidos, sin necesidad de rapado.",
                'image' => 'trasplante.png',
                'characteristics' => [],
                'image_url' => null, // We copy this from local assets/img
            ],
            [
                'title' => "Exosomas HRLV",
                'description' => "Lo último en tecnología de regeneración capilar para revitalizar las células directamente en el bulbo capilar y generar notables mejoras en distintas alteraciones capilares.",
                'image' => 'exosomas.png',
                'characteristics' => [],
                'image_url' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
            ],
            [
                'title' => "Medicina Regenerativa",
                'description' => "Tratamientos de sueroterapia que suministran vitaminas, minerales y medicamentos directamente al torrente sanguíneo, garantizando una absorción casi total y resultados inmediatos en la salud y regeneración capilar.",
                'image' => 'medicina.png',
                'characteristics' => [],
                'image_url' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80',
            ],
        ];

        foreach ($services as $index => $srv) {
            // Store image
            if ($srv['image'] === 'trasplante.png') {
                $localPath = base_path('capilar_ui/src/assets/images/regenerated_image_1778873587965.png');
                if (file_exists($localPath)) {
                    Storage::put('images/service/trasplante.png', file_get_contents($localPath));
                }
            } elseif ($srv['image_url']) {
                $this->downloadAndStore($srv['image_url'], $srv['image']);
            }

            Service::create([
                'title' => $srv['title'],
                'description' => $srv['description'],
                'image' => $srv['image'],
                'characteristics' => $srv['characteristics'],
                'visible' => true,
                'status' => true,
                'slug' => Str::slug(str_replace("\n", " ", $srv['title'])),
                'lang_id' => $lang->id,
                'order_index' => $index,
            ]);
        }
    }

    private function downloadAndStore(string $url, string $filename): void
    {
        try {
            $response = Http::withoutVerifying()->timeout(30)->get($url);
            if ($response->successful()) {
                Storage::put('images/service/' . $filename, $response->body());
            }
        } catch (\Throwable $th) {
            // Ignore download errors
        }
    }
}
