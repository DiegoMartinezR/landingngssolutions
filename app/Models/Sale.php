<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',

        'user_id',
        'name',
        'lastname',
        'fullname',
        'email',
        'phone',
        'country',
        'department',
        'province',
        'district',
        'zip_code',
        'address',
        'number',
        'reference',
        'amount',
        'delivery',




        'coupon_discount',
        'coupon_id',
        'total_amount',
        'status_id',
    ];



    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }




    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(SaleDetail::class);
    }
}
