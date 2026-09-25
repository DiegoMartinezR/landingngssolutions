<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'zip_codes',
        'link',
        'visible',
        'status',
        'slug',
        'latitude',
        'longitude',
        'radius',
        'ubications',
        'phones',
        'emails',
        'business_hours',
        'gallery',
        'view',
        'lang_id',
        'zone_id',
        'order_index',
        'detailed_content'
    ];

    protected $casts = [
        'ubications' => 'array',
        'phones' => 'array',
        'emails' => 'array',
        'business_hours' => 'array',
        'gallery' => 'array',
        'detailed_content' => 'array'
    ];
    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }
}
