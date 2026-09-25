<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Http\Requests\StoreIndicatorRequest;
use App\Http\Requests\UpdateIndicatorRequest;

class IndicatorController extends BasicController
{
    public $model = Indicator::class;
}
