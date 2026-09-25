<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class ZoneController extends BasicController
{
    public $model = Zone::class;
    public $reactView = 'Admin/Zones';
    public $defaultOrderBy = 'order_index';

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        // Procesar galería de imágenes
        $gallery = [];

        // Agregar imágenes nuevas
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/zone/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($file));
                $gallery[] = "{$uuid}.{$ext}";
            }
        }

        // Mantener imágenes existentes
        if ($request->has('existing_gallery')) {
            $existing = json_decode($request->existing_gallery, true);
            $gallery = array_merge($gallery, $existing);
        }

        $body['gallery'] = $gallery;

        return $body;
    }
}
