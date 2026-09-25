<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\General;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Specialty;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Testimony;
use Illuminate\Http\Request;

class AboutController extends BasicController
{
    public $reactView = 'FisioTerapiaPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        // $defaultLangId = Lang::where('is_default', true)->value('id');

        // LANDING
        $landing = LandingHome::where('correlative', 'like', 'page_aboutus%')
            ->where('lang_id', $langId)
            ->get();

        /* if ($landing->isEmpty()) {
            $landing = LandingHome::where('correlative', 'like', 'page_aboutus%')
                ->where('lang_id', $defaultLangId)
                ->get();
        }
*/
        // STAFF
        $staffData = Staff::where('visible', true)
            ->whereNotIn('job', ['Director', 'Directora'])
            ->where('status', true)
            ->where('lang_id', $langId)
            ->get();



        // SPECIALITIES
        $specialities = Specialty::where('visible', true)
            ->where('status', true)
            ->where('lang_id', $langId)
            ->get();

        /*  if ($specialities->isEmpty()) {
            $specialities = Specialty::where('visible', true)
                ->where('status', true)
                ->where('lang_id', $defaultLangId)
                ->get();
        }*/

        return [
            'landing' => $landing,
            'staffData' => $staffData,
            'specialities' => $specialities,
        ];
    }
}
