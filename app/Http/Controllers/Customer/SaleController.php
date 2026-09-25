<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $prefix4filter = 'sales';
    public $with4get = ['status', 'formula', 'details', 'renewal', 'bundle', 'coupon'];

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select('sales.*')
            ->with('status', 'formula', 'bundle')
            ->join('statuses AS status', 'status.id', 'sales.status_id')
            ->where('email', Auth::user()->email)
            ->orWhere('user_id', Auth::user()->id);
    }
}
