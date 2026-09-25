<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Indicator;
use App\Models\Lang;
use App\Models\Specialty;
use Illuminate\Http\Request;

class LangController extends BasicController
{
    public $model = Lang::class;
    public $reactView = 'Admin/Langs';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }
}
