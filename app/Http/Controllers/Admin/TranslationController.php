<?php

namespace App\Http\Controllers\Admin;

use App\Http\Classes\dxResponse;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\dxDataGrid;
use App\Models\Lang;
use App\Models\Social;
use App\Models\Translation;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class TranslationController extends BasicController
{
    public $model = Translation::class;
    public $reactView = 'Admin/Translations';

    public function setReactViewProperties(Request $request)
    {
        $currentLangId = app('current_lang_id');
        $defaultLang = Lang::where('is_default', true)->first();
        $icons = JSON::parse(File::get('../storage/app/utils/icons.json'));
        return [
            'icons' => $icons,
            'current_lang_id' => $currentLangId,
            'default_lang_id' => $defaultLang->id
        ];
    }

    /* public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        $response = new dxResponse();
        try {
            $langId = $request->input('lang_id') ?? app('current_lang_id');

            // Obtener el idioma base (español)
            $langDefault = Lang::where('is_default', true)->first();
            //  dump('Lang', ['lang' => $langDefault]);
            // dump('LangId', ['langId' => $langDefault->id]);
            $langDefaultId = $langDefault->id;
            // Subconsulta base (en español)
            $baseQuery = Translation::query()
                ->select('id', 'group', 'key', 'value as value_base')
                ->where('lang_id', $langDefaultId);



            // LEFT JOIN con el idioma destino (inglés)
            $query = DB::table(DB::raw("({$baseQuery->toSql()}) as base"))
                //->mergeBindings($baseQuery->getQuery())
                ->leftJoin('translations as t', function ($join) use ($langId) {
                    $join->on('t.group', '=', 'base.group')
                        ->on('t.key', '=', 'base.key')
                        ->where('t.lang_id', '=', $langId); // ✅ este es el idioma traducido
                })
                ->select([
                    't.id as translation_id',
                    'base.id as id',
                    't.lang_id',
                    'base.group',
                    'base.key',
                    'base.value_base',
                    't.value as translated_value',
                    DB::raw('IFNULL(t.value, base.value_base) as value')
                ])->addBinding([$langDefaultId], 'select');


            // Filtro personalizado

            //  if ($request->filter) {
            //    $query->where(function ($q) use ($request) {
              //      dxDataGrid::filter($q, $request->filter ?? [], false);
                //});
            //}

            // Ordenamiento
            //  if ($request->sort) {
              //  foreach ($request->sort as $sorting) {
                //    $query->orderBy($sorting['selector'], $sorting['desc'] ? 'DESC' : 'ASC');
                //}
            //} else {
              //  $query->orderBy('base.group', 'ASC')->orderBy('base.key', 'ASC');
            //}

            // Total count
            //  $totalCount = 0;
            //if ($request->requireTotalCount) {
              //  $countQuery = clone $query;
                //$totalCount = $countQuery->count();
            //}
            //  dump('Data', ['data' => $query->get()]);


            // Paginar resultados
            $data = $query->get(); 
            // $request->isLoadingAll
             //   ? $query->get()
               // : $query->skip($request->skip ?? 0)->take($request->take ?? 10)->get();



            // Respuesta
            $response->status = 200;
            $response->message = 'Operación correcta';
            $response->data = $data;
            $response->totalCount = 10; // $totalCount;
            $response->summary = $this->setPaginationSummary($request, Translation::query());
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage() . ' Ln.' . $th->getLine();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }*/

    /* public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        $response = new dxResponse();
        try {
            $langId = $request->input('lang_id') ?? app('current_lang_id');
            $defaultLang = Lang::where('is_default', true)->first();
            $searchTerm = $request->input('search');

            $baseQuery = Translation::query()
                ->select('id', 'group', 'key', 'value as value_base')
                ->where('lang_id', $defaultLang->id);

            if ($searchTerm) {
                $baseQuery->where(function ($q) use ($searchTerm) {
                    $q->where('group', 'like', "%{$searchTerm}%")
                        ->orWhere('key', 'like', "%{$searchTerm}%")
                        ->orWhere('value', 'like', "%{$searchTerm}%");
                });
            }

            $query = DB::table(DB::raw("({$baseQuery->toSql()}) as base"))
                ->leftJoin('translations as t', function ($join) use ($langId) {
                    $join->on('t.group', '=', 'base.group')
                        ->on('t.key', '=', 'base.key')
                        ->where('t.lang_id', '=', $langId);
                })
                ->select([
                    't.id as translation_id',
                    'base.id as id',
                    't.lang_id',
                    'base.group',
                    'base.key',
                    'base.value_base',
                    't.value as translated_value',
                    DB::raw('IFNULL(t.value, base.value_base) as value'),
                    DB::raw('CASE WHEN t.value IS NULL THEN 0 ELSE 1 END as is_translated')
                ])
                ->addBinding($baseQuery->getBindings(), 'select');

            $data = $query->get();

            $response->status = 200;
            $response->data = $data;
            $response->totalCount = count($data);
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }*/
    public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        // dump('Request', ['request' => $request->all()]);
        $response = new dxResponse();
        try {
            $currentLangId = $request->input('lang_id') ?? app('current_lang_id');
            $defaultLang = Lang::where('is_default', true)->first();

            // 1. Consulta para valores en español (idioma por defecto)
            $spanishQuery = Translation::query()
                ->select('id', 'group', 'key', 'value as spanish_value')
                ->where('lang_id', $defaultLang->id);

            // 2. Consulta principal con LEFT JOIN
            $query = DB::table(DB::raw("({$spanishQuery->toSql()}) as spanish"))
                ->leftJoin('translations as current', function ($join) use ($currentLangId) {
                    $join->on('current.group', '=', 'spanish.group')
                        ->on('current.key', '=', 'spanish.key')
                        ->where('current.lang_id', '=', $currentLangId);
                })
                ->select([
                    'spanish.id as id',
                    'current.id as translation_id',
                    'spanish.group',
                    'spanish.key',
                    'spanish.spanish_value as value_base',       // Español como valor principal
                    'current.value as value ',          // Traducción como valor adicional
                    DB::raw('IFNULL(current.value, spanish.spanish_value) as value'),
                    DB::raw('CASE WHEN current.value IS NULL THEN 0 ELSE 1 END as is_translated')
                ]);

            // Añadir bindings manualmente en el orden correcto
            $query->addBinding($defaultLang->id, 'select'); // Binding para la subconsulta
            // $query->addBinding($currentLangId, 'join');
            // Binding para el JOIN



            // Aplicar filtros
            if ($request->has('filter') && is_array($request->input('filter'))) {
                $filter = $request->input('filter');

                // Verificar si el filtro viene en formato DevExtreme (array indexado)
                if (count($filter) === 3 && isset($filter[0], $filter[1], $filter[2])) {
                    $field = $filter[0];
                    $operation = $filter[1]; // 'contains' en este caso
                    $value = $filter[2];

                    if (!empty($value)) {
                        switch ($field) {
                            case 'group':
                            case 'key':
                                $query->where("spanish.{$field}", 'like', "%{$value}%");
                                break;
                            case 'value_base':
                                $query->where("spanish.spanish_value", 'like', "%{$value}%");
                                break;
                            case 'value':
                                $query->where("current.value", 'like', "%{$value}%");
                                break;
                        }
                    }
                }
                // Puedes añadir más formatos de filtro aquí si es necesario
            }

            // Obtener conteo total ANTES de paginar
            //$totalCount = $query->count();


            // Aplicar paginación
            $data = $query
                ->skip($request->input('skip', 0))
                ->take($request->input('take', 10))
                ->get();

            //   dump('Query', ['query' => $query->toSql()]);
            //dump('Bindings', ['bindings' => $query->getBindings()]);
            // dump('Data', ['data' => $data]);

            // Estructura de respuesta que DevExtreme espera
            $response->status = 200;
            $response->data = $data;
            $response->totalCount = count($data); // Crítico para la paginación
            $response->summary = ['totalCount' => count($data)]; // Algunas versiones lo requieren

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }



    public function translate(Request $request)
    {

        //dump($request->all());
        try {
            $validated = $request->validate([
                'group' => 'required|string',
                'key' => 'required|string',
                'value' => 'required|string',
                // 'lang_id' => 'required|integer|exists:langs,id'
            ]);
            $currentLangId = $request->input('lang_id') ?? app('current_lang_id');
            // Verifica si ya existe la traducción para ese idioma
            $translation = Translation::where('group', $validated['group'])
                ->where('key', $validated['key'])
                ->where('lang_id', $currentLangId)
                ->first();
            //    dump('Translation', ['translation' => $translation]);

            if ($translation) {
                // Actualiza la traducción
                $translation->value = $validated['value'];
                $translation->save();
            } else {
                $validated['lang_id'] = $currentLangId;
                // Crea una nueva traducción
                Translation::create($validated);
            }

            return response()->json([
                'status' => true,
                'message' => 'Traducción guardada exitosamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }






    public function getByLang($langId)
    {
        $translations = Translation::where('lang_id', $langId)->get();

        $result = [];

        foreach ($translations as $t) {
            $result[$t->group][$t->key] = $t->value;
        }

        return response()->json($result);
    }
}
