<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Color;
use App\Models\Item;
use App\Models\ItemColor;
use Illuminate\Http\Request;

class ItemColorController extends BasicController
{
    public $model = ItemColor::class;
    public $reactView = 'Admin/Colors';
    public $imageFields = ['image'];
    public $prefix4filter = 'item_colors';


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
