<?php

namespace App\Http\Controllers;

use App\Models\General;
use App\Models\Social;
use Illuminate\Http\Request;

class PolicyController extends BasicController
{
    public $reactView = 'Policy';
    public $reactRootView = 'public';

    public function privacy(Request $request)
    {
        $this->reactView = 'PrivacyPolicy';
        return $this->reactView($request);
    }

    public function terms(Request $request)
    {
        $this->reactView = 'TermsConditions';
        return $this->reactView($request);
    }

    public function cookies(Request $request)
    {
        $this->reactView = 'CookiesPolicy';
        return $this->reactView($request);
    }

    public function copyright(Request $request)
    {
        $this->reactView = 'CopyrightNotice';
        return $this->reactView($request);
    }

    public function exchange(Request $request)
    {
        $this->reactView = 'ReturnShippingPolicy';
        return $this->reactView($request);
    }

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        return [
            'generals' => \App\Models\General::where('lang_id', $langId)->get(),
            'services' => \App\Models\Service::where('lang_id', $langId)
                ->where('visible', true)
                ->orderBy('order_index')
                ->get(),
            'socials' => Social::where('status', true)->get(),
        ];
    }
}
