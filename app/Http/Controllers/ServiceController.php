<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use App\Models\Service;
use App\Models\Specialty;
use Illuminate\Http\Request;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'ServiciosPage';
    public $reactRootView = 'public';
    public $defaultOrderBy = 'order_index';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $landing = LandingHome::where('correlative', 'like', 'page_services%')->where('lang_id', $langId)->get();

        $services = Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get();
        $specialities = Specialty::where('visible', true)
        ->where('status', true)
        ->where('lang_id', $langId)
        ->get();
        return [


            'landing' => $landing,

            'services' => $services,

           'specialities' => $specialities,

        ];
    }
}
