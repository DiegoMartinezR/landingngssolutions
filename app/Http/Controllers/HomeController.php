<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\Certification;
use App\Models\CoreValue;
use App\Models\Facility;
use App\Models\Faq;
use App\Models\General;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\Item;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Post;
use App\Models\Service;
use App\Models\Slider;
use App\Models\Specialty;
use App\Models\Social;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Supply;
use App\Models\Testimony;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {

        $langId = app('current_lang_id');

        /*ESTO ES PARA NO PAIN */

        $strenghts = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();

        $indicators = Indicator::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $landing = LandingHome::where('correlative', 'like', 'page_home%')->where('lang_id', $langId)->get();
        $benefits = Strength::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $services = Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('order_index', 'ASC')->get();
        $testimonies = Testimony::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $staffs = Staff::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $promo = Ad::where('status', true)
            ->where('visible', true)
            ->where('invasivo', false)
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->whereNull('date_begin')
                        ->orWhere('date_begin', '<=', \Carbon\Carbon::now());
                })
                    ->where(function ($q) {
                        $q->whereNull('date_end')
                            ->orWhere('date_end', '>=', \Carbon\Carbon::now());
                    });
            })
            ->orderBy('created_at', 'DESC')
            ->first();

        $certifications = Certification::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $faqs = Faq::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $specialities = Specialty::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $facilities = Facility::where('status', true)->where('visible', true)->where('lang_id', $langId)->get();
        $core_values = CoreValue::where('status', true)->where('visible', true)->get();
        $items = Item::where('status', true)->where('visible', true)->with('category')->get();
        return [
            'strenghts' => $strenghts,

            'indicators' => $indicators,
            'landing' => $landing,
            'benefits' => $benefits,
            'services' => $services,
            'testimonies' => $testimonies,
            'staffs' => $staffs,
            'promo' => $promo,
            'certifications' => $certifications,
            'faqs' => $faqs,
            'generals' => General::where('lang_id', $langId)->get(),
            'specialities' => $specialities,
            'facilities' => $facilities,
            'socials' => Social::where('status', true)->get(),
            'core_values' => $core_values,
            'items' => $items,


            // 'languagesSystem' => Lang::where('status', true)->where('visible', true)->get(),
        ];
    }
}
