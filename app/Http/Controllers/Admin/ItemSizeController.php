<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Color;
use App\Models\Item;
use App\Models\ItemColor;
use App\Models\ItemZise;
use Illuminate\Http\Request;

class ItemSizeController extends BasicController
{
    public $model = ItemZise::class;
    public $reactView = 'Admin/Sizes';
    public $imageFields = ['image'];
    public $prefix4filter = 'item_zises';


    public function setReactViewProperties(Request $request)
    {
        $items = Item::all();
        return [
            'items' => $items,
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['item']);
    }
}
