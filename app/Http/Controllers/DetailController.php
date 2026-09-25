<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\Ad;
use App\Models\Indicator;
use App\Models\Item;
use App\Models\Post;
use App\Models\Slider;
use App\Models\Supply;
use App\Models\Testimony;
use Illuminate\Http\Request;

class DetailController extends BasicController
{
    public $reactView = 'DetailProduct';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        //get detail item with $request->spl_autoload_unregister
        $item = Item::where('slug', $request->slug)->with('colors', 'sizes', 'images', 'category', 'ad')->first();
        $products_featured = Item::where('status', true)->where('visible', true)->where('featured', true)->with(['colors', 'sizes'])->orderBy('updated_at', 'DESC')->limit(12)->get();
        if (count($products_featured) < 4) {
            $original_count = count($products_featured);
            $needed = 4 - $original_count;

            for ($i = 0; $i < $needed; $i++) {
                // Duplicar elementos existentes (usando el índice original)
                $products_featured->push($products_featured[$i % $original_count]);
            }
        }
        return [

            'item' => $item,
            'products_featured' => $products_featured,

        ];
    }
}
