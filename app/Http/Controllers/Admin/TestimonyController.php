<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Routing\ResponseFactory;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\BasicController;
use App\Models\Testimony;
use App\Models\Lang;
use Exception;
use Illuminate\Http\Request;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TestimonyController extends BasicController
{
    public $model = Testimony::class;
    public $reactView = 'Admin/Testimonies';
    public $imageFields = ['image', 'image_secondary'];

    public function syncGoogle(Request $request)
    {
        $response = new Response();
        try {
            $key = env('GMAPS_API_KEY');
            $placeId = env('GOOGLE_PLACE_ID');

            if (!$key || !$placeId) {
                throw new Exception('Faltan las llaves de Google en el archivo .env (GOOGLE_MAPS_API_KEY o GOOGLE_PLACE_ID)');
            }

            $lang_id = $request->lang_id;
            $lang = null;
            if ($lang_id) {
                $lang = Lang::find($lang_id);
            }
            if (!$lang) {
                $lang = Lang::where('is_default', true)->first() ?? Lang::first();
                $lang_id = $lang ? $lang->id : null;
            }

            $langCode = $lang ? ($lang->description ?? 'es') : 'es';

            $googleResponse = Http::get("https://maps.googleapis.com/maps/api/place/details/json", [
                'place_id' => $placeId,
                'fields' => 'reviews,rating,user_ratings_total',
                'key' => $key,
                'language' => $langCode
            ]);

            if ($googleResponse->failed()) {
                throw new Exception('Error al comunicarse con Google Maps API');
            }

            $data = $googleResponse->json();
            if (($data['status'] ?? '') != 'OK') {
                throw new Exception('Google API Error: ' . ($data['error_message'] ?? $data['status'] ?? 'Unknown error'));
            }

            $result = $data['result'] ?? [];
            $reviews = $result['reviews'] ?? [];

            foreach ($reviews as $review) {
                // Generar un correlativo único para evitar duplicados
                $check = Testimony::where('name', $review['author_name'])
                    ->where('description', $review['text'])
                    ->first();

                if (!$check) {
                    $imageName = null;
                    // Intentar descargar la imagen del autor para que no expire
                    if (!empty($review['profile_photo_url'])) {
                        $imageContent = Http::get($review['profile_photo_url'])->body();
                        $imageName = Str::uuid() . '.jpg';
                        Storage::put('images/testimony/' . $imageName, $imageContent);
                    }

                    Testimony::create([
                        'name' => $review['author_name'],
                        'description' => $review['text'],
                        'rating' => $review['rating'],
                        'correlative' => 'Google Review',
                        'visible' => false,
                        'status' => true,
                        'image' => $imageName,
                        'lang_id' => $lang_id
                    ]);
                }
            }

            $response->status = 200;
            $response->message = 'Sincronización completada exitosamente';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function setReactViewProperties(Request $request)
    {
        $countries = JSON::parse(File::get('../storage/app/utils/countries.json'));
        return [
            'countries' => $countries
        ];
    }

    public function media(Request $request, string $uuid)
    {
        try {
            $path = 'images/testimony/' . $uuid;
            if (!Storage::exists($path)) throw new Exception('Imagen no encontrada');
            $content = Storage::get($path);
            $mimeType = Storage::mimeType($path) ?? 'image/jpeg';
            return response($content, 200, [
                'Content-Type' => $mimeType
            ]);
        } catch (\Throwable $th) {
            $path = 'utils/user-404.svg';
            $content = Storage::get($path);
            return response($content, 200, [
                'Content-Type' => 'image/svg+xml'
            ]);
        }
    }
}
