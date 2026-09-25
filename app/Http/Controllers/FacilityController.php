<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\Zone;
use App\Models\LandingHome;
use App\Models\Service;
use App\Models\General;
use Illuminate\Http\Request;

class FacilityController extends BasicController
{
    public $model = Facility::class;
    public $reactView = 'InstalacionesPage';
    public $reactRootView = 'public';
    public $defaultOrderBy = 'order_index';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $slug = $request->route('slug');

        if ($slug) {
            $this->reactView = 'ZoneFacilitiesPage';
            $zone = Zone::where('slug', $slug)->where('status', true)->where('lang_id', $langId)->firstOrFail();
            $facilities = Facility::where('zone_id', $zone->id)->where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get();

            return [
                'zone' => $zone,
                'facilities' => $facilities,
                'landing' => LandingHome::where('correlative', 'like', 'page_facility%')->where('lang_id', $langId)->get(),
                'services' => Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get(),
                'generals' => General::where('lang_id', $langId)->get(),
            ];
        }

        $this->reactView = 'InstalacionesPage';
        $zones = Zone::with(['facilities' => function ($query) use ($langId) {
            $query->where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC');
        }])->where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get();
        $landing = LandingHome::where('correlative', 'like', 'page_facility%')->where('lang_id', $langId)->get();

        return [
            'landing' => $landing,
            'zones' => $zones,
            'services' => Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get(),
            'generals' => General::where('lang_id', $langId)->get(),
        ];
    }
}
