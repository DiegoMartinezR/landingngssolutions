<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\Response;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Courses';
    public $reactRootView = 'public';
    public $prefix4filter = 'items';
    public $throwMediaError = true;

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name'
        ])
            ->join('items', 'items.category_id', 'categories.id')
            ->where('categories.status', true)
            ->where('categories.visible', true)
            ->where('items.status', true)
            ->where('items.visible', true)
            ->get();
        return [
            'categories' => $categories
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['items.*'])
            ->with(['category'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id')
            ->where('items.status', true)
            ->where('items.visible', true)
            ->where('category.status', true)
            ->where('category.visible', true);
    }

    public function verifyStock(Request $request)
    {
        // dump("son datos de entrada", $request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            return Item::select(['id', 'price', 'discount', 'name', 'final_price'])
                ->whereIn('id', $request->all())
                ->get();
        });
        //dump("estamos en response del verify: ", $response);
        return response($response->toArray(), $response->status);
    }
    public function getDestacados(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $data = Item::where('featured', true)->where('status', true)->take(10)->get();
            //dump($data);
            $response->data = $data;
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            //dump($th->getMessage());
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
