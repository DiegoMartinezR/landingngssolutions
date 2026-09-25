<?php

namespace App\Http\Controllers;

use App\Jobs\SendSaleEmail;
use App\Jobs\SendSaleWhatsApp;
use App\Models\Sale;
use App\Models\Bundle;
use App\Models\Item;
use App\Models\Renewal;
use App\Models\SaleDetail;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use SoDe\Extend\Trace;
use SoDe\Extend\Array2;
use SoDe\Extend\Response;

class SaleController extends Controller
{
    static function create(array $sale, array $details): array
    {
        try {
            // Obtener solo los IDs de los productos para la consulta
            $productIds = array_map(fn($item) => $item['id'], $details);
            $itemsJpa = Item::whereIn('id', $productIds)->get();

            // Preparar los detalles de venta
            $saleDetails = [];
            $totalPrice = 0;
            $totalItems = 0;

            foreach ($details as $detail) {
                $itemJpa = $itemsJpa->firstWhere('id', $detail['id']);
                if (!$itemJpa) continue;

                // Calcular cantidad total de este producto (sumando todas sus variaciones)
                $itemQuantity = array_sum(array_column($detail['variations'] ?? [], 'quantity'));
                $itemPrice = $itemJpa->discount != 0 ? $itemJpa->discount : $itemJpa->price;

                // Preparar los detalles por variación
                foreach ($detail['variations'] ?? [] as $variation) {
                    $saleDetails[] = [
                        'item_id' => $itemJpa->id,
                        'name' => $itemJpa->name,
                        'price' => $itemPrice,
                        'quantity' => $variation['quantity'],
                        'color' => $variation['color'] ?? null,
                        'size' => $variation['size'] ?? null
                    ];
                }

                $totalPrice += $itemPrice * $itemQuantity;
                $totalItems += $itemQuantity;
            }

            // Crear la venta
            $saleJpa = new Sale();
            $saleJpa->code = Trace::getId();
            $saleJpa->user_id = Auth::check() ? Auth::user()->id : null;
            $saleJpa->name = $sale['name'];
            $saleJpa->lastname = $sale['lastname'];
            $saleJpa->email = $sale['email'];
            $saleJpa->phone = $sale['phone'];
            $saleJpa->status_id = 'f13fa605-72dd-4729-beaa-ee14c9bbc47b';

            // Información de dirección
            $saleJpa->country = $sale['country'];
            $saleJpa->department = $sale['department'];
            $saleJpa->province = $sale['province'];
            $saleJpa->district = $sale['district'];
            $saleJpa->zip_code = $sale['zip_code'];
            $saleJpa->address = $sale['address'];
            $saleJpa->number = $sale['number'];
            $saleJpa->reference = $sale['reference'];
            $saleJpa->comment = $sale['comment'];

            // Actualizar información del usuario si está autenticado
            if (Auth::check()) {
                $userJpa = User::find(Auth::user()->id);
                $userJpa->phone = $sale['phone'];
                $userJpa->country = $sale['country'];
                $userJpa->department = $sale['department'];
                $userJpa->province = $sale['province'];
                $userJpa->district = $sale['district'];
                $userJpa->zip_code = $sale['zip_code'];
                $userJpa->address = $sale['address'];
                $userJpa->address_number = $sale['number'];
                $userJpa->address_reference = $sale['reference'];
                $userJpa->save();
            }

            // Aplicar cupón si existe
            if (isset($sale['coupon']) && $sale['coupon']) {
                [$couponStatus, $couponJpa] = CouponController::verify(
                    $sale['coupon'],
                    $totalPrice,
                    $sale['email']
                );

                if (!$couponStatus) throw new Exception($couponJpa);

                $saleJpa->coupon_id = $couponJpa->id;
                if ($couponJpa->type == 'percentage') {
                    $saleJpa->coupon_discount = $totalPrice * ($couponJpa->amount / 100);
                } else {
                    $saleJpa->coupon_discount = $couponJpa->amount;
                }
            }

            $saleJpa->amount = $totalPrice;
            $saleJpa->delivery = 0; // Agregar lógica de envío si es necesario
            $saleJpa->save();

            // Guardar los detalles de venta
            foreach ($saleDetails as $detail) {
                $detailJpa = new SaleDetail();
                $detailJpa->sale_id = $saleJpa->id;
                $detailJpa->item_id = $detail['item_id'];
                $detailJpa->name = $detail['name'];
                $detailJpa->price = $detail['price'];
                $detailJpa->quantity = $detail['quantity'];
                $detailJpa->color = $detail['color'];
                $detailJpa->size = $detail['size'];
                $detailJpa->save();
            }

            // Cargar la venta con sus detalles para retornar
            $saleToReturn = Sale::with(['details'])->find($saleJpa->id);

            return [true, $saleToReturn];
        } catch (\Throwable $th) {
            return [false, [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine()
            ]];
        }
    }


    public function notify(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $sale = Sale::where('code', $request->code)->first();
            if (!$request->code) throw new Exception('No existe la venta');
            SendSaleWhatsApp::dispatchAfterResponse($sale, true, false);
            SendSaleEmail::dispatchAfterResponse($sale, true, false);
        });
        return response($response->toArray(), $response->status);
    }
}
