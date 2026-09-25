<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends BasicController
{
   public $model = Message::class;
   public $reactView = 'Admin/Messages';

   public function setReactViewProperties(Request $request)
   {
      return [
         'is_general' => $request->query('is_general') === 'true'
      ];
   }


}
