<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\Item;
use App\Models\LandingHome;
use App\Models\Lang;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;

class LandingHomeController extends BasicController
{
    public $model = LandingHome::class;
    public $reactView = 'Admin/LandingHome';
    public $imageFields = ['image'];
    public $videoFields = []; // Se usará para URL de YouTube o similar, no para carga de archivos pesados
    //public $prefix4filter = 'landing_home';

    /*  public function setReactViewProperties(Request $request)
    {
        $currentLangId = app('current_lang_id');
        $defaultLang = Lang::where('is_default', true)->first();

        // Obtener solo los registros base (idioma por defecto)
        $baseItems = LandingHome::where('lang_id', $defaultLang->id)
            ->orWhereNull('lang_id')
            ->get();

        return [
            'items' => $baseItems,
            'current_lang_id' => $currentLangId,
            'default_lang_id' => $defaultLang->id
        ];
    }*/
    public function setReactViewProperties(Request $request)
    {
        $currentLangId = app('current_lang_id');
        $defaultLang = Lang::where('is_default', true)->first();

        // Obtener todos los registros base (idioma por defecto)
        $baseItems = LandingHome::where('lang_id', $defaultLang->id)
        ->where('status', true)
        ->where('visible', true)
            ->orWhereNull('lang_id')
            ->get();

        // Obtener todas las traducciones para el idioma actual
        $translations = LandingHome::where('lang_id', $currentLangId)
        ->where('status', true)
        ->where('visible', true)
            ->get()
            ->keyBy('original_id');

        // Combinar los datos
        $items = $baseItems->map(function ($item) use ($translations, $currentLangId, $defaultLang) {
            $translation = $translations[$item->id] ?? null;

            return [
                'id' => $item->id,
                'original_id' => $item->original_id ?? $item->id,
                'title' => $currentLangId === $defaultLang->id
                    ? $item->title
                    : ($translation->title ?? $item->title),
                'subtitle' => $currentLangId === $defaultLang->id
                    ? $item->subtitle
                    : ($translation->subtitle ?? $item->subtitle),
                'description' => $currentLangId === $defaultLang->id
                    ? $item->description
                    : ($translation->description ?? $item->description),
                'link' => $currentLangId === $defaultLang->id
                    ? $item->link
                    : ($translation->link ?? $item->link),
                'image' => $item->image,
                'video' => $item->video,
                'is_video' => $item->is_video,
                'correlative' => $item->correlative,
                'is_translated' => $translation ? true : false,
                'lang_id' => $currentLangId
            ];
        });

        return [
            'items' => $items,
            'current_lang_id' => $currentLangId,
            'default_lang_id' => $defaultLang->id
        ];
    }

    public function paginate(Request $request): HttpResponse|ResponseFactory|\Illuminate\Http\JsonResponse
    {
        $currentLangId = $request->input('lang_id') ?? app('current_lang_id');
        $defaultLang = Lang::where('is_default', true)->first();

        // Para LandingHome, siempre queremos ver los items base (los "slots") 
        // y luego cargar su traducción si existe. 
        // Forzamos temporalmente el idioma al defecto para que el parent::paginate nos de los items base.
        $originalLangId = app('current_lang_id');
        app()->instance('current_lang_id', $defaultLang->id);

        $response = parent::paginate($request);

        // Restauramos el idioma original
        app()->instance('current_lang_id', $originalLangId);

        // Si la respuesta es de tipo Response (viniendo de BasicController), 
        // la convertimos a JsonResponse para poder usar getData() y setData()
        if (!($response instanceof \Illuminate\Http\JsonResponse)) {
            $content = $response->getOriginalContent();
            $status = $response->getStatusCode();
            $response = response()->json($content, $status);
        }

        // Modificar la respuesta para incluir traducciones para el idioma solicitado
        $dataResponse = $response->getData();
        if (isset($dataResponse->status) && $dataResponse->status == 200) {
            $data = $dataResponse->data;

            foreach ($data as $item) {
                // Buscamos si este item base tiene una traducción en el idioma actual
                $translation = LandingHome::where('original_id', $item->id)
                    ->where('lang_id', $currentLangId)
                    ->first();

                if ($translation) {
                    $item->title = $translation->title;
                    $item->subtitle = $translation->subtitle;
                    $item->description = $translation->description;
                    $item->link = $translation->link;
                    
                    $item->translated_title = $translation->title;
                    $item->translated_subtitle = $translation->subtitle;
                    $item->translated_description = $translation->description;
                    $item->translated_link = $translation->link;
                    $item->translation_id = $translation->id;
                }
            }

            $response->setData((array)$dataResponse);
        }

        return $response;
    }

    public function translate(Request $request)
    {
        try {
            $validated = $request->validate([
                'original_id' => 'required|string',
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'link' => 'nullable|string',
                'lang_id' => 'required|string'
            ]);

            // Buscar si ya existe traducción
            $translation = LandingHome::where('original_id', $validated['original_id'])
                ->where('lang_id', $validated['lang_id'])
                ->first();

            if ($translation) {
                // Actualizar traducción existente
                $translation->update([
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'link' => $validated['link']
                ]);
            } else {
                // Crear nueva traducción
                $original = LandingHome::findOrFail($validated['original_id']);

                LandingHome::create([
                    'original_id' => $validated['original_id'],
                    'lang_id' => $validated['lang_id'],
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'link' => $validated['link'],
                    'correlative' => $original->correlative,
                    'image' => $original->image,
                    'video' => $original->video,
                    'is_video' => $original->is_video
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Traducción guardada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    /*  public function setReactViewProperties(Request $request)
    {
        $landingHome = LandingHome::all();

        return [
            'items' => $landingHome,

        ];
    }*/

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        // Procesar checkbox is_video
        $body['is_video'] = $request->has('is_video') && ($request->is_video === 'true' || $request->is_video === '1' || $request->is_video === true || $request->is_video === 'on');

        // Si es video (ahora URL de YouTube)
        if ($body['is_video']) {
            if ($request->has('video')) {
                $body['video'] = $request->video;
            }
            // Si quieres que el video sea obligatorio al marcar la casilla, podrías validar aquí
        } else {
            // Si es imagen, limpiamos el campo video
            $body['video'] = null;
        }

        // Limpiar campos de texto si vienen vacíos
        $textFields = ['title', 'subtitle', 'description', 'link'];
        foreach ($textFields as $field) {
            if ($request->has($field)) {
                $body[$field] = $request->get($field);
            }
        }

        return $body;
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        // Eliminar archivos antiguos si se subieron nuevos
        if ($request->has('delete_existing_image') && $request->delete_existing_image) {
            Storage::delete("images/landing_home/{$request->delete_existing_image}");
        }
        if ($request->has('delete_existing_video') && $request->delete_existing_video) {
            Storage::delete("videos/landing_home/{$request->delete_existing_video}");
        }

        return $jpa;
    }

    /* public function setPaginationInstance(string $model)
    {
        return $model::with('item');
    }*/
}
