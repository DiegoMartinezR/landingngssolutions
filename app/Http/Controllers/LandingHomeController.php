<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use Illuminate\Http\Request;

class LandingHomeController extends BasicController
{
    public $model = LandingHome::class;
    public $reactView = 'LandingPage';
    public $reactRootView = 'public';
}
