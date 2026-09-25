<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\Service;
use App\Models\General;
use App\Models\LandingHome;
use Illuminate\Http\Request;

class FacilityDetailController extends BasicController
{
    public $model = Facility::class;
    public $reactView = 'FacilityDetailPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $slug = $request->route('slug');

        $facility = Facility::with(['zone', 'lang'])->where('slug', $slug)->where('status', true)->where('lang_id', $langId)->firstOrFail();

        return [
            'facility' => $facility,
            'services' => Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get(),
            'generals' => General::where('lang_id', $langId)->get(),
            'landing' => LandingHome::where('correlative', 'like', 'page_facility%')->where('lang_id', $langId)->get(),
        ];
    }
}
