<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends BasicController
{
    public $model = Staff::class;
    public $reactRootView = 'public';
}
