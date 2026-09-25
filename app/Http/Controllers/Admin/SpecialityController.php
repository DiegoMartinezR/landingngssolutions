<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Indicator;
use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialityController extends BasicController
{
    public $model = Specialty::class;
    public $reactView = 'Admin/Specialities';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }
}
