<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Appointment;
use App\Models\Message;
use Illuminate\Http\Request;

class AppointmentController extends BasicController
{
   public $model = Appointment::class;
   public $reactView = 'Admin/Appointments';

   public function setPaginationInstance(Request $request, string $model)
   {
      return $model::where('status', true)->with('service');
   }
}
