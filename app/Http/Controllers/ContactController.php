<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\General;
use App\Models\LandingHome;
use App\Models\Social;
use App\Models\Staff;
use Illuminate\Http\Request;

class ContactController extends BasicController
{
    public $reactView = 'Contacto';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $landing = LandingHome::where('correlative', 'like', 'page_contact%')->where('lang_id', $langId)->get();
        $whatsapp = Social::where('status', true)->where('visible', true)->where('description', '=', 'WhatsApp')->first();
        $generals = General::all();
        return [
            'landing' => $landing,

            'whatsapp' => $whatsapp,

            'generals' => $generals,
        ];
    }
}
