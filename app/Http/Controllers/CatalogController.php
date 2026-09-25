<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\Category;
use App\Models\Indicator;
use App\Models\Item;
use App\Models\Post;
use App\Models\Slider;
use App\Models\Supply;
use App\Models\Testimony;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CatalogController extends BasicController
{
    public $reactView = 'CatalogProducts';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $sliders = Slider::where('status', true)->where('visible', true)->get();
        $testimonies = Testimony::where('status', true)->where('visible', true)->get();

        $supplies = Supply::where('status', true)->where('visible', true)->where('featured', true)->get();
        $anuncio = Ad::where('status', true)
            ->where('visible', true)
            ->where('invasivo', true)
            ->where(function ($query) {
                $query->whereNull('date_begin')
                    ->whereNull('date_end')
                    ->orWhere(function ($query) {
                        $query->where('date_begin', '<=', Carbon::now())
                            ->where('date_end', '>=', Carbon::now());
                    });
            })->orderBy('updated_at', 'desc')
            ->first();



        $items = Item::where('status', true)->where('visible', true)->with(['category', 'images'])->get();
        $categories = Category::all();
        return [
            'sliders' => $sliders,
            'testimonies' => $testimonies,
            'items' => $items,
            'supplies' => $supplies,
            'anuncio' => $anuncio,
            'categories' => $categories
        ];
    }
}
