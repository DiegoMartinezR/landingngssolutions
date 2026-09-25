<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use App\Models\Lang;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;
use Exception;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class GeneralController extends BasicController
{
    public $model = General::class;
    public $reactView = 'Admin/Generals';
    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();

        // Si no hay datos para el idioma actual, copiar del idioma por defecto
        if ($generals->isEmpty()) {
            $defaultLangId = Lang::where('is_default', true)->value('id');
            $defaultGenerals = General::where('lang_id', $defaultLangId)->get();

            foreach ($defaultGenerals as $general) {
                General::firstOrCreate([
                    'correlative' => $general->correlative,
                    'lang_id' => $langId
                ], [
                    'name' => $general->name,
                    'description' => $general->description
                ]);
            }

            $generals = General::where('lang_id', $langId)->get();
        }

        return [
            'generals' => $generals
        ];
    }
    /* public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();
        return [
            'generals' => $generals
        ];
    }*/

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        // dump($request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            foreach ($body as $record) {
                General::updateOrCreate([
                    'lang_id' => app('current_lang_id'),
                    'correlative' => $record['correlative']
                ], [
                    'name' => $record['name'],
                    'description' => $record['description']
                ]);
            }
        });
        return response($response->toArray(), $response->status);
    }

   
    public function upload(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            if (!$request->hasFile('image')) throw new Exception('Debe cargar una imagen válida');
            $file = $request->file('image');
            $name = $request->name;
            $convertToPng = $request->input('convert_to_png', false);

            $directory = public_path('assets/resources');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Si se solicita convertir a PNG
            if ($convertToPng) {
                // Crear imagen desde el archivo subido
                $imageData = file_get_contents($file);
                $sourceImage = imagecreatefromstring($imageData);
                
                if ($sourceImage === false) {
                    throw new Exception('No se pudo procesar la imagen');
                }
                
                // Asegurar que el nombre termine en .png
                if (!str_ends_with(strtolower($name), '.png')) {
                    $name = pathinfo($name, PATHINFO_FILENAME) . '.png';
                }
                
                // Guardar como PNG
                $targetPath = $directory . '/' . $name;
                if (!imagepng($sourceImage, $targetPath)) {
                    throw new Exception('Error al guardar la imagen como PNG');
                }
                
                // Liberar memoria
                imagedestroy($sourceImage);
            } else {
                // Guardar archivo original
                file_put_contents($directory . '/' . $name, file_get_contents($file));
            }
        });
        return response($response->toArray(), $response->status);
    }
    /*
    public function save(Request $request): HttpResponse|ResponseFactory
    {
        dump($request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            $langId = app('current_lang_id'); // Obtener el idioma actual

            foreach ($body as $record) {
                General::updateOrCreate([
                    'correlative' => $record['correlative'],
                    'lang_id' => $langId // Incluir el idioma en la condición
                ], [
                    'name' => $record['name'],
                    'description' => $record['description']
                ]);
            }
        });
        return response($response->toArray(), $response->status);
    }*/
}
