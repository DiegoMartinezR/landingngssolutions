<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Facility;
use App\Models\Service;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;

class FacilityController extends BasicController

{
    public $model = Facility::class;
    public $reactView = 'Admin/Facilities';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        return [
            'zones' => Zone::where('status', true)
                ->where('lang_id', $langId)
                ->get()
        ];
    }


    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $body['zone_id'] = $request->zone_id;

        // Procesar galería de imágenes
        $gallery = [];

        // Agregar imágenes nuevas
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/facility/{$uuid}.{$ext}";
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

        // Collect all dc_ prefixed fields into detailed_content
        $dc = is_string($request->detailed_content) ? json_decode($request->detailed_content, true) : ($request->detailed_content ?? []);
        if (!is_array($dc)) $dc = [];

        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 3) === 'dc_') {
                $newKey = substr($key, 3);
                // Handle special cases if any, otherwise just map it
                if ($newKey == 'why_us') $newKey = 'why_choose_us';
                if ($newKey == 'diff_items') $newKey = 'differentiator_items';
                if ($newKey == 'diff_title') $newKey = 'differentiator_title';
                if ($newKey == 'diff_desc') $newKey = 'differentiator_description';
                if ($newKey == 'hero_desc') $newKey = 'hero_description';
                if ($newKey == 'cov_msg') $newKey = 'coverage_message';
                if ($newKey == 'local_msg') $newKey = 'local_message';
                if ($newKey == 'final_msg') $newKey = 'final_message';
                
                // If it's a newline separated list, split it
                if (in_array($newKey, ['why_choose_us', 'differentiator_items']) && is_string($value)) {
                    $dc[$newKey] = array_values(array_filter(explode("\n", $value), fn($x) => trim($x)));
                } else {
                    $dc[$newKey] = $value;
                }
            }
        }
        $body['detailed_content'] = $dc;

        // Procesar características
        if ($request->has('ubications')) {
            $ubications = json_decode($request->ubications, true);
            $body['ubications'] = array_values(array_filter($ubications, function ($item) {
                if (is_array($item)) return !empty(trim($item['address'] ?? ''));
                return !empty(trim($item));
            }));
        }
        if ($request->has('phones')) {
            $phones = json_decode($request->phones, true);
            $body['phones'] = array_values(array_filter($phones, function ($item) {
                if (is_array($item)) return !empty(trim($item['value'] ?? ''));
                return !empty(trim($item));
            }));
        }
        if ($request->has('emails')) {
            $emails = json_decode($request->emails, true);
            $body['emails'] = array_values(array_filter($emails, function ($item) {
                if (is_array($item)) return !empty(trim($item['value'] ?? ''));
                return !empty(trim($item));
            }));
        }
        if ($request->has('business_hours')) {
            $business_hours = json_decode($request->business_hours, true);
            $body['business_hours'] = array_values(array_filter($business_hours, function ($item) {
                if (is_array($item)) return !empty(trim($item['value'] ?? ''));
                return !empty(trim($item));
            }));
        }

        return $body;
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        // Eliminar imágenes marcadas para borrar (si implementas esta función)
        return $jpa;
    }
}
